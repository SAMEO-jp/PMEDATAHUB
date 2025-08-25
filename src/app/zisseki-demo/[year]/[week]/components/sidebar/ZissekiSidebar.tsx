"use client"

import React, { useState, useEffect } from "react";
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
import { Tab, TAB, Project } from "./ui/types";
import { useZissekiStore } from "../../store/zissekiStore";

interface ZissekiSidebarProps {
  // projectsはContextから取得するため、Propsから削除
}

/**
 * 実績入力サイドバー（個別コンポーネント直接使用版）
 * - 各フィールドコンポーネントを直接配置
 * - EventFormコンテナを使用しない
 * - プロジェクトデータはContextから取得
 */
export const ZissekiSidebar = ({}: ZissekiSidebarProps) => {
  const { selectedEvent, handleUpdateEvent: updateEvent, handleDeleteEvent: deleteEvent, dispatch } = useEventContext();
  const { projects } = useZissekiStore();

  // アクティビティコードからタブ状態を判定
  const getActiveTab = (): Tab => {
    if (!selectedEvent?.activityCode) return TAB.PROJECT;
    const firstChar = selectedEvent.activityCode.charAt(0);
    return firstChar === 'Z' ? TAB.INDIRECT : TAB.PROJECT;
  };

  const activeTab = getActiveTab();

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

  // サブタブ状態の管理
  const [selectedProjectSubTab, setSelectedProjectSubTab] = useState<string>('計画');
  const [selectedIndirectSubTab, setSelectedIndirectSubTab] = useState<string>('目的間接');

  // 選択イベントが変わったらローカル状態を更新
  useEffect(() => {
    if (selectedEvent) {
      setLocalValues({
        title: selectedEvent.title || '',
        description: selectedEvent.description || '',
        project: selectedEvent.project || '',
        activityCode: selectedEvent.activityCode || ''
      });
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
      <div className="w-80 ml-4">
        <div className="bg-white rounded-lg shadow">
          <SidebarHeader 
            title="業務詳細" 
            eventId=""
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <div className="p-2">
            <SidebarEmpty message="イベントを選択してください" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 ml-4">
      <div className="bg-white rounded-lg shadow">
        
        <SidebarHeader 
          title="業務詳細"
          eventId={selectedEvent.id}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
                <div className="p-2"> 
      {/* 区切り線 */}
      <hr className="border-gray-200" />
          <ProjectSelect
              value={localValues.project}
              onLocalChange={(value) => handleSelectChange('project', value)}
              projects={projects}
            />

        </div>
      {/* 区切り線 */}
      <hr className="border-gray-200" />
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
            projectSubTab: selectedProjectSubTab,
            indirectSubTab: selectedIndirectSubTab
          }}
          event={{
            selectedEvent,
            updateEvent: handleUpdateEvent
          }}
        />

        <div className="p-2"> 
          <div className="space-y-2">
            <DeleteButton onDelete={handleDeleteEvent} />
          </div>
        </div>


      </div>
    </div>
  );
};