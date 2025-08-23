'use client';

import React from 'react';
import { ErrorDisplay } from '../ui/ErrorDisplay';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useEventContext } from '../../context/EventContext';
import { useWorkTimeReducer } from '../../hooks/reducer/useWorkTimeReducer';
import { useZissekiStore } from '../../store/zissekiStore';

interface ZissekiPageWrapperProps {
  children: React.ReactNode;
}

export function ZissekiPageWrapper({ children }: ZissekiPageWrapperProps) {
  // ========================================
  // 状態管理フック
  // ========================================
  
  // Zustandストア（マスターデータ）
  const { 
    loading: storeLoading, 
    error: storeError, 
    isInitialized,
    initializeFromStorage
  } = useZissekiStore();

  // 統合された状態管理
  const eventState = useEventContext();
  const workTimeState = useWorkTimeReducer();

  // ========================================
  // 初期化
  // ========================================
  
  // 初期化（初回のみ）
  React.useEffect(() => {
    if (!isInitialized) {
      initializeFromStorage();
    }
  }, [isInitialized, initializeFromStorage]);

  // ========================================
  // エラーハンドリング
  // ========================================
  
  // 統合されたエラー状態
  const hasError = storeError || workTimeState.error || eventState.error;
  const errorMessage = storeError || workTimeState.error || eventState.error;

  // エラーをクリアする関数
  const clearAllErrors = () => {
    // エラー状態をリセット（実装が必要な場合は適切なメソッドを呼び出す）
    console.log('Clearing errors...');
  };

  // ========================================
  // ローディング状態
  // ========================================
  
  const isLoading = storeLoading || workTimeState.loading || eventState.loading || !isInitialized;

  // ========================================
  // エラー表示
  // ========================================
  
  if (hasError) {
    return (
      <ErrorDisplay 
        error={errorMessage} 
        onClear={clearAllErrors}
      />
    );
  }

  // ========================================
  // ローディング表示
  // ========================================
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // ========================================
  // メインコンテンツ
  // ========================================
  
  return <>{children}</>;
}
