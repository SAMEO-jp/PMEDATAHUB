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

// ヘッダー表示タイプ
export type HeaderDisplayType = 'default' | 'dashboard' | 'project-detail';

// プロジェクト情報
export interface ProjectInfo {
  id: string;
  name: string;
  code?: string;
  description?: string;
  status?: 'active' | 'completed' | 'pending';
  startDate?: string;
  endDate?: string;
}

// ヘッダーコンポーネント設定
export interface HeaderComponentConfig {
  showTitle: boolean;
  showSubtitle: boolean;
  showBreadcrumb: boolean;
  showSearch: boolean;
  showActions: boolean;
  showUserInfo: boolean;
  showNotifications: boolean;
  showProjectInfo: boolean;
  showBackButton: boolean;
}

// ヘッダー表示設定
export interface HeaderDisplayConfig {
  displayType: HeaderDisplayType;
  title?: string;
  subtitle?: string;
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
    icon?: string;
  }>;
  searchPlaceholder?: string;
  actions?: Array<{
    id: string;
    label: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    onClick: () => void;
  }>;
}

// 状態インターフェース
interface HeaderState {
  // 表示設定
  displayType: HeaderDisplayType;
  displayConfig: HeaderDisplayConfig;
  
  // プロジェクト情報
  currentProject: ProjectInfo | null;
  
  // コンポーネント表示設定（各タイプ別）
  componentConfigs: Record<HeaderDisplayType, HeaderComponentConfig>;
  
  // UI状態
  isSearchOpen: boolean;
  searchQuery: string;
  isUserMenuOpen: boolean;
  isNotificationOpen: boolean;
  
  // カスタム設定
  customClassName: string;
}

// アクションインターフェース
interface HeaderActions {
  // 表示タイプ管理
  setDisplayType: (type: HeaderDisplayType) => void;
  
  // 表示設定管理
  setDisplayConfig: (config: Partial<HeaderDisplayConfig>) => void;
  resetDisplayConfig: () => void;
  
  // プロジェクト情報管理
  setCurrentProject: (project: ProjectInfo | null) => void;
  updateProjectInfo: (updates: Partial<ProjectInfo>) => void;
  
  // コンポーネント設定管理
  setComponentConfig: (type: HeaderDisplayType, config: Partial<HeaderComponentConfig>) => void;
  resetComponentConfig: (type: HeaderDisplayType) => void;
  
  // UI状態管理
  toggleSearch: () => void;
  setSearchQuery: (query: string) => void;
  toggleUserMenu: () => void;
  toggleNotifications: () => void;
  closeAllMenus: () => void;
  
  // カスタム設定
  setCustomClassName: (className: string) => void;
  
  // プリセット設定
  applyPreset: (type: HeaderDisplayType) => void;
}

// ==========================================
// デフォルト設定
// ==========================================

// デフォルトのコンポーネント設定
const defaultComponentConfigs: Record<HeaderDisplayType, HeaderComponentConfig> = {
  default: {
    showTitle: true,
    showSubtitle: true,
    showBreadcrumb: false,
    showSearch: true,
    showActions: true,
    showUserInfo: true,
    showNotifications: true,
    showProjectInfo: false,
    showBackButton: false,
  },
  dashboard: {
    showTitle: true,
    showSubtitle: false,
    showBreadcrumb: true,
    showSearch: true,
    showActions: true,
    showUserInfo: true,
    showNotifications: true,
    showProjectInfo: true,
    showBackButton: false,
  },
  'project-detail': {
    showTitle: true,
    showSubtitle: true,
    showBreadcrumb: true,
    showSearch: false,
    showActions: true,
    showUserInfo: true,
    showNotifications: false,
    showProjectInfo: true,
    showBackButton: true,
  },
};

// デフォルトの表示設定
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
export const useHeaderStore = create<HeaderState & HeaderActions>()(
  persist(
    (set, get) => ({
      // 初期状態
      displayType: 'default',
      displayConfig: defaultDisplayConfig,
      currentProject: null,
      componentConfigs: defaultComponentConfigs,
      isSearchOpen: false,
      searchQuery: '',
      isUserMenuOpen: false,
      isNotificationOpen: false,
      customClassName: '',

      // 表示タイプ管理
      setDisplayType: (type: HeaderDisplayType) => {
        set({ displayType: type });
        // タイプ変更時にプリセットを適用
        get().applyPreset(type);
      },

      // 表示設定管理
      setDisplayConfig: (config: Partial<HeaderDisplayConfig>) => {
        set((state) => ({
          displayConfig: { ...state.displayConfig, ...config }
        }));
      },

      resetDisplayConfig: () => {
        set({ displayConfig: defaultDisplayConfig });
      },

      // プロジェクト情報管理
      setCurrentProject: (project: ProjectInfo | null) => {
        set({ currentProject: project });
      },

      updateProjectInfo: (updates: Partial<ProjectInfo>) => {
        set((state) => ({
          currentProject: state.currentProject 
            ? { ...state.currentProject, ...updates }
            : null
        }));
      },

      // コンポーネント設定管理
      setComponentConfig: (type: HeaderDisplayType, config: Partial<HeaderComponentConfig>) => {
        set((state) => ({
          componentConfigs: {
            ...state.componentConfigs,
            [type]: { ...state.componentConfigs[type], ...config }
          }
        }));
      },

      resetComponentConfig: (type: HeaderDisplayType) => {
        set((state) => ({
          componentConfigs: {
            ...state.componentConfigs,
            [type]: defaultComponentConfigs[type]
          }
        }));
      },

      // UI状態管理
      toggleSearch: () => {
        set((state) => ({
          isSearchOpen: !state.isSearchOpen,
          searchQuery: !state.isSearchOpen ? '' : state.searchQuery,
        }));
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      toggleUserMenu: () => {
        set((state) => ({
          isUserMenuOpen: !state.isUserMenuOpen,
          isNotificationOpen: false, // 他のメニューを閉じる
        }));
      },

      toggleNotifications: () => {
        set((state) => ({
          isNotificationOpen: !state.isNotificationOpen,
          isUserMenuOpen: false, // 他のメニューを閉じる
        }));
      },

      closeAllMenus: () => {
        set({
          isUserMenuOpen: false,
          isNotificationOpen: false,
        });
      },

      // カスタム設定
      setCustomClassName: (className: string) => {
        set({ customClassName: className });
      },

      // プリセット設定
      applyPreset: (type: HeaderDisplayType) => {
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

        set((state) => ({
          displayConfig: { ...state.displayConfig, ...presets[type] }
        }));
      },
    }),
    {
      name: 'header-storage',
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
export const useHeader = () => {
  const store = useHeaderStore();
  
  return {
    // 状態
    displayType: store.displayType,
    displayConfig: store.displayConfig,
    currentProject: store.currentProject,
    componentConfig: store.componentConfigs[store.displayType],
    isSearchOpen: store.isSearchOpen,
    searchQuery: store.searchQuery,
    isUserMenuOpen: store.isUserMenuOpen,
    isNotificationOpen: store.isNotificationOpen,
    customClassName: store.customClassName,
    
    // アクション
    setDisplayType: store.setDisplayType,
    setDisplayConfig: store.setDisplayConfig,
    resetDisplayConfig: store.resetDisplayConfig,
    setCurrentProject: store.setCurrentProject,
    updateProjectInfo: store.updateProjectInfo,
    setComponentConfig: store.setComponentConfig,
    resetComponentConfig: store.resetComponentConfig,
    toggleSearch: store.toggleSearch,
    setSearchQuery: store.setSearchQuery,
    toggleUserMenu: store.toggleUserMenu,
    toggleNotifications: store.toggleNotifications,
    closeAllMenus: store.closeAllMenus,
    setCustomClassName: store.setCustomClassName,
    applyPreset: store.applyPreset,
  };
}; 