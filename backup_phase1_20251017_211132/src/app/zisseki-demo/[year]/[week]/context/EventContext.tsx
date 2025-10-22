"use client"

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
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

  // Outlookイベントを読み込む
  useEffect(() => {
    const loadOutlookEvents = () => {
      try {
        const outlookEventsKey = `outlook_events_${year}_${week}`;
        const storedEvents = localStorage.getItem(outlookEventsKey);
        
        if (storedEvents) {
          const outlookEvents = JSON.parse(storedEvents);
          console.log('🗂️ 既存のOutlookイベントを読み込み中:', outlookEvents.length, '件');
          console.log('📋 既存イベント詳細:', outlookEvents.map((e: any) => ({ id: e.id, title: e.title, startTime: e.startTime, endTime: e.endTime })));
          
          // OutlookイベントをTimeGridEvent形式に変換して追加
          outlookEvents.forEach((workItem: any) => {
            // キャンセルされたイベントをスキップ
            if (workItem.title && workItem.title.startsWith('Canceled:')) {
              console.log('🚫 キャンセルされたイベントをスキップ:', workItem.title);
              return;
            }
            
            // イベントの位置を計算
            const startDate = new Date(workItem.startTime);
            const endDate = new Date(workItem.endTime);
            
            // 時間から位置を計算（1時間 = 64px）
            const HOUR_HEIGHT = 64;
            const startHours = startDate.getHours() + startDate.getMinutes() / 60;
            const endHours = endDate.getHours() + endDate.getMinutes() / 60;
            
            // デバッグ用：workItemの内容を確認
            console.log('🔍 workItemの内容:', workItem);
            console.log('🎨 色:', workItem.color);
            console.log('📊 進捗:', workItem.status);
            console.log('🏷️ 分類コード:', workItem.categoryCode);
            
            const timeGridEvent = {
              id: workItem.id,
              title: workItem.title, // 元の件名を使用
              startDateTime: workItem.startTime,
              endDateTime: workItem.endTime,
              description: workItem.description || '',
              project: workItem.project || '', // 構造化データのプロジェクト
              color: workItem.color || '#3B82F6', // 構造化データの色を優先
              top: startHours * HOUR_HEIGHT, // 計算された位置
              height: Math.max((endHours - startHours) * HOUR_HEIGHT, 20), // 最小20px
              source: 'outlook',
              status: workItem.status || '未分類', // 構造化データの進捗
              categoryCode: workItem.categoryCode || 'PP01', // 構造化データの分類コード
              // 装置関連情報の追加
              equipmentNumber: workItem.equipmentNumber || '',
              equipmentName: workItem.equipmentName || '',
              equipment_id: workItem.equipment_id || '',
              equipment_Name: workItem.equipment_Name || '',
              // 購入品関連情報の追加
              itemName: workItem.itemName || '',
              // デフォルトの階層情報を設定
              hierarchy: {
                activeTab: "project",
                activeSubTabs: {
                  project: "企画・検討"
                }
              }
            };
            
            console.log('🎯 最終的なTimeGridEvent:', timeGridEvent);
            
            // 既存のイベントと重複しないかチェック
            const existingEvent = eventReducer.events.find(e => e.id === timeGridEvent.id);
            if (!existingEvent) {
              console.log('✅ Outlookイベントを追加:', timeGridEvent.title);
              eventReducer.createEvent(timeGridEvent);
            } else {
              console.log('⚠️ 重複する既存イベントをスキップ:', timeGridEvent.title);
            }
          });
        }
      } catch (error) {
        console.error('❌ Outlookイベントの読み込みエラー:', error);
      }
    };

    // カスタムイベントリスナーを追加
    const handleOutlookEventsLoaded = (event: CustomEvent) => {
      const { events } = event.detail;
      console.log('📡 Outlookイベント同期イベントを受信:', events.length, '件');
      console.log('📊 受信したイベント:', events);
      
      events.forEach((workItem: any) => {
        // キャンセルされたイベントをスキップ
        if (workItem.title && workItem.title.startsWith('Canceled:')) {
          console.log('🚫 キャンセルされたイベントをスキップ:', workItem.title);
          return;
        }
        
        // イベントの位置を計算
        const startDate = new Date(workItem.startTime);
        const endDate = new Date(workItem.endTime);
        
        // 時間から位置を計算（1時間 = 64px）
        const HOUR_HEIGHT = 64;
        const startHours = startDate.getHours() + startDate.getMinutes() / 60;
        const endHours = endDate.getHours() + endDate.getMinutes() / 60;
        
        // デバッグ用：workItemの内容を確認
        console.log('🔍 カスタムイベントのworkItem:', workItem);
        console.log('🎨 カスタムイベントの色:', workItem.color);
        console.log('📊 カスタムイベントの進捗:', workItem.status);
        console.log('🏷️ カスタムイベントの分類コード:', workItem.categoryCode);
        console.log('🔧 カスタムイベントのactivityCode:', workItem.activityCode);
        
        const timeGridEvent = {
          id: workItem.id,
          title: workItem.title, // 元の件名を使用
          startDateTime: workItem.startTime instanceof Date ? workItem.startTime.toISOString() : workItem.startTime,
          endDateTime: workItem.endTime instanceof Date ? workItem.endTime.toISOString() : workItem.endTime,
          description: workItem.description || '',
          project: workItem.project || '', // 構造化データのプロジェクト
          color: workItem.color || '#3B82F6', // 構造化データの色を優先
          top: startHours * HOUR_HEIGHT, // 計算された位置
          height: Math.max((endHours - startHours) * HOUR_HEIGHT, 20), // 最小20px
          source: 'outlook',
          status: workItem.status || '未分類', // 構造化データの進捗
          categoryCode: workItem.categoryCode || 'PP01', // 構造化データの分類コード
          activityCode: workItem.activityCode || '', // 業務コードを追加
          // 装置関連情報の追加
          equipmentNumber: workItem.equipmentNumber || '',
          equipmentName: workItem.equipmentName || '',
          equipment_id: workItem.equipment_id || '',
          equipment_Name: workItem.equipment_Name || '',
          // 購入品関連情報の追加
          itemName: workItem.itemName || '',
          hierarchy: {
            activeTab: "project",
            activeSubTabs: {
              project: "企画・検討"
            }
          }
        };
        
        console.log('🔄 変換されたTimeGridEvent:', timeGridEvent);
        
        // 既存のイベントと重複しないかチェック
        const existingEvent = eventReducer.events.find(e => e.id === timeGridEvent.id);
        if (!existingEvent) {
          console.log('➕ Outlookイベントを追加中:', timeGridEvent.title);
          eventReducer.createEvent(timeGridEvent);
          console.log('✅ Outlookイベントを同期追加:', timeGridEvent.title);
          console.log('📋 現在のイベント数:', eventReducer.events.length + 1);
        } else {
          console.log('⚠️ 重複するイベントをスキップ:', timeGridEvent.title);
        }
      });
      
      console.log('🎉 Outlookイベント同期完了。現在のイベント数:', eventReducer.events.length);
    };

    // 初期化後にOutlookイベントを読み込み
    const timer = setTimeout(loadOutlookEvents, 1000);
    
    // カスタムイベントリスナーを登録
    window.addEventListener('outlookEventsLoaded', handleOutlookEventsLoaded as EventListener);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('outlookEventsLoaded', handleOutlookEventsLoaded as EventListener);
    };
  }, [year, week, eventReducer]);

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