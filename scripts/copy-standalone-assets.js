const fs = require('fs');
const path = require('path');

/**
 * ディレクトリを再帰的にコピーする関数
 * @param {string} src - コピー元ディレクトリ
 * @param {string} dest - コピー先ディレクトリ
 */
function copyDir(src, dest) {
  // コピー先ディレクトリが存在しない場合は作成
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // コピー元ディレクトリの内容を取得
  const items = fs.readdirSync(src);

  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // ディレクトリの場合は再帰的にコピー
      copyDir(srcPath, destPath);
    } else {
      // ファイルの場合はコピー
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copied: ${item}`);
    }
  });
}

/**
 * スタンドアロンビルドに必要な静的ファイルをコピー
 */
async function copyStandaloneAssets() {
  const standaloneDir = '.next/standalone';
  
  console.log('🔄 Copying static assets for standalone build...');
  console.log('🖥️  Platform:', process.platform);
  
  try {
    // 少し待機してファイルロックを解除
    if (process.platform === 'win32') {
      console.log('⏳ Windows detected - waiting for file locks to release...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // .next/static フォルダをコピー
    if (fs.existsSync('.next/static')) {
      console.log('📁 Copying .next/static...');
      copyDir('.next/static', path.join(standaloneDir, '.next/static'));
    } else {
      console.log('⚠️  .next/static not found');
    }

    // public フォルダをコピー
    if (fs.existsSync('public')) {
      console.log('📁 Copying public folder...');
      copyDir('public', path.join(standaloneDir, 'public'));
    } else {
      console.log('⚠️  public folder not found');
    }

    console.log('✅ Static assets copied successfully!');
    
  } catch (error) {
    console.error('❌ Error copying static assets:', error.message);
    process.exit(1);
  }
}

// スクリプト実行
copyStandaloneAssets().catch(console.error);
