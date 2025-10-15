/**
 * ヘッダー設定マップ
 * ルートパスに基づいてヘッダーの表示内容を自動的に切り替える
 */

import { HeaderConfig } from '../types';

// ヘッダー設定の型定義
interface HeaderConfigMap {
  [key: string]: HeaderConfig;
}

/**
 * ルートパス別のヘッダー設定マップ
 * より具体的なパスが優先される
 */
export const HEADER_CONFIGS: HeaderConfigMap = {
  // ========================================
  // 実績デモ関連
  // ========================================
  '/zisseki-demo/[year]/[week]': {
    title: '実績管理',
    subtitle: '', // 動的に設定される
    actions: [
      {
        id: 'outlook-sync',
        label: 'OUTLOOK連携',
        onClick: () => {}, // 動的に設定される
        variant: 'secondary'
      },
      {
        id: 'prev-week',
        label: '← 前週',
        onClick: () => {}, // 動的に設定される
        variant: 'outline'
      },
      {
        id: 'next-week',
        label: '次週 →',
        onClick: () => {}, // 動的に設定される
        variant: 'outline'
      },
      {
        id: 'current-week',
        label: '今週',
        onClick: () => {}, // 動的に設定される
        variant: 'primary'
      },
      {
        id: 'save',
        label: '保存',
        onClick: () => {}, // 動的に設定される
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: false,
    showUserInfo: true,
    showNotifications: false
  },

  '/zisseki-demo': {
    title: '実績管理',
    subtitle: '実績データの管理',
    actions: [],
    showActions: false,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  // ========================================
  // プロジェクト管理関連
  // ========================================
  '/app_project/[project_id]/manage/member': {
    title: 'メンバー管理',
    subtitle: 'プロジェクトメンバーの管理',
    actions: [
      {
        id: 'add-member',
        label: 'メンバー追加',
        onClick: () => {},
        variant: 'primary'
      },
      {
        id: 'export-members',
        label: 'エクスポート',
        onClick: () => {},
        variant: 'outline'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/app_project/[project_id]/manage': {
    title: 'プロジェクト管理',
    subtitle: 'プロジェクトの管理機能',
    actions: [
      {
        id: 'edit-project',
        label: 'プロジェクト編集',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/app_project/[project_id]/mbom': {
    title: 'MBOM管理',
    subtitle: '製造BOMの管理',
    actions: [
      {
        id: 'add-mbom',
        label: 'MBOM追加',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/app_project/[project_id]/ebom': {
    title: 'EBOM管理',
    subtitle: '設計BOMの管理',
    actions: [
      {
        id: 'add-ebom',
        label: 'EBOM追加',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/app_project/[project_id]/zumen': {
    title: '図面管理',
    subtitle: '図面データの管理',
    actions: [
      {
        id: 'add-zumen',
        label: '図面追加',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/app_project/[project_id]/photo': {
    title: '写真管理',
    subtitle: 'プロジェクト写真の管理',
    actions: [
      {
        id: 'add-photo',
        label: '写真追加',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/app_project/[project_id]/cmom': {
    title: 'CMOM管理',
    subtitle: '構成管理BOMの管理',
    actions: [
      {
        id: 'add-cmom',
        label: 'CMOM追加',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/app_project/[project_id]/contract-management': {
    title: '契約管理',
    subtitle: 'プロジェクト契約情報の管理',
    actions: [
      {
        id: 'add-contract',
        label: '新規契約追加',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/app_project/[project_id]': {
    title: 'プロジェクト詳細',
    subtitle: 'プロジェクト情報の表示・編集',
    actions: [
      {
        id: 'edit-project',
        label: '編集',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/app_project': {
    title: 'プロジェクト一覧',
    subtitle: 'プロジェクトの一覧表示',
    actions: [
      {
        id: 'new-project',
        label: '新規プロジェクト',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  // ========================================
  // データ表示関連
  // ========================================
  '/data-display/[year]/[month]': {
    title: 'データ表示',
    subtitle: '', // 動的に設定される
    actions: [
      {
        id: 'prev-month',
        label: '← 前月',
        onClick: () => {
          // 前月ボタンの処理はHeaderContentで実装
        },
        variant: 'outline'
      },
      {
        id: 'next-month',
        label: '次月 →',
        onClick: () => {
          // 次月ボタンの処理はHeaderContentで実装
        },
        variant: 'outline'
      },
      {
        id: 'current-month',
        label: '今月',
        onClick: () => {
          // 今月ボタンの処理はHeaderContentで実装
        },
        variant: 'primary'
      },
      {
        id: 'save',
        label: 'CSVダウンロード',
        onClick: () => {
          // CSVダウンロードの処理はHeaderContentで実装
        },
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/data-display/[year]': {
    title: 'データ表示',
    subtitle: '', // 動的に設定される
    actions: [
      {
        id: 'download-csv',
        label: 'CSVダウンロード',
        onClick: () => {},
        variant: 'primary'
      },
      {
        id: 'refresh-data',
        label: 'データ更新',
        onClick: () => {},
        variant: 'outline'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/data-display': {
    title: 'データ表示',
    subtitle: 'データの表示・分析',
    actions: [
      {
        id: 'download-csv',
        label: 'CSVダウンロード',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  // ========================================
  // ユーザー管理関連
  // ========================================
  '/page/user/[user_id]/kounyu/add': {
    title: '',
    subtitle: '',
    actions: [
      {
        id: 'save-kounyu',
        label: '保存',
        onClick: () => {},
        variant: 'primary'
      },
      {
        id: 'cancel',
        label: 'キャンセル',
        onClick: () => {},
        variant: 'outline'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/page/user/[user_id]/setsubi/add/[project_id]/assign': {
    title: '',
    subtitle: '',
    actions: [
      {
        id: 'assign-setsubi',
        label: '割当実行',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/page/user/[user_id]/setsubi/add/[project_id]': {
    title: '',
    subtitle: '',
    actions: [
      {
        id: 'add-setsubi',
        label: '設備追加',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/page/user/[user_id]/setsubi/add': {
    title: '',
    subtitle: '',
    actions: [
      {
        id: 'add-setsubi',
        label: '設備追加',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/page/user/[user_id]/edit': {
    title: '',
    subtitle: '',
    breadcrumbItems: [
      { label: 'ホーム', href: '/' },
      { label: 'ユーザー一覧', href: '/page/user' },
      { label: '詳細', href: '/page/user/[user_id]' },
      { label: '編集' }
    ],
    actions: [
      {
        id: 'save-user',
        label: '保存',
        onClick: () => {},
        variant: 'primary'
      },
      {
        id: 'cancel-edit',
        label: 'キャンセル',
        onClick: () => {},
        variant: 'outline'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/page/user/[user_id]': {
    title: '',
    subtitle: '',
    breadcrumbItems: [
      { label: 'ホーム', href: '/' },
      { label: 'ユーザー一覧', href: '/page/user' },
      { label: '詳細' }
    ],
    actions: [
      {
        id: 'edit-user',
        label: '編集',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/page/user': {
    title: '',
    subtitle: '',
    breadcrumbItems: [
      { label: 'ホーム', href: '/' },
      { label: 'ユーザー一覧' }
    ],
    actions: [
      {
        id: 'new-user',
        label: '新規ユーザー',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  // ========================================
  // その他のページ
  // ========================================
  '/manage/project': {
    title: 'プロジェクト管理',
    subtitle: 'プロジェクトの管理',
    actions: [
      {
        id: 'new-project',
        label: '新規プロジェクト',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/manage/table': {
    title: 'テーブル管理',
    subtitle: 'データテーブルの管理',
    actions: [
      {
        id: 'new-table',
        label: '新規テーブル',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/box': {
    title: 'ボックス',
    subtitle: 'ファイル・データの管理',
    actions: [],
    showActions: false,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/knowledge': {
    title: 'ナレッジ',
    subtitle: '技術文書・知識の管理',
    actions: [],
    showActions: false,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/slide': {
    title: 'スライド',
    subtitle: 'プレゼンテーション資料の管理',
    actions: [
      {
        id: 'new-slide',
        label: '新規スライド',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  '/specifications': {
    title: '仕様書',
    subtitle: '仕様書の管理',
    actions: [],
    showActions: false,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  // ========================================
  // 出荷案内書作成関連
  // ========================================
  '/shipping-guidance': {
    title: '出荷案内書作成',
    subtitle: '出荷案内書の作成と管理',
    actions: [
      {
        id: 'new-shipping-guidance',
        label: '新規作成',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },

  // ========================================
  // デフォルト設定
  // ========================================
  default: {
    actions: [],
    showActions: false,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  }
};

/**
 * パスからヘッダー設定を取得する関数
 * @param pathname 現在のパス
 * @returns ヘッダー設定
 */
export function getHeaderConfigByPath(pathname: string): HeaderConfig {
  // 1. 完全一致を優先
  if (HEADER_CONFIGS[pathname]) {
    return HEADER_CONFIGS[pathname];
  }

  // 2. 動的ルートのパターンマッチング
  for (const [pattern, config] of Object.entries(HEADER_CONFIGS)) {
    if (pattern.includes('[') && pattern.includes(']')) {
      // 動的ルートのパターンマッチング
      const regex = new RegExp(
        '^' + pattern.replace(/\[.*?\]/g, '[^/]+') + '$'
      );
      if (regex.test(pathname)) {
        return config;
      }
    }
  }

  // 3. 部分一致（階層の親を探す）
  const pathSegments = pathname.split('/').filter(Boolean);
  for (let i = pathSegments.length; i > 0; i--) {
    const partialPath = '/' + pathSegments.slice(0, i).join('/');
    if (HEADER_CONFIGS[partialPath]) {
      return HEADER_CONFIGS[partialPath];
    }
  }

  // 4. デフォルト設定を返す
  return HEADER_CONFIGS.default;
}

/**
 * 動的パラメータを抽出してヘッダー設定をカスタマイズする関数
 * @param pathname 現在のパス
 * @param baseConfig ベースとなるヘッダー設定
 * @returns カスタマイズされたヘッダー設定
 */
export function customizeHeaderConfig(pathname: string, baseConfig: HeaderConfig): HeaderConfig {
  // 実績デモページの動的パラメータ処理
  const zissekiMatch = pathname.match(/\/zisseki-demo\/(\d+)\/(\d+)/);
  if (zissekiMatch) {
    const [, year, week] = zissekiMatch;
    return {
      ...baseConfig,
      subtitle: `${year}年 第${week}週`
    };
  }

  // データ表示ページの動的パラメータ処理
  const dataDisplayYearMonthMatch = pathname.match(/\/data-display\/(\d+)\/(\d+)/);
  if (dataDisplayYearMonthMatch) {
    const [, year, month] = dataDisplayYearMonthMatch;
    const monthNames = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ];
    const monthName = monthNames[parseInt(month) - 1];
    return {
      ...baseConfig,
      subtitle: `${year}年 ${monthName}のデータ`
    };
  }

  const dataDisplayYearMatch = pathname.match(/\/data-display\/(\d+)/);
  if (dataDisplayYearMatch) {
    const [, year] = dataDisplayYearMatch;
    return {
      ...baseConfig,
      subtitle: `${year}年のデータ表示`
    };
  }

  return baseConfig;
}
