# PME DataHub - スタンドアロンツール

## 📁 ディレクトリ構成

```
standalone-tools/
├── build-standalone.js     # メインビルドスクリプト
├── launchers/             # 起動スクリプト
│   ├── start-pme.js       # 統一自動起動スクリプト（クロスプラットフォーム）
│   └── launcher.html      # HTML自動起動ランチャー
├── scripts/               # 配布用スクリプト
│   └── create-distribution.js
├── templates/             # テンプレートファイル
├── docs/                  # ドキュメント
│   └── README.md          # 配布用README
└── README.md              # このファイル
```

## 🚀 使用方法

### 1. 自動起動・終了機能付きスタンドアロンビルド

```bash
# 自動起動・終了機能付きスタンドアロンパッケージを作成
npm run build:standalone:auto
```

このコマンドは以下の処理を自動実行します：
1. Next.jsスタンドアロンビルド
2. 自動起動・終了機能の統合
3. 配布パッケージの作成
4. アーカイブファイルの生成

### 2. 個別のビルド処理

```bash
# Next.jsスタンドアロンビルドのみ
npm run build:standalone

# 配布パッケージの作成のみ
node standalone-tools/scripts/create-distribution.js
```

## 📋 ファイル説明

### build-standalone.js
- **用途**: メインビルドスクリプト
- **機能**: 
  - Next.jsスタンドアロンビルドの実行
  - 自動起動・終了機能の統合
  - 配布パッケージの作成
  - アーカイブファイルの生成

### launchers/start-pme.js
- **用途**: 統一自動起動スクリプト（クロスプラットフォーム）
- **機能**:
  - Windows、Linux、macOS対応
  - サーバープロセスの管理
  - ヘルスチェック・自動復旧
  - 依存関係の自動インストール
  - 既存プロセスの自動停止
  - ブラウザ自動オープン
  - 美しいコンソール出力
  - インタラクティブモード

### launchers/launcher.html
- **用途**: HTML自動起動ランチャー
- **機能**:
  - 美しいUI（グラデーション背景、プログレスバー）
  - ブラウザで開くと自動的にサーバーが起動
  - ページを閉じると自動的にサーバーが停止
  - 視覚的フィードバック（起動状況の表示）
  - 自動的にブラウザでアプリケーションを開く

### scripts/create-distribution.js
- **用途**: 配布パッケージ作成スクリプト
- **機能**:
  - スタンドアロンファイルのコピー
  - 配布用READMEの生成
  - アーカイブファイルの作成

## 🔧 カスタマイズ

### ランチャーのカスタマイズ

1. **HTMLランチャーの見た目を変更**:
   - `launchers/launcher.html` のCSSを編集

2. **起動スクリプトの動作を変更**:
   - `launchers/launcher.js` の設定を編集

3. **配布用READMEの内容を変更**:
   - `docs/README.md` を編集

### ビルドプロセスのカスタマイズ

1. **ビルドスクリプトの動作を変更**:
   - `build-standalone.js` の設定を編集

2. **追加ファイルの統合**:
   - `build-standalone.js` の `integrateAutoLauncher()` メソッドを編集

## 📦 配布パッケージの構成

ビルド完了後の配布パッケージには以下が含まれます：

```
pme-datahub-standalone-auto.tar.xz
├── server.js              # Next.jsサーバー
├── package.json           # 依存関係
├── node_modules/          # 依存関係パッケージ
├── data/                  # データベースファイル
├── public/                # 静的ファイル
├── .next/                 # Next.jsビルドファイル
├── start-pme.js           # 統一自動起動スクリプト（クロスプラットフォーム）
├── launcher.html          # HTML自動起動ランチャー
└── README.md              # 配布用README
```

## 🎯 配布方法

1. **アーカイブファイルを配布**:
   ```bash
   # 配布先で展開
   tar -xf pme-datahub-standalone-auto.tar.xz
   ```

2. **起動方法を案内**:
   - HTMLランチャー: `launcher.html` をブラウザで開く
   - JavaScriptスクリプト: `node start-pme.js` または `./start-pme.js` を実行

## 🚨 注意事項

1. **Node.jsの要件**: バージョン16以上が必要
2. **ポートの競合**: ポート3000が使用中でないことを確認
3. **依存関係**: 初回起動時に依存関係のインストールが必要
4. **データベース**: `data/achievements.db` ファイルが必要

## 🔄 更新方法

スタンドアロンツールを更新する場合：

1. 必要なファイルを `standalone-tools/` に配置
2. `npm run build:standalone:auto` を実行
3. 新しい配布パッケージが生成される

## 📞 サポート

問題が発生した場合は、以下の情報を含めてご連絡ください：

- 使用環境（OS、Node.jsバージョン）
- 実行したコマンド
- エラーメッセージ
- ログファイルの内容

---

**PME DataHub v0.0.1** - スタンドアロンツール
