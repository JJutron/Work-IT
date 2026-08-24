import { GUEST_CLAIM_PROGRESS } from "./types";
import { fastapiBaseUrl } from "./fastapi";

function isHomePayload(body) {
  const claim = body && body.claim_progress;
  return Boolean(claim && claim.home_cta && claim.home_cta.href && claim.home_cta.label);
}

function guestPayload() {
  return {
    user: null,
    claim_progress: GUEST_CLAIM_PROGRESS,
  };
}

export async function getHomePayload() {
  const headers = {};
  let url = "/api/home";

  if (import.meta.server) {
    url = `${fastapiBaseUrl()}/api/home`;
    const reqHeaders = useRequestHeaders(["cookie"]);
    if (reqHeaders.cookie) headers.cookie = reqHeaders.cookie;
  }

  try {
    const body = await $fetch(url, { headers });
    if (!isHomePayload(body)) {
      throw new Error(`${url} schema`);
    }
    return body;
  } catch (error) {
    console.error("[home] GET /api/home failed", url, error);
    return guestPayload();
  }
}
