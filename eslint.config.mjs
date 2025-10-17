import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginNext from "@next/eslint-plugin-next";
import pluginImport from "eslint-plugin-import";
import pluginUnusedImports from "eslint-plugin-unused-imports";

export default [
  // 基本設定 - srcフォルダのみを対象
  { 
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { js }, 
    rules: {
      ...js.configs.recommended.rules,
    }
  },
  { 
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    languageOptions: { globals: globals.browser } 
  },
  
  // TypeScript設定（簡略化）
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        // TypeScriptの基本的なパースのみ
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // 基本的なTypeScriptルールのみ
      "@typescript-eslint/no-unused-vars": "off", // unused-importsで代替
    },
  },
  // JavaScriptファイル用の設定（型チェックなし）
  {
    files: ["src/**/*.{js,mjs,cjs}"],
    languageOptions: {
      parserOptions: {
        project: null, // 型チェックを無効化
      },
    },
  },
  
  // React設定
  pluginReact.configs.flat.recommended,
  {
    files: ["src/**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
      // パスエイリアスの設定
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
        alias: {
          map: [
            ["@src", "./src"],
            ["@", "./src"],
            ["@ui", "./src/components/ui"],
            ["@app", "./src/app"],
            ["@components", "./src/app/app_bom/src/components"],
            ["@bom", "./src/app/app_bom"],
            ["@utils", "./src/app/app_bom/src/utils"],
          ],
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      },
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
    files: ["src/**/*.{js,jsx,ts,tsx}"],
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
    files: ["src/**/*.{js,jsx,ts,tsx}"],
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
      "@typescript-eslint/no-unresolved": "off", // パスエイリアス対応のため完全に無効化
      
      // インポート順序
      "import/order": "off",
      // インポートの詳細ルール
      "import/no-unresolved": "off", // TypeScriptが解決するため
      "@typescript-eslint/no-unresolved": "off", // パスエイリアス対応のため
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
];