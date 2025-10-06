const baseConfig = require('./next.config.base');

const nextConfig = {
  ...baseConfig,
  // スタンドアローン出力設定（Docker等でのデプロイ用）
  output: 'standalone',
};

module.exports = nextConfig;
