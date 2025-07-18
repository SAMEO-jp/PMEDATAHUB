'use client';

import React from 'react';

interface MBOMLayoutProps {
  children: React.ReactNode;
}

export default function MBOMLayout({ children }: MBOMLayoutProps) {
  return (
    <div className="mbom-layout" style={{ 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <div className="mbom-content" style={{ 
        overflow: 'auto', 
        textAlign: 'left',
        flex: 1,
        padding: '1rem',
        paddingBottom: '6rem',
        overscrollBehavior: 'auto',
        WebkitOverflowScrolling: 'touch',
        minHeight: 0,
        position: 'relative'
      }}>
        {children}
      </div>
    </div>
  );
} 