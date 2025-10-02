/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 通常ビルド（ファイルサイズ最適化）
  // output: 'standalone', // standaloneビルドは別スクリプトで実行
  
  // 本番環境でのソースマップの生成を無効化
  productionBrowserSourceMaps: false,
  
  // ビルド時のESLintチェックをスキップ（型チェックは別途実行）
  eslint: { ignoreDuringBuilds: true },
  
  // 画像の最適化設定
  images: {
    domains: [],
    unoptimized: true,
  },

  // ビルド時の警告をエラーとして扱う
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // 開発サーバーの設定
  webpack: (config, { dev, isServer }) => {
    // src/nullフォルダをビルド対象から除外
    if (config.watchOptions) {
      config.watchOptions.ignored = [
        ...(Array.isArray(config.watchOptions.ignored) ? config.watchOptions.ignored : []),
        '**/src/null/**',
      ];
    } else {
      config.watchOptions = {
        ignored: ['**/src/null/**'],
      };
    }

    // ビルド時に問題のあるファイルを除外
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: [
        /src\/null/,
        /src\/lib\/trpc\/routers\/db\/project\.ts/,
        /src\/app\/slide\/page\.tsx/,
        /src\/app\/app_project\/\[project_id\]\/manage\/kounyu\/new\/page\.tsx/
      ],
    });

    return config;
  },

  // 環境変数の設定
  env: {
    // ここに環境変数を追加
  },

  // リダイレクト設定
  async redirects() {
    return [];
  },

  // リライト設定
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig; 