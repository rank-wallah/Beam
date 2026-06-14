/**
 * Builds the ICE server list handed to clients via `GET /ice`.
 *
 * STUN is always included. TURN is appended only when configured, so the
 * default deployment is STUN-only and free, while a production deployment can
 * opt into TURN for reliability behind symmetric NAT / CGNAT — without any
 * client code change.
 */
import type { IceConfigResponse, IceServerConfig } from '@beam/shared';
import { config } from '../config.js';

export function buildIceConfig(): IceConfigResponse {
  const iceServers: IceServerConfig[] = [];

  if (config.stunUrls.length > 0) {
    iceServers.push({ urls: config.stunUrls });
  }

  if (config.turn) {
    iceServers.push({
      urls: config.turn.url,
      username: config.turn.username,
      credential: config.turn.credential,
    });
  }

  return { iceServers };
}
