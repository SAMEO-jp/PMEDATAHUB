# 推奨コマンド

## 開発サーバー
```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start
```

## コード品質管理
```bash
# ESLint実行
npm run lint

# TypeScript型チェック
npx tsc --noEmit

# 未使用インポート削除
npx eslint --fix .
```

## データベース操作
```bash
# SQLiteデータベース確認
sqlite3 data/achievements.db

# データベーススキーマ確認
sqlite3 data/achievements.db ".schema"

# テーブル一覧確認
sqlite3 data/achievements.db ".tables"
```

## ファイル操作（Windows）
```bash
# ディレクトリ一覧
dir
ls

# ファイル検索
findstr /s "検索文字列" *.ts *.tsx

# ファイル移動
move ファイル名 移動先

# ファイルコピー
copy ファイル名 コピー先
```

## Git操作
```bash
# ステータス確認
git status

# 変更をステージング
git add .

# コミット
git commit -m "コミットメッセージ"

# プッシュ
git push
```

## パッケージ管理
```bash
# 依存関係インストール
npm install

# パッケージ追加
npm install パッケージ名

# 開発依存関係追加
npm install --save-dev パッケージ名

# パッケージ削除
npm uninstall パッケージ名
```

## デバッグ・テスト
```bash
# 開発サーバー（デバッグモード）
npm run dev

# ビルドエラー確認
npm run build

# 型チェック
npx tsc --noEmit --skipLibCheck
```

## プロジェクト固有コマンド
```bash
# パッケージビルド
npm run pkg

# Reactアプリビルド
npm run build-react

# サーバー起動
npm run starts
```