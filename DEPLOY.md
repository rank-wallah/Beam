# Deploying Beam to a Google Cloud VM

This walks through hosting Beam on a single Google Compute Engine VM, served at
**https://beam.kroszborg.co** with HTTPS.

## Architecture on the box

```
                         beam.kroszborg.co (DNS A → VM external IP)
                                   │  :443 / :80
                              ┌────▼─────┐
   browser  ───────────────▶ │  nginx   │
                              └────┬─────┘
            static client (dist)  │   /ws /ice /health  (reverse proxy)
            served from disk      ▼
                          ┌───────────────┐     ┌─────────┐
                          │ beam-server   │────▶│  redis  │
                          │ (node, :8787) │     │ (local) │
                          └───────────────┘     └─────────┘
```

- **Client** = a static SPA (Vite build). nginx serves it from disk.
- **Signaling server** = Node process on `127.0.0.1:8787`, proxied by nginx at
  `/ws`, `/ice`, `/health`. Needs Redis (room/presence only — never files).
- **Redis** = local `apt` install; rooms expire via TTL.

---

## 1. Recommended VM specs

| Setting        | Value                                              |
| -------------- | -------------------------------------------------- |
| Machine type   | **e2-small** (2 vCPU, 2 GB) — comfortable. e2-micro works for light traffic |
| OS             | **Ubuntu 24.04 LTS** (or 22.04)                    |
| Boot disk      | 20–30 GB standard persistent disk                  |
| Region         | Closest to your users (e.g. `us-central1`, `asia-south1`) |
| Firewall       | Allow **HTTP** and **HTTPS** traffic               |

The signaling server is lightweight (it never moves file bytes), so a small VM
is plenty. Most cost comes from the VM being always-on.

### Create it (gcloud)

```bash
gcloud compute instances create beam \
  --machine-type=e2-small \
  --image-family=ubuntu-2404-lts-amd64 --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB \
  --tags=http-server,https-server \
  --zone=us-central1-a

# Firewall (only needed if the default rules don't already allow 80/443)
gcloud compute firewall-rules create allow-web \
  --allow=tcp:80,tcp:443 --target-tags=http-server,https-server
```

Note the VM's **external IP** from `gcloud compute instances list`.

---

## 2. DNS

At your domain registrar / DNS for `kroszborg.co`, add an **A record**:

```
Type: A    Name: beam    Value: <VM external IP>    TTL: 300
```

Wait for it to resolve: `dig +short beam.kroszborg.co` should return the IP.

---

## 3. Server setup (SSH into the VM)

```bash
gcloud compute ssh beam --zone=us-central1-a
```

Install Node 20+, pnpm, Redis, nginx, certbot:

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs redis-server nginx git
sudo corepack enable                      # provides pnpm
sudo apt install -y certbot python3-certbot-nginx

sudo systemctl enable --now redis-server
```

---

## 4. Get the code & build

```bash
sudo mkdir -p /opt/beam && sudo chown $USER /opt/beam
git clone <your-repo-url> /opt/beam
cd /opt/beam
pnpm install --frozen-lockfile

# Build the client pointing at the public origin (same host).
# The client turns https:// into wss:// and calls /ws + /ice automatically.
VITE_SIGNALING_URL=https://beam.kroszborg.co pnpm --filter @beam/client build

# Publish the static build
sudo mkdir -p /var/www/beam
sudo cp -r packages/client/dist/* /var/www/beam/
```

Create the server env file `/opt/beam/.env`:

```ini
PORT=8787
HOST=127.0.0.1
REDIS_URL=redis://localhost:6379
ROOM_TTL_SECONDS=3600
CORS_ORIGINS=https://beam.kroszborg.co
STUN_URLS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
# Optional TURN (see §8) — leave blank for STUN-only:
TURN_URL=
TURN_USERNAME=
TURN_CREDENTIAL=
NODE_ENV=production
```

---

## 5. Run the signaling server as a service

Create `/etc/systemd/system/beam-server.service`:

```ini
[Unit]
Description=Beam signaling server
After=network.target redis-server.service

[Service]
WorkingDirectory=/opt/beam
EnvironmentFile=/opt/beam/.env
ExecStart=/opt/beam/node_modules/.bin/tsx packages/server/src/index.ts
Restart=always
RestartSec=3
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

```bash
sudo chown -R www-data:www-data /opt/beam
sudo systemctl daemon-reload
sudo systemctl enable --now beam-server
sudo systemctl status beam-server          # should be "active (running)"
curl -s localhost:8787/health              # {"status":"ok",...}
```

---

## 6. nginx (static client + proxy + WebSocket upgrade)

Create `/etc/nginx/sites-available/beam`:

```nginx
server {
    listen 80;
    server_name beam.kroszborg.co;

    root /var/www/beam;
    index index.html;

    # SPA: fall back to index.html for client-side routes (/send, /r/:id, ...)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # WebSocket signaling — requires the upgrade headers
    location /ws {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 3600s;
    }

    location ~ ^/(ice|health)$ {
        proxy_pass http://127.0.0.1:8787;
        proxy_set_header Host $host;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/beam /etc/nginx/sites-enabled/beam
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Beam should now load over **http://beam.kroszborg.co**.

---

## 7. HTTPS (Let's Encrypt)

```bash
sudo certbot --nginx -d beam.kroszborg.co --redirect -m you@example.com --agree-tos -n
```

certbot edits the nginx config to add `:443` + auto-redirect and sets up renewal.
Visit **https://beam.kroszborg.co** — done. WebRTC + clipboard require HTTPS, so
this step is mandatory for production.

---

## 8. Optional: TURN for strict networks

STUN-only fails for some symmetric-NAT / CGNAT pairs. To make those work, run a
TURN server (e.g. `coturn`) or use a hosted one (Metered, Twilio), then fill
`TURN_URL`, `TURN_USERNAME`, `TURN_CREDENTIAL` in `/opt/beam/.env` and
`sudo systemctl restart beam-server`. No client change needed — it reads `/ice`.

---

## 9. Redeploying after changes

```bash
cd /opt/beam && git pull
pnpm install --frozen-lockfile
VITE_SIGNALING_URL=https://beam.kroszborg.co pnpm --filter @beam/client build
sudo cp -r packages/client/dist/* /var/www/beam/
sudo systemctl restart beam-server
```

## 10. Quick checks

```bash
curl -s https://beam.kroszborg.co/health      # {"status":"ok"}
curl -s https://beam.kroszborg.co/ice          # STUN/TURN JSON
sudo journalctl -u beam-server -f              # live server logs
```

Open `/send` in one browser and the generated link in another to confirm a real
end-to-end transfer over the deployed stack.
