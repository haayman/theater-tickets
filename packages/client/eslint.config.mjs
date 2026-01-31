// @ts-check
import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

export default createConfigForNuxt({
  features: {
    typescript: true,
    stylistic: false,
  },
})
  .append({
    rules: {
      "import/order": "error",
      "import/first": "error",
      "import/no-mutable-exports": "error",
      "import/no-unresolved": "off",
      "import/newline-after-import": ["error"],

      // Custom rules
      "no-unused-vars": "warn",
      "no-debugger": "warn",
      "vue/multi-word-component-names": "off",
      "vue/no-unused-components": "warn",
      "vue/no-unused-vars": "warn",
      "vue/no-v-html": "off",
      "vue/no-v-text-v-html-on-component": "off",

      // Allow unused vars if they get followed by a var that is used
      "@typescript-eslint/no-unused-vars": [
        "error",
        { vars: "all", args: "after-used", ignoreRestSiblings: false },
      ],
    },
  })
  .override("nuxt/typescript/rules", {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  });
