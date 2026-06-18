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
    // TURN_URL may be a comma-separated list of endpoints (e.g. :80, :443,
    // ?transport=tcp). Handing the browser several endpoints sharing one
    // credential dramatically improves connection success across networks.
    const urls = config.turn.url
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);
    iceServers.push({
      urls: urls.length === 1 ? urls[0]! : urls,
      username: config.turn.username,
      credential: config.turn.credential,
    });
  }

  return { iceServers };
}
