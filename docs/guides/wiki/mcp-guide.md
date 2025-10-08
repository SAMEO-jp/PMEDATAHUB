# Wiki.js MCP 統合 - 完全ガイド

## 🎯 概要

このシステムは、**Wiki.js GraphQL API**と**MCP (Model Context Protocol)**を使用して、プロジェクトのドキュメントを自動的にWiki.jsと同期します。

## 📋 前提条件

- ✅ Wiki.jsがインストールされ、起動している
- ✅ Node.jsがインストールされている
- ✅ プロジェクトの依存パッケージがインストールされている（`npm install`実行済み）

## 🚀 クイックスタート

### ステップ1: Wiki.js APIキーを取得

1. **Wiki.jsにアクセス**
   ```
   http://localhost:3000
   ```
   または
   ```
   http://localhost:8090
   ```

2. **管理画面でAPIキーを生成**
   - ログイン → Administration → API Access
   - または直接アクセス: `http://localhost:3000/a/api`

3. **「New API Key」をクリック**
   - Name: `PME DataHub Integration`
   - Expiration: `Never`
   - Group: `Administrators`
   - 必要な権限をすべて選択

4. **APIキーをコピー**
   ```
   eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjE...
   ```
   ⚠️ **一度しか表示されないので必ずコピー！**

### ステップ2: 環境変数を設定

プロジェクトルートに`.env`ファイルを作成：

```bash
cd /home/same/Desktop/PMEDATAHUB
nano .env
```

以下を追加（APIキーを実際のものに置き換える）：

```env
# Wiki.js API設定
WIKIJS_API_KEY=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjE...（あなたのAPIキー）
WIKIJS_URL=http://localhost:3000
```

### ステップ3: 動作確認

```bash
# ページ一覧を取得（動作テスト）
npm run wiki:list
```

**期待される出力**:
```
🚀 Wiki.js ドキュメント同期ツール

📋 Wiki.jsページ一覧を取得中...

📄 X個のページが見つかりました:

1. Home
   パス: home
   状態: 公開
   更新日: 2025/10/08 ...
```

### ステップ4: ドキュメントを同期

```bash
# docs/フォルダ内の全Markdownファイルを同期
npm run wiki:sync
```

### ステップ5: Web UIを使用

```bash
# 開発サーバーを起動
npm run dev

# ブラウザでアクセス
# http://localhost:3000/knowledge/wiki-sync
```

## 🔧 トラブルシューティング

### ❌ エラー: "Request failed with status code 404"

**原因**: Wiki.jsのGraphQL APIエンドポイントにアクセスできない

**解決方法**:

1. **Wiki.jsが起動しているか確認**
   ```bash
   curl http://localhost:3000
   ```

2. **GraphQL APIエンドポイントをテスト**
   ```bash
   curl -X POST http://localhost:3000/graphql \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -d '{"query":"{ pages { list { id title } } }"}'
   ```

3. **Wiki.jsのURLを確認**
   - `.env`ファイルで正しいURLが設定されているか確認
   - デフォルトは`http://localhost:3000`ですが、環境によっては`http://localhost:8090`の場合も

4. **MCPサーバーのパスを確認**
   ```bash
   ls -la /home/same/Desktop/docur_make/wiki.js/mcp-server-graphql.js
   ```

### ❌ エラー: "WIKIJS_API_KEY environment variable is not set"

**解決方法**:

```bash
# .envファイルを作成
echo "WIKIJS_API_KEY=your-key-here" > .env

# 開発サーバーを再起動
npm run dev
```

### ❌ エラー: "Cannot find module 'axios'"

**解決方法**:

```bash
# MCPサーバーのディレクトリに移動
cd /home/same/Desktop/docur_make/wiki.js/

# 依存パッケージをインストール
npm install axios
```

## 📁 ファイル構成

```
プロジェクト/
├── src/
│   ├── lib/
│   │   └── wiki/
│   │       └── wikiClient.ts           # Wiki.js MCPクライアント
│   ├── lib/trpc/routers/
│   │   └── wiki.ts                     # tRPC APIエンドポイント
│   ├── hooks/
│   │   └── useWikiData.ts              # React Queryフック
│   ├── app/knowledge/wiki-sync/
│   │   └── page.tsx                    # 管理UI
│   └── types/
│       └── wiki.ts                     # 型定義
├── scripts/
│   ├── sync_docs_to_wiki.js            # CLI同期スクリプト
│   └── setup_wiki_mcp.sh               # セットアップスクリプト
├── docs/
│   ├── WIKI_MCP_README.md              # このファイル
│   ├── wiki-api-key-setup.md           # 詳細セットアップガイド
│   └── wiki-js-integration.md          # 技術ドキュメント
└── .env                                # 環境変数（要作成）

外部/
└── /home/same/Desktop/docur_make/wiki.js/
    ├── mcp-server-graphql.js           # GraphQL版MCPサーバー ⭐
    ├── mcp-server.js                   # 旧REST版（非推奨）
    └── package.json                    # 依存パッケージ
```

## 💻 使用方法

### CLIコマンド

```bash
# ページ一覧を表示
npm run wiki:list

# ドキュメントを同期
npm run wiki:sync
```

### Web UI

1. `npm run dev` で開発サーバーを起動
2. `http://localhost:3000/knowledge/wiki-sync` にアクセス
3. 以下の操作が可能：
   - ドキュメント一括同期
   - ページ一覧表示
   - ストレージ同期
   - バックアップ作成

### プログラムから使用

```typescript
import { wikiClient } from '@src/lib/wiki/wikiClient';
import { trpc } from '@src/lib/trpc/client';

// wikiClient を使用
const result = await wikiClient.getPages();

// tRPC を使用
const pages = await trpc.wiki.getPages.query();

// カスタムフックを使用（React コンポーネント内）
const { data, isLoading } = useWikiPages();
```

## 🔐 セキュリティ

### APIキーの保護

❌ **やってはいけないこと**:
- APIキーをGitにコミット
- APIキーをコードに直接書く
- APIキーを公開リポジトリに含める

✅ **推奨される方法**:
- `.env`ファイルを使用
- `.gitignore`に`.env`が含まれていることを確認
- APIキーに最小限の権限のみ付与

## 📚 詳細ドキュメント

- **[APIキーセットアップガイド](./wiki-api-key-setup.md)** - APIキーの取得方法詳細
- **[Wiki.js連携機能](./wiki-js-integration.md)** - 技術仕様とAPI詳細
- **[Wiki.jsセットアップガイド](./wiki-setup-guide.md)** - 一般的なセットアップ手順

## 🆘 サポート

問題が解決しない場合は、以下の情報を確認してください：

1. **Wiki.jsのバージョン**: `docker exec wiki wiki --version`
2. **エラーメッセージの全文**: コンソールやログから
3. **環境変数の設定**: `cat .env | grep WIKIJS`（APIキーは伏せる）
4. **MCPサーバーの動作確認**:
   ```bash
   WIKIJS_API_KEY="your-key" node /home/same/Desktop/docur_make/wiki.js/mcp-server-graphql.js pages
   ```

## ✅ セットアップ完了チェックリスト

- [ ] Wiki.jsが起動している
- [ ] APIキーを取得した
- [ ] `.env`ファイルにAPIキーを設定した
- [ ] `npm run wiki:list` が動作する
- [ ] `npm run wiki:sync` でドキュメントが同期される
- [ ] Web UI（`/knowledge/wiki-sync`）でページ一覧が表示される

---

**すべて完了したら、ドキュメント同期を楽しんでください！** 🎉

