"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { useEventReducer } from '../hooks/reducer/useEventReducer';

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