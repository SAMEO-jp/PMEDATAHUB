# PME DataHub - インストールガイド

## 📋 事前要件

### 必須要件
- **Node.js**: バージョン16以上
- **ブラウザ**: Chrome、Firefox、Safari、Edge の最新版
- **OS**: Windows 10/11、macOS 10.15以上、Ubuntu 18.04以上

### 推奨要件
- **RAM**: 4GB以上
- **ストレージ**: 2GB以上の空き容量
- **CPU**: 2コア以上

## 🚀 インストール手順

### ステップ1: Node.jsのインストール

1. [Node.js公式サイト](https://nodejs.org/) からダウンロード
2. LTS版（推奨）を選択
3. インストーラーを実行
4. インストール完了後、ターミナル/コマンドプロンプトを再起動

### ステップ2: パッケージの展開

```bash
# アーカイブファイルを展開
tar -xf pme-datahub-standalone-auto.tar.xz

# 展開されたディレクトリに移動
cd pme-datahub-standalone-auto
```

### ステップ3: 依存関係のインストール

```bash
# 依存関係をインストール
npm install
```

### ステップ4: 起動

#### 方法1: HTMLランチャー（推奨）

**Windows環境**:
1. `launcher.html` をダブルクリック
2. ブラウザが開き、自動的にサーバーが起動

**Linux/macOS環境**:
1. `launcher.html` をブラウザで開く
2. 自動的にサーバーが起動

#### 方法2: コマンドライン

```bash
# 自動起動スクリプトを使用
node launcher.js launcher

# または直接起動
node launcher.js start
```

#### 方法3: プラットフォーム別スクリプト

**Windows**:
```cmd
start-pme.bat
```

**Linux/macOS**:
```bash
./start-pme.sh
```

## 🌐 アクセス方法

サーバーが起動したら、以下のURLでアクセスできます：

- **メインアプリケーション**: http://localhost:3000
- **HTMLランチャー**: file:///path/to/launcher.html

## 🔧 トラブルシューティング

### ポート3000が使用中の場合

**Windows**:
```cmd
# ポート3000を使用しているプロセスを確認
netstat -ano | findstr :3000

# プロセスを終了
taskkill /PID <PID番号> /F
```

**Linux/macOS**:
```bash
# ポート3000を使用しているプロセスを確認
lsof -ti:3000

# プロセスを終了
lsof -ti:3000 | xargs kill -9
```

### Node.jsが見つからない場合

1. Node.jsがインストールされているか確認
2. PATH環境変数にNode.jsが含まれているか確認
3. ターミナル/コマンドプロンプトを再起動

### 依存関係のエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
```

### サーバーが起動しない場合

1. ログを確認: `node server.js` を直接実行
2. ポートの競合を確認
3. ファイアウォール設定を確認

## 📱 機能確認

起動後、以下の機能が正常に動作することを確認してください：

- ✅ サーバーの自動起動
- ✅ ブラウザの自動オープン
- ✅ アプリケーションへのアクセス
- ✅ データベースの読み込み
- ✅ 各機能の動作

## 🛑 アンインストール

1. **サーバーを停止**:
   ```bash
   node launcher.js stop
   ```

2. **ディレクトリを削除**:
   ```bash
   rm -rf pme-datahub-standalone-auto
   ```

3. **Node.jsのアンインストール**（必要に応じて）:
   - コントロールパネル（Windows）またはアプリケーション（macOS）から削除

## 📞 サポート

問題が発生した場合は、以下の情報を含めてご連絡ください：

- 使用環境（OS、Node.jsバージョン）
- エラーメッセージ
- 実行したコマンド
- ログファイルの内容

---

**PME DataHub v0.0.1** - インストールガイド
