"use client"

import React from 'react';
import './styles.css';
import { EventProvider } from './context/EventContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { ZissekiPageWrapper } from './components/layout/ZissekiPageWrapper';
import { ZissekiMainContent } from './components/layout/ZissekiMainContent';

// ========================================
// メインページコンポーネント
// ========================================
function ZissekiPageContent({ 
  params 
}: { 
  params: { year: string; week: string } 
}) {
  const year = parseInt(params.year);
  const week = parseInt(params.week);

  return (
    <DatabaseProvider year={year} week={week}>
      <EventProvider year={year} week={week}>
        <ZissekiPageWrapper>
          <ZissekiMainContent year={year} week={week} />
        </ZissekiPageWrapper>
      </EventProvider>
    </DatabaseProvider>
  );
}

// ========================================
// エクスポート用のラッパーコンポーネント
// ========================================
export default function ZissekiPage({ params }: { params: { year: string; week: string } }) {
  return <ZissekiPageContent params={params} />;
}