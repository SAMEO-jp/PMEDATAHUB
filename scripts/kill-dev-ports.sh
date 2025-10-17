#!/bin/bash

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== ポート3000-3002のプロセスを停止 ===${NC}"
echo ""

# ポート3000-3002の使用状況確認
echo -e "${YELLOW}[1/2] ポート使用状況を確認中...${NC}"
PORTS=$(ss -tulpn 2>/dev/null | grep -E ":300[0-2]" || netstat -tulpn 2>/dev/null | grep -E ":300[0-2]")

if [ -z "$PORTS" ]; then
    echo -e "${GREEN}✅ ポート3000-3002は使用されていません${NC}"
    exit 0
fi

echo -e "${YELLOW}以下のポートが使用中です:${NC}"
echo "$PORTS"
echo ""

# プロセスを停止
echo -e "${YELLOW}[2/2] プロセスを停止中...${NC}"

for port in 3000 3001 3002; do
    PID=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$PID" ]; then
        echo -e "${YELLOW}ポート${port}のプロセス(PID: $PID)を停止します...${NC}"
        kill $PID 2>/dev/null
        sleep 1
        
        # まだ残っている場合は強制終了
        if lsof -ti:$port > /dev/null 2>&1; then
            echo -e "${RED}強制終了します...${NC}"
            kill -9 $PID 2>/dev/null
        fi
        
        echo -e "${GREEN}✅ ポート${port}を解放しました${NC}"
    fi
done

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ すべてのポートを解放しました${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

