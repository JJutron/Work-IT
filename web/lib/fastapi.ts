/**
 * FastAPI origin for Next SSR and rewrites.
 * 로컬 `next dev`는 localhost:8000, Docker next 서비스는 FASTAPI_INTERNAL_URL=http://web:8000.
 */
export function fastapiBaseUrl(): string {
  return (process.env.FASTAPI_INTERNAL_URL || "http://localhost:8000").replace(/\/$/, "");
}

export function fastapiCandidates(): string[] {
  const preferred = fastapiBaseUrl();
  return Array.from(
    new Set([preferred, "http://localhost:8000", "http://127.0.0.1:8000", "http://web:8000"]),
  );
}
