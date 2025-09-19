# PMEシステム通常配布パッケージ

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

# 2. アプリケーションをビルド
npm run build

# 3. 本番サーバーを起動
npm start

# または開発モードで起動
npm run dev
```

## 📁 フォルダ構成

```
pme-system-normal/
├── src/                    # ソースコード
├── data/                   # データベースファイル
├── public/                 # 静的ファイル
├── scripts/                # 整理用JSファイル
├── package.json            # 依存関係情報
├── next.config.js          # Next.js設定
├── tsconfig.json           # TypeScript設定
├── tailwind.config.js      # Tailwind CSS設定
├── postcss.config.js       # PostCSS設定
├── components.json         # shadcn/ui設定
├── eslint.config.mjs       # ESLint設定
├── start.sh / start.bat    # 本番起動スクリプト
├── dev.sh / dev.bat        # 開発起動スクリプト
└── README.md               # このファイル
```

## 🔧 利用可能なコマンド

- `npm install` - 依存関係をインストール
- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用ビルド
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
- 本番モードでは`npm run build`でビルドが必要です
- 開発モードでは自動的にビルドされます
- `scripts/`フォルダには整理用のJSファイルが格納されています
