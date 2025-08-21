"use client"

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useZissekiOperations } from '@src/hooks/useZissekiData';
import type { TimeGridEvent, WorkTimeData } from '../types';

// DatabaseContextの型定義
type DatabaseContextType = {
  // データ
  events: TimeGridEvent[];
  workTimes: WorkTimeData[];
  metadata: {
    year: number;
    week: number;
    lastModified: string;
    totalEvents: number;
  } | undefined;
  
  // 状態
  isLoading: boolean;
  error: any;
  isSaving: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isInitialized: boolean;
  
  // 操作
  saveWeekData: (events: TimeGridEvent[], workTimes: WorkTimeData[]) => Promise<any>;
  updateEvent: (eventId: string, event: Partial<TimeGridEvent>) => Promise<any>;
  deleteEvent: (eventId: string) => Promise<any>;
  refetch: () => void;
  initialize: () => void;
};

// Contextの作成
const DatabaseContext = createContext<DatabaseContextType | null>(null);

// Providerコンポーネント
export const DatabaseProvider = ({ 
  children, 
  year, 
  week 
}: { 
  children: ReactNode;
  year: number;
  week: number;
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 常にHookを呼び出す（React Hooksのルールに従う）
  const operations = useZissekiOperations(year, week);
  
  const initialize = useCallback(() => {
    console.log('DatabaseContext: 初期化を開始');
    setIsInitialized(true);
  }, []);
  
  // 初期化されていない場合は、空のデータを返す
  const contextValue: DatabaseContextType = {
    // データ
    events: isInitialized ? operations.events : [],
    workTimes: isInitialized ? operations.workTimes : [],
    metadata: isInitialized ? operations.metadata : undefined,
    
    // 状態
    isLoading: isInitialized ? operations.isLoading : false,
    error: isInitialized ? operations.error : null,
    isSaving: isInitialized ? operations.isSaving : false,
    isUpdating: isInitialized ? operations.isUpdating : false,
    isDeleting: isInitialized ? operations.isDeleting : false,
    isInitialized,
    
    // 操作
    saveWeekData: isInitialized ? operations.saveWeekData : (async () => { throw new Error('Database not initialized'); }),
    updateEvent: isInitialized ? operations.updateEvent : (async () => { throw new Error('Database not initialized'); }),
    deleteEvent: isInitialized ? operations.deleteEvent : (async () => { throw new Error('Database not initialized'); }),
    refetch: isInitialized ? operations.refetch : (() => { throw new Error('Database not initialized'); }),
    initialize,
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Hook for using the context
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

