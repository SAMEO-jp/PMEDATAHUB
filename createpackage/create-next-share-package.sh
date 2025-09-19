#!/bin/bash

# PMEシステム.nextフォルダ共有用パッケージ作成スクリプト
# npm installが必要だが、ビルドは不要

echo "🚀 PMEシステム.nextフォルダ共有用パッケージを作成中..."

# 共有フォルダ名
SHARE_FOLDER="pme-system-next-share"
ZIP_FILE="pme-system-next-share.zip"

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
echo "📁 .nextフォルダ共有用フォルダを作成中..."
mkdir "$SHARE_FOLDER"

# .nextフォルダをコピー
echo "📋 .nextフォルダをコピー中..."
cp -r .next "$SHARE_FOLDER/"

# データベースをコピー
echo "📋 データベースをコピー中..."
cp -r data "$SHARE_FOLDER/"

# 静的ファイルをコピー
echo "📋 静的ファイルをコピー中..."
cp -r public "$SHARE_FOLDER/"

# 設定ファイルをコピー
echo "📋 設定ファイルをコピー中..."
cp package.json "$SHARE_FOLDER/"
cp package-lock.json "$SHARE_FOLDER/"
cp next.config.js "$SHARE_FOLDER/"

# 整理用JSファイルを専用フォルダに格納
echo "📋 整理用JSファイルを専用フォルダに格納中..."
mkdir "$SHARE_FOLDER/scripts"
cp -r scripts/* "$SHARE_FOLDER/scripts/"

# 起動スクリプトを作成
echo "📝 起動スクリプトを作成中..."
cat > "$SHARE_FOLDER/start.sh" << 'EOF'
#!/bin/bash
echo "🚀 PMEシステムを起動中..."
echo "📦 依存関係をインストール中..."
npm install
echo "🚀 本番サーバーを起動中..."
echo "📱 ブラウザで http://localhost:3000 にアクセスしてください"
echo "⏹️  停止するには Ctrl+C を押してください"
echo ""
npm start
EOF

# Windows用起動スクリプトも作成
cat > "$SHARE_FOLDER/start.bat" << 'EOF'
@echo off
echo 🚀 PMEシステムを起動中...
echo 📦 依存関係をインストール中...
npm install
echo 🚀 本番サーバーを起動中...
echo 📱 ブラウザで http://localhost:3000 にアクセスしてください
echo ⏹️  停止するには Ctrl+C を押してください
echo.
npm start
pause
EOF

# 開発用起動スクリプトも作成
cat > "$SHARE_FOLDER/dev.sh" << 'EOF'
#!/bin/bash
echo "🚀 PMEシステム開発モードを起動中..."
echo "📦 依存関係をインストール中..."
npm install
echo "🔧 開発サーバーを起動中..."
echo "📱 ブラウザで http://localhost:3000 にアクセスしてください"
echo "⏹️  停止するには Ctrl+C を押してください"
echo ""
npm run dev
EOF

# Windows用開発起動スクリプトも作成
cat > "$SHARE_FOLDER/dev.bat" << 'EOF'
@echo off
echo 🚀 PMEシステム開発モードを起動中...
echo 📦 依存関係をインストール中...
npm install
echo 🔧 開発サーバーを起動中...
echo 📱 ブラウザで http://localhost:3000 にアクセスしてください
echo ⏹️  停止するには Ctrl+C を押してください
echo.
npm run dev
pause
EOF

# 実行権限を付与
chmod +x "$SHARE_FOLDER/start.sh"
chmod +x "$SHARE_FOLDER/dev.sh"

# READMEファイルを作成
echo "📝 READMEファイルを作成中..."
cat > "$SHARE_FOLDER/README.md" << 'EOF'
# PMEシステム.nextフォルダ共有パッケージ

## 📋 システム要件

- Node.js 18以上
- npm または yarn
- ポート3000が使用可能

## 🚀 起動方法

### 本番モード（推奨）

#### Linux/Mac
```bash
./start.sh
```

#### Windows
```cmd
start.bat
```

### 開発モード

#### Linux/Mac
```bash
./dev.sh
```

#### Windows
```cmd
dev.bat
```

### 手動起動

```bash
# 1. 依存関係をインストール
npm install

# 2. 本番サーバーを起動（ビルド不要）
npm start

# または開発モードで起動
npm run dev
```

## 📁 フォルダ構成

```
pme-system-next-share/
├── .next/                  # ビルド済みアプリケーション
├── data/                   # データベースファイル
├── public/                 # 静的ファイル
├── scripts/                # 整理用JSファイル
├── package.json            # 依存関係情報
├── package-lock.json       # 依存関係のロックファイル
├── next.config.js          # Next.js設定
├── start.sh / start.bat    # 本番起動スクリプト
├── dev.sh / dev.bat        # 開発起動スクリプト
└── README.md               # このファイル
```

## 🔧 利用可能なコマンド

- `npm install` - 依存関係をインストール
- `npm run dev` - 開発サーバーを起動
- `npm start` - 本番サーバーを起動
- `npm run lint` - コードの品質チェック

## 📱 アクセス

起動後、ブラウザで以下のURLにアクセス：
```
http://localhost:3000
```

## 🆘 トラブルシューティング

### npm installが失敗する場合
```bash
# npmキャッシュをクリア
npm cache clean --force

# node_modulesを削除して再インストール
rm -rf node_modules
npm install
```

### ポート3000が使用中の場合
```bash
# 別のポートで起動
PORT=3001 npm start
```

### 権限エラーの場合（Linux/Mac）
```bash
chmod +x start.sh
chmod +x dev.sh
```

## 📝 注意事項

- 初回起動時は`npm install`で依存関係のインストールが必要です
- **ビルドは不要です**（.nextフォルダにビルド済みファイルが含まれています）
- 開発モードでは自動的にビルドされます
- `scripts/`フォルダには整理用のJSファイルが格納されています

## 🎯 特徴

- ✅ **ビルド不要**: .nextフォルダにビルド済みファイルが含まれています
- ✅ **高速起動**: npm install + npm start のみで起動
- ✅ **npm install確認**: 相手側でnpm installができるか確認可能
- ✅ **整理済み**: 整理用JSファイルはscripts/フォルダに格納
- ✅ **開発・本番対応**: 両方のモードに対応
EOF

# ZIPファイルを作成
echo "📦 ZIPファイルを作成中..."
zip -r "$ZIP_FILE" "$SHARE_FOLDER/"

# ファイルサイズを表示
SHARE_SIZE=$(du -sh "$SHARE_FOLDER" | cut -f1)
ZIP_SIZE=$(du -sh "$ZIP_FILE" | cut -f1)

echo "✅ .nextフォルダ共有用パッケージが完成しました！"
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
echo "📋 特徴:"
echo "✅ npm installで依存関係をインストール"
echo "✅ ビルド不要（.nextフォルダにビルド済みファイルが含まれています）"
echo "✅ npm startで本番サーバー起動"
echo "✅ 整理用JSファイルはscripts/フォルダに格納"
echo "✅ 開発モードと本番モードの両方に対応"
echo "✅ 高速起動（ビルド時間が不要）"
