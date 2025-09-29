'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { HeaderConfig, HeaderAction } from './header/types';
import { useHeader } from './header/store/headerStore';
import { useAuthContext } from '@/contexts/AuthContext';
import { HeaderTitle } from './header/components/HeaderTitle';
import { HeaderActions } from './header/components/HeaderActions';
import { HeaderSearch } from './header/components/HeaderSearch';
import { HeaderUserMenu } from './header/components/HeaderUserMenu';
import { HeaderNotifications } from './header/components/HeaderNotifications';
import { getHeaderConfigByPath, customizeHeaderConfig } from './header/config/headerConfigs';

interface HeaderContentProps extends HeaderConfig {
  // 追加のプロパティ
  onProfile?: () => void;
  onSettings?: () => void;
  // ページ固有の保存関数など
  onSave?: () => Promise<void>;
  onCustomAction?: (actionId: string) => void;
}

/**
 * ヘッダーコンテンツコンポーネント
 * タイトル、アクションボタン、検索、ユーザーメニュー、通知機能を統合
 * Zustandストアを使用した状態管理 + 認証コンテキスト統合
 */
export const HeaderContent: React.FC<HeaderContentProps> = ({
  // 基本設定
  title,
  subtitle,
  breadcrumbItems = [],
  
  // アクションボタン
  actions = [],
  searchPlaceholder = '検索...',
  onSearch,
  
  // カスタマイズ
  className = '',
  children,
  
  // ユーザー情報
  onProfile,
  onSettings,
  
  // ページ固有の関数
  onSave,
  onCustomAction,
}) => {
  // 現在のパスを取得
  const pathname = usePathname();

  // Zustandストアを使用したヘッダーの状態管理
  const {
    displayConfig,
    componentConfig,
    customComponents,
    isSearchOpen,
    searchQuery,
    isUserMenuOpen,
    isNotificationOpen,
    toggleSearch,
    setSearchQuery,
    toggleUserMenu,
    toggleNotifications,
    setDisplayConfig,
    setComponentConfig,
  } = useHeader();

  // パスに基づいてヘッダー設定を自動的に適用
  useEffect(() => {
    const baseConfig = getHeaderConfigByPath(pathname);
    const customizedConfig = customizeHeaderConfig(pathname, baseConfig);
    
    // ヘッダー設定をストアに適用
    setDisplayConfig({
      title: customizedConfig.title,
      subtitle: customizedConfig.subtitle,
      actions: customizedConfig.actions,
      breadcrumbItems: customizedConfig.breadcrumbItems,
    });
    
    setComponentConfig({
      showActions: customizedConfig.showActions,
      showSearch: customizedConfig.showSearch,
      showBreadcrumb: customizedConfig.showBreadcrumb,
      showUserInfo: customizedConfig.showUserInfo,
      showNotifications: customizedConfig.showNotifications,
    });
  }, [pathname, setDisplayConfig, setComponentConfig]);

  // 認証コンテキストからユーザー情報とログイン機能を取得
  const {
    user,
    isAuthenticated,
    clearUser,
    openLoginModal,
  } = useAuthContext();

  // アクションボタンのクリックハンドラー
  const handleActionClick = async (action: HeaderAction) => {
    console.log('🎯 Header action clicked:', action.id, action.label);
    
    try {
      // 保存ボタンの場合は特別処理
      if (action.id === 'save' && onSave) {
        console.log('💾 Save action triggered');
        await onSave();
        return;
      }
      
      // カスタムアクションの場合は特別処理
      if (onCustomAction) {
        console.log('🔧 Custom action triggered:', action.id);
        onCustomAction(action.id);
        return;
      }
      
      // 通常のアクション
      console.log('⚡ Executing action onClick:', action.id);
      action.onClick();
      console.log('✅ Action onClick executed');
    } catch (error) {
      console.error('💥 Header action error:', error);
    }
  };

  // 検索ハンドラー
  const handleSearch = (query: string) => {
    if (onSearch) {
      try {
        onSearch(query);
      } catch (error) {
        console.error('Header search error:', error);
      }
    }
  };

  // ログアウトハンドラー
  const handleLogout = () => {
    try {
      clearUser();
    } catch (error) {
      console.error('Header logout error:', error);
    }
  };

  // ログインハンドラー
  const handleLogin = () => {
    try {
      openLoginModal();
    } catch (error) {
      console.error('Header login error:', error);
    }
  };

  // プロフィールハンドラー
  const handleProfile = () => {
    try {
      // 認証されていない場合はログインモーダルを開く
      if (!isAuthenticated || !user?.user_id) {
        openLoginModal();
        return;
      }
      
      // カスタムプロフィールハンドラーが指定されている場合はそれを実行
      if (onProfile) {
        onProfile();
        return;
      }
      
      // デフォルトの動作：現在のユーザーのプロフィールページに遷移
      window.location.href = `/page/user/${user.user_id}`;
    } catch (error) {
      console.error('Header profile error:', error);
    }
  };

  // 設定ハンドラー
  const handleSettings = () => {
    if (onSettings) {
      try {
        onSettings();
      } catch (error) {
        console.error('Header settings error:', error);
      }
    }
  };

  // ユーザー情報の取得（認証状態に応じて）
  const userName = user?.name_japanese || 'ゲスト';
  const userRole = user?.syokui || 'GUEST';

  return (
    <header className={`header ${className}`}>
      <div className="header-container">
        {/* 左側: タイトルとパンくずリスト */}
        <div className="header-left">
          <HeaderTitle
            title={displayConfig.title || title}
            titleSuffix={displayConfig.titleSuffix}
            subtitle={displayConfig.subtitle || subtitle}
            breadcrumbItems={displayConfig.breadcrumbItems || breadcrumbItems}
            showBreadcrumb={componentConfig.showBreadcrumb}
          />
        </div>

        {/* 中央: カスタムコンテンツ */}
        <div className="header-center">
          {customComponents?.center}
          {children}
        </div>

        {/* 右側: アクション、検索、ユーザーメニュー、通知 */}
        <div className="header-right">
          {/* カスタムコンポーネント（右側） */}
          {customComponents?.right && (
            <div className="header-custom-right">
              {customComponents.right}
            </div>
          )}

          {/* アクションボタン */}
          {componentConfig.showActions && (
            <HeaderActions
              actions={displayConfig.actions || actions}
              onActionClick={handleActionClick}
            />
          )}

          {/* 検索 */}
          {componentConfig.showSearch && (
            <HeaderSearch
              isOpen={isSearchOpen}
              placeholder={displayConfig.searchPlaceholder || searchPlaceholder}
              onSearch={handleSearch}
              onToggle={toggleSearch}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />
          )}

          {/* 通知 */}
          {componentConfig.showNotifications && (
            <HeaderNotifications
              isOpen={isNotificationOpen}
              onToggle={toggleNotifications}
              notifications={[]} // 通知データは外部から注入
            />
          )}

          {/* ユーザーメニュー */}
          {componentConfig.showUserInfo && (
            <HeaderUserMenu
              isOpen={isUserMenuOpen}
              onToggle={toggleUserMenu}
              userName={userName}
              userRole={userRole}
              isAuthenticated={isAuthenticated}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onProfile={handleProfile}
              onSettings={handleSettings}
            />
          )}
        </div>
      </div>
    </header>
  );
};
