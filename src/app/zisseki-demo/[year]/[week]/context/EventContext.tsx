"use client"

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useEventReducer } from '../hooks/reducer/useEventReducer';
import { useAuthContext } from '@/contexts/AuthContext';
import { generateUserSampleData, generateGuestSampleData } from '../utils/sampleDataGenerator';

// EventContextの型定義
type EventContextType = ReturnType<typeof useEventReducer>;

// Contextの作成
const EventContext = createContext<EventContextType | null>(null);

// Providerコンポーネント  
export const EventProvider = ({ 
  children, 
  year, 
  week 
}: { 
  children: ReactNode;
  year: number;
  week: number;
}) => {
  const eventReducer = useEventReducer();
  const { user, isAuthenticated } = useAuthContext();

  // ユーザー固有のサンプルデータを初期化
  useEffect(() => {
    let sampleData;
    
    if (isAuthenticated && user?.user_id) {
      // ログインユーザーのサンプルデータを生成
      sampleData = generateUserSampleData(user.user_id, year, week);
      console.log(`Generated ${sampleData.length} events for user ${user.user_id}`);
    } else {
      // ゲストユーザーのサンプルデータを生成
      sampleData = generateGuestSampleData(year, week);
      console.log(`Generated ${sampleData.length} guest events`);
    }
    
    // イベントデータを設定
    eventReducer.dispatch({ type: 'SET_EVENTS', payload: sampleData });
  }, [user?.user_id, isAuthenticated, year, week, eventReducer.dispatch]);

  return (
    <EventContext.Provider value={eventReducer}>
      {children}
    </EventContext.Provider>
  );
};

// Hook for using the context
export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
}; 