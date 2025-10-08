# プロジェクトドキュメント

PME DATAHUB プロジェクトの技術ドキュメント管理システムです。

## 📚 ドキュメントカテゴリ

### 🏗️ [アーキテクチャ](./architecture)
システムアーキテクチャ、設計パターン、技術的な意思決定に関するドキュメント

- レイヤー構造設計
- データ管理アーキテクチャ
- Event Reducer統合方針

### 📋 [仕様書](./specifications)
機能仕様書、システム設計書、データベース設計

- ドキュメント管理システム仕様書
- イベント出席者システム設計

### 📅 [実装計画](./plans)
POC実装計画、開発ロードマップ、段階的実装アプローチ

- ログインシステムPOC実装計画
- ログインシステムtRPC POC実装計画

### 📖 [ガイド](./guides)
セットアップガイド、ツール使用方法、チュートリアル

- Prisma Studio使い方ガイド
- Serenaセットアップガイド
- [Wiki.js統合ガイド](./guides/wiki)

### 📚 [リファレンス](./references)
命名規則、コーディング規約、メモ

- フォルダ構造ガイド
- 開発メモ

## 🔄 Wiki.jsとの同期

このドキュメントシステムは、Wiki.jsと自動同期されます。

### 同期コマンド

```bash
# 基本同期（新規ファイルのみ）
npm run wiki:sync

# 完全同期（更新・削除含む）
npm run wiki:sync:full

# 完全同期 + ナビゲーション更新 + README自動生成
npm run wiki:sync:nav

# ナビゲーションのみ更新（リンクだけ更新）
npm run wiki:nav

# ページ一覧表示
npm run wiki:list
```

### Web UI で同期

```
http://localhost:3000/knowledge/wiki-sync
```

### Wiki.jsで閲覧

```
http://localhost:8090/project-docs
```

## 📁 フォルダ構造

```
docs/
├── architecture/              # アーキテクチャ
│   ├── README.md
│   ├── layers.md
│   ├── data-management.md
│   └── event-reducer-integration.md
├── specifications/            # 仕様書
│   ├── README.md
│   ├── document-management.md
│   └── event-attendance.md
├── plans/                     # 実装計画
│   ├── README.md
│   ├── login-poc.md
│   └── login-trpc-poc.md
├── guides/                    # ガイド
│   ├── README.md
│   ├── prisma-studio.md
│   ├── serena-setup.md
│   └── wiki/                  # Wiki.js統合ガイド
│       ├── README.md
│       ├── setup.md
│       ├── api-key-setup.md
│       ├── integration.md
│       └── mcp-guide.md
├── references/                # リファレンス
│   ├── README.md
│   ├── folder-structure.md
│   └── memo.md
└── README.md                  # このファイル
```

## 🎯 ドキュメント作成のガイドライン

### ファイル命名規則

- ✅ 小文字英数字とハイフン: `api-design.md`
- ✅ 説明的な名前: `database-schema.md`
- ❌ 日本語: `データベース設計.md`
- ❌ スペース: `API Design.md`

### フォルダ命名規則

- ✅ 英語フォルダ名: `architecture/`, `guides/`
- ✅ 複数形を使用: `specifications/`, `guides/`
- ❌ 日本語: `アーキテクチャ/`

### タイトル（表示名）

- ✅ 日本語OK: `# クリーンアーキテクチャの層構造`
- ✅ 内容も日本語OK

### README.mdの役割

各フォルダに`README.md`を配置することで：
- フォルダ自体が日本語タイトルのページになる
- サブページの概要を提供する
- ナビゲーションを改善する

## 🔍 ドキュメントの検索

### Wiki.jsでの検索

```
http://localhost:8090
```

検索ボックスから全文検索が可能です。

### ローカルでの検索

```bash
# キーワードで検索
grep -r "tRPC" docs/

# ファイル名で検索
find docs/ -name "*login*"
```

## 📈 今後の追加予定

- テストドキュメント（`tests/`）
- API仕様（`api/`）
- データベース設計（`database/`）
- 運用ドキュメント（`operations/`）
- トラブルシューティング（`troubleshooting/`）

---

**作成日**: 2025年10月8日  
**最終更新**: 2025年10月8日  
**バージョン**: 1.0

