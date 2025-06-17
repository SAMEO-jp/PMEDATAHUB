import React from 'react';
import { Header } from '@/src/app/main/layouts/Header/index';
import { Sidebar } from '@/src/app/main/layouts/Sidebar';
import { LoginProvider } from './main/components/loginmodal/LoginContext';
import './globals.css';

export const metadata = {
  title: '業務システム',
  description: 'BOM管理とテーブル管理のための業務システム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <LoginProvider>
          <Header />
          <Sidebar />
          <main className="pl-64 pt-16 min-h-screen bg-gray-50">
            {children}
          </main>
        </LoginProvider>
      </body>
    </html>
  );
}
