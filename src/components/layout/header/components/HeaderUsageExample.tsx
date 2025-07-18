'use client';

import React from 'react';
import { useHeader } from '../store/headerStore';
import { ModernHeader } from '../../ModernHeader';

/**
 * ヘッダーストアの使用例を示すサンプルコンポーネント
 */
export const HeaderUsageExample: React.FC = () => {
  const {
    setDisplayType,
    setCurrentProject,
    setDisplayConfig,
    setComponentConfig,
  } = useHeader();

  // デフォルトタイプに切り替え
  const switchToDefault = () => {
    setDisplayType('default');
  };

  // ダッシュボードタイプに切り替え
  const switchToDashboard = () => {
    setDisplayType('dashboard');
    setDisplayConfig({
      title: 'プロジェクトダッシュボード',
      subtitle: 'プロジェクト一覧と統計情報',
      searchPlaceholder: 'プロジェクトを検索...',
    });
  };

  // プロジェクト詳細タイプに切り替え
  const switchToProjectDetail = () => {
    setDisplayType('project-detail');
    setCurrentProject({
      id: 'proj-001',
      name: '新製品開発プロジェクト',
      code: 'NP-2024-001',
      description: '次世代製品の開発プロジェクト',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    setDisplayConfig({
      title: '新製品開発プロジェクト',
      subtitle: 'プロジェクト詳細',
      breadcrumbItems: [
        { label: 'プロジェクト', href: '/projects' },
        { label: '新製品開発プロジェクト' },
      ],
    });
  };

  // カスタム設定の例
  const applyCustomConfig = () => {
    setDisplayType('default');
    setComponentConfig('default', {
      showTitle: true,
      showSubtitle: false,
      showBreadcrumb: true,
      showSearch: true,
      showActions: false,
      showUserInfo: true,
      showNotifications: false,
      showProjectInfo: false,
      showBackButton: false,
    });
    setDisplayConfig({
      title: 'カスタムヘッダー',
      breadcrumbItems: [
        { label: 'ホーム', href: '/' },
        { label: 'カスタムページ' },
      ],
    });
  };

  return (
    <div className="header-usage-example">
      <div className="controls">
        <h3>ヘッダー表示タイプ切り替え</h3>
        <div className="button-group">
          <button onClick={switchToDefault} className="btn btn-primary">
            デフォルト
          </button>
          <button onClick={switchToDashboard} className="btn btn-secondary">
            ダッシュボード
          </button>
          <button onClick={switchToProjectDetail} className="btn btn-success">
            プロジェクト詳細
          </button>
          <button onClick={applyCustomConfig} className="btn btn-warning">
            カスタム設定
          </button>
        </div>
      </div>

      <div className="header-preview">
        <h3>ヘッダープレビュー</h3>
        <ModernHeader
          title="デフォルトタイトル"
          subtitle="デフォルトサブタイトル"
          searchPlaceholder="検索..."
          onSearch={(query) => console.log('検索:', query)}
          actions={[
            {
              id: 'action1',
              label: 'アクション1',
              onClick: () => console.log('アクション1実行'),
            },
            {
              id: 'action2',
              label: 'アクション2',
              onClick: () => console.log('アクション2実行'),
            },
          ]}
          onLogout={() => console.log('ログアウト')}
          onProfile={() => console.log('プロフィール')}
          onSettings={() => console.log('設定')}
        />
      </div>

      <style>{`
        .header-usage-example {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .controls {
          margin-bottom: 20px;
        }
        
        .button-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .btn-primary { background-color: #007bff; color: white; }
        .btn-secondary { background-color: #6c757d; color: white; }
        .btn-success { background-color: #28a745; color: white; }
        .btn-warning { background-color: #ffc107; color: black; }
        
        .header-preview {
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 10px;
        }
      `}</style>
    </div>
  );
}; 