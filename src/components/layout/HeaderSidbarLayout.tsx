'use client';

import React from 'react';
import { SidebarContent } from './SidebarContent';
import { HeaderContent } from './HeaderContent';
import { LoginModal } from '@/src/components/auth/LoginModal';

interface HeaderSidbarLayoutProps {
  children: React.ReactNode;
}

export const HeaderSidbarLayout: React.FC<HeaderSidbarLayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <SidebarContent />
      <HeaderContent />
      <div className="main-content-wrapper">
        <main className="main-content">
          {children}
        </main>
      </div>
      
      {/* ログインモーダル - 認証コンテキストで管理 */}
      <LoginModal />
    </div>
  );
};
