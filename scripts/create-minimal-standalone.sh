#!/bin/bash

# PME Standalone Minimal Build Script
# publicフォルダを除外した最小限のスタンドアロンバージョンを作成

set -e  # エラー時に停止

echo "🚀 PME Standalone Minimal Build 開始..."

# 色付きログ関数
log_info() {
    echo -e "\033[1;34mℹ️  $1\033[0m"
}

log_success() {
    echo -e "\033[1;32m✅ $1\033[0m"
}

log_warning() {
    echo -e "\033[1;33m⚠️  $1\033[0m"
}

log_error() {
    echo -e "\033[1;31m❌ $1\033[0m"
}

# 作業ディレクトリの確認
if [ ! -f "package.json" ]; then
    log_error "package.jsonが見つかりません。プロジェクトルートで実行してください。"
    exit 1
fi

# 古いファイルをクリーンアップ
log_info "古いファイルをクリーンアップ中..."
rm -f pme-standalone-minimal.tar.xz
rm -rf temp-standalone

# スタンドアローンビルド実行
log_info "スタンドアローンビルドを実行中..."
npm run build:standalone

# 一時ディレクトリ作成
log_info "一時ディレクトリを作成中..."
mkdir -p temp-standalone/public

# 必要なファイルをコピー
log_info "必要なファイルをコピー中..."

# .nextディレクトリ（サーバーコードとCSS/JS）
if [ -d ".next/standalone/.next" ]; then
    cp -r .next/standalone/.next temp-standalone/
    log_success ".nextディレクトリをコピー完了"
else
    log_error ".next/standalone/.nextが見つかりません"
    exit 1
fi

# node_modulesディレクトリ
if [ -d ".next/standalone/node_modules" ]; then
    cp -r .next/standalone/node_modules temp-standalone/
    log_success "node_modulesディレクトリをコピー完了"
else
    log_error ".next/standalone/node_modulesが見つかりません"
    exit 1
fi

# dataディレクトリ（データベースファイル）
if [ -d ".next/standalone/data" ]; then
    cp -r .next/standalone/data temp-standalone/
    log_success "dataディレクトリをコピー完了"
else
    log_warning "dataディレクトリが見つかりません（スキップ）"
fi

# 設定ファイル
cp .next/standalone/server.js temp-standalone/ 2>/dev/null || log_warning "server.jsが見つかりません"
cp .next/standalone/package.json temp-standalone/ 2>/dev/null || log_warning "package.jsonが見つかりません"
cp .next/standalone/.env temp-standalone/ 2>/dev/null || log_warning ".envが見つかりません"

log_success "設定ファイルをコピー完了"

# サイズ確認
SIZE_BEFORE=$(du -sh .next/standalone | cut -f1)
SIZE_AFTER=$(du -sh temp-standalone | cut -f1)
log_info "サイズ比較: 元のサイズ ${SIZE_BEFORE} → 最小版 ${SIZE_AFTER}"

# 圧縮
log_info "xz圧縮を実行中..."
tar -cJf pme-standalone-minimal.tar.xz -C temp-standalone .

# 圧縮ファイルサイズ確認
COMPRESSED_SIZE=$(ls -lh pme-standalone-minimal.tar.xz | awk '{print $5}')
log_success "圧縮完了: ${COMPRESSED_SIZE}"

# 一時ファイル削除
log_info "一時ファイルを削除中..."
rm -rf temp-standalone

# 完了メッセージ
echo ""
log_success "🎉 PME Standalone Minimal Build 完了！"
echo ""
echo "📦 作成されたファイル: pme-standalone-minimal.tar.xz (${COMPRESSED_SIZE})"
echo ""
echo "📋 Windowsでの使用方法:"
echo "   1. pme-standalone-minimal.tar.xz をWindowsに転送"
echo "   2. tar -xf pme-standalone-minimal.tar.xz で展開"
echo "   3. npm start で実行"
echo ""
echo "⚠️  注意: 画像ファイルは含まれていません（publicフォルダは空）"
echo ""
