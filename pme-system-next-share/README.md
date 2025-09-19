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
