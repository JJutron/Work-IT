import { cookies } from "next/headers";
import { fastapiCandidates } from "./fastapi";
import {
  GUEST_CLAIM_PROGRESS,
  type HomePayload,
} from "./types";

function isHomePayload(body: unknown): body is HomePayload {
  if (!body || typeof body !== "object") return false;
  const claim = (body as HomePayload).claim_progress;
  return Boolean(claim?.home_cta?.href && claim?.home_cta?.label);
}

export async function getHomePayload(): Promise<HomePayload> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((item) => `${item.name}=${item.value}`)
    .join("; ");

  const headers: HeadersInit = cookieHeader ? { cookie: cookieHeader } : {};
  let lastError: unknown;

  for (const base of fastapiCandidates()) {
    try {
      const response = await fetch(`${base}/api/home`, {
        headers,
        cache: "no-store",
      });
      if (!response.ok) {
        lastError = new Error(`${base}/api/home ${response.status}`);
        continue;
      }
      const body: unknown = await response.json();
      if (!isHomePayload(body)) {
        lastError = new Error(`${base}/api/home schema`);
        continue;
      }
      return body;
    } catch (error) {
      lastError = error;
    }
  }

  console.error("[home] GET /api/home failed", lastError);
  return {
    user: null,
    claim_progress: GUEST_CLAIM_PROGRESS,
  };
}
