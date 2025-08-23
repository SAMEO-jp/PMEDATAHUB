import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="flex-1 overflow-auto h-full">
      <div className="p-0 h-full">
        {children}
      </div>
    </main>
  );
}
