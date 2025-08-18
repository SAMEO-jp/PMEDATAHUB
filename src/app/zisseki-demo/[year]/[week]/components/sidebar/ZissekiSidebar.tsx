"use client"

import React, { useState, useEffect } from "react";
import { useEventContext } from "../../context/EventContext";
import { 
  SidebarHeader, 
  SidebarEmpty, 
  DeleteButton,
  TitleField,
  DescriptionField,
  ProjectSelect,
  ActivityCodeField
} from "./components";

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
  const { selectedEvent, updateEvent, setSelectedEvent, deleteEvent } = useEventContext();

  // アクティビティコードからタブ状態を判定
  const getActiveTab = (): 'project' | 'indirect' => {
    if (!selectedEvent?.activityCode) return 'project';
    const firstChar = selectedEvent.activityCode.charAt(0);
    return firstChar === 'Z' ? 'indirect' : 'project';
  };

  const activeTab = getActiveTab();

  // タブ変更時の処理
  const handleTabChange = (newTab: 'project' | 'indirect') => {
    if (selectedEvent) {
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

      // 直接更新とセレクトを実行
      updateEvent(selectedEvent.id, updatedEvent);
      setSelectedEvent(updatedEvent);
    }
  };

  // ローカル状態で入力値を管理
  const [localValues, setLocalValues] = useState({
    title: '',
    description: '',
    project: '',
    activityCode: ''
  });

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
    updateEvent(selectedEvent.id, updatedEvent);
    setSelectedEvent(updatedEvent);
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
    updateEvent(selectedEvent.id, updatedEvent);
    setSelectedEvent(updatedEvent);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setSelectedEvent(null);
    }
  };

  if (!selectedEvent) {
    return (
      <div className="w-80 ml-4">
        <div className="bg-white rounded-lg shadow">
          <SidebarHeader 
            title="業務詳細" 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <div className="p-4">
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
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <div className="p-4">
          <div className="space-y-4">
            <TitleField
              value={localValues.title}
              onChange={(value) => handleLocalChange('title', value)}
              onBlur={(value) => handleFieldBlur('title', value)}
            />
            
            <DescriptionField
              value={localValues.description}
              onChange={(value) => handleLocalChange('description', value)}
              onBlur={(value) => handleFieldBlur('description', value)}
            />
            
            <ProjectSelect
              value={localValues.project}
              onChange={(value) => handleSelectChange('project', value)}
              projects={projects}
            />
            
            <ActivityCodeField
              value={localValues.activityCode}
            />

            <DeleteButton onDelete={handleDeleteEvent} />
          </div>
        </div>
      </div>
    </div>
  );
};