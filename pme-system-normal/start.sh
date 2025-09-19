#!/bin/bash
echo "🚀 PMEシステムを起動中..."
echo "📦 依存関係をインストール中..."
npm install
echo "🔨 アプリケーションをビルド中..."
npm run build
echo "🚀 本番サーバーを起動中..."
echo "📱 ブラウザで http://localhost:3000 にアクセスしてください"
echo "⏹️  停止するには Ctrl+C を押してください"
echo ""
npm start
