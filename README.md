# Zipline

**Send files directly between devices — without uploading them to the cloud.**

Zipline is an end-to-end encrypted, peer-to-peer file transfer web app. Files are
encrypted in the sender's browser, streamed directly to the receiver over a
WebRTC DataChannel, and decrypted in the receiver's browser. The backend only
brokers the initial handshake (signaling); it never sees file contents or
encryption keys. No accounts, no uploads.

```
Sender browser ──encrypt──▶ ░░ WebRTC P2P DataChannel ░░ ──decrypt──▶ Receiver browser
                                     ▲
                          signaling only (SDP/ICE)
                                     │
                            Zipline signaling server  ── Redis (ephemeral rooms)
                          (no files, no keys, ever)
```

## Security model at a glance

- **Files are encrypted client-side** with AES-256-GCM before they ever leave
  the sender. The backend cannot read them.
- **The encryption key never reaches the backend.** It lives in the share
  link's URL *fragment* (`https://zipline.app/r/abc123#secretKey`). Browsers never
  send the fragment to the server, so the server only ever sees `abc123`.
- **Integrity is verified** per-chunk (SHA-256) and across the whole transfer
  (a SHA-256 Merkle tree), detecting corruption, missing chunks, and tampering.
- **The server is a blind relay** — rooms + presence + SDP/ICE forwarding only.
  Room state is ephemeral in Redis with a TTL.

## Monorepo layout

```
zipline/
├── packages/
│   ├── shared/   @zipline/shared  — wire contracts (signaling + datachannel protocol) + constants
│   ├── server/   @zipline/server  — Fastify + WebSocket signaling, Redis rooms (no file storage)
│   └── client/   @zipline/client  — React + Vite + Tailwind + shadcn/ui + Framer Motion
```

The client is split into independent layers, each ignorant of the others'
concerns:

| Layer            | Path                      | Responsibility                                           |
| ---------------- | ------------------------- | -------------------------------------------------------- |
| Encryption       | `client/src/lib/crypto`   | AES-256-GCM keys, deterministic IVs, SHA-256             |
| Transport        | `client/src/lib/webrtc`   | RTCPeerConnection, DataChannel, backpressure             |
| Signaling client | `client/src/lib/signaling`| Typed WebSocket client, reconnect                        |
| Transfer protocol| `client/src/lib/transfer` | Chunking, Merkle, framing, sender/receiver, resume       |

## Getting started

Prerequisites: **Node ≥ 20**, **pnpm ≥ 9**, and a **Redis** instance.

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.example .env        # adjust if needed

# 3. Start Redis (example via Docker)
docker run -p 6379:6379 redis:7

# 4. Run server + client together
pnpm dev
```

- Client: http://localhost:5173
- Signaling server: http://localhost:8787

## Scripts

| Command           | Effect                                            |
| ----------------- | ------------------------------------------------- |
| `pnpm dev`        | Run server and client in parallel (watch mode)    |
| `pnpm build`      | Build all packages                                |
| `pnpm typecheck`  | Type-check every package                          |
| `pnpm test`       | Run unit tests (crypto, merkle, chunker, resume)  |

## NAT traversal

STUN is used by default (free public servers). For reliable transfers behind
symmetric NAT / CGNAT, set `TURN_URL`, `TURN_USERNAME`, and `TURN_CREDENTIAL`
in `.env`; the server then hands those ICE servers to clients. TURN is optional
and off by default.

## Browser support note

The receiver streams the incoming file straight to disk via the **File System
Access API** (Chromium-based browsers). On Firefox/Safari it falls back to
assembling the file in memory before download — fine for moderate files, with a
documented memory caveat for very large ones.
