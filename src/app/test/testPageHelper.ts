import { addTestPage, type TestPageConfig } from './test-pages-config';

/**
 * 新しいテストページを簡単に追加するヘルパー関数
 */
export class TestPageHelper {
  /**
   * APIテストページを追加
   */
  static addApiTestPage(path: string, title: string, description: string) {
    addTestPage({
      path,
      title,
      description,
      category: 'API'
    });
  }

  /**
   * BOMテストページを追加
   */
  static addBomTestPage(path: string, title: string, description: string) {
    addTestPage({
      path,
      title,
      description,
      category: 'BOM'
    });
  }

  /**
   * KONPOテストページを追加
   */
  static addKonpoTestPage(path: string, title: string, description: string) {
    addTestPage({
      path,
      title,
      description,
      category: 'KONPO'
    });
  }

  /**
   * テーブル管理テストページを追加
   */
  static addTableManagementTestPage(path: string, title: string, description: string) {
    addTestPage({
      path,
      title,
      description,
      category: 'テーブル管理'
    });
  }

  /**
   * カスタムカテゴリのテストページを追加
   */
  static addCustomTestPage(path: string, title: string, description: string, category: string) {
    addTestPage({
      path,
      title,
      description,
      category
    });
  }
}

/**
 * テストページ作成のテンプレート
 */
export const testPageTemplates = {
  /**
   * tRPC APIテストページのテンプレート
   */
  trpcApi: {
    title: (name: string) => `${name} APIテスト`,
    description: (name: string) => `${name}のtRPC APIテストページ`,
    category: 'API'
  },

  /**
   * BOMテストページのテンプレート
   */
  bom: {
    title: (name: string) => `${name}テスト`,
    description: (name: string) => `${name}のテストページ`,
    category: 'BOM'
  },

  /**
   * KONPOテストページのテンプレート
   */
  konpo: {
    title: (name: string) => `${name}テスト`,
    description: (name: string) => `${name}のテストページ`,
    category: 'KONPO'
  }
};

/**
 * テストページを一括で追加
 */
export function addTestPages(pages: TestPageConfig[]) {
  pages.forEach(page => addTestPage(page));
}

/**
 * テストページの存在確認
 */
export function hasTestPage(path: string): boolean {
  // 実際の実装では、設定ファイルをチェックする
  return false;
} 