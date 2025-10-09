import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      "no-console": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",

      // Prevent warning comments like TODO, FIXME
      "no-warning-comments": [
        "error",
        {
          terms: ["TODO", "FIXME", "XXX", "HACK"],
          location: "start",
        },
      ],

      // Enforce comment formatting
      "spaced-comment": [
        "error",
        "always",
        {
          line: {
            markers: ["/"],
            exceptions: ["-", "+", "*", "=", "!"],
          },
          block: {
            markers: ["*"],
            exceptions: ["-", "+", "*", "=", "!"],
            balanced: true,
          },
        },
      ],
    },
  },
  {
    // wee will target specific jsx comment patterns instead of all commented code
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-warning-comments": [
        "error",
        {
          terms: [
            "// <",
            "// return (",
            "// return<",
            "// const ",
            "// function",
            "// export",
            "// import",
            "/* <",
            "/* return",
          ],
          location: "anywhere",
        },
      ],
    },
  },
  {
    // Allow console in test files
    files: ["**/*.test.{js,ts,tsx}", "**/*.spec.{js,ts,tsx}"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
