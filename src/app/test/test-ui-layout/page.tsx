'use client';

import React, { useState, useEffect, useRef } from 'react';

// スタイルシート（CSS）をReactコンポーネント内に直接記述します
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

    /* --- 基本設定とCSS変数 --- */
    :root {
        --header-height: 60px;
        --sidebar-width: 240px;
        --border-color: #e0e0e0;
        --background-color: #f4f5f7;
        --component-bg-color: #ffffff;
        --hover-bg-color: #f0f0f0;
        --active-bg-color: #e5e5e5;
        --text-color: #333;
        --text-light-color: #666;
        --icon-color: #555;
        --primary-color: #3f51b5;
        --accent-color: #e91e63;
    }

    /* bodyのスタイルは#rootに適用します */
    #root {
        margin: 0;
        font-family: 'Noto Sans JP', sans-serif;
        background-color: var(--background-color);
        color: var(--text-color);
        min-height: 100vh;
    }

    * {
        box-sizing: border-box;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    .app-container {
        padding-left: var(--sidebar-width);
        position: relative;
    }

    /* --- ヘッダー --- */
    .header {
        position: fixed;
        top: 0;
        left: var(--sidebar-width); /* サイドバーの右から開始 */
        width: calc(100% - var(--sidebar-width));
        height: var(--header-height);
        background-color: var(--component-bg-color);
        border-bottom: 1px solid var(--border-color);
        z-index: 1000;
    }

    /* --- サイドバー --- */
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: var(--sidebar-width);
        height: 100vh;
        background-color: var(--component-bg-color);
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        z-index: 1001;
    }

    .sidebar-header {
        display: flex;
        align-items: center;
        gap: 12px;
        height: var(--header-height);
        padding: 0 20px;
        font-size: 18px;
        font-weight: 700;
        border-bottom: 1px solid var(--border-color);
        flex-shrink: 0; /* 縮まないように設定 */
    }
    .sidebar-header .material-symbols-outlined {
        color: var(--primary-color);
    }

    .sidebar-nav {
        flex-grow: 1;
        overflow-y: auto;
        padding: 12px;
    }
    .sidebar-nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .sidebar-nav li a {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        margin-bottom: 4px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s, color 0.2s;
    }
    .sidebar-nav li a:hover {
        background-color: var(--hover-bg-color);
    }
    .sidebar-nav li a.active {
        background-color: var(--primary-color);
        color: white;
    }
    .sidebar-nav li a.active .material-symbols-outlined {
        color: white;
    }
    .sidebar-nav li a .material-symbols-outlined {
        margin-right: 20px;
        font-size: 24px;
        color: var(--icon-color);
        transition: color 0.2s;
    }
    .new-badge {
        margin-left: auto;
        background-color: var(--accent-color);
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        font-weight: 700;
    }

    .sidebar-footer {
        padding: 16px;
        border-top: 1px solid var(--border-color);
        flex-shrink: 0; /* 縮まないように設定 */
        position: relative; /* ポップアップの位置の基準 */
    }
    .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
        background-color: var(--background-color);
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .user-info:hover {
        background-color: #e0e0e0;
    }
    .user-info .user-icon {
        font-size: 36px;
        color: var(--icon-color);
    }
    .user-info .name {
        font-weight: 700;
        font-size: 14px;
    }
    .user-info .role {
        font-size: 12px;
        color: var(--text-light-color);
    }
    
    .logout-popup {
        position: absolute;
        bottom: calc(100% - 12px); /* フッターの上に配置 */
        left: 16px;
        right: 16px;
        background-color: var(--component-bg-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
        z-index: 1002;
        padding: 8px;
        animation: popup-fade-in 0.2s ease-out forwards;
    }

    @keyframes popup-fade-in {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .logout-button {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 10px 12px;
        gap: 12px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 15px;
        border-radius: 8px;
        text-align: left;
    }
    .logout-button:hover {
        background-color: var(--hover-bg-color);
    }

    /* --- メインコンテンツ --- */
    .main-content-wrapper {
        padding-top: var(--header-height);
    }
    .main-content {
        padding: 32px;
    }

    .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 24px;
    }

    .card {
        background-color: var(--component-bg-color);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 24px;
        transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    }
    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
    .card-title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 8px;
    }
    .card-description {
        font-size: 14px;
        color: var(--text-light-color);
        margin-bottom: 24px;
        min-height: 40px;
    }
    .card-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 700;
        color: var(--primary-color);
    }
    .card-link .material-symbols-outlined {
        transition: transform 0.2s;
    }
    .card-link:hover .material-symbols-outlined {
        transform: translateX(4px);
    }
  `}</style>
);

// --- 子コンポーネント ---

const Card = ({ title, description, linkText }: { title: string; description: string; linkText: string }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <a href="#" className="card-link">
        <span>{linkText}</span>
        <span className="material-symbols-outlined">arrow_forward</span>
      </a>
    </div>
  );
};

const MainContent = () => {
  const cardData = [
    { title: "BOM管理", description: "BOMの作成、編集、管理を行います。", linkText: "BOM管理を開く" },
    { title: "テーブル管理", description: "テーブルの作成、編集、管理を行います。", linkText: "テーブル管理を開く" },
    { title: "プロジェクト管理", description: "プロジェクトの作成、編集、管理を行います。", linkText: "プロジェクト管理を開く" },
    { title: "テストページ", description: "各機能のテストページです。", linkText: "テストページを開く" }
  ];

  return (
    <div className="main-content-wrapper">
        <main className="main-content">
            <div className="card-container">
                {cardData.map((card, index) => (
                <Card 
                    key={index}
                    title={card.title}
                    description={card.description}
                    linkText={card.linkText}
                />
                ))}
            </div>
        </main>
    </div>
  );
};

const Header = () => {
  return (
    <header className="header">
      {/* ヘッダーのコンテンツは空 */}
    </header>
  );
};

const Sidebar = () => {
  // クライアントサイドでのみ状態を初期化
  const [activePage, setActivePage] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true);
    setActivePage('プロジェクト管理');
  }, []);

  const menuItems = [
    { id: 'home', name: 'ホーム', icon: 'home' },
    { id: 'bom', name: 'BOM管理', icon: 'view_in_ar' },
    { id: 'project', name: 'プロジェクト管理', icon: 'assignment' },
    { id: 'table', name: 'テーブル管理', icon: 'grid_view' },
    { id: 'report', name: '日報管理', icon: 'edit_calendar' },
    { id: 'user', name: 'ユーザー管理', icon: 'group' },
    { id: 'settings', name: '設定', icon: 'settings' },
  ];
  
  // フッターの外側をクリックしたときにポップアップを閉じる
  useEffect(() => {
    if (!isClient) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [footerRef, isClient]);

  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) {
    return (
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="material-symbols-outlined">data_object</span>
          <span>業務システム</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.id}>
                <a>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="material-symbols-outlined user-icon">account_circle</span>
            <div>
              <div className="name">担当者 太郎</div>
              <div className="role">MENU</div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">data_object</span>
          <span>業務システム</span>
        </a>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <a 
                className={item.name === activePage ? 'active' : ''}
                onClick={() => setActivePage(item.name)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer" ref={footerRef}>
        {isPopupOpen && (
            <div className="logout-popup">
                <button className="logout-button">
                    <span className="material-symbols-outlined">logout</span>
                    <span>ログアウト</span>
                </button>
            </div>
        )}
        <div className="user-info" onClick={() => setIsPopupOpen(!isPopupOpen)}>
          <span className="material-symbols-outlined user-icon">account_circle</span>
          <div>
            <div className="name">担当者 太郎</div>
            <div className="role">MENU</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// --- メインのAppコンポーネント ---

export default function TestUILayoutPage() {
  return (
    <>
      <Styles />
      <div className="app-container">
        <Sidebar />
        <Header />
        <MainContent />
      </div>
    </>
  );
}
