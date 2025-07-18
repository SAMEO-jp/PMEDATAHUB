'use client';

import React, { useState } from 'react';
import { useHeader } from '@/src/components/layout/header/store/headerStore';
import { ModernHeader } from '@/src/components/layout/ModernHeader';
import { HeaderDisplayType, ProjectInfo } from '@/src/components/layout/header/store/headerStore';

/**
 * ヘッダーストアの使い方を解説するテストページ
 */
export default function TestHeaderStorePage() {
  const {
    displayType,
    displayConfig,
    currentProject,
    componentConfig,
    isSearchOpen,
    searchQuery,
    isUserMenuOpen,
    isNotificationOpen,
    setDisplayType,
    setDisplayConfig,
    setCurrentProject,
    setComponentConfig,
    resetDisplayConfig,
    resetComponentConfig,
    toggleSearch,
    setSearchQuery,
    toggleUserMenu,
    toggleNotifications,
    closeAllMenus,
    applyPreset,
  } = useHeader();

  const [customTitle, setCustomTitle] = useState('カスタムタイトル');
  const [customTitleSuffix, setCustomTitleSuffix] = useState(' ＞ カスタム');
  const [customSubtitle, setCustomSubtitle] = useState('カスタムサブタイトル');

  // サンプルプロジェクトデータ
  const sampleProjects: ProjectInfo[] = [
    {
      id: 'proj-001',
      name: '新製品開発プロジェクト',
      code: 'NP-2024-001',
      description: '次世代製品の開発プロジェクト',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    {
      id: 'proj-002',
      name: 'システム改修プロジェクト',
      code: 'SG-2024-002',
      description: '既存システムの改修プロジェクト',
      status: 'completed',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
    },
    {
      id: 'proj-003',
      name: '研究開発プロジェクト',
      code: 'RD-2024-003',
      description: '新技術の研究開発プロジェクト',
      status: 'pending',
      startDate: '2024-06-01',
      endDate: '2025-05-31',
    },
  ];

  // 表示タイプ切り替え
  const handleDisplayTypeChange = (type: HeaderDisplayType) => {
    setDisplayType(type);
  };

  // プロジェクト設定
  const handleProjectChange = (project: ProjectInfo | null) => {
    setCurrentProject(project);
  };

  // カスタム設定適用
  const handleCustomConfig = () => {
    setDisplayConfig({
      title: customTitle,
      titleSuffix: customTitleSuffix,
      subtitle: customSubtitle,
      searchPlaceholder: 'カスタム検索...',
    });
  };

  // コンポーネント設定の切り替え
  const handleComponentToggle = (key: keyof typeof componentConfig, value: boolean) => {
    setComponentConfig(displayType, { [key]: value });
  };

  // プリセットリセット
  const handleReset = () => {
    resetDisplayConfig();
    resetComponentConfig(displayType);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 実際のヘッダー表示 */}
      <ModernHeader
        title={displayConfig.title || 'デフォルトタイトル'}
        subtitle={displayConfig.subtitle || 'デフォルトサブタイトル'}
        searchPlaceholder={displayConfig.searchPlaceholder || '検索...'}
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

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ヘッダーストア テスト・解説ページ</h1>

        {/* 現在の状態表示 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 基本情報 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">現在の状態</h2>
            <div className="space-y-2 text-sm">
              <div><strong>表示タイプ:</strong> {displayType}</div>
                             <div><strong>タイトル:</strong> {displayConfig.title || '未設定'}</div>
               <div><strong>タイトルサフィックス:</strong> {displayConfig.titleSuffix || '未設定'}</div>
               <div><strong>サブタイトル:</strong> {displayConfig.subtitle || '未設定'}</div>
              <div><strong>検索プレースホルダー:</strong> {displayConfig.searchPlaceholder || '未設定'}</div>
              <div><strong>プロジェクト:</strong> {currentProject?.name || '未設定'}</div>
              <div><strong>検索クエリ:</strong> {searchQuery || '未入力'}</div>
            </div>
          </div>

          {/* コンポーネント設定 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">コンポーネント表示設定</h2>
            <div className="space-y-2 text-sm">
              {Object.entries(componentConfig).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span>{key}:</span>
                  <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {value ? '表示' : '非表示'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 表示タイプ切り替え */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">1. 表示タイプ切り替え</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleDisplayTypeChange('default')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                displayType === 'default'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold mb-2">Default</h3>
              <p className="text-sm text-gray-600">標準的なヘッダー表示</p>
            </button>
            <button
              onClick={() => handleDisplayTypeChange('dashboard')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                displayType === 'dashboard'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold mb-2">Dashboard</h3>
              <p className="text-sm text-gray-600">ダッシュボード用の表示</p>
            </button>
            <button
              onClick={() => handleDisplayTypeChange('project-detail')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                displayType === 'project-detail'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold mb-2">Project Detail</h3>
              <p className="text-sm text-gray-600">プロジェクト詳細用の表示</p>
            </button>
          </div>
        </div>

        {/* プロジェクト設定 */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">2. プロジェクト情報設定</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectChange(project)}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  currentProject?.id === project.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold mb-1">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{project.code}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </button>
            ))}
            <button
              onClick={() => handleProjectChange(null)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                !currentProject
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold mb-1">プロジェクト解除</h3>
              <p className="text-sm text-gray-600">プロジェクト情報をクリア</p>
            </button>
          </div>
        </div>

        {/* カスタム設定 */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">3. カスタム設定</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトルサフィックス
              </label>
              <input
                type="text"
                value={customTitleSuffix}
                onChange={(e) => setCustomTitleSuffix(e.target.value)}
                placeholder=" ＞ 詳細"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サブタイトル
              </label>
              <input
                type="text"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleCustomConfig}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              カスタム設定を適用
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              プリセットにリセット
            </button>
          </div>
        </div>

        {/* コンポーネント表示制御 */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">4. コンポーネント表示制御</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(componentConfig).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={(e) => handleComponentToggle(key as keyof typeof componentConfig, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={key} className="text-sm font-medium text-gray-700">
                  {key}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 使用例 */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">5. 使用例・コードサンプル</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">基本的な使用方法</h3>
              <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`import { useHeader } from '@/src/components/layout/header/store/headerStore';

// コンポーネント内で使用
const { 
  displayType, 
  setDisplayType, 
  setCurrentProject,
  setDisplayConfig 
} = useHeader();

// 表示タイプを変更
setDisplayType('dashboard');

// プロジェクト情報を設定
setCurrentProject({
  id: 'proj-001',
  name: 'プロジェクト名',
  status: 'active'
});

// カスタム設定
setDisplayConfig({
  title: 'カスタムタイトル',
  subtitle: 'カスタムサブタイトル'
});`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">プロジェクト詳細ページでの使用例</h3>
              <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`// プロジェクト詳細ページ用のカスタムフック
export const useProjectHeader = (project: Project | null) => {
  const { setDisplayType, setCurrentProject, setDisplayConfig } = useHeader();

  useEffect(() => {
    if (project) {
      setDisplayType('project-detail');
      setCurrentProject({
        id: project.PROJECT_ID,
        name: project.PROJECT_NAME,
        status: mapProjectStatus(project.PROJECT_STATUS)
      });
      setDisplayConfig({
        title: project.PROJECT_NAME,
        subtitle: '',
        breadcrumbItems: []
      });
    }
  }, [project]);
};`}
              </pre>
            </div>
          </div>
        </div>

        {/* 機能説明 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">6. 機能説明</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">表示タイプ</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li><strong>default:</strong> 標準的なヘッダー表示（検索、アクション、ユーザー情報を表示）</li>
                <li><strong>dashboard:</strong> ダッシュボード用（プロジェクト情報、パンくずリストを表示）</li>
                <li><strong>project-detail:</strong> プロジェクト詳細用（戻るボタン、プロジェクト情報を表示、通知は非表示）</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">主要機能</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li><strong>表示タイプ管理:</strong> 3つのプリセットタイプでヘッダー表示を切り替え</li>
                <li><strong>プロジェクト情報管理:</strong> プロジェクト名称、ステータス、期間などを管理</li>
                <li><strong>コンポーネント表示制御:</strong> 各要素の表示/非表示を細かく制御</li>
                <li><strong>カスタム設定:</strong> タイトル、サブタイトル、検索プレースホルダーをカスタマイズ</li>
                <li><strong>状態永続化:</strong> ローカルストレージに設定を保存</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 