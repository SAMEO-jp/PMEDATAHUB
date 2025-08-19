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

interface ZissekiSidebarProps {
  projects: Array<{
    projectCode?: string;
    projectName?: string;
    name?: string;
    [key: string]: string | number | boolean | undefined;
  }>;
}

/**
 * 実績入力サイドバー（個別コンポーネント直接使用版）
 * - 各フィールドコンポーネントを直接配置
 * - EventFormコンテナを使用しない
 */
export const ZissekiSidebar = ({ projects }: ZissekiSidebarProps) => {
  const { selectedEvent, handleUpdateEvent: updateEvent, handleDeleteEvent: deleteEvent, dispatch } = useEventContext();

  // アクティビティコードからタブ状態を判定
  const getActiveTab = (): 'project' | 'indirect' => {
    if (!selectedEvent?.activityCode) return 'project';
    const firstChar = selectedEvent.activityCode.charAt(0);
    return firstChar === 'Z' ? 'indirect' : 'project';
  };

  const activeTab = getActiveTab();

  // タブ変更時の処理
  const handleTabChange = (eventId: string, newTab: 'project' | 'indirect') => {
    if (selectedEvent && selectedEvent.id === eventId) {
      let newActivityCode = '';
      
      if (newTab === 'project') {
        newActivityCode = 'P000';
      } else if (newTab === 'indirect') {
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
  const handleUpdateEvent = (updatedEvent: TimeGridEvent) => {
    if (selectedEvent) {
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
              onChange={(value) => handleSelectChange('project', value)}
              projects={projects}
            />

        </div>
      {/* 区切り線 */}
      <hr className="border-gray-200" />
        <SidebarBasic
          title={localValues.title}
          description={localValues.description}
          onTitleChange={(value) => handleLocalChange('title', value)}
          onDescriptionChange={(value) => handleLocalChange('description', value)}
          onTitleBlur={(value) => handleFieldBlur('title', value)}
          onDescriptionBlur={(value) => handleFieldBlur('description', value)}
        />
        


        {/* 業務分類コードエディター */}
        <SidebarActiveCodeEditor
          selectedTab={activeTab}
          selectedProjectSubTab={selectedProjectSubTab}
          selectedIndirectSubTab={selectedIndirectSubTab}
          selectedEvent={selectedEvent}
          updateEvent={handleUpdateEvent}
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