/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本番環境でのソースマップの生成を無効化
  productionBrowserSourceMaps: false,
  
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

    // ビルド時にsrc/nullフォルダを除外
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /src\/null/,
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