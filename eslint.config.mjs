// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginNext from "@next/eslint-plugin-next";
import pluginImport from "eslint-plugin-import";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 基本設定
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
  
  // TypeScript設定
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  
  // React設定
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Next.jsでは不要
      "react/prop-types": "off", // TypeScriptで型チェック
      "react/jsx-uses-react": "off", // React 17以降では不要
      "react/jsx-uses-vars": "error",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
    },
  },
  
  // Next.js設定
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  
  // 全体的なルール
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: pluginImport,
      "unused-imports": pluginUnusedImports,
    },
    rules: {
      // 未使用変数・インポート
      "@typescript-eslint/no-unused-vars": "off", // unused-importsで代替
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", argsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      
      // インポート順序
      "import/order": "off",
      // インポートの詳細ルール
      "import/no-unresolved": "off", // TypeScriptが解決するため
      "import/named": "off", // 名前付きインポートの検証
      "import/default": "off", // デフォルトインポートの検証
      "import/no-duplicates": "off", // 重複インポートの禁止
      
      // その他の推奨ルール
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "off",
      "no-debugger": "error",
    },
  },
]);
