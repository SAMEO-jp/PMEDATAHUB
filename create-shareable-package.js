#!/usr/bin/env node

/**
 * PMEシステム共有用パッケージ作成スクリプト
 * node_modulesを除外してZIPファイルを作成します
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 設定
const CONFIG = {
  sourceDir: './pme-system-standalone',
  outputDir: './temp',
  zipName: 'pme-system-shareable',
  // 通常ビルド用の設定
  normalBuild: {
    sourceDir: './.next',
    outputDir: './temp-normal',
    zipName: 'pme-system-normal'
  },
  excludePatterns: [
    'node_modules/**',
    '.next/**',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    '.git/**',
    '.gitignore',
    '*.tmp',
    '*.temp',
    'node_modules_backup/**'
  ],
  includeFiles: [
    'package.json',
    'server.js',
    'README.md',
    'next.config.js',
    'tsconfig.json',
    'tailwind.config.js',
    'postcss.config.js',
    'start.bat',
    'start.sh',
    'data/**',
    'public/**'
  ],
  // 必須ファイル（npm installで動作するために必要）
  requiredFiles: [
    'package.json',
    'server.js',
    'next.config.js',
    'tsconfig.json',
    'tailwind.config.js',
    'postcss.config.js'
  ],
  // 推奨ファイル（あると良い）
  recommendedFiles: [
    'README.md',
    'start.bat',
    'start.sh',
    'data/achievements.db'
  ]
};

/**
 * ディレクトリが存在するかチェック
 */
function checkDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ ディレクトリが見つかりません: ${dir}`);
    process.exit(1);
  }
}

/**
 * 必要なファイルの存在確認と自動コピー
 */
function checkRequiredFiles() {
  const sourceDir = CONFIG.sourceDir;
  const mainProjectDir = './';
  const missingFiles = [];
  const missingRecommended = [];
  
  console.log('🔍 必要なファイルの存在確認中...');
  
  // 必須ファイルの確認
  for (const file of CONFIG.requiredFiles) {
    const filePath = path.join(sourceDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
      console.log(`❌ 必須ファイルが見つかりません: ${file}`);
    } else {
      console.log(`✅ 必須ファイル確認: ${file}`);
    }
  }
  
  // 推奨ファイルの確認
  for (const file of CONFIG.recommendedFiles) {
    const filePath = path.join(sourceDir, file);
    if (!fs.existsSync(filePath)) {
      missingRecommended.push(file);
      console.log(`⚠️  推奨ファイルが見つかりません: ${file}`);
    } else {
      console.log(`✅ 推奨ファイル確認: ${file}`);
    }
  }
  
  // 不足ファイルの自動コピー
  if (missingFiles.length > 0 || missingRecommended.length > 0) {
    console.log('\n🔧 不足ファイルの自動コピーを試行中...');
    
    const allMissingFiles = [...missingFiles, ...missingRecommended];
    let copiedCount = 0;
    
    for (const file of allMissingFiles) {
      const mainProjectFile = path.join(mainProjectDir, file);
      const targetFile = path.join(sourceDir, file);
      
      if (fs.existsSync(mainProjectFile)) {
        try {
          // ディレクトリを作成
          const targetDir = path.dirname(targetFile);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          
          // ファイルをコピー
          fs.copyFileSync(mainProjectFile, targetFile);
          console.log(`✅ コピー完了: ${file}`);
          copiedCount++;
          
          // 配列から削除
          const index = missingFiles.indexOf(file);
          if (index > -1) missingFiles.splice(index, 1);
          const recIndex = missingRecommended.indexOf(file);
          if (recIndex > -1) missingRecommended.splice(recIndex, 1);
          
        } catch (error) {
          console.log(`❌ コピー失敗: ${file} - ${error.message}`);
        }
      } else {
        console.log(`⚠️  メインプロジェクトにも見つかりません: ${file}`);
      }
    }
    
    if (copiedCount > 0) {
      console.log(`\n✅ ${copiedCount}個のファイルを自動コピーしました`);
    }
  }
  
  // 結果の表示
  if (missingFiles.length > 0) {
    console.log('\n🚨 必須ファイルが不足しています！');
    console.log('以下のファイルが必要です:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    console.log('\n💡 対処法:');
    console.log('   1. メインプロジェクトから必要なファイルを手動でコピーしてください');
    console.log('   2. または、create-shareable-package.jsのCONFIG.requiredFilesを確認してください');
    process.exit(1);
  }
  
  if (missingRecommended.length > 0) {
    console.log('\n⚠️  推奨ファイルが不足しています:');
    missingRecommended.forEach(file => console.log(`   - ${file}`));
    console.log('\n💡 推奨ファイルはなくても動作しますが、以下の機能が制限される可能性があります:');
    missingRecommended.forEach(file => {
      if (file.includes('README.md')) console.log('   - ドキュメント');
      if (file.includes('start.')) console.log('   - 起動スクリプト');
      if (file.includes('data/')) console.log('   - データベース');
    });
    console.log('\n続行しますか？ (y/N)');
  }
  
  console.log('✅ ファイル存在確認完了');
}

/**
 * 一時ディレクトリを作成
 */
function createTempDir() {
  const tempDir = CONFIG.outputDir;
  if (fs.existsSync(tempDir)) {
    console.log(`🗑️  既存の一時ディレクトリを削除: ${tempDir}`);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  fs.mkdirSync(tempDir, { recursive: true });
  console.log(`✅ 一時ディレクトリを作成: ${tempDir}`);
}

/**
 * ファイルをコピー（node_modules除外）
 */
function copyFiles() {
  const sourceDir = CONFIG.sourceDir;
  const tempDir = CONFIG.outputDir;
  
  console.log(`📁 ファイルをコピー中: ${sourceDir} → ${tempDir}`);
  
  // 除外パターンをチェックする関数
  function shouldExclude(filePath) {
    const relativePath = path.relative(sourceDir, filePath);
    return CONFIG.excludePatterns.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      return regex.test(relativePath);
    });
  }
  
  // 再帰的にファイルをコピー
  function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const items = fs.readdirSync(src);
      for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        if (!shouldExclude(srcPath)) {
          copyRecursive(srcPath, destPath);
        } else {
          console.log(`⏭️  除外: ${path.relative(sourceDir, srcPath)}`);
        }
      }
    } else {
      if (!shouldExclude(src)) {
        fs.copyFileSync(src, dest);
        console.log(`📄 コピー: ${path.relative(sourceDir, src)}`);
      }
    }
  }
  
  copyRecursive(sourceDir, tempDir);
  console.log('✅ ファイルコピー完了');
}

/**
 * package.jsonを更新（npm install対応）
 */
function updatePackageJson() {
  const packageJsonPath = path.join(CONFIG.outputDir, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // npm install対応のスクリプトを追加
    if (!packageJson.scripts['install-and-start']) {
      packageJson.scripts['install-and-start'] = 'npm install && npm run starts';
    }
    
    // 説明を追加
    packageJson.description = 'PMEシステム共有用パッケージ（node_modules除外版）';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ package.jsonを更新');
  }
}

/**
 * README.mdを更新
 */
function updateReadme() {
  const readmePath = path.join(CONFIG.outputDir, 'README.md');
  
  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, 'utf8');
    
    // タイトルを更新
    readme = readme.replace(
      '# PMEシステム完全自己完結型パッケージ',
      '# PMEシステム共有用パッケージ'
    );
    
    // 説明を更新
    readme = readme.replace(
      '## 🎉 2つの起動方法をサポート！',
      '## 🎉 共有用パッケージ（node_modules除外）\n\nこのパッケージはnode_modulesを除外して配布用に最適化されています。'
    );
    
    // 起動方法を更新
    readme = readme.replace(
      '### 方法1: npm install不要（推奨）',
      '### 方法1: 即座に起動（node_modulesが含まれている場合）'
    );
    
    readme = readme.replace(
      '### 方法2: npm install使用',
      '### 方法2: npm install使用（推奨）'
    );
    
    // 特徴を更新
    readme = readme.replace(
      '- ✅ **npm install不要（推奨）**',
      '- ✅ **npm install必須**'
    );
    
    readme = readme.replace(
      '- ✅ **npm install対応（オプション）**',
      '- ✅ **軽量配布**'
    );
    
    readme = readme.replace(
      '- ✅ **2つの起動方法をサポート**',
      '- ✅ **配布用最適化**'
    );
    
    fs.writeFileSync(readmePath, readme);
    console.log('✅ README.mdを更新');
  }
}

/**
 * ZIPファイルを作成
 */
function createZip() {
  const tempDir = CONFIG.outputDir;
  const zipPath = `${CONFIG.zipName}.zip`;
  
  console.log(`📦 ZIPファイルを作成中: ${zipPath}`);
  
  try {
    // zipコマンドが利用可能かチェック
    execSync('which zip', { stdio: 'ignore' });
    
    // ZIPファイルを作成
    execSync(`cd ${tempDir} && zip -r ../${zipPath} .`, { stdio: 'inherit' });
    
    console.log(`✅ ZIPファイル作成完了: ${zipPath}`);
    
    // ファイルサイズを表示
    const stats = fs.statSync(zipPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 ファイルサイズ: ${sizeInMB} MB`);
    
  } catch (error) {
    console.error('❌ ZIP作成に失敗しました:', error.message);
    console.log('💡 代替案: tar.gzファイルを作成します');
    
    try {
      execSync(`cd ${tempDir} && tar -czf ../${CONFIG.zipName}.tar.gz .`, { stdio: 'inherit' });
      console.log(`✅ tar.gzファイル作成完了: ${CONFIG.zipName}.tar.gz`);
    } catch (tarError) {
      console.error('❌ tar.gz作成も失敗しました:', tarError.message);
      process.exit(1);
    }
  }
}

/**
 * 一時ファイルをクリーンアップ
 */
function cleanup() {
  const tempDir = CONFIG.outputDir;
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('🗑️  一時ファイルをクリーンアップ');
  }
}

/**
 * 通常ビルド用パッケージ作成
 */
function createNormalBuildPackage() {
  console.log('🚀 PMEシステム通常ビルド用パッケージ作成開始');
  console.log('=====================================');
  
  const config = CONFIG.normalBuild;
  
  try {
    // 1. 通常ビルドの実行
    console.log('🔨 通常ビルドを実行中...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // 2. ソースディレクトリの存在確認
    checkDirectory(config.sourceDir);
    
    // 3. 一時ディレクトリを作成
    if (fs.existsSync(config.outputDir)) {
      fs.rmSync(config.outputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(config.outputDir, { recursive: true });
    
    // 4. 必要なファイルをコピー
    console.log(`📁 ファイルをコピー中: ${config.sourceDir} → ${config.outputDir}`);
    
    // .nextディレクトリをコピー
    execSync(`cp -r ${config.sourceDir} ${config.outputDir}/`, { stdio: 'inherit' });
    
    // その他の必要なファイルをコピー
    const additionalFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.js',
      'postcss.config.js',
      'public',
      'data'
    ];
    
    for (const file of additionalFiles) {
      if (fs.existsSync(file)) {
        execSync(`cp -r ${file} ${config.outputDir}/`, { stdio: 'inherit' });
        console.log(`📄 コピー: ${file}`);
      }
    }
    
    // 5. ZIPファイルを作成
    console.log(`📦 ZIPファイルを作成中: ${config.zipName}.zip`);
    execSync(`cd ${config.outputDir} && zip -r ../${config.zipName}.zip .`, { stdio: 'inherit' });
    
    // 6. 一時ファイルをクリーンアップ
    fs.rmSync(config.outputDir, { recursive: true, force: true });
    
    console.log('=====================================');
    console.log('🎉 通常ビルド用パッケージ作成完了！');
    console.log(`📦 作成されたファイル: ${config.zipName}.zip`);
    console.log('📋 使用方法:');
    console.log('   1. ZIPファイルを解凍');
    console.log('   2. npm install');
    console.log('   3. npm run start');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    if (fs.existsSync(config.outputDir)) {
      fs.rmSync(config.outputDir, { recursive: true, force: true });
    }
    process.exit(1);
  }
}

/**
 * メイン処理
 */
function main() {
  const args = process.argv.slice(2);
  const buildType = args[0] || 'standalone';
  
  if (buildType === 'normal') {
    createNormalBuildPackage();
  } else {
    console.log('🚀 PMEシステム共有用パッケージ作成開始');
    console.log('=====================================');
    
    try {
      // 1. ソースディレクトリの存在確認
      checkDirectory(CONFIG.sourceDir);
      
      // 2. 必要なファイルの存在確認
      checkRequiredFiles();
      
      // 3. 一時ディレクトリを作成
      createTempDir();
      
      // 4. ファイルをコピー（node_modules除外）
      copyFiles();
      
      // 5. package.jsonを更新
      updatePackageJson();
      
      // 6. README.mdを更新
      updateReadme();
      
      // 7. ZIPファイルを作成
      createZip();
      
      // 8. 一時ファイルをクリーンアップ
      cleanup();
      
      console.log('=====================================');
      console.log('🎉 共有用パッケージ作成完了！');
      console.log(`📦 作成されたファイル: ${CONFIG.zipName}.zip`);
      console.log('📋 使用方法:');
      console.log('   1. ZIPファイルを解凍');
      console.log('   2. npm install');
      console.log('   3. npm run starts');
      
    } catch (error) {
      console.error('❌ エラーが発生しました:', error.message);
      cleanup();
      process.exit(1);
    }
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { main, CONFIG };
