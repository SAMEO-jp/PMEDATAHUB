'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { getCurrentYearWeekString, getYearAndWeek } from '@/utils/dateUtils';

// Material Symbols のフォールバック用アイコンマッピング
const iconFallbacks: Record<string, string> = {
  'home': '🏠',
  'view_in_ar': '📱',
  'assignment': '📋',
  'grid_view': '📊',
  'edit_calendar': '📅',
  'group': '👥',
  'settings': '⚙️',
  'data_object': '📦',
  'account_circle': '👤',
  'logout': '🚪',
  'login': '🔑',
  'description': '📄',
  'image': '🖼️',
  'notes': '📝',
  'inventory': '📦',
  'widgets': '🧩',
  'table_chart': '📊',
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

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  href?: string;
  isNew?: boolean;
}

// サイドバーの状態管理
const useSidebarStore = () => {
  const [menuType, setMenuType] = useState<'project' | 'global'>('global');
  
  const toggleMenuType = () => {
    setMenuType(prev => prev === 'project' ? 'global' : 'project');
  };

  return { 
    menuType, 
    toggleMenuType
  };
};

export const SidebarContent: React.FC = () => {
  const pathname = usePathname();
  const params = useParams();
  const { 
    menuType, 
    toggleMenuType
  } = useSidebarStore();
  const [activePage, setActivePage] = useState('ホーム');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // 認証コンテキストからユーザー情報とログイン機能を取得
  const {
    user,
    isAuthenticated,
    clearUser,
    openLoginModal,
  } = useAuthContext();

  // プロジェクトIDを取得
  const projectId = params?.project_id as string;

  // 現在のページがプロジェクト関連かどうかを判定
  const isProjectPage = pathname.includes('/app_project/') && projectId;

  // 今週の年と週番号を取得
  const { year, week } = getYearAndWeek();

  // プロジェクトサブメニューの項目
  const projectMenuItems: MenuItem[] = [
    { id: 'detail', name: '詳細', icon: 'description', href: `/app_project/${projectId}/detail` },
    { id: 'drawing', name: '図面', icon: 'image', href: `/app_project/${projectId}/zumen` },
    { id: '3d', name: '3D', icon: 'view_in_ar', href: `/app_project/${projectId}/3d` },
    { id: 'minutes', name: '議事録', icon: 'notes', href: `/app_project/${projectId}/minutes` },
    { id: 'ebom', name: 'EBOM', icon: 'inventory', href: `/app_project/${projectId}/ebom` },
    { id: 'mbom', name: 'MBOM', icon: 'widgets', href: `/app_project/${projectId}/mbom` },
    { id: 'cmom', name: 'CMOM', icon: 'table_chart', href: `/app_project/${projectId}/cmom` },
  ];

  // 全体メニューの項目（zisseki-demo専用サイドバーと同じ）
  const globalMenuItems: MenuItem[] = [
    { id: 'home', name: 'ホーム', icon: 'home', href: '/' },
    { id: 'calendar', name: '週間カレンダー', icon: 'calendar_month', href: `/zisseki-demo/${year}/${week}` },
    { id: 'schedule', name: 'スケジュール', icon: 'schedule', href: '/zisseki-demo/schedule' },
    { id: 'tasks', name: 'タスク管理', icon: 'task', href: '/zisseki-demo/tasks' },
    { id: 'analytics', name: '実績分析', icon: 'analytics', href: '/zisseki-demo/analytics' },
    { id: 'settings', name: '設定', icon: 'settings', href: '/zisseki-demo/settings' },
  ];

  // 現在表示するメニュー項目を選択
  const currentMenuItems = menuType === 'project' ? projectMenuItems : globalMenuItems;

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
      console.error('Sidebar login error:', error);
    }
  };

  // ログアウトハンドラー
  const handleLogout = () => {
    try {
      clearUser();
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Sidebar logout error:', error);
    }
  };

  // ユーザー情報の取得（認証状態に応じて）
  const userName = user?.name_japanese || 'ゲスト';
  const userRole = user?.syokui || 'GUEST';
  const userIcon = isAuthenticated ? 'account_circle' : 'person';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <IconComponent iconName="data_object" />
          <span>業務システム</span>
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {currentMenuItems.map(item => (
            <li key={item.id}>
              {item.href ? (
                <Link 
                  href={item.href}
                  className={pathname === item.href ? 'active' : ''}
                  onClick={() => setActivePage(item.name)}
                >
                  <IconComponent iconName={item.icon} />
                  {item.name}
                  {item.isNew && <span className="new-badge">New</span>}
                </Link>
              ) : (
                <a 
                  className={item.name === activePage ? 'active' : ''}
                  onClick={() => setActivePage(item.name)}
                >
                  <IconComponent iconName={item.icon} />
                  {item.name}
                  {item.isNew && <span className="new-badge">New</span>}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer" ref={footerRef}>
        {/* メニュー切り替えボタン */}
        <div className="menu-toggle-button">
          {menuType === 'project' ? (
            <button 
              onClick={toggleMenuType} 
              className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 rounded transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>全体メニュー</span>
            </button>
          ) : (
            isProjectPage && (
              <button 
                onClick={toggleMenuType} 
                className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 rounded transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
                <span>プロジェクトへ</span>
              </button>
            )
          )}
        </div>
        
        {/* 認証状態に応じたポップアップ */}
        {isPopupOpen && (
          <div className="logout-popup">
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
