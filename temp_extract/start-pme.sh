#!/bin/bash

# PME DataHub 自動起動スクリプト
set -e

# 色付き出力の設定
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 現在のディレクトリを取得
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$CURRENT_DIR"

echo -e "${BLUE}========================================"
echo -e "   🚀 PME DataHub 自動起動システム"
echo -e "========================================${NC}"
echo

# Node.jsがインストールされているかチェック
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ エラー: Node.jsがインストールされていません${NC}"
    echo -e "   Node.jsをインストールしてください: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js が確認できました${NC}"
node --version

# 必要なファイルが存在するかチェック
if [ ! -f "server.js" ]; then
    echo -e "${RED}❌ エラー: server.js が見つかりません${NC}"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ エラー: package.json が見つかりません${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 必要なファイルが確認できました${NC}"

# 依存関係をインストール（初回のみ）
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 依存関係をインストールしています...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 依存関係のインストールに失敗しました${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ 依存関係のインストールが完了しました${NC}"
fi

# 既存のサーバープロセスを停止
echo -e "${YELLOW}🔍 既存のサーバープロセスをチェックしています...${NC}"
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  ポート3000が使用中です。既存プロセスを停止します...${NC}"
    lsof -ti:3000 | xargs kill -9 > /dev/null 2>&1 || true
    sleep 2
fi

# サーバーを起動
echo
echo -e "${BLUE}🚀 サーバーを起動しています...${NC}"
echo -e "   ポート: 3000"
echo -e "   URL: http://localhost:3000"
echo

# バックグラウンドでサーバーを起動
node server.js &
SERVER_PID=$!

# PIDファイルを作成
echo $SERVER_PID > server.pid

# サーバーの起動を待機
echo -e "${YELLOW}⏳ サーバーの起動を待機しています...${NC}"
sleep 3

# サーバーが起動したかチェック
check_server() {
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# 最大30秒間サーバーの起動を待機
for i in {1..30}; do
    if check_server; then
        echo -e "${GREEN}✅ サーバーが正常に起動しました！${NC}"
        break
    else
        echo -e "${YELLOW}サーバーの起動を待機中... (${i}/30)${NC}"
        sleep 1
    fi
    
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ サーバーの起動がタイムアウトしました${NC}"
        kill $SERVER_PID 2>/dev/null || true
        rm -f server.pid
        exit 1
    fi
done

# ブラウザでアプリケーションを開く
echo -e "${BLUE}🌐 ブラウザでアプリケーションを開いています...${NC}"
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 &
elif command -v open &> /dev/null; then
    open http://localhost:3000 &
elif command -v start &> /dev/null; then
    start http://localhost:3000 &
fi

echo
echo -e "${GREEN}========================================"
echo -e "   ✅ PME DataHub が起動しました！"
echo -e "========================================${NC}"
echo
echo -e "${BLUE}📋 操作方法:${NC}"
echo -e "   - アプリケーション: http://localhost:3000"
echo -e "   - このウィンドウを閉じるとサーバーが停止します"
echo -e "   - 手動で停止する場合は Ctrl+C を押してください"
echo

# プロセス終了時のクリーンアップ関数
cleanup() {
    echo
    echo -e "${YELLOW}🛑 サーバーを停止しています...${NC}"
    
    if [ -f "server.pid" ]; then
        PID=$(cat server.pid)
        if kill -0 $PID 2>/dev/null; then
            kill $PID 2>/dev/null || true
            sleep 2
            kill -9 $PID 2>/dev/null || true
        fi
        rm -f server.pid
    fi
    
    # 念のためポート3000を使用しているプロセスを停止
    if lsof -ti:3000 > /dev/null 2>&1; then
        lsof -ti:3000 | xargs kill -9 > /dev/null 2>&1 || true
    fi
    
    echo -e "${GREEN}✅ サーバーが停止しました${NC}"
    echo -e "アプリケーションを終了します..."
    sleep 2
    exit 0
}

# シグナルハンドラーを設定
trap cleanup SIGINT SIGTERM

# ユーザーが何かキーを押すまで待機
echo -e "${YELLOW}何かキーを押すとサーバーを停止します...${NC}"
read -n 1 -s

# クリーンアップを実行
cleanup
