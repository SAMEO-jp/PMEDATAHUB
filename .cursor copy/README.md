# Cursor AI 設定ファイル

このディレクトリには、AIアシスタントの動作を制御するための設定ファイルが含まれています。

## 設定ファイル一覧

### settings.json
AIアシスタントの動作を制御するメイン設定ファイルです。

#### 現在の設定内容

- **auto-start-dev-server**: `false`
  - 開発サーバーを自動起動しない設定
  - デフォルトでは `npm run dev` を勝手に実行しません

- **require-confirmation-for-commands**: 確認が必要なコマンドリスト
  - `npm run dev`, `npm start`, `yarn dev`, `yarn start`, `next dev`
  - これらのコマンドを実行する前にユーザーに確認を求めます

- **preferred-start-command**: 推奨される起動コマンド
  - `npm run dev:safe` （ポート競合チェック付きの安全な起動）

## 推奨される開発サーバー起動方法

開発サーバーを起動する際は、以下のコマンドを使用してください：

```bash
# 安全な起動（ポート競合チェック付き）
npm run dev:safe

# 通常の起動（手動で確認する場合）
npm run dev
```

## 設定の変更方法

この設定を変更したい場合は、`settings.json`を直接編集してください。

### 例: 開発サーバーの自動起動を有効化する場合
```json
{
  "ai-behavior": {
    "auto-start-dev-server": true
  }
}
```

## 注意事項

- この設定はAIアシスタントの動作のみを制御します
- 実際の開発作業には影響しません
- 設定変更後はAIアシスタントが設定を読み込みます
