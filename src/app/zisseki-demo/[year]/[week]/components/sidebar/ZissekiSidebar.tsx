"use client"

import React, { useState, useEffect } from "react";
import "../../styles.css";
import { useEventContext } from "../../context/EventContext";
import { TimeGridEvent } from "../../types";
import { eventActions } from "../../hooks/reducer/event/eventActions";
import { 
  SidebarHeader, 
  SidebarEmpty, 
  SidebarBasic,
  SidebarActiveCodeEditor,
  DeleteButton,
  ProjectSelect
} from "./ui";
import { Tab, TAB } from "./ui/types";
import { useZissekiStore } from "../../store/zissekiStore";


/**
 * 実績入力サイドバー（個別コンポーネント直接使用版）
 * - 各フィールドコンポーネントを直接配置
 * - EventFormコンテナを使用しない
 * - プロジェクトデータはContextから取得
 */
export const ZissekiSidebar = () => {
  
  // EventContextから必要な状態と関数を取得
  // - selectedEvent: 現在選択されているイベント（TimeGridEvent型）
  // - handleUpdateEvent: イベント更新関数（updateEventとしてエイリアス設定）
  // - handleDeleteEvent: イベント削除関数（deleteEventとしてエイリアス設定）
  // - dispatch: Reduxライクな状態管理のディスパッチ関数
  const { selectedEvent, handleUpdateEvent: updateEvent, handleDeleteEvent: deleteEvent, dispatch } = useEventContext();
  
  // ZissekiStoreからプロジェクト一覧を取得
  const { projects } = useZissekiStore();


  
  // アクティビティコードからタブ状態を判定する関数
  // Reactでは、このような計算ロジックを関数として分離することで、
  // コンポーネントの可読性と再利用性を向上させる
  const getActiveTab = (): Tab => {
    // 選択されたイベントが存在しない、またはアクティビティコードが空の場合
    // デフォルトで「プロジェクト」タブを返す
    if (!selectedEvent?.activityCode) return TAB.PROJECT;
    
    // アクティビティコードの最初の文字を取得
    // 例: "Z001" → "Z", "P123" → "P"
    const firstChar = selectedEvent.activityCode.charAt(0);
    
    // 最初の文字が'Z'の場合は間接業務、それ以外は直接業務（プロジェクト）
    // 三項演算子を使用して条件分岐を簡潔に表現
    return firstChar === 'Z' ? TAB.INDIRECT : TAB.PROJECT;
  };

  // アクティビティコードからサブタブを判定する関数
  // タブの種類（プロジェクト or 間接業務）に応じて、2文字目でサブタブを決定
  const getSubTab = (): string => {
    // 選択されたイベントが存在しない、またはアクティビティコードが2文字未満の場合
    // タブの種類に応じてデフォルト値を返す
    if (!selectedEvent?.activityCode || selectedEvent.activityCode.length < 2) {
      return activeTab === TAB.PROJECT ? '計画' : '純間接';
    }
    
    // アクティビティコードの1文字目でタブの種類を判定
    const firstChar = selectedEvent.activityCode.charAt(0);
    // アクティビティコードの2文字目でサブタブを判定
    const secondChar = selectedEvent.activityCode.charAt(1);
    
    // プロジェクトタブの場合
    if (firstChar !== 'Z') {
      switch (secondChar) {
        case 'P': return '計画';    // Planning
        case 'D': return '設計';    // Design
        case 'M': return '会議';    // Meeting
        case 'B': return '購入品';  // Purchase
        case 'O': return 'その他';  // Other
        default: return '計画';     // デフォルト
      }
    }
    // 間接業務タブの場合
    else {
      switch (secondChar) {
        case 'P': return '純間接';    // Pure Indirect
        case 'M': return '目的間接';  // Mission Indirect
        case 'K': return '控除';      // Deduction
        default: return '純間接';   // デフォルト
      }
    }
  };

  // 現在アクティブなタブを計算して取得
  // getActiveTab()関数を呼び出して、選択されたイベントのアクティビティコードに基づいて
  // どのタブ（プロジェクト or 間接業務）を表示すべきかを決定
  const activeTab = getActiveTab();

  // 現在アクティブなサブタブを計算して取得
  // getSubTab()関数を呼び出して、アクティビティコードの1文字目と2文字目に基づいて
  // どのサブタブを表示すべきかを決定
  const activeSubTab = getSubTab();

  // タブ変更時の処理
  const handleTabChange = (eventId: string, newTab: Tab) => {
    if (selectedEvent && selectedEvent.id === eventId) {
      let newActivityCode = '';
      
      if (newTab === TAB.PROJECT) {
        newActivityCode = 'P000';
      } else if (newTab === TAB.INDIRECT) {
        newActivityCode = 'Z000';
      }

      const updatedEvent = {
        ...selectedEvent,
        activityCode: newActivityCode,
        selectedTab: newTab
      };

      // イベントを更新
      updateEvent(updatedEvent);
      dispatch(eventActions.setSelectedEvent(updatedEvent));
    }
  };

  // ローカル状態で入力値を管理
  const [localValues, setLocalValues] = useState({
    title: '',
    description: '',
    project: '',
    activityCode: ''
  });

  // サブタブ状態の管理（動的に計算された値を使用）
  const [selectedSubTab, _setSelectedSubTab] = useState<string>(activeSubTab);

  // 選択イベントが変わったらローカル状態とサブタブ状態を更新
  useEffect(() => {
    if (selectedEvent) {
      setLocalValues({
        title: selectedEvent.title || '',
        description: selectedEvent.description || '',
        project: selectedEvent.project || '',
        activityCode: selectedEvent.activityCode || ''
      });
      
      // サブタブも動的に更新
      const newSubTab = getSubTab();
      _setSelectedSubTab(newSubTab);
    }
  }, [selectedEvent]);

  // 入力中の変更はローカル状態のみ更新
  const handleLocalChange = (field: keyof typeof localValues, value: string) => {
    setLocalValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // blurイベント時にイベント情報を更新し、再選択
  const handleFieldBlur = (field: string, value: string) => {
    if (!selectedEvent) return;
    
    const updatedEvent = {
      ...selectedEvent,
      [field]: value
    };
    updateEvent(updatedEvent);
    dispatch(eventActions.setSelectedEvent(updatedEvent));
  };

  // セレクトボックスは即座に更新し、再選択
  const handleSelectChange = (field: string, value: string) => {
    if (!selectedEvent) return;

    setLocalValues(prev => ({
      ...prev,
      [field]: value
    }));
    const updatedEvent = {
      ...selectedEvent,
      [field]: value
    };
    updateEvent(updatedEvent);
    dispatch(eventActions.setSelectedEvent(updatedEvent));
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent();
      dispatch(eventActions.setSelectedEvent(null));
    }
  };

  // SidebarActiveCodeEditor用のupdateEventラッパー
  const handleUpdateEvent = (updates: Partial<TimeGridEvent>) => {
    if (selectedEvent) {
      const updatedEvent = { ...selectedEvent, ...updates };
      updateEvent(updatedEvent);
      dispatch(eventActions.setSelectedEvent(updatedEvent));
    }
  };

  if (!selectedEvent) {
    return (
      <div className="sidebar-container">
        <div className="sidebar-card">
          <SidebarHeader 
            title="業務詳細" 
            eventId=""
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <div className="sidebar-section">
            <SidebarEmpty message="イベントを選択してください" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-container">
      <div className="sidebar-card">
        
        <SidebarHeader 
          title="業務詳細"
          eventId={selectedEvent.id}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div className="sidebar-section"> 
          <ProjectSelect
              value={localValues.project}
              onLocalChange={(value) => handleSelectChange('project', value)}
              projects={projects}
            />
        </div>
        <hr className="sidebar-divider" />
        <SidebarBasic
          form={{
            title: localValues.title,
            description: localValues.description,
            project: localValues.project,
            activityCode: localValues.activityCode,
            onLocalChange: (field: string, value: string) => handleLocalChange(field as keyof typeof localValues, value),
            onCommit: (field: string, value: string) => handleFieldBlur(field, value)
          }}
        />
        
        {/* 業務分類コードエディター */}
        <SidebarActiveCodeEditor
          state={{
            selectedTab: activeTab,
            projectSubTab: selectedSubTab,
            indirectSubTab: selectedSubTab
          }}
          event={{
            selectedEvent,
            updateEvent: handleUpdateEvent
          }}
        />

        <div className="sidebar-section"> 
          <div className="sidebar-spacing">
            <DeleteButton onDelete={handleDeleteEvent} />
          </div>
        </div>

      </div>
    </div>
  );
};