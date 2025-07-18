// ==========================================
// サイドバーコンポーネント
// ==========================================

import {
  HomeIcon,
  FileBoxIcon,
  TableIcon,
  UsersIcon,
  SettingsIcon,
} from './Icons';

export const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r flex flex-col">
      <div className="h-16 flex items-center px-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">業務システム</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
          <HomeIcon className="w-5 h-5 mr-3" /> ホーム
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
          <FileBoxIcon className="w-5 h-5 mr-3" /> プロジェクト管理
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg">
          <TableIcon className="w-5 h-5 mr-3" /> テーブル管理
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
          <UsersIcon className="w-5 h-5 mr-3" /> ユーザー管理
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
          <SettingsIcon className="w-5 h-5 mr-3" /> 設定
        </a>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
            太
          </div>
          <div className="ml-3">
            <p className="font-semibold text-gray-800">担当者 太郎</p>
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">MENU</a>
          </div>
        </div>
      </div>
    </aside>
  );
}; 