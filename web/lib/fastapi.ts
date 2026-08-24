/**
 * FastAPI origin for Next SSR and rewrites.
 * 로컬 `next dev`는 localhost:8000, Docker next 서비스는 FASTAPI_INTERNAL_URL=http://web:8000.
 */
export function fastapiBaseUrl(): string {
  return (process.env.FASTAPI_INTERNAL_URL || "http://localhost:8000").replace(/\/$/, "");
}
