#!/bin/bash

# PMEシステム完全自己完結型共有パッケージ作成スクリプト
# npm installすら不要！

echo "🚀 PMEシステム完全自己完結型共有パッケージを作成中..."

# 共有フォルダ名
SHARE_FOLDER="pme-system-standalone"
ZIP_FILE="pme-system-standalone.zip"

# 既存の共有フォルダを削除
if [ -d "$SHARE_FOLDER" ]; then
    echo "📁 既存の共有フォルダを削除中..."
    rm -rf "$SHARE_FOLDER"
fi

if [ -f "$ZIP_FILE" ]; then
    echo "📦 既存のZIPファイルを削除中..."
    rm -f "$ZIP_FILE"
fi

# 共有フォルダを作成
echo "📁 完全自己完結型フォルダを作成中..."
mkdir "$SHARE_FOLDER"

# Standalone Outputをコピー
echo "📋 Standalone Outputをコピー中..."
cp -r .next/standalone/* "$SHARE_FOLDER/"

# .nextフォルダもコピー（Standalone Outputに必要）
echo "📋 .nextフォルダをコピー中..."
cp -r .next "$SHARE_FOLDER/"

# 静的ファイルをコピー（publicフォルダ）
echo "📋 静的ファイルをコピー中..."
cp -r public/* "$SHARE_FOLDER/public/"

# 起動スクリプトを作成
echo "📝 起動スクリプトを作成中..."
cat > "$SHARE_FOLDER/start.sh" << 'EOF'
#!/bin/bash
echo "🚀 PMEシステムを起動中..."
echo "📱 ブラウザで http://localhost:3000 にアクセスしてください"
echo "⏹️  停止するには Ctrl+C を押してください"
echo ""
node server.js
EOF

# Windows用起動スクリプトも作成
cat > "$SHARE_FOLDER/start.bat" << 'EOF'
@echo off
echo 🚀 PMEシステムを起動中...
echo 📱 ブラウザで http://localhost:3000 にアクセスしてください
echo ⏹️  停止するには Ctrl+C を押してください
echo.
node server.js
pause
EOF

# 実行権限を付与
chmod +x "$SHARE_FOLDER/start.sh"

# READMEファイルを作成
echo "📝 READMEファイルを作成中..."
cat > "$SHARE_FOLDER/README.md" << 'EOF'
# PMEシステム完全自己完結型パッケージ

## 🎉 npm install不要！

このパッケージには、すべての依存関係が含まれています。

## 🚀 起動方法

### Linux/Mac
```bash
./start.sh
```

### Windows
```cmd
start.bat
```

または
```cmd
node server.js
```

## 📱 アクセス

ブラウザで以下のURLにアクセスしてください：
```
http://localhost:3000
```

## ⏹️ 停止方法

ターミナルで `Ctrl+C` を押してください。

## 📁 含まれるファイル

- `server.js` - メインサーバーファイル
- `node_modules/` - すべての依存関係（含まれています）
- `data/` - データベースファイル
- `public/` - 静的ファイル
- `package.json` - パッケージ情報

## 🎯 特徴

- ✅ **npm install不要**
- ✅ **Node.jsのみ必要**
- ✅ **完全自己完結型**
- ✅ **即座に起動可能**
- ✅ **クロスプラットフォーム対応**

## 🔧 システム要件

- Node.js 18以上
- ポート3000が使用可能

## 🆘 トラブルシューティング

### ポート3000が使用中の場合
```bash
PORT=3001 node server.js
```

### 権限エラーの場合（Linux/Mac）
```bash
chmod +x start.sh
./start.sh
```
EOF

# ZIPファイルを作成
echo "📦 ZIPファイルを作成中..."
zip -r "$ZIP_FILE" "$SHARE_FOLDER/"

# ファイルサイズを表示
SHARE_SIZE=$(du -sh "$SHARE_FOLDER" | cut -f1)
ZIP_SIZE=$(du -sh "$ZIP_FILE" | cut -f1)

echo "✅ 完全自己完結型共有パッケージが完成しました！"
echo "📁 フォルダサイズ: $SHARE_SIZE"
echo "📦 ZIPファイルサイズ: $ZIP_SIZE"
echo "📂 共有フォルダ: $SHARE_FOLDER"
echo "📦 ZIPファイル: $ZIP_FILE"
echo ""
echo "🎯 共有方法:"
echo "1. $ZIP_FILE を相手に送信"
echo "2. 受信側で unzip $ZIP_FILE"
echo "3. cd $SHARE_FOLDER && ./start.sh (Linux/Mac) または start.bat (Windows)"
echo ""
echo "🎉 npm installすら不要！Node.jsだけで即座に起動できます！"
