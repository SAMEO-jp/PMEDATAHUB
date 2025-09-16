"use client"

import React, { useState, useEffect } from "react";
import "../../styles.css";
import { useEventContext } from "../../context/EventContext";
import { useDatabase } from "../../context/DatabaseContext";
import { TimeGridEvent } from "../../types";
import { eventActions } from "../../hooks/reducer/event/eventActions";
import {
  SidebarHeader,
  SidebarEmpty,
  SidebarBasic,
  SidebarActiveCodeEditor,
  DeleteButton,
  ProjectSelect,
  SetsubiSelect,
  KounyuSelect,
  ColorPicker,
  ProgressSelect
} from "./ui";
import { Tab, TAB } from "./ui/types";
import { useZissekiStore } from "../../store/zissekiStore";
import { useProjectAssignments } from "../../hooks/useProjectAssignments";
import { parseActivityCode } from "./utils/businessCodeUtils";

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

  // DatabaseContextからユーザー情報を取得
  const { userInfo } = useDatabase();

  console.log('ZissekiSidebar: userInfo from DatabaseContext:', userInfo);

  // プロジェクト参加情報と担当装備・購入品情報を取得
  const { userProjects, getSetsubiByProject, getKounyuByProject } = useProjectAssignments(userInfo);

  console.log('ZissekiSidebar: userProjects from hook:', userProjects);

  // ZissekiStoreからプロジェクト一覧を取得（フォールバック）
  const { projects } = useZissekiStore();

  // ローカル状態で入力値を管理
  const [localValues, setLocalValues] = useState({
    title: '',
    description: '',
    project: '',
    setsubi: '', // 選択された装備（製番）
    kounyu: '', // 選択された購入品（管理番号）
    activityCode: '',
    color: '#3B82F6', // デフォルトカラー
    status: '' // 進捗状況
  });

  // 現在のタブ状態を計算（プロジェクト/間接業務の選択のみ）
  const getCurrentTab = (): Tab => {
    if (!selectedEvent?.activityCode) return TAB.PROJECT;

    const parsed = parseActivityCode(selectedEvent.activityCode);
    return parsed?.mainTab === 'indirect' ? TAB.INDIRECT : TAB.PROJECT;
  };

  // 購入品タブかどうかを判定
  const isPurchaseTab = (): boolean => {
    if (!selectedEvent?.activityCode) return false;
    const parsed = parseActivityCode(selectedEvent.activityCode);
    return parsed?.mainTab === 'project' && parsed?.subTab === '購入品';
  };

  // タブ変更時の処理（プロジェクト/間接業務の切り替えのみ）
  const handleTabChange = (eventId: string, newTab: Tab) => {
    if (selectedEvent && selectedEvent.id === eventId) {
      let newActivityCode = '';
      
      if (newTab === TAB.PROJECT) {
        newActivityCode = 'PP01'; // プロジェクトのデフォルトコード
      } else if (newTab === TAB.INDIRECT) {
        newActivityCode = 'ZW04'; // 間接業務のデフォルトコード
      }

      const updatedEvent = {
        ...selectedEvent,
        activityCode: newActivityCode
      };

      // イベントを更新
      updateEvent(updatedEvent);
      dispatch(eventActions.setSelectedEvent(updatedEvent));
    }
  };

  // 選択イベントが変わったらローカル状態を更新
  useEffect(() => {
    if (selectedEvent) {
      setLocalValues({
        title: selectedEvent.title || '',
        description: selectedEvent.description || '',
        project: selectedEvent.project || '',
        setsubi: selectedEvent.setsubi || '',
        kounyu: selectedEvent.kounyu || '',
        activityCode: selectedEvent.activityCode || '',
        color: selectedEvent.color || '#3B82F6',
        status: selectedEvent.status || ''
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

    // プロジェクトが変更された場合は、装備と購入品の選択をリセット
    const resetFields = field === 'project' ? { setsubi: '', kounyu: '' } : {};

    setLocalValues(prev => ({
      ...prev,
      [field]: value,
      ...resetFields
    }));

    const updatedEvent = {
      ...selectedEvent,
      [field]: value,
      ...resetFields
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
            activeTab={TAB.PROJECT}
            onTabChange={() => {}}
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
          activeTab={getCurrentTab()}
          onTabChange={handleTabChange}
        />
                <div className="sidebar-section">
          <ProjectSelect
              value={localValues.project}
              onLocalChange={(value) => handleSelectChange('project', value)}
              projects={userProjects.length > 0 ? userProjects : projects}
            />
        </div>

        {/* プロジェクトが選択されている場合のみ表示 */}
        {localValues.project && (
          <>
            {/* 装備選択（購入品タブ以外の場合） */}
            {!isPurchaseTab() && (
              <div className="sidebar-section">
                <SetsubiSelect
                  value={localValues.setsubi}
                  onLocalChange={(value) => handleSelectChange('setsubi', value)}
                  setsubiList={getSetsubiByProject(localValues.project)}
                  disabled={!localValues.project}
                />
              </div>
            )}

            {/* 購入品選択（購入品タブの場合） */}
            {isPurchaseTab() && (
              <div className="sidebar-section">
                <KounyuSelect
                  value={localValues.kounyu}
                  onLocalChange={(value) => handleSelectChange('kounyu', value)}
                  kounyuList={getKounyuByProject(localValues.project)}
                  disabled={!localValues.project}
                />
              </div>
            )}
          </>
        )}

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
        
        {/* イベントの色設定 */}
        <div className="sidebar-section sidebar-section-compact">
          <ColorPicker
            currentColor={localValues.color}
            onColorChange={(color) => handleSelectChange('color', color)}
            label="イベントの色"
          />
        </div>
        
        {/* 進捗状況設定 */}
        <div className="sidebar-section sidebar-section-compact">
          <ProgressSelect
            currentProgress={localValues.status}
            onProgressChange={(status) => handleSelectChange('status', status)}
            label="進捗状況"
          />
        </div>
        
        {/* 業務分類コードエディター */}
        <SidebarActiveCodeEditor
          selectedEvent={selectedEvent}
          onEventUpdate={handleUpdateEvent}
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