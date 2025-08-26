/* eslint-disable no-fallthrough */
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
import { 
  ClassificationItem,
  PROJECT_DETAIL_CLASSIFICATIONS,
  INDIRECT_DETAIL_CLASSIFICATIONS,
  generateProjectActivityCode,
  generateIndirectActivityCode,
  generateDefaultCode
} from "../../../constants/activity-codes";

// ============================================================================
// 型定義セクション
// ============================================================================

/**
 * シンプルなProps型定義
 * 分割後: types/ActiveCodeEditorTypes.ts に移動予定
 */
interface SimpleActiveCodeEditorProps {
  selectedEvent: TimeGridEvent | null;
  onEventUpdate?: (updates: Partial<TimeGridEvent>) => void;
}

// ============================================================================
// ユーティリティ関数セクション
// 分割後: utils/activityCodeParser.ts に移動予定
// ============================================================================

/**
 * activityCodeから状態を解析する関数
 * 分割後: utils/activityCodeParser.ts に移動予定
 * @param activityCode - 解析対象のアクティビティコード
 * @returns 解析された状態オブジェクト
 */
const parseActivityCode = (activityCode: string) => {
  if (!activityCode || activityCode.length < 3) {
    return {
      mainTab: 'project' as const,
      subTab: '計画',
      detailTab: '計画図',
      classificationTab: '基本設計'
    };
  }

  const firstChar = activityCode.charAt(0);
  const secondChar = activityCode.charAt(1);
  
  // 下2桁を一つのコードとして取得
  const lastTwoDigits = activityCode.length >= 2 
    ? activityCode.slice(-2) 
    : '';
        
  // ============================================================================
  // プロジェクト系コード解析
  // 分割後: utils/activityCodeParser.ts に統合
  // ============================================================================
  if (['P', 'D', 'M', 'O', 'B'].includes(firstChar)) {
    let mainTab = 'project' as const;
    let subTab = '';
    let detailTab = '';
    let classificationTab = '';

    // サブタブの判定（1文字目で決定）
    mainTab = 'project';
    switch (firstChar) {
      case 'P': 
        subTab = '計画';
        switch (secondChar) {
          case 'P': 
            detailTab = '計画図';
            // 下2桁のコードで分類を判定
            switch (lastTwoDigits) {
              case '01': classificationTab = '作図及び作図準備';
              case '02': classificationTab = '作図指示';
              case '03': classificationTab = '検図';
              case '04': classificationTab = '承認作業';
              case '05': classificationTab = '出図前図面検討会';
              case '06': classificationTab = '出図後図面検討会';
              case '07': classificationTab = 'その他';
            }
            break;
          case 'C': 
            detailTab = '検討書';
            switch (lastTwoDigits) {
              case '01': classificationTab = '検討書作成及びサイン';
            }
            break;
          case 'T': 
            detailTab = '見積り';
            switch (lastTwoDigits) {
              case '01': classificationTab = '設計費見積書';
              case '02': classificationTab = '見積仕様書';
              case '03': classificationTab = 'テクスぺ';
              case '04': classificationTab = '製作品BQ';
              case '05': classificationTab = '工事BQ';
              case '06': classificationTab = '購入品見積';
              case '07': classificationTab = '区分見積';
              case '08': classificationTab = '予備品見積';
            }
            break;
        }
        break;
      case 'D': 
        subTab = '設計';
        if (secondChar === 'P') detailTab = '計画図';
        else if (secondChar === 'S') detailTab = '詳細図';
        else if (secondChar === 'K') detailTab = '組立図';
        else if (secondChar === 'R') detailTab = '改正図';
        // 設計はどの図面でも下2桁は同じ
        switch (lastTwoDigits) {
          case '01': classificationTab = '検討書作成及びサイン';
          case '02': classificationTab = '作図及び作図準備';
          case '03': classificationTab = '作図前図面検討会';
          case '04': classificationTab = '作図指示';
          case '05': classificationTab = '作図（外注あり）';
          case '06': classificationTab = '作図後図面検討会';
          case '07': classificationTab = '検図';
          case '08': classificationTab = '承認作業';
          case '09': classificationTab = '出図確認';
          case '10': classificationTab = '修正対応';
          case '11': classificationTab = 'その他';
        }
        break;
      case 'M': 
        subTab = '会議';
        if (secondChar === 'N') detailTab = '内部定例';
        else if (secondChar === 'G') detailTab = '外部定例';
        else if (secondChar === 'J') detailTab = 'プロ進行';
        else if (secondChar === 'O') detailTab = 'その他';
        // 会議も同様に下2桁で分類
        switch (lastTwoDigits) {
          case '01': classificationTab = '定例会';
          case '02': classificationTab = '実行方針会議';
          case '03': classificationTab = '全体品質会議';
          case '04': classificationTab = '個別品質会議';
          case '05': classificationTab = '部分品質会議';
          case '06': classificationTab = '試運転計画会議';
          case '07': classificationTab = '試運転安全審査';
          case '08': classificationTab = '完成報告';
          case '09': classificationTab = 'その他';
        }
        break;
      case 'O': 
        subTab = 'その他';
        if (secondChar === 'T') {
          detailTab = '出張';
          // 出張の詳細分類
          switch (lastTwoDigits) {
            case '01': classificationTab = '現場調査';
            case '02': classificationTab = '製造外注品検査・工場試運転対応';
            case '03': classificationTab = '現地試運転立会';
            case '04': classificationTab = '現地試運転ＳＶ';
            case '05': classificationTab = '現地3Dスキャン対応';
            case '06': classificationTab = '現地工事立会';
            case '07': classificationTab = '工事設計連絡員業務';
            case '08': classificationTab = '試運転基地対応業務';
            case '09': classificationTab = 'その他';
          }
        } else if (secondChar === 'C') {
          detailTab = '〇対応';
          // 〇対応の詳細分類
          switch (lastTwoDigits) {
            case '01': classificationTab = 'プロ管';
            case '02': classificationTab = '工事';
            case '03': classificationTab = '製造';
            case '04': classificationTab = '制御（電計）';
            case '05': classificationTab = '製鉄所';
            case '06': classificationTab = 'PFC';
            case '07': classificationTab = '土建';
            case '08': classificationTab = 'NSE_構造設計';
            case '09': classificationTab = 'NSE_CAESOL';
            case '10': classificationTab = '（ベンダー）';
            case '11': classificationTab = '設計　その他';
          }
        } else if (secondChar === 'M') {
          detailTab = 'プロ管理';
          // プロ管理の詳細分類
          switch (lastTwoDigits) {
            case '01': classificationTab = 'プロジェクト管理';
            case '02': classificationTab = '進捗管理';
            case '03': classificationTab = '品質管理';
            case '04': classificationTab = 'リスク管理';
            case '05': classificationTab = 'その他';
          }
        } else if (secondChar === 'D') {
          detailTab = '資料';
          // 資料の詳細分類
          switch (lastTwoDigits) {
            case '01': classificationTab = '資料作成';
            case '02': classificationTab = '資料整理';
            case '03': classificationTab = '資料配布';
            case '04': classificationTab = 'その他';
          }
        } else if (secondChar === 'O') {
          detailTab = 'その他';
          // その他の詳細分類
          switch (lastTwoDigits) {
            case '01': classificationTab = 'その他';
          }
        }
        break;
      case 'B': 
        subTab = '購入品';
        detailTab = '購入品';
        // 購入品の詳細分類
        switch (lastTwoDigits) {
          case '01': classificationTab = '計画図作成';
          case '02': classificationTab = '仕様書作成準備';
          case '03': classificationTab = '仕様書作成・発行';
          case '04': classificationTab = '見積仕様比較検討';
          case '05': classificationTab = '契約確定確認';
          case '06': classificationTab = 'KOM';
          case '07': classificationTab = '確定仕様対応';
          case '08': classificationTab = '納入図対応';
          case '09': classificationTab = '工事用資料整備';
          case '10': classificationTab = '図面化及び出図対応';
          case '11': classificationTab = '試運転要領';
          case '12': classificationTab = '取説';
          case '13': classificationTab = '検査要領対応';
          case '14': classificationTab = '検査対応';
          case '15': classificationTab = '出荷調整対応';
          case '16': classificationTab = '検定対応';
          case '17': classificationTab = 'その他';
        }
        break;
    }
          
    return { mainTab, subTab, detailTab, classificationTab };
  }
  
  // ============================================================================
  // 間接業務系コード解析
  // 分割後: utils/activityCodeParser.ts に統合
  // ============================================================================
  else if (['Z', 'O', 'I'].includes(firstChar)) {
    let mainTab = 'indirect' as const;
    let subTab = '';
    let detailTab = '';
    let classificationTab = '';

    if (firstChar === 'Z') {
      subTab = '純間接';
      if (secondChar === 'M') {
        detailTab = '会議';
        // 純間接の会議詳細分類
        switch (lastTwoDigits) {
          case '01': classificationTab = '定例会議';
          case '02': classificationTab = '臨時会議';
          case '03': classificationTab = '報告会';
          case '04': classificationTab = 'オンライン会議';
          case '05': classificationTab = 'その他';
        }
      } else if (secondChar === 'E') {
        detailTab = '人事評価';
        // 純間接の人事評価詳細分類
        switch (lastTwoDigits) {
          case '01': classificationTab = '目標設定';
          case '02': classificationTab = '中間レビュー';
          case '03': classificationTab = '年度評価';
          case '04': classificationTab = '部下面談';
          case '05': classificationTab = 'その他';
        }
      } else if (secondChar === 'W') {
        detailTab = '作業';
        // 純間接の作業詳細分類
        switch (lastTwoDigits) {
          case '01': classificationTab = '書類作成';
          case '02': classificationTab = '資料調査';
          case '03': classificationTab = 'データ整理';
          case '04': classificationTab = 'その他';
        }
      }
    } else if (firstChar === 'O') {
      subTab = '目的間接';
      if (secondChar === 'M') {
        detailTab = '会議';
        // 目的間接の会議詳細分類
        switch (lastTwoDigits) {
          case '01': classificationTab = '定例会議';
          case '02': classificationTab = '臨時会議';
          case '03': classificationTab = '報告会';
          case '04': classificationTab = 'オンライン会議';
          case '05': classificationTab = 'その他';
        }
      } else if (secondChar === 'W') {
        detailTab = '作業';
        // 目的間接の作業詳細分類
        switch (lastTwoDigits) {
          case '01': classificationTab = '書類作成';
          case '02': classificationTab = '資料調査';
          case '03': classificationTab = 'データ整理';
          case '04': classificationTab = 'その他';
        }
      }
    } else if (firstChar === 'I') {
      subTab = '控除';
      // 控除の詳細分類
      switch (lastTwoDigits) {
        case '01': classificationTab = '休憩';
        case '02': classificationTab = '昼食';
        case '03': classificationTab = 'その他';
      }
    }

    return { mainTab, subTab, detailTab, classificationTab };
  }

  // デフォルト
  return {
    mainTab: 'project' as const,
    subTab: '計画',
    detailTab: '計画図',
    classificationTab: '基本設計'
  };
};

/**
 * 状態からactivityCodeを生成する関数
 * 分割後: utils/activityCodeGenerator.ts に移動予定
 */
const generateActivityCode = (mainTab: string, subTab: string, detailTab: string, classificationTab: string) => {
  if (mainTab === 'project') {
    return generateProjectActivityCode(subTab, detailTab, { name: classificationTab, code: '' }, detailTab);
  } else {
    return generateIndirectActivityCode(subTab, detailTab, { name: classificationTab, code: '' });
  }
};

// ============================================================================
// メインコンポーネント
// 分割後: components/SidebarActiveCodeEditor/index.tsx に移動予定
// ============================================================================

/**
 * サイドバーアクティブコードエディター
 * 分割予定:
 * - utils/activityCodeParser.ts: コード解析ロジック（プロジェクト系・間接業務系統合）
 * - utils/activityCodeGenerator.ts: コード生成ロジック
 * - hooks/useActivityCodeState.ts: 状態管理ロジック
 * - components/ActivityCodeDisplay.tsx: 表示部分
 * - components/ActivityCodeControls.tsx: 制御部分
 */
export const SidebarActiveCodeEditor = ({
  selectedEvent,
  onEventUpdate
}: SimpleActiveCodeEditorProps) => {
  const { handleUpdateEvent: contextUpdateEvent } = useEventContext();

  // ============================================================================
  // 状態管理セクション
  // 分割後: hooks/useActivityCodeState.ts に移動予定
  // ============================================================================

  /**
   * 現在のactivityCodeから状態を解析
   * 分割後: hooks/useActivityCodeState.ts に移動予定
   */
  const currentState = useMemo(() => {
    const activityCode = selectedEvent?.activityCode || '';
    return parseActivityCode(activityCode);
  }, [selectedEvent?.activityCode]);

  /**
   * ローカル状態管理（UI操作用）
   * 分割後: hooks/useActivityCodeState.ts に移動予定
   */
  const [localState, setLocalState] = useState(currentState);

  // selectedEventが変更されたらローカル状態を更新
  useEffect(() => {
    setLocalState(currentState);
  }, [currentState]);

  // ============================================================================
  // イベント更新関数セクション
  // 分割後: hooks/useActivityCodeState.ts に移動予定
  // ============================================================================

  /**
   * イベント更新関数
   * 分割後: hooks/useActivityCodeState.ts に移動予定
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
  // 分割後: hooks/useActivityCodeHandlers.ts に移動予定
  // ============================================================================

  /**
   * メインサブタブ選択ハンドラー
   * 分割後: hooks/useActivityCodeHandlers.ts に移動予定
   */
  const handleMainSubTabSelect = useCallback((subTab: string) => {
    const newState = { ...localState, subTab };
    const defaultDetailTab = SUBTABS[subTab]?.[0] || '';
    const finalState = { ...newState, detailTab: defaultDetailTab };
    
    setLocalState(finalState);
    
    const newCode = generateActivityCode(finalState.mainTab, finalState.subTab, finalState.detailTab, finalState.classificationTab);
    updateEvent({ activityCode: newCode });
  }, [localState, updateEvent]);

  /**
   * 詳細サブタブ選択ハンドラー
   * 分割後: hooks/useActivityCodeHandlers.ts に移動予定
   */
  const handleDetailSubTabSelect = useCallback((detailTab: string) => {
    const newState = { ...localState, detailTab };
    setLocalState(newState);
    
    const newCode = generateActivityCode(newState.mainTab, newState.subTab, newState.detailTab, newState.classificationTab);
    updateEvent({ activityCode: newCode });
  }, [localState, updateEvent]);

  /**
   * 分類選択ハンドラー
   * 分割後: hooks/useActivityCodeHandlers.ts に移動予定
   */
  const handleClassificationSelect = useCallback((newCode: string, additionalData: Partial<TimeGridEvent>) => {
    updateEvent({ activityCode: newCode, ...additionalData });
  }, [updateEvent]);

  // ============================================================================
  // 早期リターンセクション
  // 分割後: components/ActivityCodeDisplay.tsx に移動予定
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
  // データ準備セクション
  // 分割後: hooks/useActivityCodeData.ts に移動予定
  // ============================================================================

  // 現在のコード
  const currentCode = selectedEvent.activityCode || '';

  /**
   * プロジェクトサブタブ設定（動的生成）
   * 分割後: hooks/useActivityCodeData.ts に移動予定
   */
  const projectSubTabConfigs = useMemo(() => {
    const configs: Record<string, { name: string; color: string; subTabs?: string[] }> = {};
    ['計画', '設計', '会議', '購入品', 'その他'].forEach(tab => {
      configs[tab] = { name: tab, color: 'green', subTabs: SUBTABS[tab] };
    });
    return configs;
  }, []);

  /**
   * 間接業務サブタブ設定（動的生成）
   * 分割後: hooks/useActivityCodeData.ts に移動予定
   */
  const indirectSubTabConfigs = useMemo(() => {
    const configs: Record<string, { name: string; color: string; subTabs?: string[] }> = {};
    ['純間接', '目的間接', '控除'].forEach(tab => {
      configs[tab] = { name: tab, color: 'blue', subTabs: SUBTABS[tab] };
    });
    return configs;
  }, []);

  // ============================================================================
  // レンダリングセクション
  // 分割後: components/ActivityCodeDisplay.tsx に移動予定
  // ============================================================================

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
          selectedTab={localState.mainTab}
          currentMainSubTab={localState.subTab}
          onTabSelect={handleMainSubTabSelect}
          projectSubTabConfigs={projectSubTabConfigs}
          indirectSubTabConfigs={indirectSubTabConfigs}
        />
      </div>

      {/* 区切り線 */}
      <hr className="border-gray-200 mb-1.5" />

      {/* 詳細サブタブ選択 */}
      <div className="mb-1.5">
        <DetailSubTabs
          selectedTab={localState.mainTab}
          currentMainSubTab={localState.subTab}
          currentDetailSubTab={localState.detailTab}
          onTabSelect={handleDetailSubTabSelect}
          projectSubTabConfigs={projectSubTabConfigs}
        />
      </div>

      {/* 区切り線 */}
      <hr className="border-gray-200 mb-1.5" />

      {/* 詳細分類タブ */}
      <div className="mb-1.5">
        <DetailClassifications
          state={{
            selectedTab: localState.mainTab,
            mainSubTab: localState.subTab,
            detailSubTab: localState.detailTab,
            currentCode: currentCode
          }}
          actions={{
            onSelect: handleClassificationSelect,
            getProjectClassifications: () => {
              if (localState.subTab === '計画') {
                return PROJECT_DETAIL_CLASSIFICATIONS.計画[localState.detailTab as keyof typeof PROJECT_DETAIL_CLASSIFICATIONS.計画] || null;
              } else if (localState.subTab === '設計') {
                return PROJECT_DETAIL_CLASSIFICATIONS.設計;
              } else if (localState.subTab === '会議') {
                return PROJECT_DETAIL_CLASSIFICATIONS.会議.会議種類;
              } else if (localState.subTab === 'その他') {
                return PROJECT_DETAIL_CLASSIFICATIONS.その他[localState.detailTab as keyof typeof PROJECT_DETAIL_CLASSIFICATIONS.その他] || null;
              } else if (localState.subTab === '購入品') {
                return SUBTABS.購入品?.map((item, index) => ({
                  name: item,
                  code: `P${index.toString().padStart(2, '0')}00`
                })) || null;
              }
              return null;
            },
            getIndirectClassifications: () => {
              return INDIRECT_DETAIL_CLASSIFICATIONS[localState.subTab as keyof typeof INDIRECT_DETAIL_CLASSIFICATIONS];
            },
            generateProjectCode: generateProjectActivityCode,
            generateIndirectCode: generateIndirectActivityCode,
            getProjectData: (classification: ClassificationItem) => {
              if (localState.subTab === '計画') {
                return { planningSubType: classification.name, subTabType: localState.detailTab };
              } else if (localState.subTab === '設計') {
                return { designSubType: classification.name, subTabType: localState.detailTab };
              } else if (localState.subTab === '会議') {
                return { meetingType: classification.name, subTabType: localState.detailTab };
              } else if (localState.subTab === 'その他') {
                return {
                  [localState.detailTab === "出張" ? "travelType" : 
                   localState.detailTab === "〇対応" ? "stakeholderType" :
                   localState.detailTab === "プロ管理" ? "projectManagementType" :
                   "documentType"]: classification.name
                };
              } else if (localState.subTab === '購入品') {
                return { category: classification.name };
              }
              return {};
            },
            getIndirectData: (detailTab: string, classification: ClassificationItem) => {
              return {
                [detailTab === "会議" ? "meetingType" :
                 detailTab === "人事評価" ? "evaluationType" :
                 detailTab === "作業" ? "workType" :
                 detailTab === "休憩" ? "breakType" : "otherType"]: classification.name,
                category: localState.subTab
              };
            },
            getPurchaseClassifications: () => {
              return SUBTABS.購入品?.map((item, index) => ({
                name: item,
                code: `P${index.toString().padStart(2, '0')}00`
              })) || [];
            }
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
                updateEvent({ 
                  ...updates,
                color: selectedEvent.color ?? '#3788d8'
                });
            }
          }}
        />
      </div>

      {/* 区切り線 */}
      <hr className="border-gray-200 mb-1.5" />
    </div>
  );
};