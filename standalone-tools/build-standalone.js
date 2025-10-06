const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * スタンドアロン配布ビルドを実行するメインスクリプト
 * 自動起動・終了機能付きスタンドアロンパッケージを生成
 */

class StandaloneBuilder {
    constructor() {
        this.rootDir = path.resolve(__dirname, '..');
        this.standaloneToolsDir = path.join(this.rootDir, 'standalone-tools');
        this.standaloneDir = path.join(this.rootDir, '.next/standalone');
        this.distDir = path.join(this.rootDir, 'dist');
        this.archiveName = 'pme-datahub-standalone-auto.tar.xz';
    }

    /**
     * スタンドアロン配布ビルドを実行
     */
    async build() {
        console.log('🚀 PME DataHub スタンドアロン配布ビルドを開始します...');
        console.log('📁 ルートディレクトリ:', this.rootDir);
        console.log('📁 スタンドアロンツール:', this.standaloneToolsDir);
        console.log('📁 スタンドアロンディレクトリ:', this.standaloneDir);

        try {
            // ステップ1: スタンドアロンビルドの実行
            await this.buildStandalone();

            // ステップ2: 自動起動・終了機能の統合
            await this.integrateAutoLauncher();

            // ステップ3: 配布パッケージの作成
            await this.createDistributionPackage();

            console.log('🎉 スタンドアロン配布ビルドが完了しました！');
            console.log('📁 配布ファイル:', this.archiveName);
            console.log('💾 サイズ:', this.getFileSize(this.archiveName));

        } catch (error) {
            console.error('❌ ビルドエラー:', error);
            process.exit(1);
        }
    }

    /**
     * Next.jsスタンドアロンビルドを実行
     */
    async buildStandalone() {
        console.log('\n📦 Next.jsスタンドアロンビルドを実行しています...');

        // スタンドアロン設定ファイルをコピー
        const standaloneConfig = path.join(this.rootDir, 'next.config.standalone.js');
        const nextConfig = path.join(this.rootDir, 'next.config.js');

        if (fs.existsSync(standaloneConfig)) {
            fs.copyFileSync(standaloneConfig, nextConfig);
            console.log('✅ スタンドアロン設定ファイルを適用しました');
        }

        // Next.jsビルドを実行
        await this.execCommand('npm run build');

        // スタンドアロンアセットをコピー
        await this.execCommand('npm run build:standalone:assets');

        console.log('✅ Next.jsスタンドアロンビルドが完了しました');
    }

    /**
     * 自動起動・終了機能を統合
     */
    async integrateAutoLauncher() {
        console.log('\n🔧 自動起動・終了機能を統合しています...');

        const launchersDir = path.join(this.standaloneToolsDir, 'launchers');

        // ランチャーファイルをスタンドアロンディレクトリにコピー
        const launcherFiles = [
            'start-pme.js',        // 統一JavaScriptスクリプト
            'launcher.html',       // HTMLランチャー
            'launcher-server.js',  // HTMLランチャー用WebSocketサーバー
            'launcher-helper.js',  // HTMLランチャー用ヘルパーサーバー
            'start-all.js',        // 統合起動スクリプト
            'simple-launcher.js',  // シンプルNode.jsサーバー起動ツール
            'simple-launcher.html' // シンプルHTMLランチャー
        ];

        for (const file of launcherFiles) {
            const srcPath = path.join(launchersDir, file);
            const destPath = path.join(this.standaloneDir, file);

            if (fs.existsSync(srcPath)) {
                fs.copyFileSync(srcPath, destPath);
                console.log(`✅ ${file} を統合しました`);
                
                // JavaScriptファイルの場合は実行権限を設定
                if (file.endsWith('.js')) {
                    fs.chmodSync(destPath, '755');
                    console.log(`✅ ${file} の実行権限を設定しました`);
                }
            } else {
                console.log(`⚠️  ${file} が見つかりません`);
            }
        }

        // 配布用READMEを作成
        await this.createDistributionReadme();

        console.log('✅ 自動起動・終了機能の統合が完了しました');
    }

    /**
     * 配布パッケージを作成
     */
    async createDistributionPackage() {
        console.log('\n📦 配布パッケージを作成しています...');

        // 配布ディレクトリを作成
        if (fs.existsSync(this.distDir)) {
            fs.rmSync(this.distDir, { recursive: true, force: true });
        }
        
        fs.mkdirSync(this.distDir, { recursive: true });

        // スタンドアロンファイルをコピー
        await this.copyDirectory(this.standaloneDir, this.distDir);

        // アーカイブを作成
        await this.createArchive();

        console.log('✅ 配布パッケージの作成が完了しました');
    }

    /**
     * 配布用READMEを作成
     */
    async createDistributionReadme() {
        const readmePath = path.join(this.standaloneDir, 'README.md');
        const templatePath = path.join(this.standaloneToolsDir, 'docs', 'README.md');

        let readmeContent;
        if (fs.existsSync(templatePath)) {
            readmeContent = fs.readFileSync(templatePath, 'utf8');
        } else {
            readmeContent = this.getDefaultReadme();
        }

        // ビルド日時を追加
        const buildDate = new Date().toLocaleString('ja-JP');
        readmeContent += `\n\n---\n**ビルド日時**: ${buildDate}\n**バージョン**: 0.0.1\n`;

        fs.writeFileSync(readmePath, readmeContent);
        console.log('✅ 配布用READMEを作成しました');
    }

    /**
     * デフォルトREADMEコンテンツ
     */
    getDefaultReadme() {
        return `# PME DataHub - スタンドアロン配布版

## 🚀 自動起動・終了機能付き配布パッケージ

このパッケージには、HTMLを開くと自動的にプロジェクトを開始し、閉じると自動的に終了する機能が含まれています。

## 📁 ファイル構成

- \`server.js\` - Next.jsサーバー
- \`package.json\` - 依存関係
- \`node_modules/\` - 依存関係パッケージ
- \`data/\` - データベースファイル
- \`public/\` - 静的ファイル
- \`.next/\` - Next.jsビルドファイル
- \`launcher.html\` - HTML自動起動ランチャー
- \`launcher.js\` - Node.js自動起動スクリプト
- \`start-pme.bat\` - Windows用起動スクリプト
- \`start-pme.sh\` - Linux/macOS用起動スクリプト

## 🎯 起動方法

### 方法1: HTMLランチャー（推奨）

1. **Windows環境**:
   - \`launcher.html\` をダブルクリック
   - または \`start-pme.bat\` をダブルクリック

2. **Linux/macOS環境**:
   - \`launcher.html\` をブラウザで開く
   - または \`./start-pme.sh\` を実行

### 方法2: コマンドライン

\`\`\`bash
# Node.jsランチャーを使用
node launcher.js launcher  # HTMLランチャーを開く
node launcher.js start     # 直接サーバーを起動
node launcher.js stop      # サーバーを停止
node launcher.js restart   # サーバーを再起動
node launcher.js status    # サーバー状態を確認
\`\`\`

## ✨ 自動起動・終了機能

### 🔄 自動開始
- HTMLランチャーを開くと自動的にサーバーが起動
- サーバー起動後、自動的にブラウザでアプリケーションが開く
- 起動状況がプログレスバーで表示される

### 🛑 自動終了
- HTMLランチャーのページを閉じると自動的にサーバーが停止
- ブラウザタブを閉じても自動的にサーバーが停止
- プロセス終了時にも自動的にクリーンアップ

### 📊 ヘルスチェック
- 10秒ごとにサーバーの状態を監視
- サーバーが応答しない場合は自動的に再起動
- プロセス異常終了時の自動復旧

## 🖥️ 対応環境

### Windows
- Windows 10/11
- Node.js 16以上
- ブラウザ（Chrome、Firefox、Edge）

### Linux
- Ubuntu 18.04以上
- CentOS 7以上
- Node.js 16以上

### macOS
- macOS 10.15以上
- Node.js 16以上

## 📋 事前要件

1. **Node.js**: バージョン16以上が必要
   - ダウンロード: https://nodejs.org/

2. **ブラウザ**: 最新版のブラウザ
   - Chrome、Firefox、Safari、Edge

## 🌐 アクセス方法

サーバーが起動したら、以下のURLでアクセスできます：

- **メインアプリケーション**: http://localhost:3000
- **HTMLランチャー**: file:///path/to/launcher.html

## 📱 機能一覧

- ✅ 自動サーバー起動・停止
- ✅ ブラウザ自動オープン
- ✅ プロセス監視・復旧
- ✅ ヘルスチェック
- ✅ クロスプラットフォーム対応
- ✅ エラーハンドリング
- ✅ プログレス表示
- ✅ 状態管理

## 🚨 注意事項

1. **初回起動時**: 依存関係のインストールに時間がかかる場合があります
2. **ポート競合**: 他のアプリケーションがポート3000を使用している場合は停止してください
3. **ファイアウォール**: ローカルアクセスを許可する必要があります
4. **データベース**: \`data/achievements.db\` ファイルが必要です

---

**PME DataHub v0.0.1** - 自動起動・終了機能付き配布版
`;
    }

    /**
     * ディレクトリを再帰的にコピー
     */
    async copyDirectory(src, dest) {
        if (!fs.existsSync(src)) {
            throw new Error(`ソースディレクトリが存在しません: ${src}`);
        }

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const items = fs.readdirSync(src);

        for (const item of items) {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            const stat = fs.statSync(srcPath);

            if (stat.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
                console.log(`📁 ディレクトリをコピー: ${item}`);
            } else {
                fs.copyFileSync(srcPath, destPath);
                console.log(`📄 ファイルをコピー: ${item}`);
            }
        }
    }

    /**
     * アーカイブを作成
     */
    async createArchive() {
        return new Promise((resolve, reject) => {
            const command = `tar -cJf ${this.archiveName} -C ${this.distDir} .`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`アーカイブ作成エラー: ${error.message}`));
                    return;
                }
                
                if (stderr) {
                    console.log('アーカイブ作成警告:', stderr);
                }
                
                resolve();
            });
        });
    }

    /**
     * コマンドを実行
     */
    async execCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, { cwd: this.rootDir }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`コマンド実行エラー: ${error.message}`));
                    return;
                }
                
                if (stdout) {
                    console.log(stdout);
                }
                
                if (stderr) {
                    console.log(stderr);
                }
                
                resolve();
            });
        });
    }

    /**
     * ファイルサイズを取得
     */
    getFileSize(filePath) {
        if (!fs.existsSync(filePath)) {
            return '0 B';
        }
        
        const stats = fs.statSync(filePath);
        const bytes = stats.size;
        
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// メイン実行
const builder = new StandaloneBuilder();
builder.build().catch(console.error);
