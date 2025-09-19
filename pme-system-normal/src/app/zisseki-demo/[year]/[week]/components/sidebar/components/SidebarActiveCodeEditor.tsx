/* eslint-disable no-fallthrough */
"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TimeGridEvent } from "../../../types";
import { useEventContext } from "../../../context/EventContext";
import { 
  ActivityCodeField,
  MainSubTabs,
  DetailSubTabs,
  DetailClassifications,
  TimeInputField
} from "../ui";
import { 
  parseActivityCode,
  getCodesForPath,
  getDetailTabs,
  getSubTabs,
  getDefaultBusinessCodeState,
  getCodeFromPath
} from "../utils/businessCodeUtils";

// ============================================================================
// 型定義セクション
// ============================================================================

interface SimpleActiveCodeEditorProps {
  selectedEvent: TimeGridEvent | null;
  onEventUpdate?: (updates: Partial<TimeGridEvent>) => void;
}

interface ClassificationInfo {
  name: string;
  code: string;
}

// ============================================================================
// メインコンポーネント
// ============================================================================

/**
 * サイドバーアクティブコードエディター
 * 大幅簡素化: 400行+のparseActivityCode関数を削除し、JSONベースの動的処理に変更
 */
export const SidebarActiveCodeEditor = ({
  selectedEvent,
  onEventUpdate
}: SimpleActiveCodeEditorProps) => {
  const { handleUpdateEvent: contextUpdateEvent } = useEventContext();

  // ============================================================================
  // 状態管理セクション
  // ============================================================================

  /**
   * 現在のactivityCodeから状態を解析（大幅簡素化）
   */
  const currentState = useMemo(() => {
    const activityCode = selectedEvent?.activityCode || '';
    return parseActivityCode(activityCode) || getDefaultBusinessCodeState();
  }, [selectedEvent?.activityCode]);

  /**
   * ローカル状態管理（UI操作用）
   */
  const [localState, setLocalState] = useState(currentState);

  // selectedEventが変更されたらローカル状態を更新
  useEffect(() => {
    setLocalState(currentState);
  }, [currentState]);

  // ============================================================================
  // データ準備セクション（動的生成）
  // ============================================================================

  /**
   * プロジェクトサブタブ設定（動的生成）
   */
  const projectSubTabConfigs = useMemo(() => {
    const configs: Record<string, { name: string; color: string; subTabs?: string[] }> = {};
    const projectSubTabs = getSubTabs('project');
    
    projectSubTabs.forEach(tab => {
      const detailTabs = getDetailTabs('project', tab);
      configs[tab] = { 
        name: tab, 
        color: 'green', 
        subTabs: detailTabs 
      };
    });
    
    return configs;
  }, []);

  /**
   * 間接業務サブタブ設定（動的生成）
   */
  const indirectSubTabConfigs = useMemo(() => {
    const configs: Record<string, { name: string; color: string; subTabs?: string[] }> = {};
    const indirectSubTabs = getSubTabs('indirect');
    
    indirectSubTabs.forEach(tab => {
      const detailTabs = getDetailTabs('indirect', tab);
      configs[tab] = { 
        name: tab, 
        color: 'blue', 
        subTabs: detailTabs 
      };
    });
    
    return configs;
  }, []);

  // ============================================================================
  // イベント更新関数セクション
  // ============================================================================

  /**
   * イベント更新関数
   */
  const updateEvent = useCallback((updates: Partial<TimeGridEvent>) => {
    if (contextUpdateEvent && selectedEvent?.id) {
      contextUpdateEvent(updates);
    } else if (onEventUpdate) {
      onEventUpdate(updates);
    }
  }, [contextUpdateEvent, onEventUpdate, selectedEvent?.id]);

  // ============================================================================
  // イベントハンドラーセクション
  // ============================================================================

  /**
   * メインサブタブ選択ハンドラー
   */
  const handleMainSubTabSelect = useCallback((subTab: string) => {
    const newState = { ...localState, subTab };
    const detailTabs = getDetailTabs(localState.mainTab, subTab);
    const defaultDetailTab = detailTabs[0] || '';
    const finalState = { ...newState, detailTab: defaultDetailTab };
    
    setLocalState(finalState);
    
    // デフォルトの分類を取得
    const codes = getCodesForPath(finalState.mainTab, finalState.subTab, finalState.detailTab);
    const defaultClassification = codes[0]?.name || '';
    const newCode = getCodeFromPath(finalState.mainTab, finalState.subTab, finalState.detailTab, defaultClassification);
    
    if (newCode) {
      updateEvent({ activityCode: newCode });
    }
  }, [localState, updateEvent]);

  /**
   * 詳細サブタブ選択ハンドラー
   */
  const handleDetailSubTabSelect = useCallback((detailTab: string) => {
    const newState = { ...localState, detailTab };
    setLocalState(newState);
    
    // デフォルトの分類を取得
    const codes = getCodesForPath(newState.mainTab, newState.subTab, newState.detailTab);
    const defaultClassification = codes[0]?.name || '';
    const newCode = getCodeFromPath(newState.mainTab, newState.subTab, newState.detailTab, defaultClassification);
    
    if (newCode) {
      updateEvent({ activityCode: newCode });
    }
  }, [localState, updateEvent]);

  /**
   * 分類選択ハンドラー
   */
  const handleClassificationSelect = useCallback((newCode: string, additionalData: Partial<TimeGridEvent>) => {
    updateEvent({ activityCode: newCode, ...additionalData });
  }, [updateEvent]);

  // ============================================================================
  // 早期リターンセクション
  // ============================================================================

  // データがない場合の表示
  if (!selectedEvent) {
    return (
      <div className="p-4 text-center text-gray-500">
        イベントを選択してください
      </div>
    );
  }

  // ============================================================================
  // レンダリングセクション
  // ============================================================================

  // 現在のコード
  const currentCode = selectedEvent.activityCode || '';

  return (
    <div className="zisseki-demo p-1">
      {/* 現在のコード表示 */}
      <div className="mb-1">
        <ActivityCodeField 
          value={currentCode}
          label="現在の業務分類コード"
          show={false}
        />
      </div>

      {/* メインサブタブ選択 */}
      <div className="mb-1">
        <MainSubTabs
          selectedTab={localState.mainTab}
          currentMainSubTab={localState.subTab}
          onTabSelect={handleMainSubTabSelect}
          projectSubTabConfigs={projectSubTabConfigs}
          indirectSubTabConfigs={indirectSubTabConfigs}
        />
      </div>

      {/* 詳細サブタブ選択 */}
      <div className="mb-1">
        <DetailSubTabs
          selectedTab={localState.mainTab}
          currentMainSubTab={localState.subTab}
          currentDetailSubTab={localState.detailTab}
          onTabSelect={handleDetailSubTabSelect}
          projectSubTabConfigs={projectSubTabConfigs}
          indirectSubTabConfigs={indirectSubTabConfigs}
        />
      </div>

      {/* 詳細分類タブ（動的生成） */}
      <div className="mb-1">
        <DetailClassifications
          state={{
            selectedTab: localState.mainTab,
            mainSubTab: localState.subTab,
            detailSubTab: localState.detailTab,
            currentCode: currentCode
          }}
          actions={{
            onSelect: handleClassificationSelect,
            getClassifications: () => {
              return getCodesForPath(localState.mainTab, localState.subTab, localState.detailTab);
            },
            generateCode: (subTab: string, detailTab: string, classification: ClassificationInfo) => {
              return getCodeFromPath(localState.mainTab, subTab, detailTab, classification.name) || '';
            },
            getAdditionalData: (detailTab: string, classification: ClassificationInfo) => {
              return {
                classification: classification.name,
                category: localState.subTab,
                subTabType: detailTab
              };
            },
            getPurchaseClassifications: () => {
              return getCodesForPath(localState.mainTab, localState.subTab, localState.detailTab);
            }
          }}
        />
      </div>

      {/* 時間入力フォーム */}
      <div className="mb-1">
        <TimeInputField 
          state={{
            selectedEvent: selectedEvent,
            label: "時間設定"
          }}
          actions={{
            onEventUpdate: (eventId, updates) => {
                updateEvent({ 
                  ...updates,
                color: selectedEvent.color ?? '#3788d8'
                });
            }
          }}
        />
      </div>

    </div>
  );
};