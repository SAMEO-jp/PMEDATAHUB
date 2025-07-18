import { LayoutDashboard, Book, Users, FileText, Settings } from 'lucide-react';

const Sidebar = () => (
  <aside className="w-64 bg-gray-800 text-white flex flex-col">
    <div className="h-16 flex items-center justify-center text-2xl font-bold">
      PMEデータHUB
    </div>
    <nav className="flex-1 px-4 py-6 space-y-2">
      <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
        <LayoutDashboard className="mr-3" size={20} />
        プロジェクト概要
      </a>
      <a href="#" className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md">
        <Book className="mr-3" size={20} />
        プロジェクト管理
      </a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
        <Users className="mr-3" size={20} />
        設計管理
      </a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
        <FileText className="mr-3" size={20} />
        関連図書
      </a>
      <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
        <Settings className="mr-3" size={20} />
        設定
      </a>
    </nav>
  </aside>
);

export default Sidebar; 