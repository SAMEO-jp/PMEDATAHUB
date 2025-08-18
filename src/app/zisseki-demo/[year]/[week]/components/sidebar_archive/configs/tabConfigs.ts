import { TabConfig, HierarchicalTabConfig } from '../components/TabNavigation';

// ========================================
// レベル1: メインタブ設定
// ========================================
export const mainTabConfig: TabConfig[] = [
  {
    id: 'project',
    label: 'プロジェクト',
    icon: '📋'
  },
  {
    id: 'indirect',
    label: '間接業務',
    icon: '⚙️'
  }
];

// ========================================
// レベル2: プロジェクトサブタブ設定
// ========================================
export const projectSubTabConfig: TabConfig[] = [
  {
    id: '計画',
    label: '計画',
    icon: '📊'
  },
  {
    id: '設計',
    label: '設計',
    icon: '✏️'
  },
  {
    id: '会議',
    label: '会議',
    icon: '🤝'
  },
  {
    id: '購入品',
    label: '購入品',
    icon: '🛒'
  },
  {
    id: 'その他',
    label: 'その他',
    icon: '📝'
  }
];

// ========================================
// レベル2: 間接業務サブタブ設定
// ========================================
export const indirectSubTabConfig: TabConfig[] = [
  {
    id: '純間接',
    label: '純間接',
    icon: '📋'
  },
  {
    id: '目的間接',
    label: '目的間接',
    icon: '🎯'
  },
  {
    id: '控除時間',
    label: '控除時間',
    icon: '⏰'
  }
];

// ========================================
// レベル3: 詳細タブ設定
// ========================================
export const detailTabConfigs = {
  // 計画の詳細タブ
  計画: [
    { id: '計画図', label: '計画図', icon: '📐' },
    { id: '検討書', label: '検討書', icon: '📄' },
    { id: '見積り', label: '見積り', icon: '💰' }
  ],
  
  // 設計の詳細タブ
  設計: [
    { id: '計画図', label: '計画図', icon: '📐' },
    { id: '詳細図', label: '詳細図', icon: '🔍' },
    { id: '組立図', label: '組立図', icon: '🔧' },
    { id: '改正図', label: '改正図', icon: '✏️' }
  ],
  
  // 会議の詳細タブ
  会議: [
    { id: '内部定例', label: '内部定例', icon: '🏢' },
    { id: '外部定例', label: '外部定例', icon: '🤝' },
    { id: 'プロ進行', label: 'プロ進行', icon: '📈' },
    { id: 'その他', label: 'その他', icon: '📝' }
  ],
  
  // その他の詳細タブ
  その他: [
    { id: '出張', label: '出張', icon: '✈️' },
    { id: '〇対応', label: '〇対応', icon: '✅' },
    { id: 'プロ管理', label: 'プロ管理', icon: '📊' },
    { id: '資料', label: '資料', icon: '📚' },
    { id: 'その他', label: 'その他', icon: '📝' }
  ],
  
  // 購入品の詳細タブ
  購入品: [
    { id: '設備', label: '設備', icon: '🔧' },
    { id: '材料', label: '材料', icon: '📦' },
    { id: 'サービス', label: 'サービス', icon: '🛠️' }
  ],
  
  // 純間接の詳細タブ
  純間接: [
    { id: '日報入力', label: '日報入力', icon: '📝' },
    { id: '報告書作成', label: '報告書作成', icon: '📄' },
    { id: 'その他', label: 'その他', icon: '📋' }
  ],
  
  // 目的間接の詳細タブ
  目的間接: [
    { id: '〇先対応', label: '〇先対応', icon: '🎯' },
    { id: '品質管理', label: '品質管理', icon: '🔍' },
    { id: '安全管理', label: '安全管理', icon: '🛡️' }
  ],
  
  // 控除時間の詳細タブ
  控除時間: [
    { id: '休憩', label: '休憩', icon: '☕' },
    { id: '私用', label: '私用', icon: '👤' },
    { id: 'その他', label: 'その他', icon: '⏰' }
  ]
};

// ========================================
// 階層タブ設定の作成関数
// ========================================
export const createHierarchicalTabConfig = (
  level1Id: string,
  level2Id?: string,
  level3Id?: string
): HierarchicalTabConfig => {
  const config: HierarchicalTabConfig = {
    level1: {
      id: level1Id,
      label: mainTabConfig.find(tab => tab.id === level1Id)?.label || level1Id,
      icon: mainTabConfig.find(tab => tab.id === level1Id)?.icon
    }
  };

  // レベル2の設定
  if (level2Id) {
    const level2Tabs = level1Id === 'project' ? projectSubTabConfig : indirectSubTabConfig;
    config.level2 = {
      id: level2Id,
      label: level2Tabs.find(tab => tab.id === level2Id)?.label || level2Id,
      icon: level2Tabs.find(tab => tab.id === level2Id)?.icon,
      tabs: level2Tabs
    };
  }

  // レベル3の設定
  if (level3Id && level2Id) {
    const level3Tabs = detailTabConfigs[level2Id as keyof typeof detailTabConfigs] || [];
    config.level3 = {
      id: level3Id,
      label: level3Tabs.find(tab => tab.id === level3Id)?.label || level3Id,
      icon: level3Tabs.find(tab => tab.id === level3Id)?.icon,
      tabs: level3Tabs
    };
  }

  return config;
};

// ========================================
// タブ設定の取得関数
// ========================================
export const getTabConfigs = {
  // メインタブ取得
  getMainTabs: () => mainTabConfig,
  
  // プロジェクトサブタブ取得
  getProjectSubTabs: () => projectSubTabConfig,
  
  // 間接業務サブタブ取得
  getIndirectSubTabs: () => indirectSubTabConfig,
  
  // 詳細タブ取得
  getDetailTabs: (subTabId: string) => {
    return detailTabConfigs[subTabId as keyof typeof detailTabConfigs] || [];
  },
  
  // 階層設定取得
  getHierarchicalConfig: createHierarchicalTabConfig
};
