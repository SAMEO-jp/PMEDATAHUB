# Wiki.js APIキー セットアップガイド

## 📋 APIキーの形式

Wiki.jsのAPIキーは**JWT（JSON Web Token）**形式です：

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjEsImdycCI6MSwidWlkIjoxLCJpYXQiOjE2ODk1NjcyMzUsImV4cCI6MTcyMTE0OTYzNSwiYXVkIjoid2lraS5qcyIsImlzcyI6Indpa2kuanMifQ.abc123...
```

### 特徴
- `ey`で始まる
- `.`（ドット）で3つのセクションに区切られている
- 非常に長い文字列（通常300文字以上）
- Base64エンコードされたJSON

## 🔧 APIキーの取得手順

### ステップ1: Wiki.jsにアクセス

```bash
# Wiki.jsのデフォルトURL（環境により異なる場合があります）
http://localhost:3000
# または
http://localhost:8090
```

### ステップ2: 管理者としてログイン

1. Wiki.jsのトップページを開く
2. 右上の「ログイン」をクリック
3. 管理者アカウントでログイン
   - デフォルトユーザー名: `admin@example.com`
   - パスワード: セットアップ時に設定したもの

### ステップ3: API設定へ移動

#### 方法1: URLから直接アクセス
```
http://localhost:3000/a/api
```

#### 方法2: 管理画面から
1. 右上のアバターアイコンをクリック
2. **「Administration」**（管理）を選択
3. 左サイドバーの **「API Access」** を選択

### ステップ4: 新しいAPIキーを生成

1. **「New API Key」** ボタンをクリック

2. **設定項目を入力**:
   ```
   Name: PME DataHub Integration
   Expiration: Never (無期限) または必要に応じて設定
   Group: Administrators （管理者権限が必要）
   ```

3. **必要な権限を選択**:
   - ✅ `manage:system` - システム管理
   - ✅ `manage:api` - API管理
   - ✅ `read:pages` - ページ読み取り
   - ✅ `write:pages` - ページ書き込み
   - ✅ `manage:pages` - ページ管理

4. **「Generate」** ボタンをクリック

5. **APIキーをコピー**
   ⚠️ **重要**: 生成されたAPIキーは**一度しか表示されません**！
   必ず安全な場所にコピーしてください。

   表示されるキー例：
   ```
   eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjEsImdycCI6MS...
   ```

### ステップ5: 環境変数に設定

#### Linuxの場合

```bash
# プロジェクトルートに.envファイルを作成
cd /home/same/Desktop/PMEDATAHUB
echo "WIKIJS_API_KEY=eyJhbGc..." > .env
echo "WIKIJS_URL=http://localhost:3000" >> .env

# または手動で編集
nano .env
```

`.env`ファイルの内容：
```env
# Wiki.js API設定
WIKIJS_API_KEY=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjE...（あなたのAPIキー）
WIKIJS_URL=http://localhost:3000
```

#### 確認

```bash
# 環境変数が正しく設定されているか確認
cat .env | grep WIKIJS_API_KEY
```

## 🧪 動作確認

### 1. MCPサーバーを直接テスト

```bash
# GraphQL版MCPサーバーが存在することを確認
ls -la /home/same/Desktop/docur_make/wiki.js/mcp-server-graphql.js

# 実行権限を付与
chmod +x /home/same/Desktop/docur_make/wiki.js/mcp-server-graphql.js

# 環境変数を設定してテスト
export WIKIJS_API_KEY="your-api-key-here"
export WIKIJS_URL="http://localhost:3000"

# ページ一覧を取得（動作テスト）
node /home/same/Desktop/docur_make/wiki.js/mcp-server-graphql.js pages
```

成功すると、以下のようなJSON形式のレスポンスが返ります：
```json
{
  "success": true,
  "data": {
    "pages": [
      {
        "id": 1,
        "title": "Home",
        "path": "home",
        "description": "Welcome to your wiki!",
        "isPublished": true
      }
    ]
  },
  "error": null
}
```

### 2. プロジェクトから実行

```bash
# .envファイルを読み込んで実行
npm run wiki:list
```

### 3. Web UIで確認

```bash
# 開発サーバーを起動
npm run dev

# ブラウザでアクセス
# http://localhost:3000/knowledge/wiki-sync
```

## ❌ トラブルシューティング

### エラー: "Request failed with status code 404"

**原因**: Wiki.jsのURLが間違っている、またはGraphQL APIエンドポイントにアクセスできない

**解決方法**:
1. Wiki.jsが起動しているか確認:
   ```bash
   curl http://localhost:3000
   # または
   curl http://localhost:8090
   ```

2. `.env`ファイルで正しいURLを設定:
   ```env
   WIKIJS_URL=http://localhost:3000
   ```

3. GraphQL APIエンドポイントを直接テスト:
   ```bash
   curl -X POST http://localhost:3000/graphql \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -d '{"query":"{ pages { list { id title } } }"}'
   ```

### エラー: "WIKIJS_API_KEY environment variable is not set"

**原因**: 環境変数が設定されていない

**解決方法**:
```bash
# .envファイルを作成
echo "WIKIJS_API_KEY=your-key-here" > .env
echo "WIKIJS_URL=http://localhost:3000" >> .env

# 開発サーバーを再起動
npm run dev
```

### エラー: "Invalid token" または "Unauthorized"

**原因**: APIキーが無効、または権限が不足している

**解決方法**:
1. APIキーが正しくコピーされているか確認（余分なスペースや改行がないか）
2. APIキーの有効期限が切れていないか確認
3. APIキーに必要な権限があるか確認（管理者権限が推奨）
4. 必要に応じて新しいAPIキーを生成

### エラー: "Cannot find module 'axios'"

**原因**: MCPサーバーの依存パッケージがインストールされていない

**解決方法**:
```bash
# MCPサーバーのディレクトリに移動
cd /home/same/Desktop/docur_make/wiki.js/

# 依存パッケージをインストール
npm install axios
```

## 🔐 セキュリティのベストプラクティス

### 1. APIキーの保護

❌ **やってはいけないこと**:
- APIキーをGitにコミットする
- APIキーをコードに直接書く
- APIキーを他人と共有する
- APIキーを公開リポジトリに含める

✅ **推奨される方法**:
- `.env`ファイルを使用（`.gitignore`に含まれていることを確認）
- 環境変数として設定
- 秘密管理ツール（Vault、AWS Secrets Manager等）を使用

### 2. アクセス権限の最小化

- APIキーには必要最小限の権限のみを付与
- 読み取り専用の操作には読み取り専用キーを使用
- 定期的にキーをローテーション

### 3. 監査とログ

- API使用状況をWiki.jsの管理画面で定期的に確認
- 不審なアクセスがないかチェック
- 使用していないAPIキーは削除

## 📚 参考情報

### Wiki.js GraphQL API スキーマ

主要なクエリとミューテーション：

```graphql
# ページ一覧取得
query {
  pages {
    list {
      id
      path
      title
      description
      isPublished
      updatedAt
    }
  }
}

# ページ作成
mutation {
  pages {
    create(
      content: "# My Page\n\nContent here"
      description: "Page description"
      editor: "markdown"
      isPublished: true
      isPrivate: false
      locale: "ja"
      path: "my-page"
      tags: ["tag1", "tag2"]
      title: "My Page Title"
    ) {
      responseResult {
        succeeded
        errorCode
        message
      }
      page {
        id
        path
        title
      }
    }
  }
}
```

### 関連ドキュメント

- [Wiki.js 公式API ドキュメント](https://docs.requarks.io/dev/api)
- [Wiki.js GraphQL Explorer](http://localhost:3000/graphql) - APIキー設定後にアクセス可能
- [プロジェクトのWiki.js連携ドキュメント](./wiki-js-integration.md)

## ✅ セットアップ完了チェックリスト

- [ ] Wiki.jsが起動している
- [ ] 管理者としてWiki.jsにログインできる
- [ ] APIキーを生成できた
- [ ] APIキーが`.env`ファイルに設定されている
- [ ] `.env`ファイルが`.gitignore`に含まれている
- [ ] MCPサーバーが存在する（`mcp-server-graphql.js`）
- [ ] `npm run wiki:list`が動作する
- [ ] Web UI (`/knowledge/wiki-sync`) でページ一覧が表示される

---

問題が解決しない場合は、以下の情報を確認してください：
- Wiki.jsのバージョン
- エラーメッセージの全文
- 環境変数の設定（APIキーは伏せる）
- Wiki.jsのログ

