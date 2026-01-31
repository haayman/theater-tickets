import "@mdi/font/css/materialdesignicons.css";
// import "vuetify/styles";
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import { nl, en } from "vuetify/locale";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "~/assets/scss/main.scss";

export default defineNuxtPlugin(async (nuxtApp) => {
  const {
    public: { client },
  } = useRuntimeConfig();

  const { theme } = await import(`~/assets/${client}.theme.ts`);
  console.log({ theme });
  await import(`~/assets/scss/${client}.scss`);

  const vuetify = createVuetify({
    components,
    directives,
    blueprint: md3,
    ssr: true,
    locale: {
      locale: "nl",
      fallback: "en",
      messages: { nl, en },
    },
    theme,
  });

  nuxtApp.vueApp.use(vuetify);
});
