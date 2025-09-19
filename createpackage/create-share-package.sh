#!/bin/bash

# PMEシステム共有パッケージ作成スクリプト

echo "🚀 PMEシステム共有パッケージを作成中..."

# 共有フォルダ名
SHARE_FOLDER="pme-system-share"
ZIP_FILE="pme-system-share.zip"

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
echo "📁 共有フォルダを作成中..."
mkdir "$SHARE_FOLDER"

# 必要なファイルをコピー
echo "📋 ファイルをコピー中..."
cp -r .next "$SHARE_FOLDER/"
cp -r data "$SHARE_FOLDER/"
cp -r public "$SHARE_FOLDER/"
cp package.json "$SHARE_FOLDER/"
cp next.config.js "$SHARE_FOLDER/"

# READMEファイルを作成
echo "📝 READMEファイルを作成中..."
cat > "$SHARE_FOLDER/README.md" << 'EOF'
# PMEシステム共有パッケージ

## セットアップ手順

1. 依存関係をインストール
```bash
npm install
```

2. 本番サーバーを起動
```bash
npm start
```

3. ブラウザでアクセス
```
http://localhost:3000
```

## 含まれるファイル

- `.next/` - ビルド済みアプリケーション
- `data/` - データベースファイル
- `public/` - 静的ファイル
- `package.json` - 依存関係情報
- `next.config.js` - Next.js設定

## 注意事項

- Node.js 18以上が必要です
- ポート3000が使用可能であることを確認してください
EOF

# ZIPファイルを作成
echo "📦 ZIPファイルを作成中..."
zip -r "$ZIP_FILE" "$SHARE_FOLDER/"

# ファイルサイズを表示
SHARE_SIZE=$(du -sh "$SHARE_FOLDER" | cut -f1)
ZIP_SIZE=$(du -sh "$ZIP_FILE" | cut -f1)

echo "✅ 共有パッケージが完成しました！"
echo "📁 フォルダサイズ: $SHARE_SIZE"
echo "📦 ZIPファイルサイズ: $ZIP_SIZE"
echo "📂 共有フォルダ: $SHARE_FOLDER"
echo "📦 ZIPファイル: $ZIP_FILE"
echo ""
echo "🎯 共有方法:"
echo "1. $ZIP_FILE を相手に送信"
echo "2. 受信側で unzip $ZIP_FILE"
echo "3. cd $SHARE_FOLDER && npm install && npm start"
