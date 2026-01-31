import { transformAssetUrls } from "vite-plugin-vuetify";

process.env.title = "Frontend";

const config = defineNuxtConfig({
  compatibilityDate: "2025-04-25",
  ssr: false,
  app: {
    // pageTransition: { name: "page", mode: "out-in" },
    head: {
      //      titleTemplate: "%s - " + process.env.APP_TITLE,
      title: process.env.APP_TITLE || "Theater tickets",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: process.env.npm_package_description || "",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: process.env.APP_FAVICON || "/favicon.ico" },
        {
          // TODO: uit .env ofzo halen
          rel: "stylesheet",
          type: "text/css",
          href: "//fonts.googleapis.com/css?family=Open+Sans%3A400italic%2C400%2C600italic%2C600%2C700italic%2C700&ver=1.0.0",
        },
      ],
    },

    // pageTransition: { name: "page", mode: "out-in" },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASEURL || "http://localhost:3001",
      api: {
        base: "/api", // NUXT_PUBLIC_API_BASE
        routes: {
          auth: {
            login: "/auth/login",
          },
          profile: {
            index: "/auth/me",
          },
        },
      },
      client: process.env.APP_CLIENT,
      logo: process.env.APP_LOGO,
      teruggave_termijn: process.env.TERUGGAVE_TERMIJN,
    },
  },

  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxt/eslint", "vuetify-nuxt-module"],

  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: "light",
        themes: {
          dark: {
            colors: {
              primary: "#f0940a",
              anchor: "#f0940a",
            },
          },
        },
      },
    },
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    server: {
      allowedHosts: true,
    },
    optimizeDeps: {
      include: ["vue", "vuetify"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          silenceDeprecations: ["legacy-js-api", "import", "if-function"],
        },
      },
    },
  },

  devtools: { enabled: true },

  /*
   ** Build configuration
   */
  build: {},
});

// console.log(config);
export default config;
