'use client';

import React from 'react';
import { ModernSidebar } from './ModernSidebar';
import { ModernHeader } from './ModernHeader';

interface ModernLayoutProps {
  children: React.ReactNode;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <ModernSidebar />
      <ModernHeader />
      <div className="main-content-wrapper">
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}; 