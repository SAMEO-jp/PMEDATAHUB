import React from 'react';
import { TRPCProvider } from '@src/lib/trpc/Provider';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { ModernLayout } from '@/src/components/layout/ModernLayout';
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
      <body style={{ overflow: 'hidden' }}>
        <TRPCProvider>
          <AuthProvider>
            <ModernLayout>
              {children}
            </ModernLayout>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
