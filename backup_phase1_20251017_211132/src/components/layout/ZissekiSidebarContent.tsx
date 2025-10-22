'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Clock, Target, BarChart3 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { getCurrentYearWeekString } from '@/utils/dateUtils';
import { CalendarWidget } from './CalendarWidget';

// Material Symbols のフォールバック用アイコンマッピング
const iconFallbacks: Record<string, string> = {
  'home': '🏠',
  'calendar_month': '📅',
  'schedule': '⏰',
  'task': '✅',
  'analytics': '📊',
  'settings': '⚙️',
  'account_circle': '👤',
  'logout': '🚪',
  'login': '🔑',
  'edit_calendar': '📅',
};

// アイコン表示用のヘルパー関数
const IconComponent: React.FC<{ iconName: string; className?: string }> = ({ iconName, className = '' }) => {
  const [isMaterialSymbolsLoaded, setIsMaterialSymbolsLoaded] = useState(true);

  useEffect(() => {
    // Material Symbols フォントが読み込まれているかチェック
    const checkFontLoaded = () => {
      const testElement = document.createElement('span');
      testElement.className = 'material-symbols-outlined';
      testElement.textContent = 'home';
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.style.fontSize = '24px';
      document.body.appendChild(testElement);
      
      const isLoaded = testElement.offsetWidth > 0;
      document.body.removeChild(testElement);
      
      setIsMaterialSymbolsLoaded(isLoaded);
    };

    // フォント読み込み完了を待つ
    if (document.fonts) {
      void document.fonts.ready.then(() => {
        setTimeout(checkFontLoaded, 100);
      });
    } else {
      // フォールバック: 少し待ってからチェック
      setTimeout(checkFontLoaded, 500);
    }
  }, []);

  if (isMaterialSymbolsLoaded) {
    return (
      <span className={`material-symbols-outlined ${className}`}>
        {iconName}
      </span>
    );
  }

  // フォールバック: 絵文字を使用
  return (
    <span className={`icon-fallback ${className}`} style={{ fontSize: '20px' }}>
      {iconFallbacks[iconName] || '📄'}
    </span>
  );
};

export const ZissekiSidebarContent: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // 認証コンテキストからユーザー情報とログイン機能を取得
  const {
    user,
    isAuthenticated,
    clearUser,
    openLoginModal,
  } = useAuthContext();

  // フッターの外側をクリックしたときにポップアップを閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [footerRef]);

  // ログインハンドラー
  const handleLogin = () => {
    try {
      openLoginModal();
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Zisseki sidebar login error:', error);
    }
  };

  // ログアウトハンドラー
  const handleLogout = () => {
    try {
      clearUser();
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Zisseki sidebar logout error:', error);
    }
  };

  // レポートボタンのハンドラー - 現在の年月の data-display ページへ遷移
  const handleReportClick = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 0-11 なので +1
    router.push(`/data-display/${year}/${month}`);
  };

  // ユーザー情報の取得（認証状態に応じて）
  const userName = user?.name_japanese || 'ゲスト';
  const userRole = user?.syokui || 'GUEST';
  const userIcon = isAuthenticated ? 'account_circle' : 'person';

  return (
    <aside className="sidebar zisseki-sidebar flex flex-col h-full">
      <div className="sidebar-header">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <IconComponent iconName="edit_calendar" />
          <span>業務システム</span>
        </Link>
      </div>
      
      {/* カレンダーウィジェット */}
      <div className="calendar-widget-section">
        <CalendarWidget />
      </div>

      {/* スペーサー - 余白を埋める */}
      <div className="flex-1 overflow-y-auto">
        {/* ZissekiDemo専用コントロール（表示切替） */}
        {pathname.includes('/zisseki-demo') && (
          <div className="quick-actions">
            <div className="quick-actions-title">
              <Target className="w-4 h-4" />
              <span>表示切替（開発中）</span>
            </div>
            <div className="quick-action-buttons">
              <button 
                className="quick-action-btn"
                onClick={() => {
                  const event = new CustomEvent('zissekiSectionToggle', {
                    detail: { section: 'meeting' }
                  });
                  window.dispatchEvent(event);
                }}
              >
                <span className="material-symbols-outlined text-base">groups</span>
                <span>会議</span>
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => {
                  const event = new CustomEvent('zissekiSectionToggle', {
                    detail: { section: 'project' }
                  });
                  window.dispatchEvent(event);
                }}
              >
                <span className="material-symbols-outlined text-base">assignment</span>
                <span>プロジェクト</span>
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => {
                  console.log('🎯 タスクボタンがクリックされました');
                  const event = new CustomEvent('zissekiSectionToggle', {
                    detail: { section: 'task' }
                  });
                  window.dispatchEvent(event);
                  console.log('📡 zissekiSectionToggle イベントを発火しました (task)');
                }}
              >
                <span className="material-symbols-outlined text-base">task</span>
                <span>タスク</span>
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => {
                  const event = new CustomEvent('zissekiSectionToggle', {
                    detail: { section: 'recent' }
                  });
                  window.dispatchEvent(event);
                }}
              >
                <span className="material-symbols-outlined text-base">history</span>
                <span>直近の実績</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* クイックアクション */}
      <div className="quick-actions">
        <div className="quick-actions-title">
          <Target className="w-4 h-4" />
          <span>クイックアクション</span>
        </div>
        <div className="quick-action-buttons">
          <button className="quick-action-btn">
            <Clock className="w-4 h-4" />
            <span>時間記録（開発中）</span>
          </button>
          <button className="quick-action-btn" onClick={handleReportClick}>
            <BarChart3 className="w-4 h-4" />
            <span>レポート</span>
          </button>
        </div>
      </div>

      <div className="sidebar-footer" ref={footerRef}>
        {/* 認証状態に応じたポップアップ */}
        {isPopupOpen && (
          <div className="logout-popup zisseki-popup">
            {/* 年と週番号表示 */}
            <div className="year-week-info">
              <IconComponent iconName="edit_calendar" className="calendar-icon" />
              <span className="year-week-text">{getCurrentYearWeekString()}</span>
            </div>
            
            {/* 区切り線 */}
            <div className="popup-divider"></div>
            
            {/* 認証アクションボタン */}
            {isAuthenticated ? (
              <button className="logout-button" onClick={handleLogout}>
                <IconComponent iconName="logout" />
                <span>ログアウト</span>
              </button>
            ) : (
              <button className="login-button" onClick={handleLogin}>
                <IconComponent iconName="login" />
                <span>ログイン</span>
              </button>
            )}
          </div>
        )}
        
        {/* ユーザー情報表示 */}
        <div className="user-info" onClick={() => setIsPopupOpen(!isPopupOpen)}>
          <IconComponent iconName={userIcon} className="user-icon" />
          <div>
            <div className="name">{userName}</div>
            <div className="role">{userRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
