#!/bin/bash

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== 開発サーバー起動スクリプト ===${NC}"
echo ""

# Step 1: 既存プロセス確認
echo -e "${YELLOW}[1/4] 既存プロセスを確認中...${NC}"
EXISTING_PROCESSES=$(ps aux | grep -E "next-server" | grep -v grep)

if [ -n "$EXISTING_PROCESSES" ]; then
    echo -e "${RED}⚠️  既存のNext.jsプロセスが見つかりました:${NC}"
    echo "$EXISTING_PROCESSES"
    echo ""
else
    echo -e "${GREEN}✅ 既存プロセスはありません${NC}"
fi

# Step 2: ポート確認
echo ""
echo -e "${YELLOW}[2/4] ポート使用状況を確認中...${NC}"
PORT_3000=$(ss -tulpn 2>/dev/null | grep ":3000" || netstat -tulpn 2>/dev/null | grep ":3000")

if [ -n "$PORT_3000" ]; then
    echo -e "${RED}⚠️  ポート3000が使用中です:${NC}"
    echo "$PORT_3000"
    
    # ポート3000が使用中の場合は確認を求める
    echo ""
    echo -e "${YELLOW}既存のプロセスを停止してよろしいですか？ (y/n)${NC}"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}プロセスを停止します...${NC}"
        pkill -f "next-server" 2>/dev/null
        sleep 2
        echo -e "${GREEN}✅ プロセスを停止しました${NC}"
    else
        echo -e "${RED}❌ 起動を中止しました${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ ポート3000は空いています${NC}"
    
    # 他のポート（3001, 3002など）をチェック
    OTHER_PORTS=$(ss -tulpn 2>/dev/null | grep -E ":300[1-9]" || netstat -tulpn 2>/dev/null | grep -E ":300[1-9]")
    
    if [ -n "$OTHER_PORTS" ]; then
        echo -e "${YELLOW}⚠️  他のポートでNext.jsが動いています:${NC}"
        echo "$OTHER_PORTS"
        echo -e "${YELLOW}これらを停止します...${NC}"
        pkill -f "next-server" 2>/dev/null
        sleep 2
        echo -e "${GREEN}✅ プロセスを停止しました${NC}"
    fi
fi

# Step 3: 最終確認
echo ""
echo -e "${YELLOW}[3/4] 最終確認中...${NC}"
sleep 1

FINAL_CHECK=$(ss -tulpn 2>/dev/null | grep ":3000" || netstat -tulpn 2>/dev/null | grep ":3000")
if [ -n "$FINAL_CHECK" ]; then
    echo -e "${RED}❌ ポート3000がまだ使用中です。強制終了を試みます...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 2
fi

# Step 4: 起動
echo ""
echo -e "${YELLOW}[4/4] ポート3000で開発サーバーを起動します...${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

npm run dev

# このスクリプトはnpm run devが終了するまで待機します

