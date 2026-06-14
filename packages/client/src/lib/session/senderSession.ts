/**
 * SenderSession — the sending-side controller.
 *
 * Composes the four layers into one lifecycle:
 *   crypto (session key + nonce) → signaling (room) → webrtc (peer connection)
 *   → transfer (FileSender).
 *
 * Reconnect/resume strategy: WebRTC handshakes are driven entirely by signaling
 * presence. Whenever a receiver appears (`peer-joined`) — whether for the first
 * time or after reconnecting — we (re)negotiate a fresh PeerConnection and the
 * FileSender replays its manifest, after which the receiver asks only for the
 * chunks it still needs. We also renegotiate if the peer connection itself
 * fails. This makes a dropped transfer self-heal without ever restarting from
 * zero.
 */
import {
  generateSessionKey,
  generateBaseNonce,
  exportKeyToFragment,
} from '../crypto/index.js';
import { SignalingClient } from '../signaling/signalingClient.js';
import { PeerConnection, fetchIceServers } from '../webrtc/index.js';
import { FileSender } from '../transfer/index.js';
import type { SenderState, TransferProgress } from '../transfer/index.js';
import { Emitter } from '../events.js';

export interface SenderRoomInfo {
  roomId: string;
  shareUrl: string;
}

type SenderSessionEvents = {
  state: SenderState;
  progress: TransferProgress;
  room: SenderRoomInfo;
  error: string;
};

export class SenderSession {
  private readonly emitter = new Emitter<SenderSessionEvents>();
  private signaling: SignalingClient | null = null;
  private sender: FileSender | null = null;
  private pc: PeerConnection | null = null;
  private iceServers: RTCIceServer[] = [];
  private roomId: string | null = null;
  private renegotiating = false;

  readonly on = this.emitter.on.bind(this.emitter);

  constructor(
    private readonly signalingUrl: string,
    private readonly appOrigin: string,
  ) {}

  async start(files: File[]): Promise<void> {
    // 1. Keys never leave the browser; the key rides in the URL fragment.
    const key = await generateSessionKey();
    const baseNonce = generateBaseNonce();
    const keyFragment = await exportKeyToFragment(key);

    // 2. Build the manifest (hashing pre-pass) before we even have a peer.
    this.sender = new FileSender(files, key, baseNonce, {
      onState: (s) => this.emitter.emit('state', s),
      onProgress: (p) => this.emitter.emit('progress', p),
      onError: (m) => this.emitter.emit('error', m),
    });
    await this.sender.prepare();

    // 3. ICE config + signaling room.
    this.iceServers = await fetchIceServers(this.signalingUrl);
    this.signaling = new SignalingClient(this.signalingUrl);
    await this.signaling.connect();
    const { roomId } = await this.signaling.createRoom();
    this.roomId = roomId;

    const shareUrl = `${this.appOrigin}/r/${roomId}#${keyFragment}`;
    this.emitter.emit('room', { roomId, shareUrl });

    // 4. (Re)negotiate whenever a receiver appears or the connection fails.
    this.signaling.on('peer-joined', () => void this.negotiate());
    this.signaling.on('peer-left', () => this.emitter.emit('state', 'waiting'));
  }

  private async negotiate(): Promise<void> {
    if (!this.signaling || !this.sender || !this.roomId) return;
    if (this.renegotiating) return;
    this.renegotiating = true;

    this.pc?.close();
    const pc = new PeerConnection('sender', this.roomId, this.signaling, this.iceServers);
    this.pc = pc;

    pc.on('channel-open', (transport) => {
      this.renegotiating = false;
      void this.sender!.run(transport);
    });
    pc.on('failed', () => this.scheduleRenegotiate());
    pc.on('disconnected', () => this.scheduleRenegotiate());

    try {
      await pc.start(); // create data channel + offer
    } catch (err) {
      this.renegotiating = false;
      this.emitter.emit('error', (err as Error).message);
    }
  }

  private scheduleRenegotiate(): void {
    // Allow a fresh negotiation, then retry shortly once things settle.
    this.renegotiating = false;
    setTimeout(() => void this.negotiate(), 500);
  }

  close(): void {
    this.pc?.close();
    this.signaling?.close();
    this.emitter.clear();
  }
}
