# Wiki.js 利用可能アイコン一覧

このドキュメントでは、`navigation.yaml`で使用できるアイコンの一覧を提供します。

## ⚠️ 重要: アイコンのプレフィックス

**Wiki.jsでは、すべてのアイコン名に `mdi-` プレフィックスが必要です。**

例:
- ❌ 間違い: `puzzle-piece`
- ✅ 正しい: `mdi-puzzle`

## 📦 Material Design Icons

Wiki.jsは[Material Design Icons](https://materialdesignicons.com/)を使用しています。

### ドキュメント関連
- `mdi-file-document` - 📄 ドキュメント
- `mdi-file-document-multiple` - 📑 複数ドキュメント
- `mdi-book` - 📚 本
- `mdi-book-open` - 📖 開いた本
- `mdi-book-open-variant` - 📕 開いた本（バリアント）
- `mdi-library` - 🏛️ ライブラリ
- `mdi-notebook` - 📓 ノート

### フォルダ/整理
- `mdi-folder` - 📁 フォルダ
- `mdi-folder-open` - 📂 開いたフォルダ
- `mdi-archive` - 🗄️ アーカイブ
- `mdi-inbox` - 📥 受信箱
- `mdi-folder-multiple` - 📁📁 複数フォルダ

### 開発関連
- `mdi-code-braces` - </> コード
- `mdi-code-tags` - <> コードタグ
- `mdi-puzzle` - 🧩 パズル（アーキテクチャ）
- `mdi-tools` - 🔧 ツール
- `mdi-cog` - ⚙️ 設定
- `mdi-api` - 🔌 API
- `mdi-database` - 🗄️ データベース
- `mdi-console` - 💻 コンソール

### プロジェクト管理
- `mdi-calendar-check` - 📅 カレンダー（チェック）
- `mdi-clipboard-text` - 📋 クリップボード
- `mdi-chart-line` - 📈 チャート
- `mdi-format-list-checks` - ✅ チェックリスト
- `mdi-table` - 📊 テーブル

### 通信/共有
- `mdi-share-variant` - 🔗 共有
- `mdi-link` - 🔗 リンク
- `mdi-email` - ✉️ メール
- `mdi-message` - 💬 メッセージ

### 外部サービス
- `mdi-github` - GitHub
- `mdi-gitlab` - GitLab
- `mdi-web` - 🌐 ウェブ
- `mdi-cloud` - ☁️ クラウド

### ナビゲーション
- `mdi-home` - 🏠 ホーム
- `mdi-menu` - ☰ メニュー
- `mdi-arrow-right` - → 右矢印
- `mdi-chevron-right` - › 右シェブロン

### 状態/アクション
- `mdi-check` - ✓ チェック
- `mdi-alert` - ⚠️ アラート
- `mdi-information` - ℹ️ 情報
- `mdi-help-circle` - ❓ ヘルプ
- `mdi-star` - ⭐ スター

## 使用方法

`navigation.yaml`でアイコンを指定する際は、`mdi-`プレフィックス付きのアイコン名を文字列として指定します：

```yaml
- type: link
  label: "アーキテクチャ設計"
  folder: "architecture"
  icon: "mdi-puzzle"  # ← mdi- プレフィックスが必要
```

## アイコンの検索

完全なアイコンリストは以下で検索できます：
- **公式サイト**: https://materialdesignicons.com/
- **検索方法**: キーワードで検索し、アイコン名をコピー

## 注意事項

- アイコン名は小文字とハイフン（`-`）で構成されます
- アイコンを指定しない場合、Wiki.jsがデフォルトアイコンを使用します
- 存在しないアイコン名を指定すると、デフォルトアイコンにフォールバックします

