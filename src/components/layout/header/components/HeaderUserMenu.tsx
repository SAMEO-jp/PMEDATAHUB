import React, { useRef, useEffect } from 'react';

interface HeaderUserMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
}

/**
 * ヘッダーのユーザーメニューを表示するコンポーネント
 */
export const HeaderUserMenu: React.FC<HeaderUserMenuProps> = ({
  isOpen,
  onToggle,
  userName = '担当者 太郎',
  userRole = 'MENU',
  onLogout,
  onProfile,
  onSettings,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // メニューの外側をクリックしたときに閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    onToggle();
  };

  const handleProfile = () => {
    if (onProfile) {
      onProfile();
    }
    onToggle();
  };

  const handleSettings = () => {
    if (onSettings) {
      onSettings();
    }
    onToggle();
  };

  return (
    <div className="header-user-menu" ref={menuRef}>
      {/* ユーザー情報ボタン */}
      <button
        className="header-user-button"
        onClick={onToggle}
        aria-label="ユーザーメニューを開く"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined header-user-icon">
          account_circle
        </span>
        <div className="header-user-info">
          <span className="header-user-name">{userName}</span>
          <span className="header-user-role">{userRole}</span>
        </div>
        <span className="material-symbols-outlined header-user-arrow">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="header-user-dropdown">
          <div className="header-user-dropdown-header">
            <span className="material-symbols-outlined header-user-dropdown-icon">
              account_circle
            </span>
            <div className="header-user-dropdown-info">
              <span className="header-user-dropdown-name">{userName}</span>
              <span className="header-user-dropdown-role">{userRole}</span>
            </div>
          </div>
          
          <div className="header-user-dropdown-actions">
            {onProfile && (
              <button
                className="header-user-dropdown-action"
                onClick={handleProfile}
              >
                <span className="material-symbols-outlined">person</span>
                <span>プロフィール</span>
              </button>
            )}
            
            {onSettings && (
              <button
                className="header-user-dropdown-action"
                onClick={handleSettings}
              >
                <span className="material-symbols-outlined">settings</span>
                <span>設定</span>
              </button>
            )}
            
            {onLogout && (
              <button
                className="header-user-dropdown-action header-user-dropdown-logout"
                onClick={handleLogout}
              >
                <span className="material-symbols-outlined">logout</span>
                <span>ログアウト</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 