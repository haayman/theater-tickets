export default defineNuxtConfig({
  extends: ["@theater-tickets/client"],

  compatibilityDate: "2026-01-31",

  // Organization-specific overrides
  app: {
    head: {
      title: "Sempre Crescendo - Reserveren",
    },
  },

  runtimeConfig: {
    public: {
      client: "semprecrescendo",
    },
  },

  vite: {
    server: {
      allowedHosts: true,
    },
    hmr: {
      protocol: "wss",
      clientPort: 443,
      port: 24626,
      path: "hmr/",
    },
  },
});
