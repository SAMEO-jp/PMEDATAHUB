"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TimeGridEvent } from "../../../types";
import { SUBTABS } from "../../../constants";
import { useEventContext } from "../../../context/EventContext";
import { 
  ActivityCodeField,
  MainSubTabs,
  DetailSubTabs,
  DetailClassifications,
  TimeInputField
} from "../ui";
import { ActiveCodeEditorProps, TAB } from "../ui/types";

// サブタブ設定の型定義
interface SubTabConfig {
  name: string;
  color: string;
  subTabs?: string[];
}
import { 
  ClassificationItem,
  PROJECT_DETAIL_CLASSIFICATIONS,
  INDIRECT_DETAIL_CLASSIFICATIONS,
  generateProjectActivityCode,
  generateIndirectActivityCode,
  generateDefaultCode
} from "../../../constants/activity-codes";

/**
 * SidebarActiveCodeEditor コンポーネント
 * 
 * 実績管理システムにおける業務分類コード（activityCode）の編集を行うコンポーネント。
 * week-shiwakeの詳細分類を基に、より詳細なエディターとして設計。
 * 
 * 主要機能:
 * - プロジェクトタブと間接業務タブの両方に対応
 * - サブタブ選択機能（プロジェクト: 計画/設計/会議/購入品/その他、間接業務: 純間接/目的間接/控除）
 * - 詳細な業務分類コードの自動生成と表示
 * - 直感的なUIでのコード編集
 * - リアルタイムでのコード更新
 * - EventContextとの統合
 */
// 既存の型定義を削除し、新しい型を使用



// プロジェクトサブタブの設定
const PROJECT_SUBTAB_CONFIGS: Record<string, SubTabConfig> = {
  計画: { name: '計画', color: 'green', subTabs: SUBTABS.計画 },
  設計: { name: '設計', color: 'green', subTabs: SUBTABS.設計 },
  会議: { name: '会議', color: 'green', subTabs: SUBTABS.会議 },
  購入品: { name: '購入品', color: 'green', subTabs: SUBTABS.購入品 },
  その他: { name: 'その他', color: 'green', subTabs: SUBTABS.その他 },
};

// 間接業務サブタブの設定
const INDIRECT_SUBTAB_CONFIGS: Record<string, SubTabConfig> = {
  純間接: { name: '純間接', color: 'blue', subTabs: SUBTABS.純間接 },
  目的間接: { name: '目的間接', color: 'blue', subTabs: SUBTABS.目的間接 },
  控除: { name: '控除', color: 'blue', subTabs: SUBTABS.控除時間 },
};

export const SidebarActiveCodeEditor = ({
  state,
  event
}: ActiveCodeEditorProps) => {
  // stateやeventがundefinedの場合は早期リターン
  if (!state || !event) {
    return (
      <div className="p-4 text-center text-gray-500">
        データを読み込み中...
      </div>
    );
  }

  const { selectedTab, projectSubTab: selectedProjectSubTab, indirectSubTab: selectedIndirectSubTab } = state;
  const { selectedEvent, updateEvent } = event;
  // Event ContextからhandleUpdateEventを取得（推奨の更新方法）
  const { handleUpdateEvent: contextUpdateEvent } = useEventContext();

  // 統合されたサブタブ状態管理（初期状態で詳細サブタブを選択済みにする）
  const [subTabStates, setSubTabStates] = useState<Record<string, string>>({
    project: '計画',
    indirect: '純間接',
    planning: SUBTABS.計画?.[0] || '',
    design: SUBTABS.設計?.[0] || '',
    meeting: SUBTABS.会議?.[0] || '',
    other: SUBTABS.その他?.[0] || '',
  });

  // ローカル状態で現在のコードを管理
  const [currentCode, setCurrentCode] = useState<string>('');

  /**
   * サブタブ状態を更新する関数
   */
  const updateSubTabState = useCallback((key: string, value: string) => {
    setSubTabStates(prev => ({ ...prev, [key]: value }));
  }, []);

  // 現在のメインサブタブを取得
  const currentMainSubTab = selectedTab === 'project' 
    ? subTabStates.project 
    : subTabStates.indirect;

  // 現在の詳細サブタブを取得（純粋関数に変更）
  const currentDetailSubTab = useMemo(() => {
    // 購入品の場合は特別な処理
    if (selectedTab === 'project' && currentMainSubTab === '購入品') {
      return '購入品';
    }

    const subTabKey = selectedTab === 'project' 
      ? currentMainSubTab === '計画' ? 'planning'
      : currentMainSubTab === '設計' ? 'design'
      : currentMainSubTab === '会議' ? 'meeting'
      : currentMainSubTab === 'その他' ? 'other'
      : 'default' // 空文字列を避けるためデフォルト値を設定
      : 'default'; // 空文字列を避けるためデフォルト値を設定
    
    // 詳細サブタブが未選択の場合は、デフォルト値を返す（副作用なし）
    const currentValue = subTabStates[subTabKey] || '';
    if (!currentValue && selectedTab === 'project') {
      const defaultSubTab = SUBTABS[currentMainSubTab]?.[0] || '';
      return defaultSubTab;
    }
    
    return currentValue;
  }, [selectedTab, currentMainSubTab, subTabStates]);

  // 詳細サブタブの自動設定（副作用をuseEffectで処理）
  useEffect(() => {
    if (selectedTab === 'project' && currentMainSubTab !== '購入品') {
      const subTabKey = currentMainSubTab === '計画' ? 'planning'
        : currentMainSubTab === '設計' ? 'design'
        : currentMainSubTab === '会議' ? 'meeting'
        : currentMainSubTab === 'その他' ? 'other'
        : null;
      
      if (subTabKey && !subTabStates[subTabKey]) {
        const defaultSubTab = SUBTABS[currentMainSubTab]?.[0] || '';
        if (defaultSubTab) {
          updateSubTabState(subTabKey, defaultSubTab);
        }
      }
    }
  }, [selectedTab, currentMainSubTab, subTabStates, updateSubTabState]);

  // 選択されたイベントのコードを初期化
  useEffect(() => {
    if (selectedEvent?.activityCode) {
      setCurrentCode(selectedEvent.activityCode);
    } else {
      // イベントがない場合は、現在の選択状態に基づいてデフォルトコードを生成
      const defaultCode = generateDefaultCode(selectedTab, currentMainSubTab, currentDetailSubTab);
      setCurrentCode(defaultCode);
    }
  }, [selectedEvent?.activityCode, selectedTab, currentMainSubTab, currentDetailSubTab]);

  // イベント選択時にサイドバーの状況を更新
  useEffect(() => {
    if (selectedEvent?.activityCode) {
      const activityCode = selectedEvent.activityCode;
      
      // activityCodeからタブとサブタブを解析
      if (activityCode.length >= 3) {
        const firstChar = activityCode.charAt(0);
        const thirdChar = activityCode.charAt(2);
        
        // プロジェクトタブの場合
        if (firstChar === 'P' || firstChar === 'D' || firstChar === 'M' || firstChar === 'O') {
          let mainTab = '';
          let detailTab = '';
          
          // メインタブの判定
          if (firstChar === 'P') {
            // 購入品の場合は特別処理
            if (activityCode.startsWith('P1')) {
              mainTab = '購入品';
              detailTab = '購入品';
            } else {
              mainTab = '計画';
              // 3文字目で詳細タブを判定
              if (thirdChar === 'P') detailTab = '計画図';
              else if (thirdChar === 'C') detailTab = '検討書';
              else if (thirdChar === 'T') detailTab = '見積り';
            }
          } else if (firstChar === 'D') {
            mainTab = '設計';
            // 3文字目で詳細タブを判定
            if (thirdChar === 'P') detailTab = '計画図';
            else if (thirdChar === 'S') detailTab = '詳細図';
            else if (thirdChar === 'K') detailTab = '組立図';
            else if (thirdChar === 'R') detailTab = '改正図';
          } else if (firstChar === 'M') {
            mainTab = '会議';
            // 3文字目で詳細タブを判定
            if (thirdChar === 'N') detailTab = '内部定例';
            else if (thirdChar === 'G') detailTab = '外部定例';
            else if (thirdChar === 'J') detailTab = 'プロ進行';
            else if (thirdChar === 'O') detailTab = 'その他';
          } else if (firstChar === 'O') {
            mainTab = 'その他';
            // 3文字目で詳細タブを判定
            if (thirdChar === 'T') detailTab = '出張';
            else if (thirdChar === 'C') detailTab = '〇対応';
            else if (thirdChar === 'M') detailTab = 'プロ管理';
            else if (thirdChar === 'D') detailTab = '資料';
            else if (thirdChar === 'P') detailTab = '購入品管理';
          }
          
          // メインタブを更新
          if (mainTab) {
            setSubTabStates(prev => ({ ...prev, project: mainTab }));
          }
          
          // 詳細タブを更新
          if (detailTab) {
            const subTabKey = mainTab === '計画' ? 'planning'
              : mainTab === '設計' ? 'design'
              : mainTab === '会議' ? 'meeting'
              : mainTab === 'その他' ? 'other'
              : 'default';
            setSubTabStates(prev => ({ ...prev, [subTabKey]: detailTab }));
          }
        }
        // 間接業務タブの場合
        else if (firstChar === 'I' || firstChar === 'O') {
          let mainTab = '';
          if (firstChar === 'I') {
            mainTab = '純間接';
          } else if (firstChar === 'O') {
            mainTab = '目的間接';
          }
          
          if (mainTab) {
            setSubTabStates(prev => ({ ...prev, indirect: mainTab }));
          }
        }
      }
    }
  }, [selectedEvent?.activityCode]);

  // サブタブの初期化と詳細サブタブの自動選択
  useEffect(() => {
    if (selectedProjectSubTab) {
      setSubTabStates(prev => ({ 
        ...prev, 
        project: selectedProjectSubTab,
        // メインサブタブに応じて詳細サブタブも自動選択
        planning: selectedProjectSubTab === '計画' ? (prev.planning || SUBTABS.計画?.[0] || '') : prev.planning,
        design: selectedProjectSubTab === '設計' ? (prev.design || SUBTABS.設計?.[0] || '') : prev.design,
        meeting: selectedProjectSubTab === '会議' ? (prev.meeting || SUBTABS.会議?.[0] || '') : prev.meeting,
        other: selectedProjectSubTab === 'その他' ? (prev.other || SUBTABS.その他?.[0] || '') : prev.other,
      }));
    }
    if (selectedIndirectSubTab) {
      setSubTabStates(prev => ({ ...prev, indirect: selectedIndirectSubTab }));
    }
  }, [selectedProjectSubTab, selectedIndirectSubTab]);

  /**
   * イベントを更新する関数
   */
  const updateEventWithCode = (newCode: string, additionalData: Partial<TimeGridEvent> = {}) => {
    if (!selectedEvent) return;

    const updatedEvent: TimeGridEvent = {
      ...selectedEvent,
      activityCode: newCode,
      ...additionalData
    };

    // Event ContextのupdateEventを使用（推奨）
    if (contextUpdateEvent && selectedEvent?.id) {
      contextUpdateEvent(updatedEvent);
    } else if (updateEvent) {
      // フォールバック: propsから渡されたupdateEventを使用
      updateEvent(updatedEvent);
    }
  };

  /**
   * メインサブタブのハンドラー
   */
  const handleMainSubTabSelect = (tab: string) => {
    updateSubTabState(selectedTab, tab);
    const configs = selectedTab === 'project' ? PROJECT_SUBTAB_CONFIGS : INDIRECT_SUBTAB_CONFIGS;
    const defaultSubTab = configs[tab].subTabs?.[0] || '';
    
    // 詳細サブタブも自動選択（購入品以外）
    if (selectedTab === 'project' && tab !== '購入品') {
      const subTabKey = tab === '計画' ? 'planning'
        : tab === '設計' ? 'design'
        : tab === '会議' ? 'meeting'
        : tab === 'その他' ? 'other'
        : 'default'; // 空文字列を避けるためデフォルト値を設定
      updateSubTabState(subTabKey, defaultSubTab);
    }
    
    // 購入品の場合は特別な処理
    if (selectedTab === 'project' && tab === '購入品') {
      const purchaseClassifications = getPurchaseClassifications();
      if (purchaseClassifications.length > 0) {
        const defaultCode = generateProjectActivityCode('購入品', '購入品', purchaseClassifications[0], '購入品');
        setCurrentCode(defaultCode);
        updateEventWithCode(defaultCode, getProjectAdditionalData(purchaseClassifications[0]));
      }
    } else {
      const defaultCode = generateDefaultCode(selectedTab, tab, defaultSubTab);
      setCurrentCode(defaultCode);
      updateEventWithCode(defaultCode);
    }
  };

  /**
   * 詳細サブタブのハンドラー
   */
  const handleDetailSubTabSelect = (tab: string) => {
    const subTabKey = currentMainSubTab === '計画' ? 'planning'
      : currentMainSubTab === '設計' ? 'design'
      : currentMainSubTab === '会議' ? 'meeting'
      : currentMainSubTab === 'その他' ? 'other'
      : 'default'; // 空文字列を避けるためデフォルト値を設定
    
    updateSubTabState(subTabKey, tab);
    const defaultCode = generateDefaultCode('project', currentMainSubTab, tab);
    setCurrentCode(defaultCode);
    updateEventWithCode(defaultCode, {
      subTabType: tab
    });
  };

  /**
   * 詳細分類のハンドラー
   */
  const handleClassificationSelect = (newCode: string, additionalData: Partial<TimeGridEvent>) => {
    setCurrentCode(newCode);
    updateEventWithCode(newCode, additionalData);
  };

  /**
   * プロジェクト分類データを取得
   */
  const getProjectClassifications = (): ClassificationItem[] | null => {
    if (currentMainSubTab === '計画') {
      return PROJECT_DETAIL_CLASSIFICATIONS.計画[currentDetailSubTab as keyof typeof PROJECT_DETAIL_CLASSIFICATIONS.計画] || null;
    } else if (currentMainSubTab === '設計') {
      return PROJECT_DETAIL_CLASSIFICATIONS.設計;
    } else if (currentMainSubTab === '会議') {
      return PROJECT_DETAIL_CLASSIFICATIONS.会議.会議種類;
    } else if (currentMainSubTab === 'その他') {
      return PROJECT_DETAIL_CLASSIFICATIONS.その他[currentDetailSubTab as keyof typeof PROJECT_DETAIL_CLASSIFICATIONS.その他] || null;
    } else if (currentMainSubTab === '購入品') {
      // 購入品の場合は特別な処理
      return SUBTABS.購入品?.map((item, index) => ({
        name: item,
        code: `P${index.toString().padStart(2, '0')}00`
      })) || null;
    }
    return null;
  };

  /**
   * プロジェクト追加データを取得
   */
  const getProjectAdditionalData = (classification: ClassificationItem): Partial<TimeGridEvent> => {
    if (currentMainSubTab === '計画') {
      return {
        planningSubType: classification.name,
        subTabType: currentDetailSubTab
      };
    } else if (currentMainSubTab === '設計') {
      return {
        designSubType: classification.name,
        subTabType: currentDetailSubTab
      };
    } else if (currentMainSubTab === '会議') {
      return {
        meetingType: classification.name,
        subTabType: currentDetailSubTab
      };
    } else if (currentMainSubTab === 'その他') {
      return {
        [currentDetailSubTab === "出張" ? "travelType" : 
         currentDetailSubTab === "〇対応" ? "stakeholderType" :
         currentDetailSubTab === "プロ管理" ? "projectManagementType" :
         "documentType"]: classification.name
      };
    } else if (currentMainSubTab === '購入品') {
      return {
        // purchaseTypeは型定義にないため、適切なプロパティを使用
        category: classification.name
      };
    }
    return {};
  };

  /**
   * 間接業務追加データを取得
   */
  const getIndirectAdditionalData = (detailTab: string, classification: ClassificationItem): Partial<TimeGridEvent> => {
    return {
      [detailTab === "会議" ? "meetingType" :
       detailTab === "人事評価" ? "evaluationType" :
       detailTab === "作業" ? "workType" :
       detailTab === "休憩" ? "breakType" : "otherType"]: classification.name,
      category: currentMainSubTab
    };
  };

  /**
   * 間接業務分類データを取得
   */
  const getIndirectClassifications = () => {
    return INDIRECT_DETAIL_CLASSIFICATIONS[currentMainSubTab as keyof typeof INDIRECT_DETAIL_CLASSIFICATIONS];
  };

  /**
   * 購入品分類データを取得
   */
  const getPurchaseClassifications = (): ClassificationItem[] => {
    return SUBTABS.購入品?.map((item, index) => ({
      name: item,
      code: `P${index.toString().padStart(2, '0')}00`
    })) || [];
  };

  return (
    <div className="p-2">
      {/* 現在のコード表示 */}
      <div className="mb-1.5">
        <ActivityCodeField 
          value={currentCode}
          label="現在の業務分類コード"
          show={false}
        />
      </div>

      {/* 区切り線 */}
      <hr className="border-gray-200 mb-1.5" />

      {/* メインサブタブ選択 */}
      <div className="mb-1.5">
        <MainSubTabs
          selectedTab={selectedTab}
          currentMainSubTab={currentMainSubTab}
          onTabSelect={handleMainSubTabSelect}
          projectSubTabConfigs={PROJECT_SUBTAB_CONFIGS}
          indirectSubTabConfigs={INDIRECT_SUBTAB_CONFIGS}
        />
      </div>

      {/* 区切り線 */}
      <hr className="border-gray-200 mb-1.5" />

      {/* 詳細サブタブ選択 */}
      <div className="mb-1.5">
        <DetailSubTabs
          selectedTab={selectedTab}
          currentMainSubTab={currentMainSubTab}
          currentDetailSubTab={currentDetailSubTab}
          onTabSelect={handleDetailSubTabSelect}
          projectSubTabConfigs={PROJECT_SUBTAB_CONFIGS}
        />
      </div>

      {/* 区切り線 */}
      <hr className="border-gray-200 mb-1.5" />

      {/* 詳細分類タブ */}
      <div className="mb-1.5">
        <DetailClassifications
          state={{
            selectedTab: selectedTab,
            mainSubTab: currentMainSubTab,
            detailSubTab: currentDetailSubTab,
            currentCode: currentCode
          }}
          actions={{
            onSelect: handleClassificationSelect,
            getProjectClassifications: getProjectClassifications,
            getIndirectClassifications: getIndirectClassifications,
            generateProjectCode: generateProjectActivityCode,
            generateIndirectCode: generateIndirectActivityCode,
            getProjectData: getProjectAdditionalData,
            getIndirectData: getIndirectAdditionalData,
            getPurchaseClassifications: getPurchaseClassifications
          }}
        />
      </div>

      {/* 区切り線 */}
      <hr className="border-gray-200 mb-1.5" />

      {/* 時間入力フォーム */}
      <div className="mb-1.5">
        <TimeInputField 
          state={{
            selectedEvent: selectedEvent,
            label: "時間設定"
          }}
          actions={{
            onEventUpdate: (eventId, updates) => {
              if (selectedEvent && contextUpdateEvent) {
                contextUpdateEvent({ ...selectedEvent, ...updates });
              } else if (selectedEvent && updateEvent) {
                updateEvent({ ...selectedEvent, ...updates });
              }
            }
          }}
        />
      </div>

      {/* 区切り線 */}
      <hr className="border-gray-200 mb-1.5" />

      {/* 説明 */}
      {/* <div>
        <Instructions />
      </div> */}
    </div>
  );
};