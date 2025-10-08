# Prisma Studio 使い方ガイド

## 📋 概要

Prisma Studioは、データベースの内容を視覚的に確認・編集できるGUIツールです。
このプロジェクトでは、既存のSQLiteデータベース（`data/achievements.db`）を閲覧するために最小限の設定で導入されています。

**重要：既存のアプリケーションコードには一切影響を与えません。**

## 🚀 起動方法

### 方法1: npmスクリプトを使用（推奨）

```bash
npm run studio
```

### 方法2: npxコマンドを直接実行

```bash
npx prisma studio
```

どちらの方法でも、ブラウザが自動的に開き、Prisma Studioにアクセスできます。
デフォルトでは `http://localhost:5555` で起動します。

## 📊 利用可能なテーブル

Prisma Studioで閲覧・編集できるテーブル（28テーブル）：

### プロジェクト管理系
- `PROJECT` - プロジェクト情報
- `PROJECT_HISTORY` - プロジェクト変更履歴
- `PROJECT_MEMBERS` - プロジェクトメンバー
- `PROJECT_MEMBERS_OLD` - プロジェクトメンバー（旧）

### BOM（部品表）管理系
- `BOM_BUHIN` - 部品情報
- `BOM_BUZAI` - 部材情報
- `BOM_PART` - パーツ情報
- `BOM_ZUMEN` - 図面情報

### パレット管理系
- `PALET_LIST` - パレットリスト
- `PALET_MASTER_OLD` - パレットマスタ
- `PALET_SCHEDULE` - パレットスケジュール
- `PALET_STATUS_HISTORY` - パレット状態履歴
- `PALET_TEMP_LOCATIONS` - パレット一時保管場所
- `KONPO_PALET` - 梱包パレット

### 設備・購入管理系
- `setsubi_master` - 設備マスタ
- `setsubi_assignment` - 設備割当
- `setsubi_history` - 設備履歴
- `kounyu_master` - 購入マスタ
- `kounyu_assignment` - 購入割当

### 実績管理系
- `business_achievements` - 業務実績
- `business_categories` - 業務カテゴリ

### 写真管理系
- `photos` - 写真情報
- `photo_albums` - 写真アルバム
- `photo_categories` - 写真カテゴリ
- `photo_tags` - 写真タグ

### その他
- `DEPARTMENT` - 部門情報
- `document_demo` - ドキュメントデモ
- `user_settings` - ユーザー設定

### ⚠️ 閲覧のみ可能なテーブル（編集不可）

以下のテーブルはユニーク識別子がないため、Prisma Clientからはアクセスできませんが、
Prisma Studioでは**閲覧**できます：

- `USER` - ユーザー情報
- `PALET_MASTER` - パレットマスタ
- `events` - イベント情報
- `album_photos_link` - アルバム写真リンク
- `photo_tags_link` - 写真タグリンク

## 🎯 基本的な使い方

### 1. テーブルの閲覧

1. Prisma Studioを起動
2. 左サイドバーからテーブル名をクリック
3. テーブルのデータが一覧表示されます

### 2. データの検索

- 各カラムの右側にある検索アイコンをクリック
- 条件を入力してフィルタリング
- 複数の条件を組み合わせることも可能

### 3. データの編集

1. 編集したい行のセルをクリック
2. 値を変更
3. 画面上部の「Save 1 change」ボタンをクリック

**注意：データの編集は慎重に行ってください。**

### 4. データの追加

1. 画面上部の「Add record」ボタンをクリック
2. 各フィールドに値を入力
3. 「Save 1 change」ボタンをクリック

### 5. データの削除

1. 削除したい行の左端のチェックボックスをクリック
2. 画面上部の「Delete 1 record」ボタンをクリック
3. 確認ダイアログで「Delete」をクリック

## ⚙️ 設定ファイル

### prisma/schema.prisma

Prismaのスキーマファイルです。データベース構造が定義されています。

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:../data/achievements.db"
}

generator client {
  provider = "prisma-client-js"
}

// テーブル定義は自動生成されています
```

## 🔧 トラブルシューティング

### Q: Prisma Studioが起動しない

**A:** 以下を確認してください：
1. データベースファイル（`data/achievements.db`）が存在するか
2. Prismaパッケージが正しくインストールされているか
   ```bash
   npm install
   ```

### Q: テーブルが表示されない

**A:** Prisma Clientを再生成してみてください：
```bash
npx prisma generate
```

### Q: データベースの変更がPrisma Studioに反映されない

**A:** ブラウザをリフレッシュするか、Prisma Studioを再起動してください。

### Q: スキーマを更新したい（テーブル構造が変更された場合）

**A:** 以下のコマンドで既存DBからスキーマを再取得できます：
```bash
npx prisma db pull
npx prisma generate
```

## 🚨 重要な注意事項

1. **既存コードへの影響なし**
   - Prisma Studioは閲覧・編集専用ツールです
   - 既存のtRPCルーターやCRUD関数には一切影響しません
   - sqlite3ベースの既存コードとPrisma Studioは共存できます

2. **データ編集時の注意**
   - Prisma Studioでのデータ編集は直接データベースに反映されます
   - アプリケーションのバリデーションを通らないため、慎重に行ってください
   - 重要なデータを変更する前は、データベースのバックアップを推奨します

3. **パフォーマンス**
   - Prisma Studioは開発環境での使用を想定しています
   - 本番環境では使用しないでください

4. **ポート番号**
   - デフォルトでポート5555を使用します
   - 他のアプリケーションと競合する場合は、環境変数で変更できます：
     ```bash
     PORT=5556 npm run studio
     ```

## 📚 参考リンク

- [Prisma Studio公式ドキュメント](https://www.prisma.io/docs/concepts/components/prisma-studio)
- [Prisma公式サイト](https://www.prisma.io/)

## 🎉 活用例

### 開発時のデータ確認
- 「このプロジェクトにどんなメンバーがいるか確認したい」
- 「特定のユーザーの情報を素早く調べたい」
- 「実績データの傾向を視覚的に確認したい」

### データの一括編集
- テストデータの一括投入
- ステータスの一括変更
- 不要なデータの一括削除

### デバッグ
- アプリケーションで発生した問題の原因調査
- データの整合性チェック
- リレーションの確認

---

**導入日:** 2025年10月7日  
**バージョン:** Prisma v6.16.3  
**メンテナー:** プロジェクトチーム

