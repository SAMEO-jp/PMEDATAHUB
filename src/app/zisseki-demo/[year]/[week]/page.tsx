"use client"

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';
import { EventProvider } from './context/EventContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { ZissekiPageWrapper } from './components/layout/ZissekiPageWrapper';
import { ZissekiMainContent } from './components/layout/ZissekiMainContent';
import { useHeader } from '@/components/layout/header/store/headerStore';
import { getPreviousWeek, getNextWeek, getCurrentWeek } from './utils/weekUtils';
import { useDatabase } from './context/DatabaseContext';
import { useEventContext } from './context/EventContext';
import type { WorkTimeData } from './types';

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
  const router = useRouter();
  const { setDisplayConfig } = useHeader();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const saveFunctionRef = useRef<(() => Promise<void>) | null>(null);

  // 週ナビゲーション関数
  const goToPreviousWeek = () => {
    const { year: prevYear, week: prevWeek } = getPreviousWeek(year, week);
    router.push(`/zisseki-demo/${prevYear}/${prevWeek}`);
  };

  const goToNextWeek = () => {
    const { year: nextYear, week: nextWeek } = getNextWeek(year, week);
    router.push(`/zisseki-demo/${nextYear}/${nextWeek}`);
  };

  const goToCurrentWeek = () => {
    const { year: currentYear, week: currentWeek } = getCurrentWeek();
    router.push(`/zisseki-demo/${currentYear}/${currentWeek}`);
  };

  // 保存ボタンのクリックハンドラー
  const handleSave = useCallback(async () => {
    // 既に保存中の場合は何もしない
    if (saveStatus === 'saving') {
      return;
    }

    try {
      setSaveStatus('saving');
      setErrorMessage('');

      // refに設定された保存関数を呼び出し
      if (saveFunctionRef.current) {
        await saveFunctionRef.current();
        setSaveStatus('success');
      } else {
        throw new Error('保存関数が見つかりません');
      }

      // 3秒後に成功状態をリセット
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);

    } catch (error: unknown) {
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '保存に失敗しました');
      
      // 5秒後にエラー状態をリセット
      setTimeout(() => {
        setSaveStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  }, [saveStatus]);

  // ヘッダーに実績管理のタイトルと全てのアクションを設定
  useEffect(() => {
    setDisplayConfig({
      title: '実績管理',
      subtitle: `${year}年 第${week}週`,
      actions: [
        {
          id: 'prev-week',
          label: '← 前週',
          onClick: goToPreviousWeek,
          variant: 'outline'
        },
        {
          id: 'next-week',
          label: '次週 →',
          onClick: goToNextWeek,
          variant: 'outline'
        },
        {
          id: 'current-week',
          label: '今週',
          onClick: goToCurrentWeek,
          variant: 'primary'
        },
        {
          id: 'save',
          label: saveStatus === 'saving' ? '保存中...' : '保存',
          onClick: handleSave,
          variant: 'primary'
        }
      ]
    });
  }, [year, week, saveStatus, setDisplayConfig]);

  return (
    <DatabaseProvider year={year} week={week}>
      <EventProvider year={year} week={week}>
        <ZissekiPageWrapper>
          <ZissekiMainContent 
            year={year} 
            week={week} 
            onSave={handleSave}
            saveFunctionRef={saveFunctionRef}
          />
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