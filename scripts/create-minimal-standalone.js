const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * PME Standalone Minimal Build Script (Node.js版)
 * Windows/Linux両対応
 */

// 色付きログ関数
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function logInfo(message) {
  console.log(`${colors.bright}${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.bright}${colors.green}✅ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.bright}${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.bright}${colors.red}❌ ${message}${colors.reset}`);
}

/**
 * ディレクトリを再帰的にコピーする関数
 */
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

/**
 * ファイルサイズを取得
 */
function getDirSize(dirPath) {
  if (!fs.existsSync(dirPath)) return '0B';
  
  let size = 0;
  function getSize(itemPath) {
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      fs.readdirSync(itemPath).forEach(file => {
        getSize(path.join(itemPath, file));
      });
    } else {
      size += stat.size;
    }
  }
  
  getSize(dirPath);
  return formatBytes(size);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
}

/**
 * メイン処理
 */
async function createMinimalStandalone() {
  try {
    console.log('🚀 PME Standalone Minimal Build 開始...');
    
    // 作業ディレクトリの確認
    if (!fs.existsSync('package.json')) {
      logError('package.jsonが見つかりません。プロジェクトルートで実行してください。');
      process.exit(1);
    }

    // 古いファイルをクリーンアップ
    logInfo('古いファイルをクリーンアップ中...');
    if (fs.existsSync('pme-standalone-minimal.tar.xz')) {
      fs.unlinkSync('pme-standalone-minimal.tar.xz');
    }
    if (fs.existsSync('temp-standalone')) {
      fs.rmSync('temp-standalone', { recursive: true, force: true });
    }

    // スタンドアローンビルド実行
    logInfo('スタンドアローンビルドを実行中...');
    execSync('npm run build:standalone', { stdio: 'inherit' });

    // 一時ディレクトリ作成
    logInfo('一時ディレクトリを作成中...');
    const tempDir = 'temp-standalone';
    fs.mkdirSync(tempDir, { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'public'), { recursive: true });

    // 必要なファイルをコピー
    logInfo('必要なファイルをコピー中...');

    // .nextディレクトリ
    const nextSrc = '.next/standalone/.next';
    const nextDest = path.join(tempDir, '.next');
    if (fs.existsSync(nextSrc)) {
      copyDir(nextSrc, nextDest);
      logSuccess('.nextディレクトリをコピー完了');
    } else {
      logError('.next/standalone/.nextが見つかりません');
      process.exit(1);
    }

    // node_modulesディレクトリ
    const nodeModulesSrc = '.next/standalone/node_modules';
    const nodeModulesDest = path.join(tempDir, 'node_modules');
    if (fs.existsSync(nodeModulesSrc)) {
      copyDir(nodeModulesSrc, nodeModulesDest);
      logSuccess('node_modulesディレクトリをコピー完了');
    } else {
      logError('.next/standalone/node_modulesが見つかりません');
      process.exit(1);
    }

    // dataディレクトリ
    const dataSrc = '.next/standalone/data';
    const dataDest = path.join(tempDir, 'data');
    if (fs.existsSync(dataSrc)) {
      copyDir(dataSrc, dataDest);
      logSuccess('dataディレクトリをコピー完了');
    } else {
      logWarning('dataディレクトリが見つかりません（スキップ）');
    }

    // 設定ファイル
    const filesToCopy = ['server.js', 'package.json', '.env'];
    filesToCopy.forEach(file => {
      const srcPath = `.next/standalone/${file}`;
      const destPath = path.join(tempDir, file);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
      } else {
        logWarning(`${file}が見つかりません`);
      }
    });
    logSuccess('設定ファイルをコピー完了');

    // サイズ確認
    const originalSize = getDirSize('.next/standalone');
    const minimalSize = getDirSize(tempDir);
    logInfo(`サイズ比較: 元のサイズ ${originalSize} → 最小版 ${minimalSize}`);

    // 圧縮
    logInfo('xz圧縮を実行中...');
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      // Windows用: tarコマンド（Windows 10以降）
      try {
        execSync(`tar -cJf pme-standalone-minimal.tar.xz -C ${tempDir} .`, { stdio: 'inherit' });
      } catch (error) {
        logWarning('tarコマンドが利用できません。zip形式で圧縮します...');
        execSync(`powershell Compress-Archive -Path "${tempDir}\\*" -DestinationPath "pme-standalone-minimal.zip" -Force`, { stdio: 'inherit' });
      }
    } else {
      // Linux/macOS用: xz圧縮
      execSync(`tar -cJf pme-standalone-minimal.tar.xz -C ${tempDir} .`, { stdio: 'inherit' });
    }

    // 圧縮ファイルサイズ確認
    let compressedFile = 'pme-standalone-minimal.tar.xz';
    if (!fs.existsSync(compressedFile)) {
      compressedFile = 'pme-standalone-minimal.zip';
    }
    
    const compressedSize = fs.existsSync(compressedFile) ? getDirSize(compressedFile) : '0B';
    logSuccess(`圧縮完了: ${compressedSize}`);

    // 一時ファイル削除
    logInfo('一時ファイルを削除中...');
    fs.rmSync(tempDir, { recursive: true, force: true });

    // 完了メッセージ
    console.log('');
    logSuccess('🎉 PME Standalone Minimal Build 完了！');
    console.log('');
    console.log(`📦 作成されたファイル: ${compressedFile} (${compressedSize})`);
    console.log('');
    console.log('📋 Windowsでの使用方法:');
    if (compressedFile.endsWith('.tar.xz')) {
      console.log('   1. pme-standalone-minimal.tar.xz をWindowsに転送');
      console.log('   2. tar -xf pme-standalone-minimal.tar.xz で展開');
      console.log('   3. npm start で実行');
    } else {
      console.log('   1. pme-standalone-minimal.zip をWindowsに転送');
      console.log('   2. 右クリック → すべて展開 で展開');
      console.log('   3. npm start で実行');
    }
    console.log('');
    console.log('⚠️  注意: 画像ファイルは含まれていません（publicフォルダは空）');
    console.log('');

  } catch (error) {
    logError(`エラーが発生しました: ${error.message}`);
    process.exit(1);
  }
}

// スクリプト実行
createMinimalStandalone();
