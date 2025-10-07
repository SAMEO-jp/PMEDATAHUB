'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarContent } from './SidebarContent';
import { ZissekiSidebarContent } from './ZissekiSidebarContent';
import { HeaderContent } from './HeaderContent';
import { LoginModal } from '@/components/auth/LoginModal';

interface HeaderSidbarLayoutProps {
  children: React.ReactNode;
}

export const HeaderSidbarLayout: React.FC<HeaderSidbarLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // zisseki-demoページかどうかを判定
  const isZissekiDemo = pathname.startsWith('/zisseki-demo');
  
  // zisseki-demoの場合は専用サイドバーを表示、それ以外は通常のサイドバーを表示
  const SidebarComponent = isZissekiDemo ? ZissekiSidebarContent : SidebarContent;

  return (
    <div className="app-container h-screen flex flex-col">
      <SidebarComponent />
      <HeaderContent />
      <div className="main-content-wrapper flex-1 overflow-hidden">
        <main className="main-content h-full overflow-y-auto">
          {children}
        </main>
      </div>
      
      {/* ログインモーダル - 認証コンテキストで管理 */}
      <LoginModal />
    </div>
  );
};
