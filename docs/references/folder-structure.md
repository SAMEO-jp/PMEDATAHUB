# 📁 ドキュメント階層構造ガイド

## 🎯 概要

`docs/` フォルダ内のディレクトリ構造が、そのままWiki.jsの階層構造に反映されます。

## 📂 フォルダ構造の例

### ローカルのフォルダ構造

```
docs/
├── architecture/          # アーキテクチャ関連
│   ├── layers.md
│   └── patterns.md
├── specifications/        # 仕様書
│   ├── database.md
│   └── api.md
├── guides/                # ガイド・手順書
│   ├── setup.md
│   └── deployment.md
└── plans/                 # 計画書
    ├── roadmap.md
    └── milestones.md
```

### Wiki.jsでの表示

```
project-docs/
├── architecture/
│   ├── layers
│   └── patterns
├── specifications/
│   ├── database
│   └── api
├── guides/
│   ├── setup
│   └── deployment
└── plans/
    ├── roadmap
    └── milestones
```

## 🔧 フォルダの作成方法

### 1. コマンドラインで作成

```bash
cd /home/same/Desktop/PMEDATAHUB/docs

# フォルダを作成
mkdir -p architecture specifications guides plans api

# ファイルを移動
mv architecture-layers.md architecture/layers.md
mv document_management_system_specification.md specifications/document-management-system.md
```

### 2. 推奨フォルダ構造

```
docs/
├── architecture/          # システムアーキテクチャ
├── specifications/        # 機能仕様書
├── api/                   # API仕様
├── database/              # データベース設計
├── guides/                # セットアップガイド
├── plans/                 # 実装計画
├── designs/               # UI/UXデザイン
├── operations/            # 運用ドキュメント
└── troubleshooting/       # トラブルシューティング
```

## 📝 命名規則

### フォルダ名
- ✅ 小文字英数字とハイフン: `user-authentication`
- ✅ 複数形を使用: `guides`, `specifications`
- ❌ 日本語: `ガイド`
- ❌ スペース: `User Authentication`
- ❌ 特殊文字: `user_auth!`

### ファイル名
- ✅ 小文字英数字とハイフン: `api-design.md`
- ✅ 説明的な名前: `database-schema.md`
- ❌ 汎用的な名前: `doc1.md`

## 🚀 同期方法

### 1. 階層構造で同期

```bash
# すべてのサブディレクトリを含めて同期
npm run wiki:sync
```

### 2. 同期結果の確認

```bash
# Wiki.jsのページ一覧を表示
npm run wiki:list
```

### 3. Wiki.jsで確認

ブラウザで以下にアクセス：
```
http://localhost:8090/project-docs/architecture/layers
http://localhost:8090/project-docs/specifications/database
http://localhost:8090/project-docs/guides/setup
```

## 💡 ベストプラクティス

### 1. 論理的なグルーピング

関連するドキュメントは同じフォルダにまとめる：

```
docs/
├── user-management/
│   ├── authentication.md
│   ├── authorization.md
│   └── user-roles.md
```

### 2. README.mdの活用

各フォルダにREADME.mdを配置して概要を説明：

```
docs/
├── architecture/
│   ├── README.md          # アーキテクチャの概要
│   ├── layers.md
│   └── patterns.md
```

### 3. 適切な階層の深さ

- ✅ 2-3階層まで: `docs/api/rest/endpoints.md`
- ❌ 深すぎる階層: `docs/a/b/c/d/e/f/file.md`

### 4. 一貫性のある構造

プロジェクト全体で統一した構造を維持：

```
docs/
├── {機能名}/
│   ├── README.md
│   ├── specification.md
│   ├── api.md
│   └── tests.md
```

## 🔄 既存ファイルの整理

### 既存ファイルを整理する場合

```bash
cd /home/same/Desktop/PMEDATAHUB/docs

# 1. フォルダを作成
mkdir -p architecture specifications guides plans

# 2. ファイルを移動
mv architecture-layers.md architecture/layers.md
mv *-specification.md specifications/
mv *-guide.md guides/
mv *-plan.md plans/

# 3. 同期
npm run wiki:sync
```

## ⚙️ 自動化のヒント

### Git Hookで自動同期

`.git/hooks/post-commit` を作成：

```bash
#!/bin/bash
if git diff-tree --no-commit-id --name-only -r HEAD | grep -q "^docs/"; then
  echo "📚 ドキュメントが更新されました。Wiki.jsに同期します..."
  npm run wiki:sync
fi
```

## 📊 現在の構造を確認

```bash
# ツリー表示（treeコマンドが必要）
tree docs/

# または
find docs/ -type f -name "*.md" | sort
```

## 🆘 トラブルシューティング

### Q: フォルダが同期されない
A: フォルダ内に`.md`ファイルが存在することを確認してください。空のフォルダは同期されません。

### Q: 日本語フォルダ名が使えない
A: Wiki.jsのパス制限により、英数字とハイフンのみ使用できます。日本語はタイトルで表示してください。

### Q: 階層が深すぎるとエラーになる
A: 3階層までを推奨します。それ以上はフラットな構造を検討してください。

