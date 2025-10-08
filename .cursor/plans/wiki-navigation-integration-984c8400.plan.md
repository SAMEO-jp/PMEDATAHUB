<!-- 984c8400-057c-42e2-9a04-d47c7b8c5791 0a41abec-bd0e-4d40-8195-14c99ccb8e6b -->
# Wiki.js機能分離プラン

## 概要

Wiki.js関連の機能を独立した専用プロジェクトに分離し、PMEDATAHUBプロジェクトをスリム化します。

## Wiki.js関連ファイルの特定

### 削除対象ファイル（現在のプロジェクトから）

**コードファイル:**

- `src/lib/wiki/wikiClient.ts` (725行)
- `src/lib/trpc/routers/wiki.ts` (310行)
- `src/hooks/useWikiData.ts`
- `src/types/wiki.ts`
- `src/app/knowledge/wiki-sync/page.tsx` (399行)

**スクリプト:**

- `scripts/sync_docs_to_wiki.js` (782行)
- `scripts/setup_wiki_mcp.sh`

**ドキュメント:**

- `docs/guides/wiki/` (フォルダ全体)
- `WIKI_SETUP.md` (159行)
- `WIKI_SYNC_QUICK_GUIDE.md` (244行)
- `docs/README_WIKI_SYNC.md` (351行)

**設定ファイル:**

- `docs/navigation.yaml`
- `docs/navigation-icons.md`

**package.json:**

- `wiki:*` スクリプト (5個)

**依存パッケージ:**

- `js-yaml` (Wiki.js専用)
- `@types/js-yaml` (Wiki.js専用)

### 保持するファイル

- `docs/` フォルダ（ドキュメント本体）
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `architecture/`, `specifications/`, `guides/`, `plans/`, `references/`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - ただし `docs/guides/wiki/` は削除
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - `navigation.yaml`, `navigation-icons.md` は削除

## 新プロジェクト構成

### プロジェクト名: `wikijs-sync-tool`

**完全に独立したCLI専用ツール（tRPC/Web UIなし）**

```
wikijs-sync-tool/
├── package.json                   # 最小限の依存（axios, js-yaml）
├── README.md                      # 使い方ガイド
├── .env.example                   # 環境変数サンプル
├── src/
│   ├── wikiClient.js              # WikiClient（JS版、依存なし）
│   └── types.js                   # 型定義（JSDocコメント）
├── scripts/
│   └── sync.js                    # メイン同期スクリプト
├── config/
│   ├── navigation.yaml            # ナビゲーション設定サンプル
│   └── navigation-icons.md        # アイコン一覧
├── docs/
│   ├── README.md                  # クイックスタート
│   ├── setup.md                   # 詳細セットアップ
│   └── api-reference.md           # API リファレンス
└── mcp-server/
    └── graphql.js                 # MCPサーバー
```

**特徴:**

- Node.js単体で動作（TypeScript/Next.js不要）
- 最小限の依存パッケージ
- どこでも使える汎用ツール

## 実装手順

### 1. 新プロジェクトのセットアップ

**新しいフォルダを作成:**

```bash
mkdir -p /home/same/Desktop/wikijs-sync-tool
```

**package.json:**

```json
{
  "name": "wikijs-sync-tool",
  "version": "1.0.0",
  "description": "Wiki.js同期ツール - MarkdownファイルをWiki.jsと自動同期",
  "main": "src/index.ts",
  "scripts": {
    "sync": "node scripts/sync.js sync",
    "sync:full": "node scripts/sync.js sync --full",
    "sync:nav": "node scripts/sync.js sync --full --nav",
    "nav": "node scripts/sync.js nav",
    "list": "node scripts/sync.js list"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "js-yaml": "^4.1.0"
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^20.0.0",
    "typescript": "^5.7.2"
  }
}
```

**README.md:**

```markdown
# Wiki.js Sync Tool

MarkdownドキュメントをWiki.jsと自動同期するCLIツール

## 機能

- ✅ Markdownファイルの自動同期
- ✅ 階層構造の完全サポート
- ✅ ナビゲーション自動生成
- ✅ README自動生成（賢いマージ + バックアップ）
- ✅ 日本語完全対応

## セットアップ

### 1. インストール
\`\`\`bash
npm install
\`\`\`

### 2. 環境変数設定
\`\`\`bash
cp .env.example .env
# WIKIJS_API_KEY と WIKIJS_URL を設定
\`\`\`

### 3. ドキュメント同期
\`\`\`bash
npm run sync:nav
\`\`\`

## 使い方

### 基本同期
\`\`\`bash
npm run sync
\`\`\`

### 完全同期 + ナビゲーション
\`\`\`bash
npm run sync:nav
\`\`\`

### ナビゲーションのみ更新
\`\`\`bash
npm run nav
\`\`\`

## 設定

### navigation.yaml

ナビゲーション構造を定義します。

\`\`\`yaml
navigation:
 - type: header
    label: "📚 ドキュメント"
 - type: link
    label: "アーキテクチャ"
    folder: "architecture"
    icon: "mdi-puzzle"
\`\`\`

## プログラムから使用

\`\`\`typescript
import { WikiClient } from './src/lib/wikiClient';

const client = new WikiClient();

// ページを作成
await client.createPage({
  title: 'New Page',
  content: '# Content',
  path: 'docs/new-page'
});

// ナビゲーション更新
await client.syncDirectory(
  '/path/to/docs',
  '',
  true,  // fullSync
  true   // updateNavigation
);
\`\`\`
```

### 2. ファイルの移行

**移行するファイル:**

- `src/lib/wiki/wikiClient.ts` → `src/lib/wikiClient.ts`
- `src/types/wiki.ts` → `src/types/wiki.ts`
- `scripts/sync_docs_to_wiki.js` → `scripts/sync.js`
- `scripts/setup_wiki_mcp.sh` → `scripts/setup.sh`
- `docs/navigation.yaml` → `docs/navigation.yaml` (サンプルとして)
- `docs/navigation-icons.md` → `docs/navigation-icons.md`
- Wiki.jsガイド → `docs/` (新プロジェクト)
- MCPサーバー → `mcp-server/graphql.js`

### 3. 元のプロジェクトからの削除

**削除するファイル:**

- `src/lib/wiki/` (フォルダごと)
- `src/lib/trpc/routers/wiki.ts`
- `src/hooks/useWikiData.ts`
- `src/types/wiki.ts`
- `src/app/knowledge/wiki-sync/` (フォルダごと)
- `scripts/sync_docs_to_wiki.js`
- `scripts/setup_wiki_mcp.sh`
- `WIKI_SETUP.md`
- `WIKI_SYNC_QUICK_GUIDE.md`
- `docs/README_WIKI_SYNC.md`
- `docs/guides/wiki/` (フォルダごと)
- `docs/navigation.yaml`
- `docs/navigation-icons.md`

**package.jsonから削除:**

- `wiki:*` スクリプト
- `js-yaml` 依存（他で使用していない場合）
- `@types/js-yaml`

**_app.ts から削除:**

- `wikiRouter` のインポートと登録

### 4. オプション: 連携機能

必要に応じて、元のプロジェクトから新しいツールを呼び出せるようにします。

**方法A: npm scriptから直接実行**

```json
{
  "scripts": {
    "wiki:sync": "cd ../wikijs-sync-tool && npm run sync:nav"
  }
}
```

**方法B: 独立したツールとして実行**

```bash
# 別プロジェクトのコマンドを直接実行
cd /home/same/Desktop/wikijs-sync-tool
npm run sync:nav
```

## 質問

1. **新プロジェクトの配置場所:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - a) `/home/same/Desktop/wikijs-sync-tool` (推奨)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - b) `/home/same/Desktop/PMEDATAHUB/tools/wikijs-sync-tool`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - c) 別の場所

2. **tRPC/Web UI機能:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - a) 完全に削除（CLI専用ツールに）
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - b) オプション機能として残す（別途Express/Fastifyサーバーで提供）

3. **元のプロジェクトからの連携:**

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - a) 完全に分離（手動で別ツールとして実行）
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - b) npm scriptで簡単に呼び出せるようにする
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                - c) 不要

デフォルトでは **1-a, 2-a, 3-b** で進めます。変更があれば教えてください。

### To-dos

- [ ] 新プロジェクトのフォルダとpackage.jsonを作成
- [ ] WikiClient、型定義、スクリプトを新プロジェクトに移行
- [ ] MCPサーバーを新プロジェクトにコピー
- [ ] Wiki.js関連ドキュメントを新プロジェクトに移行
- [ ] 新プロジェクトのREADMEと使用ガイドを作成
- [ ] 元のプロジェクトからWiki.js関連ファイルを削除
- [ ] 元のpackage.jsonからwiki関連スクリプトと依存を削除
- [ ] _app.tsからwikiRouterを削除
- [ ] 新プロジェクトで動作確認