# Wiki.js 連携機能

プロジェクトドキュメントをWiki.jsと自動同期する機能です。

## 📋 概要

この機能により、`docs/`フォルダ内のMarkdownファイルを自動的にWiki.jsに同期できます。MCPサーバーを介してWiki.jsと通信し、ページの作成、更新、削除、検索などの操作が可能です。

## 🚀 セットアップ

### 1. 環境変数の設定

`.env`ファイルに以下を追加してください：

```bash
WIKIJS_API_KEY=your-wiki-js-api-key
```

### 2. Wiki.js APIキーの取得

1. Wiki.jsにログイン
2. 管理画面 → API設定
3. 新しいAPIキーを作成
4. 生成されたキーをコピーして環境変数に設定

## 💻 使用方法

### Web UI から使用

1. ブラウザで `http://localhost:3000/knowledge/wiki-sync` にアクセス
2. 「ドキュメント同期」ボタンをクリック
3. 同期結果が表示されます

#### 機能

- **ドキュメント同期**: `docs/`配下の全Markdownファイルを一括同期
- **ストレージ同期**: Wiki.jsのストレージを同期
- **バックアップ作成**: 現在の状態をバックアップ
- **ページ一覧表示**: 現在Wiki.jsに登録されているページを表示

### CLI から使用

#### ドキュメントを同期

```bash
export WIKIJS_API_KEY=your-api-key
node scripts/sync_docs_to_wiki.js sync
```

#### ページ一覧を表示

```bash
node scripts/sync_docs_to_wiki.js list
```

### プログラムから使用

#### tRPC経由

```typescript
import { trpc } from '@src/lib/trpc/client';

// ドキュメントを同期
const result = await trpc.wiki.syncProjectDocs.mutate();

// ページ一覧を取得
const pages = await trpc.wiki.getPages.query();

// ページを検索
const searchResults = await trpc.wiki.searchPages.query({ 
  query: 'architecture' 
});
```

#### カスタムフック使用

```typescript
import { useWikiPages, useWikiMutations } from '@src/hooks/useWikiData';

function MyComponent() {
  const { data, isLoading } = useWikiPages();
  const { syncProjectDocsMutation } = useWikiMutations();

  const handleSync = async () => {
    await syncProjectDocsMutation.mutateAsync();
  };

  return (
    <div>
      <button onClick={handleSync}>同期</button>
      {data?.data?.pages.map(page => (
        <div key={page.id}>{page.title}</div>
      ))}
    </div>
  );
}
```

#### Wiki Client 直接使用

```typescript
import { wikiClient } from '@src/lib/wiki/wikiClient';

// ページを作成
const result = await wikiClient.createPage({
  title: 'New Page',
  content: '# Content',
  path: 'docs/new-page',
  isPublished: true
});

// ディレクトリを同期
const syncResult = await wikiClient.syncDirectory(
  '/path/to/docs',
  'wiki-base-path'
);
```

## 📁 ファイル構造

```
src/
├── lib/
│   └── wiki/
│       └── wikiClient.ts          # Wiki.js MCPクライアント
├── lib/trpc/routers/
│   └── wiki.ts                    # tRPCルーター
├── hooks/
│   └── useWikiData.ts             # React Queryフック
├── app/knowledge/wiki-sync/
│   └── page.tsx                   # 管理UI
└── types/
    └── wiki.ts                    # 型定義

scripts/
└── sync_docs_to_wiki.js           # CLIスクリプト

docs/
└── wiki-js-integration.md         # このドキュメント
```

## 🔧 API エンドポイント

### tRPC エンドポイント

すべて `trpc.wiki.*` で利用可能：

- `getPages()` - 全ページを取得
- `getPage(id)` - 特定のページを取得
- `createPage(data)` - ページを作成
- `updatePage(id, data)` - ページを更新
- `deletePage(id)` - ページを削除
- `searchPages(query)` - ページを検索
- `syncProjectDocs()` - プロジェクトドキュメントを同期
- `syncMarkdownFile(filePath, wikiPath?)` - 特定のファイルを同期
- `syncStorage()` - ストレージを同期
- `createBackup()` - バックアップを作成

## 📝 Markdownファイルの扱い

### タイトル抽出

Markdownファイルの最初の行が `# Title` 形式の場合、それがページタイトルとして使用されます。

```markdown
# アーキテクチャドキュメント

このドキュメントでは...
```

→ タイトル: "アーキテクチャドキュメント"

### パス生成

デフォルトでは、ファイル名からパスが生成されます：

- `architecture-layers.md` → `project-docs/architecture-layers`
- `login-system-poc-plan.md` → `project-docs/login-system-poc-plan`

### タグ

自動的に以下のタグが付与されます：

- `project-docs` - プロジェクトドキュメントであることを示す
- `auto-sync` - 自動同期されたことを示す

## 🔍 トラブルシューティング

### エラー: WIKIJS_API_KEY環境変数が設定されていません

環境変数を設定してください：

```bash
export WIKIJS_API_KEY=your-api-key
```

または `.env` ファイルに追加：

```
WIKIJS_API_KEY=your-api-key
```

### エラー: Wiki MCP execution error

1. MCPサーバーのパスが正しいか確認：
   - デフォルト: `/home/same/Desktop/docur_make/wiki.js/mcp-server.js`
   - 必要に応じて `wikiClient.ts` で変更

2. Wiki.jsが起動しているか確認：
   ```bash
   curl http://localhost:8090/api/pages
   ```

3. APIキーが有効か確認

### エラー: Failed to read markdown file

1. ファイルパスが正しいか確認
2. ファイルの読み取り権限があるか確認
3. ファイルがUTF-8エンコーディングであることを確認

## 🎯 ベストプラクティス

### 1. 定期的な同期

CI/CDパイプラインに組み込むことで、自動的にドキュメントを同期できます：

```yaml
# .github/workflows/sync-wiki.yml
name: Sync Wiki
on:
  push:
    paths:
      - 'docs/**'
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: node scripts/sync_docs_to_wiki.js
        env:
          WIKIJS_API_KEY: ${{ secrets.WIKIJS_API_KEY }}
```

### 2. バックアップ

重要な変更前にはバックアップを作成：

```typescript
await trpc.wiki.createBackup.mutate();
// 変更作業...
await trpc.wiki.syncProjectDocs.mutate();
```

### 3. エラーハンドリング

同期結果を確認してエラーに対応：

```typescript
const result = await trpc.wiki.syncProjectDocs.mutate();

if (result.data?.failed && result.data.failed.length > 0) {
  console.error('Failed files:', result.data.failed);
  // エラー通知やリトライ処理
}
```

## 📚 関連リンク

- [Wiki.js 公式ドキュメント](https://docs.requarks.io/)
- [MCP (Model Context Protocol) 仕様](https://modelcontextprotocol.io/)
- [tRPC ドキュメント](https://trpc.io/)

## 🆕 今後の拡張予定

- [ ] 差分同期（変更されたファイルのみ同期）
- [ ] 双方向同期（Wiki.jsの変更をローカルに反映）
- [ ] バージョン管理との統合
- [ ] 画像ファイルの自動アップロード
- [ ] 複数Wiki.jsインスタンスへの同期
- [ ] Webhook連携

