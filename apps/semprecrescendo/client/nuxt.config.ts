export default defineNuxtConfig({
  extends: ["@theater-tickets/client"],

  compatibilityDate: "2026-01-31",

  // Organization-specific overrides
  app: {
    head: {
      title: "Sempre Crescendo - Reserveren",
    },
  },

  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
