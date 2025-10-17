const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * 配布用パッケージを作成するスクリプト
 * 自動起動・終了機能付きスタンドアロンパッケージを生成
 */

async function createDistribution() {
    const standaloneDir = '.next/standalone';
    const distDir = 'dist';
    const archiveName = 'pme-datahub-standalone-auto.tar.xz';

    console.log('🚀 PME DataHub 配布パッケージを作成しています...');
    console.log('📁 ソースディレクトリ:', standaloneDir);
    console.log('📦 配布ディレクトリ:', distDir);

    try {
        // 配布ディレクトリを作成
        if (fs.existsSync(distDir)) {
            console.log('🗑️ 既存の配布ディレクトリを削除しています...');
            fs.rmSync(distDir, { recursive: true, force: true });
        }
        
        fs.mkdirSync(distDir, { recursive: true });
        console.log('✅ 配布ディレクトリを作成しました');

        // スタンドアロンファイルをコピー
        console.log('📋 ファイルをコピーしています...');
        await copyDirectory(standaloneDir, distDir);

        // 配布用READMEを作成
        createDistributionReadme(distDir);

        // 起動スクリプトの権限を設定（Linux/macOS）
        const startScript = path.join(distDir, 'start-pme.sh');
        if (fs.existsSync(startScript)) {
            fs.chmodSync(startScript, '755');
            console.log('✅ 起動スクリプトの権限を設定しました');
        }

        // アーカイブを作成
        console.log('📦 アーカイブを作成しています...');
        await createArchive(distDir, archiveName);

        console.log('🎉 配布パッケージの作成が完了しました！');
        console.log('📁 ファイル:', archiveName);
        console.log('💾 サイズ:', getFileSize(archiveName));
        
        console.log('\n📋 配布方法:');
        console.log(`1. ${archiveName} を配布先にコピー`);
        console.log('2. tar -xf pme-datahub-standalone-auto.tar.xz で展開');
        console.log('3. launcher.html をブラウザで開く');
        console.log('4. または start-pme.bat (Windows) / start-pme.sh (Linux/macOS) を実行');

    } catch (error) {
        console.error('❌ 配布パッケージ作成エラー:', error);
        process.exit(1);
    }
}

/**
 * ディレクトリを再帰的にコピー
 */
async function copyDirectory(src, dest) {
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
            // ディレクトリの場合は再帰的にコピー
            await copyDirectory(srcPath, destPath);
            console.log(`📁 ディレクトリをコピー: ${item}`);
        } else {
            // ファイルの場合はコピー
            fs.copyFileSync(srcPath, destPath);
            console.log(`📄 ファイルをコピー: ${item}`);
        }
    }
}

/**
 * 配布用READMEを作成
 */
function createDistributionReadme(distDir) {
    const readmePath = path.join(distDir, 'README-DISTRIBUTION.md');
    const readmeContent = `# PME DataHub - 配布版

## 🚀 クイックスタート

### Windows環境
1. \`launcher.html\` をダブルクリック
2. または \`start-pme.bat\` をダブルクリック

### Linux/macOS環境
1. \`launcher.html\` をブラウザで開く
2. または \`./start-pme.sh\` を実行

## ✨ 自動起動・終了機能

- **自動開始**: HTMLを開くと自動的にサーバーが起動
- **自動終了**: HTMLを閉じると自動的にサーバーが停止
- **自動オープン**: サーバー起動後、自動的にブラウザでアプリケーションが開く

## 📋 事前要件

- Node.js 16以上
- ブラウザ（Chrome、Firefox、Safari、Edge）

## 🌐 アクセス

サーバー起動後: http://localhost:3000

---
配布日: ${new Date().toLocaleDateString('ja-JP')}
`;

    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ 配布用READMEを作成しました');
}

/**
 * アーカイブを作成
 */
async function createArchive(distDir, archiveName) {
    return new Promise((resolve, reject) => {
        const command = `tar -cJf ${archiveName} -C ${distDir} .`;
        
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
 * ファイルサイズを取得
 */
function getFileSize(filePath) {
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

// スクリプト実行
createDistribution().catch(console.error);
