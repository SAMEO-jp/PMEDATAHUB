import fs from 'fs';
import path from 'path';

export interface TestPageInfo {
  path: string;
  title: string;
  description: string;
  category: string;
}

/**
 * テストページのディレクトリを自動検出
 * @param baseDir 検索するベースディレクトリ
 * @returns 検出されたテストページの情報
 */
export function discoverTestPages(baseDir: string = 'src/app/test'): TestPageInfo[] {
  const testPages: TestPageInfo[] = [];
  
  try {
    const scanDirectory = (dir: string, relativePath: string = '') => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // page.tsxファイルが存在するかチェック
          const pagePath = path.join(fullPath, 'page.tsx');
          if (fs.existsSync(pagePath)) {
            // テストページとして認識
            const pageInfo = extractPageInfo(fullPath, relativePath, item);
            if (pageInfo) {
              testPages.push(pageInfo);
            }
          } else {
            // サブディレクトリを再帰的にスキャン
            const newRelativePath = relativePath ? `${relativePath}/${item}` : item;
            scanDirectory(fullPath, newRelativePath);
          }
        }
      }
    };
    
    scanDirectory(baseDir);
  } catch (error) {
    console.error('テストページの検出中にエラーが発生しました:', error);
  }
  
  return testPages;
}

/**
 * ページ情報を抽出
 */
function extractPageInfo(dirPath: string, relativePath: string, dirName: string): TestPageInfo | null {
  try {
    const pagePath = path.join(dirPath, 'page.tsx');
    const content = fs.readFileSync(pagePath, 'utf-8');
    
    // ファイル名からタイトルを生成
    const title = generateTitleFromPath(dirName);
    
    // カテゴリを判定
    const category = determineCategory(dirName, content);
    
    // 説明を生成
    const description = generateDescription(dirName, content);
    
    return {
      path: `/test/${relativePath || dirName}`,
      title,
      description,
      category
    };
  } catch (error) {
    console.error(`ページ情報の抽出に失敗しました: ${dirPath}`, error);
    return null;
  }
}

/**
 * パスからタイトルを生成
 */
function generateTitleFromPath(path: string): string {
  // ケバブケースをスペース区切りに変換
  const words = path
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  
  return words.join(' ');
}

/**
 * カテゴリを判定
 */
function determineCategory(dirName: string, content: string): string {
  const lowerDirName = dirName.toLowerCase();
  const lowerContent = content.toLowerCase();
  
  if (lowerDirName.includes('api') || lowerContent.includes('api')) {
    return 'API';
  }
  
  if (lowerDirName.includes('bom') || lowerContent.includes('bom')) {
    return 'BOM';
  }
  
  if (lowerDirName.includes('konpo') || lowerContent.includes('konpo')) {
    return 'KONPO';
  }
  
  if (lowerDirName.includes('table') || lowerContent.includes('table')) {
    return 'テーブル管理';
  }
  
  return 'その他';
}

/**
 * 説明を生成
 */
function generateDescription(dirName: string, _content: string): string {
  const lowerDirName = dirName.toLowerCase();
  
  if (lowerDirName.includes('trpc')) {
    return `${generateTitleFromPath(dirName)}のtRPC APIテストページ`;
  }
  
  if (lowerDirName.includes('bom')) {
    return `${generateTitleFromPath(dirName)}のテストページ`;
  }
  
  if (lowerDirName.includes('konpo')) {
    return `${generateTitleFromPath(dirName)}のテストページ`;
  }
  
  return `${generateTitleFromPath(dirName)}のテストページ`;
}

/**
 * 設定ファイルを自動更新
 */
export function updateTestPagesConfig(): void {
  try {
    const discoveredPages = discoverTestPages();
    const configPath = './test-pages-config.ts';
    
    // 既存の設定を読み込み
    const existingConfig = fs.readFileSync(configPath, 'utf-8');
    
    // 新しいページを追加
    const newPages = discoveredPages.filter(page => {
      // 既存の設定に含まれていないページのみ
      return !existingConfig.includes(`'${page.path}'`);
    });
    
    if (newPages.length > 0) {
      console.log('新しいテストページを検出しました:', newPages.map(p => p.path));
      
      // 設定ファイルを更新するロジックをここに実装
      // 実際の実装では、より安全な方法でファイルを更新する必要があります
    }
  } catch (error) {
    console.error('設定ファイルの更新に失敗しました:', error);
  }
} 