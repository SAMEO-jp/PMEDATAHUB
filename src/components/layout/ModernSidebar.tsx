'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export const ModernSidebar: React.FC = () => {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState('ホーム');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    { id: 'home', name: 'ホーム', icon: 'home', href: '/' },
    { id: 'bom', name: 'BOM管理', icon: 'view_in_ar', href: '/app_project' },
    { id: 'project', name: 'プロジェクト管理', icon: 'assignment', href: '/app_project' },
    { id: 'table', name: 'テーブル管理', icon: 'grid_view', href: '/test' },
    { id: 'report', name: '日報管理', icon: 'edit_calendar', href: '/nippou' },
    { id: 'user', name: 'ユーザー管理', icon: 'group', href: '/test' },
    { id: 'settings', name: '設定', icon: 'settings', href: '/test' },
  ];

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

  const handleLogout = () => {
    // ログアウト処理をここに実装
    console.log('ログアウト処理');
    setIsPopupOpen(false);
  };

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
          {menuItems.map(item => (
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
        {isPopupOpen && (
          <div className="logout-popup">
            <button className="logout-button" onClick={handleLogout}>
              <IconComponent iconName="logout" />
              <span>ログアウト</span>
            </button>
          </div>
        )}
        <div className="user-info" onClick={() => setIsPopupOpen(!isPopupOpen)}>
          <IconComponent iconName="account_circle" className="user-icon" />
          <div>
            <div className="name">担当者 太郎</div>
            <div className="role">MENU</div>
          </div>
        </div>
      </div>
    </aside>
  );
}; 