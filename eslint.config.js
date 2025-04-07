import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,vue}"] },
  { files: ["**/*.{js,mjs,cjs,vue}"], languageOptions: { globals: globals.browser } },
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {},
  },
  pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    rules: {
      "vue/block-order": [
        "error",
        { order: ["template", "script:not([setup])", "script[setup]", "style:not([scoped])", "style[scoped]"] },
      ],
      "vue/multi-word-component-names": 0,
      "vue/require-default-prop": 0,
    },
  },
  eslintPluginPrettierRecommended,
  {
    ignores: [
      "dist/**", // 忽略 dist 目录及其内容
      "node_modules/**", // 忽略 node_modules 目录及其内容
      "static/**", // 忽略 static 目录及其内容
      "components.d.ts", // 忽略 components.d.ts 文件
      "!**/.prettierrc.js", // 排除 .prettierrc.js 文件（不忽略）
    ],
  },
]);
