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
  ProjectSetsubiSelect,
  ProjectKounyuSelect,
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

  // プロジェクト参加情報と担当装備・購入品情報を取得
  const { 
    userProjects, 
    getSetsubiByProject, 
    getKounyuByProject,
    getProjectSetsubiCombinations,
    getProjectKounyuCombinations
  } = useProjectAssignments(userInfo);

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

  // 現在のタブに応じてプロジェクトをフィルタリング
  const getFilteredProjects = () => {
    const currentTab = getCurrentTab();
    const allProjects = userProjects.length > 0 ? userProjects : projects;
    
    if (currentTab === TAB.PROJECT) {
      // プロジェクトタブ: IS_PROJECT = '1' のプロジェクトのみ
      return allProjects.filter((project: any) => {
        // userProjectsの場合は、元のデータからIS_PROJECTを確認
        if (userProjects.length > 0) {
          // userInfoから元のプロジェクトデータを取得してIS_PROJECTを確認
          const originalProject = userInfo?.projects?.find(p => p.project_id === project.code);
          // IS_PROJECTが'1'または未設定の場合はプロジェクトとして扱う
          return originalProject ? (originalProject.IS_PROJECT === '1' || originalProject.IS_PROJECT === undefined || originalProject.IS_PROJECT === null) : false;
        }
        // ZissekiStoreのprojectsの場合は、IS_PROJECTフィールドを直接確認
        return project.IS_PROJECT === '1' || project.IS_PROJECT === undefined || project.IS_PROJECT === null;
      });
    } else if (currentTab === TAB.INDIRECT) {
      // 間接業務タブ: IS_PROJECT = '0' のプロジェクトのみ
      return allProjects.filter((project: any) => {
        // userProjectsの場合は、元のデータからIS_PROJECTを確認
        if (userProjects.length > 0) {
          // userInfoから元のプロジェクトデータを取得してIS_PROJECTを確認
          const originalProject = userInfo?.projects?.find(p => p.project_id === project.code);
          // IS_PROJECTが明示的に'0'のもののみ
          return originalProject ? (originalProject.IS_PROJECT === '0') : false;
        }
        // ZissekiStoreのprojectsの場合は、IS_PROJECTフィールドを直接確認
        return project.IS_PROJECT === '0';
      });
    }
    
    return allProjects;
  };

  // フィルタリングされたプロジェクト一覧を取得
  const filteredProjects = getFilteredProjects();

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
        setsubi: selectedEvent.setsubi || selectedEvent.equipmentNumber || '',
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
    const resetFields = field === 'project' ? { 
      setsubi: '', 
      kounyu: '',
      equipmentNumber: '',
      equipmentName: '',
      equipment_id: '',
      equipment_Name: '',
      itemName: ''
    } : {};

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

  // 装置選択時の処理（詳細情報も一緒に保存）
  const handleSetsubiChange = (setsubiCode: string) => {
    if (!selectedEvent || !setsubiCode) return;

    // 選択された装置の詳細情報を取得
    const setsubiList = getSetsubiByProject(localValues.project);
    const selectedSetsubi = setsubiList.find(setsubi => setsubi.code === setsubiCode);

    if (selectedSetsubi) {
      setLocalValues(prev => ({
        ...prev,
        setsubi: setsubiCode,
        kounyu: '', // 購入品はリセット
        equipmentNumber: setsubiCode,
        equipmentName: selectedSetsubi.name,
        equipment_id: selectedSetsubi.id.toString(),
        equipment_Name: selectedSetsubi.name,
        itemName: '' // 購入品情報はリセット
      }));

      const updatedEvent = {
        ...selectedEvent,
        setsubi: setsubiCode,
        kounyu: '',
        equipmentNumber: setsubiCode,
        equipmentName: selectedSetsubi.name,
        equipment_id: selectedSetsubi.id.toString(),
        equipment_Name: selectedSetsubi.name,
        itemName: ''
      };
      updateEvent(updatedEvent);
      dispatch(eventActions.setSelectedEvent(updatedEvent));
    }
  };

  // 購入品選択時の処理（詳細情報も一緒に保存）
  const handleKounyuChange = (kounyuCode: string) => {
    if (!selectedEvent || !kounyuCode) return;

    // 選択された購入品の詳細情報を取得
    const kounyuList = getKounyuByProject(localValues.project);
    const selectedKounyu = kounyuList.find(kounyu => kounyu.code === kounyuCode);

    if (selectedKounyu) {
      setLocalValues(prev => ({
        ...prev,
        kounyu: kounyuCode,
        setsubi: '', // 装置はリセット
        itemName: selectedKounyu.name,
        equipmentNumber: '',
        equipmentName: '',
        equipment_id: '',
        equipment_Name: '' // 装置情報はリセット
      }));

      const updatedEvent = {
        ...selectedEvent,
        kounyu: kounyuCode,
        setsubi: '',
        itemName: selectedKounyu.name,
        equipmentNumber: '',
        equipmentName: '',
        equipment_id: '',
        equipment_Name: ''
      };
      updateEvent(updatedEvent);
      dispatch(eventActions.setSelectedEvent(updatedEvent));
    }
  };

  // プロジェクト-担当装置の組み合わせ選択時の処理
  const handleProjectSetsubiCombinationChange = (value: string) => {
    if (!selectedEvent || !value) return;

    // 値の形式: "projectId|setsubiCode"
    const [projectId, setsubiCode] = value.split('|');
    
    if (projectId && setsubiCode) {
      // 選択された装置の詳細情報を取得
      const setsubiList = getSetsubiByProject(projectId);
      const selectedSetsubi = setsubiList.find(setsubi => setsubi.code === setsubiCode);

      if (selectedSetsubi) {
        setLocalValues(prev => ({
          ...prev,
          project: projectId,
          setsubi: setsubiCode,
          kounyu: '', // 購入品はリセット
          equipmentNumber: setsubiCode,
          equipmentName: selectedSetsubi.name,
          equipment_id: selectedSetsubi.id.toString(),
          equipment_Name: selectedSetsubi.name,
          itemName: '' // 購入品情報はリセット
        }));

        const updatedEvent = {
          ...selectedEvent,
          project: projectId,
          setsubi: setsubiCode,
          kounyu: '',
          equipmentNumber: setsubiCode,
          equipmentName: selectedSetsubi.name,
          equipment_id: selectedSetsubi.id.toString(),
          equipment_Name: selectedSetsubi.name,
          itemName: ''
        };
        updateEvent(updatedEvent);
        dispatch(eventActions.setSelectedEvent(updatedEvent));
      }
    }
  };

  // プロジェクト-購入品の組み合わせ選択時の処理
  const handleProjectKounyuCombinationChange = (value: string) => {
    if (!selectedEvent || !value) return;

    // 値の形式: "projectId|kounyuCode"
    const [projectId, kounyuCode] = value.split('|');
    
    if (projectId && kounyuCode) {
      // 選択された購入品の詳細情報を取得
      const kounyuList = getKounyuByProject(projectId);
      const selectedKounyu = kounyuList.find(kounyu => kounyu.code === kounyuCode);

      if (selectedKounyu) {
        setLocalValues(prev => ({
          ...prev,
          project: projectId,
          kounyu: kounyuCode,
          setsubi: '', // 装備はリセット
          itemName: selectedKounyu.name,
          equipmentNumber: '',
          equipmentName: '',
          equipment_id: '',
          equipment_Name: '' // 装置情報はリセット
        }));

        const updatedEvent = {
          ...selectedEvent,
          project: projectId,
          kounyu: kounyuCode,
          setsubi: '',
          itemName: selectedKounyu.name,
          equipmentNumber: '',
          equipmentName: '',
          equipment_id: '',
          equipment_Name: ''
        };
        updateEvent(updatedEvent);
        dispatch(eventActions.setSelectedEvent(updatedEvent));
      }
    }
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
      <div className="sidebar-container h-full">
        <div className="sidebar-card h-full">
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
    <div className="sidebar-container h-full">
      <div className="sidebar-card h-full">
        
        <SidebarHeader 
          title="業務詳細"
          eventId={selectedEvent.id}
          activeTab={getCurrentTab()}
          onTabChange={handleTabChange}
        />
        {/* プロジェクト選択 */}
        <div className="sidebar-section sidebar-section-compact-spacing mt-2">
          <div className="flex items-center gap-1">
            <label className="text-xs font-medium text-gray-600 w-20 flex-shrink-0">プロジェクト</label>
            <div className="flex-1">
              <ProjectSelect
                value={localValues.project}
                onLocalChange={(value) => handleSelectChange('project', value)}
                projects={filteredProjects}
              />
            </div>
          </div>
        </div>

        {/* 装置/購入品選択（常に表示） */}
        {/* 装置選択（購入品タブ以外の場合） */}
        {!isPurchaseTab() && (
          <div className="sidebar-section sidebar-section-compact-spacing mt-2">
            <div className="flex items-center gap-1">
              <label className="text-xs font-medium text-gray-600 w-20 flex-shrink-0">担当装置</label>
              <div className="flex-1">
                {!localValues.project ? (
                  // プロジェクト未選択時はプロジェクト-担当装置の組み合わせ選択
                  <ProjectSetsubiSelect
                    value={`${localValues.project}|${localValues.setsubi}`}
                    onLocalChange={handleProjectSetsubiCombinationChange}
                    combinations={getProjectSetsubiCombinations()}
                    label=""
                  />
                ) : (
                  // プロジェクト選択済み時は通常の担当装置選択
                  <SetsubiSelect
                    value={localValues.setsubi}
                    onLocalChange={(value) => handleSetsubiChange(value)}
                    setsubiList={getSetsubiByProject(localValues.project)}
                    label=""
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* 購入品選択（購入品タブの場合） */}
        {isPurchaseTab() && (
          <div className="sidebar-section sidebar-section-compact-spacing mt-2">
            <div className="flex items-center gap-1">
              <label className="text-xs font-medium text-gray-600 w-20 flex-shrink-0">担当購入品</label>
              <div className="flex-1">
                {!localValues.project ? (
                  // プロジェクト未選択時はプロジェクト-購入品の組み合わせ選択
                  <ProjectKounyuSelect
                    value={`${localValues.project}|${localValues.kounyu}`}
                    onLocalChange={handleProjectKounyuCombinationChange}
                    combinations={getProjectKounyuCombinations()}
                    label=""
                  />
                ) : (
                  // プロジェクト選択済み時は通常の購入品選択
                  <KounyuSelect
                    value={localValues.kounyu}
                    onLocalChange={(value) => handleKounyuChange(value)}
                    kounyuList={getKounyuByProject(localValues.project)}
                    label=""
                  />
                )}
              </div>
            </div>
          </div>
        )}

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
        
        {/* イベントの色と進捗状況設定 */}
        <div className="sidebar-section sidebar-section-compact mt-0">
          <div className="grid grid-cols-2 gap-1">
            {/* 色設定 */}
            <div className="flex items-center gap-0.5">
              <span className="text-xs font-medium text-gray-600 w-6 pl-1">色</span>
              <ColorPicker
                currentColor={localValues.color}
                onColorChange={(color) => handleSelectChange('color', color)}
                label=""
              />
            </div>
            {/* 進捗設定 */}
            <div className="flex items-center gap-0.5">
              <span className="text-xs font-medium text-gray-600 w-6 pl-1">進捗</span>
              <ProgressSelect
                currentProgress={localValues.status}
                onProgressChange={(status) => handleSelectChange('status', status)}
                label=""
              />
            </div>
          </div>
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