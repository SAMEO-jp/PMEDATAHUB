// ==========================================
// ファイル名: headerStore.ts
// 機能: ヘッダー表示状態管理（Zustand）
// 技術: Zustand, persist middleware
// 作成日: 2024-12-19
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==========================================
// 型定義層
// ==========================================

/**
 * ヘッダー表示タイプ
 * - default: 標準的なヘッダー表示
 * - dashboard: ダッシュボード用の表示（プロジェクト情報表示）
 * - project-detail: プロジェクト詳細ページ用の表示（戻るボタン付き）
 */
export type HeaderDisplayType = 'default' | 'dashboard' | 'project-detail';

/**
 * プロジェクト情報インターフェース
 * 現在選択されているプロジェクトの詳細情報を保持
 */
export interface ProjectInfo {
  id: string;                                    // プロジェクトID
  name: string;                                  // プロジェクト名
  code?: string;                                 // プロジェクトコード（任意）
  description?: string;                          // プロジェクト説明（任意）
  status?: 'active' | 'completed' | 'pending';  // プロジェクトステータス
  startDate?: string;                            // 開始日（任意）
  endDate?: string;                              // 終了日（任意）
}

/**
 * ヘッダーコンポーネント設定
 * 各表示タイプごとに、どのコンポーネントを表示するかを制御
 */
export interface HeaderComponentConfig {
  showTitle: boolean;         // タイトル表示
  showSubtitle: boolean;      // サブタイトル表示
  showBreadcrumb: boolean;    // パンくずリスト表示
  showSearch: boolean;        // 検索機能表示
  showActions: boolean;       // アクションボタン表示
  showUserInfo: boolean;      // ユーザー情報表示
  showNotifications: boolean; // 通知表示
  showProjectInfo: boolean;   // プロジェクト情報表示
  showBackButton: boolean;    // 戻るボタン表示
}

/**
 * ヘッダー表示設定
 * 実際に表示されるコンテンツの詳細設定
 */
export interface HeaderDisplayConfig {
  displayType: HeaderDisplayType;  // 表示タイプ
  title?: string;                  // タイトル文字列
  titleSuffix?: string;            // タイトル後の追加テキスト（例：「＞ 詳細」）
  subtitle?: string;               // サブタイトル文字列
  breadcrumbItems?: Array<{        // パンくずリストのアイテム
    label: string;                 // 表示ラベル
    href?: string;                 // リンク先URL（任意）
    icon?: string;                 // アイコン名（任意）
  }>;
  searchPlaceholder?: string;      // 検索フィールドのプレースホルダー
  actions?: Array<{               // アクションボタンの設定
    id: string;                   // ボタンID
    label: string;                // ボタンラベル
    icon?: string;                // アイコン名（任意）
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // ボタンの見た目
    onClick: () => void;          // クリック時の処理
  }>;
  customComponents?: {             // カスタムコンポーネントの配置
    center?: React.ReactNode;      // 中央に配置するコンポーネント
    right?: React.ReactNode;       // 右側に配置するコンポーネント（アクションより前）
  };
}

/**
 * ヘッダー状態インターフェース
 * ストアで管理する全ての状態を定義
 */
interface HeaderState {
  // === 表示設定 ===
  displayType: HeaderDisplayType;                              // 現在の表示タイプ
  displayConfig: HeaderDisplayConfig;                          // 現在の表示設定
  
  // === プロジェクト情報 ===
  currentProject: ProjectInfo | null;                          // 現在選択されているプロジェクト
  
  // === コンポーネント表示設定（各タイプ別） ===
  componentConfigs: Record<HeaderDisplayType, HeaderComponentConfig>; // 各表示タイプの設定
  
  // === UI状態 ===
  isSearchOpen: boolean;        // 検索フィールドの開閉状態
  searchQuery: string;          // 検索クエリ
  isUserMenuOpen: boolean;      // ユーザーメニューの開閉状態
  isNotificationOpen: boolean;  // 通知メニューの開閉状態
  
  // === カスタム設定 ===
  customClassName: string;      // カスタムCSSクラス名
  
  // === カスタムコンポーネント ===
  customComponents: {           // カスタムコンポーネントの配置
    center?: React.ReactNode;   // 中央に配置するコンポーネント
    right?: React.ReactNode;    // 右側に配置するコンポーネント
  };
}

/**
 * ヘッダーアクションインターフェース
 * ストアで提供する全てのアクション（状態変更メソッド）を定義
 */
interface HeaderActions {
  // === 表示タイプ管理 ===
  setDisplayType: (type: HeaderDisplayType) => void;  // 表示タイプを変更
  
  // === 表示設定管理 ===
  setDisplayConfig: (config: Partial<HeaderDisplayConfig>) => void;  // 表示設定を更新
  resetDisplayConfig: () => void;                                     // 表示設定をリセット
  
  // === プロジェクト情報管理 ===
  setCurrentProject: (project: ProjectInfo | null) => void;        // 現在のプロジェクトを設定
  updateProjectInfo: (updates: Partial<ProjectInfo>) => void;      // プロジェクト情報を部分更新
  
  // === コンポーネント設定管理 ===
  setComponentConfig: (config: Partial<HeaderComponentConfig>) => void;  // 現在の表示タイプのコンポーネント設定を更新
  setComponentConfigByType: (type: HeaderDisplayType, config: Partial<HeaderComponentConfig>) => void;  // 特定の表示タイプのコンポーネント設定を更新
  resetComponentConfig: (type: HeaderDisplayType) => void;                                         // コンポーネント設定をリセット
  
  // === UI状態管理 ===
  toggleSearch: () => void;         // 検索フィールドの開閉切り替え
  setSearchQuery: (query: string) => void;  // 検索クエリを設定
  toggleUserMenu: () => void;       // ユーザーメニューの開閉切り替え
  toggleNotifications: () => void;  // 通知メニューの開閉切り替え
  closeAllMenus: () => void;        // 全てのメニューを閉じる
  
  // === カスタム設定 ===
  setCustomClassName: (className: string) => void;  // カスタムCSSクラス名を設定
  
  // === カスタムコンポーネント管理 ===
  setCustomComponents: (components: { center?: React.ReactNode; right?: React.ReactNode }) => void;  // カスタムコンポーネントを設定
  clearCustomComponents: () => void;  // カスタムコンポーネントをクリア
  
  // === プリセット設定 ===
  applyPreset: (type: HeaderDisplayType) => void;  // 表示タイプに応じたプリセット設定を適用
}

// ==========================================
// デフォルト設定
// ==========================================

/**
 * デフォルトのコンポーネント設定
 * 各表示タイプごとに、どのコンポーネントを表示するかのデフォルト設定
 */
const defaultComponentConfigs: Record<HeaderDisplayType, HeaderComponentConfig> = {
  // 標準ヘッダー: 基本的な機能をすべて表示
  default: {
    showTitle: true,
    showSubtitle: false,        // サブタイトルは非表示
    showBreadcrumb: false,      // パンくずリストは非表示
    showSearch: true,
    showActions: true,
    showUserInfo: true,
    showNotifications: true,
    showProjectInfo: false,     // プロジェクト情報は非表示
    showBackButton: false,      // 戻るボタンは非表示
  },
  
  // ダッシュボード: プロジェクト情報とパンくずリストを表示
  dashboard: {
    showTitle: true,
    showSubtitle: false,        // サブタイトルは非表示
    showBreadcrumb: true,       // パンくずリストを表示
    showSearch: true,
    showActions: true,
    showUserInfo: true,
    showNotifications: true,
    showProjectInfo: true,      // プロジェクト情報を表示
    showBackButton: false,
  },
  
  // プロジェクト詳細: 戻るボタンを表示、通知は非表示
  'project-detail': {
    showTitle: true,
    showSubtitle: false,        // サブタイトルは非表示
    showBreadcrumb: true,
    showSearch: false,          // 検索機能は非表示
    showActions: true,
    showUserInfo: true,
    showNotifications: false,   // 通知は非表示
    showProjectInfo: true,
    showBackButton: true,       // 戻るボタンを表示
  },
};

/**
 * デフォルトの表示設定
 * 初期化時に使用される基本的な表示設定
 */
const defaultDisplayConfig: HeaderDisplayConfig = {
  displayType: 'default',
  title: 'アプリケーション',
  subtitle: '',
  breadcrumbItems: [],
  searchPlaceholder: '検索...',
  actions: [],
};

// ==========================================
// Zustandストア定義
// ==========================================

/**
 * ヘッダー状態管理ストア
 * Zustandのcreateとpersistミドルウェアを使用して、
 * 状態の管理とローカルストレージへの永続化を実現
 */
export const useHeaderStore = create<HeaderState & HeaderActions>()(
  persist(
    (set, get) => ({
      // === 初期状態 ===
      displayType: 'default',
      displayConfig: defaultDisplayConfig,
      currentProject: null,
      componentConfigs: defaultComponentConfigs,
      isSearchOpen: false,
      searchQuery: '',
      isUserMenuOpen: false,
      isNotificationOpen: false,
      customClassName: '',
      customComponents: {},

      // === 表示タイプ管理 ===
      /**
       * 表示タイプを変更し、対応するプリセットを適用
       * @param type 新しい表示タイプ
       */
      setDisplayType: (type: HeaderDisplayType) => {
        set({ displayType: type });
        // タイプ変更時にプリセットを自動適用
        get().applyPreset(type);
      },

      // === 表示設定管理 ===
      /**
       * 表示設定を部分更新
       * @param config 更新する設定項目
       */
      setDisplayConfig: (config: Partial<HeaderDisplayConfig>) => {
        set((state) => ({
          displayConfig: { ...state.displayConfig, ...config }
        }));
      },

      /**
       * 表示設定をデフォルト値にリセット
       */
      resetDisplayConfig: () => {
        set({ displayConfig: defaultDisplayConfig });
      },

      // === プロジェクト情報管理 ===
      /**
       * 現在のプロジェクトを設定
       * @param project 設定するプロジェクト情報（nullで解除）
       */
      setCurrentProject: (project: ProjectInfo | null) => {
        set({ currentProject: project });
      },

      /**
       * 現在のプロジェクト情報を部分更新
       * @param updates 更新する項目
       */
      updateProjectInfo: (updates: Partial<ProjectInfo>) => {
        set((state) => ({
          currentProject: state.currentProject 
            ? { ...state.currentProject, ...updates }
            : null
        }));
      },

      // === コンポーネント設定管理 ===
      /**
       * 現在の表示タイプのコンポーネント設定を更新
       * @param config 更新する設定項目
       */
      setComponentConfig: (config: Partial<HeaderComponentConfig>) => {
        set((state) => ({
          componentConfigs: {
            ...state.componentConfigs,
            [state.displayType]: { ...state.componentConfigs[state.displayType], ...config }
          }
        }));
      },

      /**
       * 特定の表示タイプのコンポーネント設定を更新
       * @param type 対象の表示タイプ
       * @param config 更新する設定項目
       */
      setComponentConfigByType: (type: HeaderDisplayType, config: Partial<HeaderComponentConfig>) => {
        set((state) => ({
          componentConfigs: {
            ...state.componentConfigs,
            [type]: { ...state.componentConfigs[type], ...config }
          }
        }));
      },

      /**
       * 特定の表示タイプのコンポーネント設定をデフォルトにリセット
       * @param type 対象の表示タイプ
       */
      resetComponentConfig: (type: HeaderDisplayType) => {
        set((state) => ({
          componentConfigs: {
            ...state.componentConfigs,
            [type]: defaultComponentConfigs[type]
          }
        }));
      },

      // === UI状態管理 ===
      /**
       * 検索フィールドの開閉を切り替え
       * 閉じる時は検索クエリもクリア
       */
      toggleSearch: () => {
        set((state) => ({
          isSearchOpen: !state.isSearchOpen,
          searchQuery: !state.isSearchOpen ? '' : state.searchQuery,
        }));
      },

      /**
       * 検索クエリを設定
       * @param query 検索クエリ文字列
       */
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      /**
       * ユーザーメニューの開閉を切り替え
       * 開く時は他のメニューを閉じる
       */
      toggleUserMenu: () => {
        set((state) => ({
          isUserMenuOpen: !state.isUserMenuOpen,
          isNotificationOpen: false, // 他のメニューを閉じる
        }));
      },

      /**
       * 通知メニューの開閉を切り替え
       * 開く時は他のメニューを閉じる
       */
      toggleNotifications: () => {
        set((state) => ({
          isNotificationOpen: !state.isNotificationOpen,
          isUserMenuOpen: false, // 他のメニューを閉じる
        }));
      },

      /**
       * 全てのメニューを閉じる
       * 外部クリック時などに使用
       */
      closeAllMenus: () => {
        set({
          isUserMenuOpen: false,
          isNotificationOpen: false,
        });
      },

      // === カスタム設定 ===
      /**
       * カスタムCSSクラス名を設定
       * @param className 設定するCSSクラス名
       */
      setCustomClassName: (className: string) => {
        set({ customClassName: className });
      },

      // === カスタムコンポーネント管理 ===
      /**
       * カスタムコンポーネントを設定
       * @param components 設定するコンポーネント
       */
      setCustomComponents: (components: { center?: React.ReactNode; right?: React.ReactNode }) => {
        set({ customComponents: components });
      },

      /**
       * カスタムコンポーネントをクリア
       */
      clearCustomComponents: () => {
        set({ customComponents: {} });
      },

      // === プリセット設定 ===
      /**
       * 表示タイプに応じたプリセット設定を適用
       * @param type 適用する表示タイプ
       */
      applyPreset: (type: HeaderDisplayType) => {
        // 各表示タイプのプリセット設定
        const presets: Record<HeaderDisplayType, Partial<HeaderDisplayConfig>> = {
          default: {
            displayType: 'default',
            title: 'アプリケーション',
            subtitle: '',
            searchPlaceholder: '検索...',
          },
          dashboard: {
            displayType: 'dashboard',
            title: 'ダッシュボード',
            subtitle: '',
            searchPlaceholder: 'プロジェクトを検索...',
          },
          'project-detail': {
            displayType: 'project-detail',
            title: 'プロジェクト詳細',
            subtitle: '',
            searchPlaceholder: '',
          },
        };

        // プリセット設定を現在の設定にマージ
        set((state) => ({
          displayConfig: { ...state.displayConfig, ...presets[type] }
        }));
      },
    }),
    {
      // === 永続化設定 ===
      name: 'header-storage',  // ローカルストレージのキー名
      
      /**
       * 永続化する状態を選択
       * UI状態（メニューの開閉など）は永続化しない
       */
      partialize: (state) => ({
        displayType: state.displayType,
        displayConfig: state.displayConfig,
        currentProject: state.currentProject,
        componentConfigs: state.componentConfigs,
        customClassName: state.customClassName,
      }),
    }
  )
);

// ==========================================
// カスタムフック（利便性向上）
// ==========================================

/**
 * ヘッダー状態管理のカスタムフック
 * useHeaderStoreの状態とアクションを使いやすい形で提供
 * 
 * @returns ヘッダー状態とアクションのオブジェクト
 * 
 * @example
 * ```typescript
 * const { 
 *   displayType, 
 *   componentConfig, 
 *   setDisplayType,
 *   setCurrentProject 
 * } = useHeader();
 * 
 * // 表示タイプ変更
 * setDisplayType('dashboard');
 * 
 * // プロジェクト設定
 * setCurrentProject({ id: '1', name: 'プロジェクトA' });
 * ```
 */
export const useHeader = () => {
  const store = useHeaderStore();
  
  return {
    // === 状態（読み取り専用） ===
    displayType: store.displayType,                           // 現在の表示タイプ
    displayConfig: store.displayConfig,                       // 現在の表示設定
    currentProject: store.currentProject,                     // 現在のプロジェクト
    componentConfig: store.componentConfigs[store.displayType], // 現在の表示タイプのコンポーネント設定
    isSearchOpen: store.isSearchOpen,                         // 検索フィールドの開閉状態
    searchQuery: store.searchQuery,                           // 検索クエリ
    isUserMenuOpen: store.isUserMenuOpen,                     // ユーザーメニューの開閉状態
    isNotificationOpen: store.isNotificationOpen,             // 通知メニューの開閉状態
    customClassName: store.customClassName,                   // カスタムCSSクラス名
    customComponents: store.customComponents,                 // カスタムコンポーネント
    
    // === アクション（状態変更） ===
    setDisplayType: store.setDisplayType,                     // 表示タイプ変更
    setDisplayConfig: store.setDisplayConfig,                 // 表示設定更新
    resetDisplayConfig: store.resetDisplayConfig,             // 表示設定リセット
    setCurrentProject: store.setCurrentProject,               // プロジェクト設定
    updateProjectInfo: store.updateProjectInfo,               // プロジェクト情報更新
    setComponentConfig: store.setComponentConfig,             // 現在の表示タイプのコンポーネント設定更新
    setComponentConfigByType: store.setComponentConfigByType, // 特定の表示タイプのコンポーネント設定更新
    resetComponentConfig: store.resetComponentConfig,         // コンポーネント設定リセット
    toggleSearch: store.toggleSearch,                         // 検索フィールド開閉
    setSearchQuery: store.setSearchQuery,                     // 検索クエリ設定
    toggleUserMenu: store.toggleUserMenu,                     // ユーザーメニュー開閉
    toggleNotifications: store.toggleNotifications,           // 通知メニュー開閉
    closeAllMenus: store.closeAllMenus,                       // 全メニュー閉じる
    setCustomClassName: store.setCustomClassName,             // カスタムクラス設定
    setCustomComponents: store.setCustomComponents,           // カスタムコンポーネント設定
    clearCustomComponents: store.clearCustomComponents,       // カスタムコンポーネントクリア
    applyPreset: store.applyPreset,                           // プリセット適用
  };
};