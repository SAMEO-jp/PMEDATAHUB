import React from 'react';
import { TRPCProvider } from '@src/lib/trpc/Provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { HeaderSidbarLayout } from '@/components/layout/HeaderSidbarLayout';
import { MainLayout } from '@/components/layout-main';
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
      <body style={{ overflow: 'auto' }}>
        <TRPCProvider>
          <AuthProvider>
            <HeaderSidbarLayout>
              <MainLayout>
                {children}
              </MainLayout>
            </HeaderSidbarLayout>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
