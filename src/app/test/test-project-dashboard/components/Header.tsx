import { Bell, UserCircle } from 'lucide-react';

const Header = () => (
  <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
    <div className="flex items-center text-sm text-gray-500">
      <span>電気集塵機VS-ESCS開発 (EBXX0025002)</span>
    </div>
    <div className="flex items-center space-x-4">
      <Bell size={20} className="text-gray-600" />
      <UserCircle size={24} className="text-gray-600" />
      <span className="text-sm font-medium">担当者名</span>
    </div>
  </header>
);

export default Header; 