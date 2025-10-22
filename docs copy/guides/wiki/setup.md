# Wiki.js 連携機能のセットアップガイド

## 🚀 クイックスタート

### 1. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下を追加してください：

```bash
WIKIJS_API_KEY=your-wiki-js-api-key-here
```

### 2. Wiki.js APIキーの取得手順

1. **Wiki.jsにアクセス**
   ```
   http://localhost:8090
   ```

2. **管理者としてログイン**
   - デフォルトの管理者アカウント（初回セットアップ時に作成したもの）でログイン

3. **API設定ページへ移動**
   - 右上のユーザーアイコンをクリック
   - 「Administration」（管理）を選択
   - 左サイドバーの「API Access」を選択

4. **新しいAPIキーを作成**
   - 「New API Key」ボタンをクリック
   - 名前: `PME DataHub Integration`（任意）
   - 有効期限: 無期限 or 必要に応じて設定
   - 権限: 
     - ✅ `pages:read` - ページ読み取り
     - ✅ `pages:write` - ページ書き込み
     - ✅ `pages:manage` - ページ管理
     - ✅ `storage:read` - ストレージ読み取り
     - ✅ `storage:write` - ストレージ書き込み
   - 「Generate」をクリック

5. **APIキーをコピー**
   - 生成されたAPIキーをコピー
   - ⚠️ **重要**: このキーは一度しか表示されません！必ずコピーしてください

6. **環境変数に設定**
   ```bash
   # .env ファイルに追加
   WIKIJS_API_KEY=ey... （コピーしたキー）
   ```

### 3. 動作確認

#### 方法1: CLIで確認

```bash
# ページ一覧を取得（Wiki.jsが起動していることを確認）
npm run wiki:list
```

成功すると、Wiki.jsに登録されているページ一覧が表示されます。

#### 方法2: Web UIで確認

```bash
# 開発サーバーを起動
npm run dev
```

ブラウザで以下にアクセス：
```
http://localhost:3000/knowledge/wiki-sync
```

### 4. ドキュメントを同期

#### CLIから実行

```bash
npm run wiki:sync
```

#### Web UIから実行

1. `http://localhost:3000/knowledge/wiki-sync` にアクセス
2. 「ドキュメント同期」ボタンをクリック
3. 同期結果が表示されます

## 📁 同期されるファイル

以下のMarkdownファイルが自動的に同期されます：

```
docs/
├── architecture-layers.md
├── document_management_system_specification.md
├── Event Reducer統合方針.md
├── event_attendance_system_design.md
├── login-system-poc-plan.md
├── login-system-trpc-poc-plan.md
├── memo.md
├── prisma-studio-usage.md
├── serena-setup.md
└── データ管理アーキテクチャ検討.md
```

## 🔧 トラブルシューティング

### エラー: "WIKIJS_API_KEY environment variable is not set"

**原因**: 環境変数が設定されていません

**解決方法**:
1. プロジェクトルートに `.env` ファイルを作成
2. `WIKIJS_API_KEY=your-api-key` を追加
3. 開発サーバーを再起動

### エラー: "Wiki MCP execution error"

**原因**: Wiki.jsが起動していない、またはMCPサーバーのパスが間違っている

**解決方法**:
1. Wiki.jsが起動しているか確認:
   ```bash
   curl http://localhost:8090
   ```
2. MCPサーバーのパスを確認:
   - デフォルト: `/home/same/Desktop/docur_make/wiki.js/mcp-server.js`
   - 必要に応じて `src/lib/wiki/wikiClient.ts` で変更

### エラー: "Failed to read markdown file"

**原因**: ファイルへのアクセス権限がない、またはファイルが存在しない

**解決方法**:
1. ファイルが存在するか確認:
   ```bash
   ls -la docs/
   ```
2. 読み取り権限があるか確認:
   ```bash
   chmod +r docs/*.md
   ```

### エラー: "connect ECONNREFUSED"

**原因**: Wiki.jsサーバーに接続できません

**解決方法**:
1. Wiki.jsが起動しているか確認
2. Wiki.jsのURLが正しいか確認（デフォルト: `http://localhost:8090`）
3. ファイアウォールでポートがブロックされていないか確認

## 🎯 使用例

### CLIで使用

```bash
# ドキュメントを同期
npm run wiki:sync

# ページ一覧を表示
npm run wiki:list

# 環境変数を指定して実行
WIKIJS_API_KEY=your-key npm run wiki:sync
```

### プログラムから使用

```typescript
import { wikiClient } from '@src/lib/wiki/wikiClient';

// ページを作成
const result = await wikiClient.createPage({
  title: 'New Documentation',
  content: '# Content here',
  path: 'project-docs/new-doc',
  isPublished: true
});

// ディレクトリを同期
const syncResult = await wikiClient.syncDirectory(
  '/path/to/docs',
  'wiki-base-path'
);

console.log(`同期完了: ${syncResult.synced.length}個のファイル`);
```

## 📚 関連ドキュメント

- [Wiki.js 連携機能の詳細](./wiki-js-integration.md)
- [Wiki.js 公式ドキュメント](https://docs.requarks.io/)

## 💡 ヒント

### 定期的な同期

Crontabで定期的に同期を実行できます：

```bash
# crontabを編集
crontab -e

# 毎日午前2時に同期
0 2 * * * cd /path/to/project && /usr/bin/node /path/to/project/scripts/sync_docs_to_wiki.js sync
```

### Git Hookで自動同期

`.git/hooks/post-commit` を作成：

```bash
#!/bin/bash
# docs/配下が変更された場合のみ同期
if git diff-tree --no-commit-id --name-only -r HEAD | grep -q "^docs/"; then
  echo "Syncing documentation to Wiki.js..."
  npm run wiki:sync
fi
```

権限を付与：
```bash
chmod +x .git/hooks/post-commit
```

## 🔐 セキュリティ注意事項

1. **APIキーの取り扱い**
   - APIキーは `.env` ファイルに保存
   - `.env` ファイルは `.gitignore` に含まれていることを確認
   - ❌ コミットしない
   - ❌ 他人と共有しない

2. **本番環境での使用**
   - 環境変数はサーバーの環境変数として設定
   - APIキーは定期的に更新
   - 最小限の権限のみを付与

3. **アクセス制御**
   - Wiki.jsでページごとにアクセス権限を設定
   - 公開すべきでないドキュメントは `isPublished: false` に設定

