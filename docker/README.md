# Docker環境設定

このディレクトリには、PMEDATAHUBプロジェクトをDockerコンテナで実行するための設定ファイルが含まれています。

## 前提条件

- Docker Engine 20.10 以上
- Docker Compose 2.0 以上

## クイックスタート

### 1. 環境準備

```bash
# プロジェクトルートに移動
cd /path/to/PMEDATAHUB

# データディレクトリの存在確認
ls -l data/achievements.db
```

### 2. Dockerイメージのビルド

```bash
# dockerディレクトリから実行
cd docker
docker-compose build

# またはプロジェクトルートから実行
docker-compose -f docker/docker-compose.yml build
```

### 3. コンテナ起動

```bash
# dockerディレクトリから実行
cd docker
docker-compose up -d

# またはプロジェクトルートから実行
docker-compose -f docker/docker-compose.yml up -d
```

### 4. 動作確認

ブラウザで `http://localhost:3000` にアクセスしてアプリケーションが正常に動作することを確認してください。

## 詳細な使用方法

### 環境変数の設定

必要に応じて環境変数を設定してください：

```bash
# dockerディレクトリに移動
cd docker

# 環境変数ファイルをコピーして編集
cp env.example .env
# .envファイルを編集して必要な環境変数を設定
```

### ログの確認

```bash
# コンテナのログを確認
docker-compose logs -f app

# 特定のサービスのログを確認
docker-compose logs -f app
```

### コンテナの停止

```bash
# コンテナを停止
docker-compose down

# コンテナとボリュームを削除（データは保持される）
docker-compose down -v
```

## アーキテクチャの説明

### マルチステージビルド

Dockerfileでは以下の3つのステージを使用しています：

1. **deps**: 依存関係のインストールのみ
2. **builder**: アプリケーションのビルド
3. **runner**: 実行環境（最小限のイメージ）

### データ永続化

以下のディレクトリがホストマシンにボリュームマウントされます：

- `../data:/app/data` - SQLiteデータベースファイル
- `../public:/app/public` - アップロードされたファイル（画像など）

### セキュリティ

- 非rootユーザー（nextjs）でアプリケーションを実行
- 最小限の権限のみを付与

## トラブルシューティング

### ビルドエラー

```bash
# キャッシュをクリアして再ビルド
docker-compose build --no-cache
```

### ポート競合

ポート3000が既に使用されている場合：

```bash
# docker-compose.ymlのポート設定を変更
ports:
  - "3001:3000"  # 3001番ポートで公開
```

### データベース接続エラー

データベースファイルが存在することを確認：

```bash
ls -l ../data/achievements.db
```

### メモリ不足

ビルド時にメモリ不足になる場合：

```bash
# Docker Desktopのメモリ設定を増やす
# またはビルドオプションでメモリ制限を緩和
docker-compose build --memory=2g
```

## 本番環境での使用

### 環境変数の設定

本番環境では以下の環境変数を適切に設定してください：

```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=/app/data/achievements.db
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
```

### HTTPS対応

本番環境でHTTPSを使用する場合：

```yaml
# docker-compose.yml
services:
  app:
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
    # リバースプロキシ（nginx等）の使用を推奨
```

### バックアップ

定期的なデータバックアップを推奨：

```bash
# データベースのバックアップ
cp data/achievements.db data/achievements.db.backup

# publicディレクトリのバックアップ
tar -czf public_backup.tar.gz public/
```

## 開発環境との共存

このDocker設定は既存の開発環境（`npm run dev`）と共存可能です：

- 開発時は `npm run dev` を使用
- 本番テスト時はDockerを使用
- スタンドアロン配布（`standalone-tools/`）とは独立

## サポート

問題が発生した場合は、以下の情報を確認してください：

1. DockerとDocker Composeのバージョン
2. ビルドログ（`docker-compose build`の出力）
3. 実行ログ（`docker-compose logs`の出力）
4. システムリソース（メモリ、ディスク容量）

---

**注意**: このDocker設定は既存のアプリケーションコードを一切変更していません。既存の機能に影響はありません。


