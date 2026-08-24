/**
 * FastAPI origin for Nuxt SSR.
 * 로컬 `nuxt dev`는 localhost:8000, Docker nuxt 서비스는 FASTAPI_INTERNAL_URL=http://web:8000.
 */
export function fastapiBaseUrl() {
  const fromEnv = process.env.FASTAPI_INTERNAL_URL;
  if (fromEnv) return String(fromEnv).replace(/\/$/, "");
  const config = useRuntimeConfig();
  return String(config.fastapiInternalUrl || "http://localhost:8000").replace(/\/$/, "");
}
