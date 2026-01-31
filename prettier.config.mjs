export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  overrides: [
    {
      files: "*.json",
      options: {
        parser: "json",
        printWidth: 100,
      },
    },
    {
      files: ["package.json", "package-lock.json"],
      options: {
        parser: "json-stringify",
        printWidth: 100,
      },
    },
  ],
};
