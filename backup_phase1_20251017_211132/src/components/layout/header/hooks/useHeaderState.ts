import { useState, useCallback, useMemo } from 'react';
import { HeaderConfig, HeaderState } from '../types';

/**
 * ヘッダーの状態管理を行うカスタムフック
 */
export const useHeaderState = (config: HeaderConfig) => {
  const [state, setState] = useState<HeaderState>({
    isSearchOpen: false,
    searchQuery: '',
    isUserMenuOpen: false,
    isNotificationOpen: false,
  });

  // 検索の切り替え
  const toggleSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSearchOpen: !prev.isSearchOpen,
      searchQuery: !prev.isSearchOpen ? '' : prev.searchQuery,
    }));
  }, []);

  // 検索クエリの設定
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
    }));
  }, []);

  // ユーザーメニューの切り替え
  const toggleUserMenu = useCallback(() => {
    setState(prev => ({
      ...prev,
      isUserMenuOpen: !prev.isUserMenuOpen,
      isNotificationOpen: false, // 他のメニューを閉じる
    }));
  }, []);

  // 通知メニューの切り替え
  const toggleNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      isNotificationOpen: !prev.isNotificationOpen,
      isUserMenuOpen: false, // 他のメニューを閉じる
    }));
  }, []);

  // メニューを全て閉じる
  const closeAllMenus = useCallback(() => {
    setState(prev => ({
      ...prev,
      isUserMenuOpen: false,
      isNotificationOpen: false,
    }));
  }, []);

  // アクション関数
  const actions = useMemo(() => ({
    toggleSearch,
    setSearchQuery,
    toggleUserMenu,
    toggleNotifications,
    closeAllMenus,
  }), [toggleSearch, setSearchQuery, toggleUserMenu, toggleNotifications, closeAllMenus]);

  return {
    state,
    actions,
  };
}; 