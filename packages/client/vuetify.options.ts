import type { ThemeDefinition } from "vuetify";

export default function (): { theme: { dark: boolean; themes: { dark: ThemeDefinition } } } {
  return {
    theme: {
      dark: false,
      themes: {
        dark: {
          colors: {
            primary: "#f0940a",
            anchor: "#f0940a",
          },
        },
      },
    },
  };
}
