const fastapi = (process.env.FASTAPI_INTERNAL_URL || "http://localhost:8000").replace(
  /\/$/,
  "",
);

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2024-11-01",
  css: ["~/assets/css/globals.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  components: [{ path: "~/components", pathPrefix: false }],
  runtimeConfig: {
    fastapiInternalUrl: fastapi,
  },
  app: {
    head: {
      htmlAttrs: { lang: "ko" },
      title: "산재ON - 정당한 보상, 처음부터",
      meta: [
        {
          name: "description",
          content:
            "산업재해 보상 서비스. 예상 보상금부터 확인하고 장해등급·판례·신청까지 이어갑니다.",
        },
      ],
      link: [
        { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
        },
      ],
    },
  },
  nitro: {
    routeRules: {
      "/": { headers: { "cache-control": "no-store" } },
    },
    devProxy: {
      "/static": { target: fastapi, changeOrigin: true },
      "/api": { target: fastapi, changeOrigin: true },
      "/auth": { target: fastapi, changeOrigin: true },
      "/compensation": { target: fastapi, changeOrigin: true },
      "/analysis": { target: fastapi, changeOrigin: true },
      "/lawyers": { target: fastapi, changeOrigin: true },
      "/admin": { target: fastapi, changeOrigin: true },
      "/health": { target: fastapi, changeOrigin: true },
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        },
      },
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: true,
    },
  },
  typescript: {
    typeCheck: false,
  },
});
