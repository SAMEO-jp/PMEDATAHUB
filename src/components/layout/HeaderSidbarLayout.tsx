'use client';

import React from 'react';
import { SidebarContent } from './SidebarContent';
import { HeaderContent } from './HeaderContent';
import { LoginModal } from '@/components/auth/LoginModal';

interface HeaderSidbarLayoutProps {
  children: React.ReactNode;
}

export const HeaderSidbarLayout: React.FC<HeaderSidbarLayoutProps> = ({ children }) => {
  return (
    <div className="app-container h-screen flex flex-col">
      <SidebarContent />
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
