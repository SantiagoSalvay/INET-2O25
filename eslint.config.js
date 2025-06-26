// ESLint v9+ config for Next.js + TypeScript
import js from "@eslint/js";
import next from "eslint-config-next";

export default [
  js.config({
    extends: ["eslint:recommended"],
  }),
  ...next,
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/out/**"],
  },
]; 