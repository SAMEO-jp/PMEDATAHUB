'use client';

import React from 'react';
import { ModernLayout } from '../../../components/layout/ModernLayout';
import { ModernHeader } from '../../../components/layout/ModernHeader';
import { HeaderAction, BreadcrumbItem } from '../../../components/layout/header/types';

/**
 * ヘッダーコンポーネントのテストページ
 */
export default function TestHeaderPage() {
  // パンくずリストの例
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'ホーム', href: '/', icon: 'home' },
    { label: 'プロジェクト', href: '/app_project', icon: 'assignment' },
    { label: 'BOM管理', href: '/app_project/bom', icon: 'view_in_ar' },
    { label: '部品一覧', icon: 'list' },
  ];

  // アクションボタンの例
  const actions: HeaderAction[] = [
    {
      id: 'add',
      label: '新規作成',
      icon: 'add',
      variant: 'primary',
      onClick: () => {
        console.log('新規作成ボタンがクリックされました');
        alert('新規作成ボタンがクリックされました');
      },
    },
    {
      id: 'export',
      label: 'エクスポート',
      icon: 'download',
      variant: 'outline',
      onClick: () => {
        console.log('エクスポートボタンがクリックされました');
        alert('エクスポートボタンがクリックされました');
      },
    },
    {
      id: 'settings',
      label: '設定',
      icon: 'settings',
      variant: 'ghost',
      onClick: () => {
        console.log('設定ボタンがクリックされました');
        alert('設定ボタンがクリックされました');
      },
    },
  ];

  // 検索ハンドラー
  const handleSearch = (query: string) => {
    console.log('検索クエリ:', query);
    alert(`検索クエリ: ${query}`);
  };

  // ログアウトハンドラー
  const handleLogout = () => {
    console.log('ログアウトが実行されました');
    alert('ログアウトが実行されました');
  };

  // プロフィールハンドラー
  const handleProfile = () => {
    console.log('プロフィールが開かれました');
    alert('プロフィールが開かれました');
  };

  // 設定ハンドラー
  const handleSettings = () => {
    console.log('設定が開かれました');
    alert('設定が開かれました');
  };

  return (
    <ModernLayout>
      <ModernHeader
        title="部品一覧"
        subtitle="プロジェクトAの部品管理"
        showBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
        actions={actions}
        showSearch={true}
        searchPlaceholder="部品名で検索..."
        onSearch={handleSearch}
        showUserInfo={true}
        showNotifications={true}
        showSettings={true}
        userName="山田 太郎"
        userRole="管理者"
        onLogout={handleLogout}
        onProfile={handleProfile}
        onSettings={handleSettings}
      />
      
      <div style={{ padding: '20px' }}>
        <h2>ヘッダーコンポーネントのテスト</h2>
        <p>このページでは、新しいヘッダーコンポーネントの機能をテストできます。</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>実装された機能:</h3>
          <ul>
            <li>タイトルとサブタイトルの表示</li>
            <li>パンくずリストの表示</li>
            <li>アクションボタン（新規作成、エクスポート、設定）</li>
            <li>検索機能</li>
            <li>ユーザーメニュー（プロフィール、設定、ログアウト）</li>
            <li>通知機能</li>
            <li>レスポンシブデザイン</li>
          </ul>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用方法:</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '5px',
            overflow: 'auto'
          }}>
{`<ModernHeader
  title="ページタイトル"
  subtitle="ページの説明"
  showBreadcrumb={true}
  breadcrumbItems={breadcrumbItems}
  actions={actions}
  showSearch={true}
  onSearch={handleSearch}
  showUserInfo={true}
  showNotifications={true}
  userName="ユーザー名"
  userRole="役割"
  onLogout={handleLogout}
  onProfile={handleProfile}
  onSettings={handleSettings}
/>`}
          </pre>
        </div>
      </div>
    </ModernLayout>
  );
} 