/**
 * Signaling protocol — messages exchanged over the WebSocket between a
 * browser and the Zipline signaling server.
 *
 * The server is a *blind relay*: it creates/joins rooms, tracks presence,
 * and forwards opaque `signal` payloads (SDP + ICE) between the two members
 * of a room. It never inspects or stores SDP/ICE beyond routing, and it
 * never sees file bytes or encryption keys.
 *
 * Every message is a discriminated union on `type`, so both ends get
 * exhaustive type-checking.
 */

/** Role a client plays in a room. The sender is always the WebRTC offerer. */
export type PeerRole = 'sender' | 'receiver';

// ── Client → Server ───────────────────────────────────────────

/** Sender asks the server to mint a fresh room. */
export interface CreateRoomMessage {
  type: 'create-room';
}

/** Receiver joins an existing room by id. */
export interface JoinRoomMessage {
  type: 'join-room';
  roomId: string;
}

/**
 * Opaque signaling payload to relay to the other peer in the room.
 * `data` is an SDP offer/answer or an ICE candidate — the server does not
 * parse it.
 */
export interface SignalMessage {
  type: 'signal';
  roomId: string;
  data: SignalPayload;
}

export type ClientToServerMessage =
  | CreateRoomMessage
  | JoinRoomMessage
  | SignalMessage;

// ── Server → Client ───────────────────────────────────────────

/** Confirms room creation and tells the sender its role. */
export interface RoomCreatedMessage {
  type: 'room-created';
  roomId: string;
  role: PeerRole; // 'sender'
}

/** Confirms a successful join and tells the receiver its role. */
export interface RoomJoinedMessage {
  type: 'room-joined';
  roomId: string;
  role: PeerRole; // 'receiver'
}

/** Presence: the other peer joined the room. Triggers WebRTC offer. */
export interface PeerJoinedMessage {
  type: 'peer-joined';
  roomId: string;
}

/** Presence: the other peer left / disconnected. Triggers resume handling. */
export interface PeerLeftMessage {
  type: 'peer-left';
  roomId: string;
}

/** Relayed signaling payload from the other peer. */
export interface RelayedSignalMessage {
  type: 'signal';
  roomId: string;
  data: SignalPayload;
}

/** Error with a stable machine-readable code plus human message. */
export interface ErrorMessage {
  type: 'error';
  code: SignalingErrorCode;
  message: string;
}

export type ServerToClientMessage =
  | RoomCreatedMessage
  | RoomJoinedMessage
  | PeerJoinedMessage
  | PeerLeftMessage
  | RelayedSignalMessage
  | ErrorMessage;

// ── Shared payloads ───────────────────────────────────────────

/** SDP description or ICE candidate, distinguished by `kind`. */
export type SignalPayload =
  | { kind: 'sdp'; description: RTCSessionDescriptionInitLike }
  | { kind: 'ice'; candidate: RTCIceCandidateInitLike | null };

/**
 * Minimal structural mirror of the browser DTOs so @zipline/shared stays free
 * of DOM lib types (it is consumed by the Node server too).
 */
export interface RTCSessionDescriptionInitLike {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp?: string;
}

export interface RTCIceCandidateInitLike {
  candidate?: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
  usernameFragment?: string | null;
}

export type SignalingErrorCode =
  | 'room-not-found'
  | 'room-full'
  | 'invalid-message'
  | 'not-in-room'
  | 'internal-error';

/** ICE server configuration handed to clients from `GET /ice`. */
export interface IceServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface IceConfigResponse {
  iceServers: IceServerConfig[];
}
