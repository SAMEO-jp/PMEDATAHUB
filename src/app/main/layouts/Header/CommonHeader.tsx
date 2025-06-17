'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@ui/button';
import { LoginModal } from '../../components/loginmodal/LoginModal';
import { useLoginContext } from '../../components/loginmodal/LoginContext';

interface CommonHeaderProps {
  children?: React.ReactNode;
}

export function CommonHeader({ children }: CommonHeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { currentUser, logout } = useLoginContext();

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-2">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {children}
          </div>
          <nav className="flex items-center space-x-2">
            <Link href="/app_bom">
              <Button variant="ghost" className="px-2">BOM管理</Button>
            </Link>
            <Link href="/app_table">
              <Button variant="ghost" className="px-2">テーブル管理</Button>
            </Link>
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {currentUser.name_japanese}
                </span>
                <Button variant="ghost" onClick={logout} className="px-2">
                  ログアウト
                </Button>
              </div>
            ) : (
              <Button variant="ghost" onClick={() => setIsLoginModalOpen(true)} className="px-2">
                ログイン
              </Button>
            )}
          </nav>
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
} 