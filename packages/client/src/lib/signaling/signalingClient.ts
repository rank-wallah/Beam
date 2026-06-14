/**
 * Typed WebSocket signaling client.
 *
 * Wraps the browser WebSocket with: the @beam/shared message contracts,
 * promise-based room create/join, an event surface for presence + relayed
 * signals, and automatic reconnect with exponential backoff. The reconnect
 * matters because a brief signaling blip during the ICE dance (or later, when
 * a dropped peer needs to renegotiate to resume) should self-heal rather than
 * fail the transfer.
 *
 * This client is transport-only: it never sees file data. Once the WebRTC
 * connection is up, the app stops using it for the bulk transfer entirely.
 */
import type {
  ClientToServerMessage,
  ServerToClientMessage,
  SignalPayload,
  PeerRole,
} from '@beam/shared';
import { Emitter } from '../events.js';

type SignalingEvents = {
  open: void;
  close: void;
  reconnecting: { attempt: number };
  'peer-joined': { roomId: string };
  'peer-left': { roomId: string };
  signal: { roomId: string; data: SignalPayload };
  error: { code: string; message: string };
};

export class SignalingClient {
  private ws: WebSocket | null = null;
  private readonly emitter = new Emitter<SignalingEvents>();
  private shouldReconnect = true;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  /** Pending one-shot resolvers for create/join request-response pairs. */
  private pendingCreate: ((roomId: string) => void) | null = null;
  private pendingJoin: {
    resolve: (roomId: string) => void;
    reject: (err: Error) => void;
  } | null = null;

  constructor(private readonly url: string) {}

  readonly on = this.emitter.on.bind(this.emitter);

  /** Open the socket (idempotent) and resolve once it is connected. */
  connect(): Promise<void> {
    this.shouldReconnect = true;
    return new Promise((resolve, reject) => {
      try {
        this.openSocket(resolve, reject);
      } catch (err) {
        reject(err as Error);
      }
    });
  }

  private openSocket(onOpen?: () => void, onError?: (e: Error) => void): void {
    // Translate http(s):// signaling base URL into a ws(s):// endpoint.
    const wsUrl = this.url.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws';
    const ws = new WebSocket(wsUrl);
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectAttempt = 0;
      this.emitter.emit('open', undefined);
      onOpen?.();
    };

    ws.onmessage = (event) => {
      this.handleMessage(event.data as string);
    };

    ws.onerror = () => {
      onError?.(new Error('WebSocket error'));
    };

    ws.onclose = () => {
      this.emitter.emit('close', undefined);
      if (this.shouldReconnect) this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectAttempt += 1;
    // Exponential backoff capped at 10s, with light jitter.
    const delay = Math.min(10_000, 2 ** this.reconnectAttempt * 250);
    const jitter = Math.random() * 250;
    this.emitter.emit('reconnecting', { attempt: this.reconnectAttempt });
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.openSocket();
    }, delay + jitter);
  }

  private handleMessage(raw: string): void {
    let msg: ServerToClientMessage;
    try {
      msg = JSON.parse(raw) as ServerToClientMessage;
    } catch {
      return;
    }

    switch (msg.type) {
      case 'room-created':
        this.pendingCreate?.(msg.roomId);
        this.pendingCreate = null;
        break;
      case 'room-joined':
        this.pendingJoin?.resolve(msg.roomId);
        this.pendingJoin = null;
        break;
      case 'peer-joined':
        this.emitter.emit('peer-joined', { roomId: msg.roomId });
        break;
      case 'peer-left':
        this.emitter.emit('peer-left', { roomId: msg.roomId });
        break;
      case 'signal':
        this.emitter.emit('signal', { roomId: msg.roomId, data: msg.data });
        break;
      case 'error':
        // A pending join is the most likely victim of an error response.
        if (this.pendingJoin) {
          this.pendingJoin.reject(new Error(msg.message));
          this.pendingJoin = null;
        }
        this.emitter.emit('error', { code: msg.code, message: msg.message });
        break;
    }
  }

  private send(message: ClientToServerMessage): void {
    this.ws?.send(JSON.stringify(message));
  }

  /** Create a new room; resolves with the server-assigned room id. */
  createRoom(): Promise<{ roomId: string; role: PeerRole }> {
    return new Promise((resolve) => {
      this.pendingCreate = (roomId) => resolve({ roomId, role: 'sender' });
      this.send({ type: 'create-room' });
    });
  }

  /** Join an existing room; rejects if the room is missing or full. */
  joinRoom(roomId: string): Promise<{ roomId: string; role: PeerRole }> {
    return new Promise((resolve, reject) => {
      this.pendingJoin = {
        resolve: (id) => resolve({ roomId: id, role: 'receiver' }),
        reject,
      };
      this.send({ type: 'join-room', roomId });
    });
  }

  /** Relay an SDP/ICE payload to the other peer in the room. */
  sendSignal(roomId: string, data: SignalPayload): void {
    this.send({ type: 'signal', roomId, data });
  }

  /** Permanently close the socket and stop reconnecting. */
  close(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.ws?.close();
    this.ws = null;
    this.emitter.clear();
  }
}
