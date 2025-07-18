export interface TestPageConfig {
  path: string;
  title: string;
  description: string;
  category?: string;
}

export const testPagesConfig: TestPageConfig[] = [
  {
    path: '/test/test-table-management-trpc',
    title: 'テーブル管理APIテスト',
    description: 'テーブル一覧・削除・複数削除のAPIテストページ',
    category: 'API'
  },
  {
    path: '/test/test-konpo-palet-trpc',
    title: 'KONPO_PALET APIテスト',
    description: 'KONPO_PALET/KONPO_PALET_MASTERのAPIテストページ',
    category: 'API'
  },
  {
    path: '/test/test-bom-zumen-trpc',
    title: 'BOM_ZUMEN APIテスト',
    description: 'BOM_ZUMENテーブルのCRUD操作APIテストページ',
    category: 'BOM'
  },
  {
    path: '/test/test-bom-buhin',
    title: 'BOM部品テスト',
    description: 'BOM部品のテストページ',
    category: 'BOM'
  },
  {
    path: '/test/test-project-dashboard',
    title: 'プロジェクト管理ダッシュボード',
    description: 'プロジェクト管理用のダッシュボードUIテストページ',
    category: 'UI'
  },
  {
    path: '/test/test-ui-layout',
    title: 'UIレイアウトテスト',
    description: 'サイドバー・ヘッダー・メインコンテンツのレイアウトテストページ',
    category: 'UI'
  },
  {
    path: '/test/test-table-management',
    title: 'テーブル管理UIテスト',
    description: 'テーブル一覧・検索・一括削除のUIテストページ',
    category: 'UI'
  }
];

/**
 * カテゴリ別にテストページをグループ化
 */
export const getTestPagesByCategory = () => {
  const grouped = testPagesConfig.reduce((acc, page) => {
    const category = page.category || 'その他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(page);
    return acc;
  }, {} as Record<string, TestPageConfig[]>);

  return grouped;
};

/**
 * 新しいテストページを追加する関数
 */
export const addTestPage = (config: TestPageConfig) => {
  // 重複チェック
  const exists = testPagesConfig.some(page => page.path === config.path);
  if (!exists) {
    testPagesConfig.push(config);
  }
}; 