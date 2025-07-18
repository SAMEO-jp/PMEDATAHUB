import { ReactNode } from 'react';

// ヘッダーの基本設定インターフェース
export interface HeaderConfig {
  // 基本設定
  title?: string;
  subtitle?: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: BreadcrumbItem[];
  
  // アクションボタン
  actions?: HeaderAction[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  
  // 表示制御
  showUserInfo?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  
  // カスタマイズ
  className?: string;
  children?: ReactNode;
}

// パンくずリストアイテム
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

// ヘッダーアクション
export interface HeaderAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// ヘッダーの状態
export interface HeaderState {
  isSearchOpen: boolean;
  searchQuery: string;
  isUserMenuOpen: boolean;
  isNotificationOpen: boolean;
}

// ヘッダーのコンテキスト
export interface HeaderContextType {
  config: HeaderConfig;
  state: HeaderState;
  actions: {
    toggleSearch: () => void;
    setSearchQuery: (query: string) => void;
    toggleUserMenu: () => void;
    toggleNotifications: () => void;
  };
}

// ヘッダーパターンの種類
export type HeaderPattern = 
  | 'default'
  | 'dashboard'
  | 'list'
  | 'detail'
  | 'form'
  | 'custom';

// レスポンシブ設定
export interface ResponsiveConfig {
  mobile: {
    showTitle: boolean;
    showActions: boolean;
    showSearch: boolean;
  };
  tablet: {
    showTitle: boolean;
    showActions: boolean;
    showSearch: boolean;
  };
  desktop: {
    showTitle: boolean;
    showActions: boolean;
    showSearch: boolean;
  };
} 