"use client"

import React, { useEffect } from 'react';
import { TimeGridEvent } from "../../../types";
import { SUBTABS } from "../../../constants";
import { useEventContext } from "../../../context/EventContext";

/**
 * ActivityCodeTab コンポーネント
 * 
 * 実績管理システムにおける業務分類コード（activityCode）の自動生成を行うタブコンポーネント。
 * プロジェクトタブと目的間接タブの両方に対応し、選択されたサブタブに応じて
 * 詳細分類タブを表示し、業務分類コード（activityCode）の自動生成を行います。
 * 
 * 主要機能:
 * - プロジェクトタブ対応（計画、設計、会議、その他、購入品）
 * - 目的間接タブ対応
 * - 業務分類コードの自動生成
 * - 選択状態の管理
 * - EventContextとの統合
 */
interface ActivityCodeTabProps {
  // 基本状態
  selectedTab: string;                    // "project" | "indirect"
  selectedProjectSubTab: string;         // プロジェクトサブタブ
  selectedIndirectSubTab: string;        // 間接業務サブタブ
  
  // イベント関連
  selectedEvent: TimeGridEvent | null;
  updateEvent: (event: TimeGridEvent) => void;
}

export const ActivityCodeTab = ({
  selectedTab,
  selectedProjectSubTab,
  selectedIndirectSubTab,
  selectedEvent,
  updateEvent
}: ActivityCodeTabProps) => {
  // Event ContextからupdateEventを取得（推奨の更新方法）
  const { updateEvent: contextUpdateEvent } = useEventContext();

  // ActivityCodeからタブの選択状態を判定
  const getCurrentOtherSubTab = (): string => {
    if (!selectedEvent?.activityCode || selectedProjectSubTab !== "その他") {
      return "出張"; // デフォルト値
    }
    const thirdChar = selectedEvent.activityCode.charAt(2);
    if (thirdChar === "T") return "出張";
    if (thirdChar === "C") return "〇対応";
    if (thirdChar === "M") return "プロ管理";
    if (thirdChar === "D") return "資料";
    if (thirdChar === "O") return "その他";
    return "出張"; // デフォルト値
  };

  const getCurrentIndirectDetailTab = (): string => {
    if (!selectedEvent?.activityCode || selectedIndirectSubTab !== "目的間接") {
      return "作業"; // デフォルト値
    }
    const suffix = selectedEvent.activityCode.slice(-2);
    if (suffix === "A0") return "作業";
    if (suffix === "M0") return "会議";
    if (suffix === "O0") return "その他";
    return "作業"; // デフォルト値
  };

  const currentOtherSubTab = getCurrentOtherSubTab();
  const currentIndirectDetailTab = getCurrentIndirectDetailTab();

  /**
   * プロジェクトタブ用の業務分類コード生成
   * 
   * @param subTab - プロジェクトサブタブ
   * @param detailTab - 詳細タブ
   * @returns 4桁の業務分類コード
   */
  const generateProjectActivityCode = (subTab: string, detailTab: string): string => {
    // プレフィックス決定
    const prefixes: Record<string, string> = {
      計画: "P",
      設計: "D", 
      会議: "M",
      その他: "O",
      購入品: "P"
    };
    
    // 詳細分類コード決定
    const detailCodes: Record<string, Record<string, string>> = {
      計画: {
        計画図: "P",
        検討書: "C", 
        見積り: "T"
      },
      設計: {
        計画図: "P",
        詳細図: "S",
        組立図: "K",
        改正図: "R"
      },
      会議: {
        内部定例: "N",
        外部定例: "G",
        プロ進行: "J",
        その他: "O"
      },
      その他: {
        出張: "T",
        "〇対応": "C",
        プロ管理: "M",
        資料: "D",
        その他: "O"
      }
    };
    
    // 購入品の場合は、インデックスベース
    if (subTab === "購入品") {
      const purchaseIndex = SUBTABS.購入品.indexOf(detailTab);
      if (purchaseIndex >= 0) {
        return `${prefixes[subTab]}${purchaseIndex.toString().padStart(2, '0')}00`;
      }
    }
    
    // 通常の詳細分類コード
    const prefix = prefixes[subTab] || "P";
    const detailCode = detailCodes[subTab]?.[detailTab] || "0";
    
    return `${prefix}${detailCode}00`;
  };

  /**
   * 目的間接タブ用の業務分類コード生成
   * 
   * @param detailTab - 詳細タブ
   * @returns 4桁の業務分類コード
   */
  const generateIndirectActivityCode = (detailTab: string): string => {
    const detailCodes: Record<string, string> = {
      作業: "A0",
      会議: "M0", 
      その他: "O0"
    };
    
    return `ZM${detailCodes[detailTab] || "00"}`;
  };

  /**
   * activityCodeからサブタブを判定する関数（プロジェクトタブ用）
   */
  const getProjectSubTabFromActivityCode = (activityCode: string, selectedProjectSubTab: string): string => {
    if (!activityCode || activityCode.length < 3) return "";
    
    const thirdChar = activityCode.charAt(2);
    
    // 計画タブの詳細分類
    if (selectedProjectSubTab === "計画") {
      if (thirdChar === "P") return "計画図";
      if (thirdChar === "C") return "検討書";
      if (thirdChar === "T") return "見積り";
    }
    // 設計タブの詳細分類
    else if (selectedProjectSubTab === "設計") {
      if (thirdChar === "P") return "計画図";
      if (thirdChar === "S") return "詳細図";
      if (thirdChar === "K") return "組立図";
      if (thirdChar === "R") return "改正図";
    }
    // 会議タブの詳細分類
    else if (selectedProjectSubTab === "会議") {
      if (thirdChar === "N") return "内部定例";
      if (thirdChar === "G") return "外部定例";
      if (thirdChar === "J") return "プロ進行";
      if (thirdChar === "O") return "その他";
    }
    // その他タブの詳細分類
    else if (selectedProjectSubTab === "その他") {
      if (thirdChar === "T") return "出張";
      if (thirdChar === "C") return "〇対応";
      if (thirdChar === "M") return "プロ管理";
      if (thirdChar === "D") return "資料";
      if (thirdChar === "O") return "その他";
    }
    // 購入品タブの詳細分類（インデックスベース）
    else if (selectedProjectSubTab === "購入品") {
      const index = parseInt(thirdChar);
      if (!isNaN(index) && SUBTABS.購入品[index]) {
        return SUBTABS.購入品[index];
      }
    }
    
    return "";
  };

  /**
   * 副作用: activityCodeが変更された時に選択状態を更新
   */
  useEffect(() => {
    if (selectedEvent?.activityCode && selectedEvent?.selectedProjectSubTab) {
      const expectedSubTab = getProjectSubTabFromActivityCode(selectedEvent.activityCode, selectedEvent.selectedProjectSubTab);
      console.log('activityCode変更による選択状態更新:', {
        activityCode: selectedEvent.activityCode,
        expectedSubTab,
        currentSubTabType: selectedEvent.subTabType
      });
    }
  }, [selectedEvent?.activityCode, selectedEvent?.selectedProjectSubTab]);

  /**
   * プロジェクトタブの詳細タブをレンダリング
   */
  const renderProjectDetailTabs = () => {
    if (selectedTab !== "project" || 
        !["計画", "設計", "会議", "その他", "購入品"].includes(selectedProjectSubTab) ||
        !SUBTABS[selectedProjectSubTab]?.length) {
      return null;
    }

    return (
      <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
        {SUBTABS[selectedProjectSubTab].map((subTab: string) => {
          // 選択状態の判定
          let isSelected = false;
          
          if (selectedProjectSubTab === "その他") {
            isSelected = currentOtherSubTab === subTab;
          } else {
            if (selectedEvent?.activityCode) {
              const expectedSubTab = getProjectSubTabFromActivityCode(selectedEvent.activityCode, selectedProjectSubTab);
              isSelected = expectedSubTab === subTab;
            } else {
              // デフォルトの選択状態
              const defaults: Record<string, string> = {
                計画: '計画図',
                設計: '計画図', 
                会議: '内部定例',
                その他: '出張',
                購入品: '計画図作成'
              };
              isSelected = defaults[selectedProjectSubTab] === subTab;
            }
          }

          return (
            <button
              key={subTab}
              className={`py-1 px-1 whitespace-nowrap mr-2 ${
                isSelected 
                  ? "bg-blue-100 text-blue-800 font-medium rounded" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                const newCode = generateProjectActivityCode(selectedProjectSubTab, subTab);
                
                // リセットが必要なフィールド
                const resetFields = {
                  planningSubType: "",
                  estimateSubType: "",
                  designSubType: "",
                  designTypeCode: "",
                  meetingType: "",
                  meetingCode: ""
                };
                
                if (selectedEvent) {
                  const updatedEvent = {
                    ...selectedEvent,
                    ...resetFields,
                    activityCode: newCode,
                  };
                  
                  // Event ContextのupdateEventを使用（推奨）
                  if (contextUpdateEvent && selectedEvent?.id) {
                    contextUpdateEvent(selectedEvent.id, updatedEvent);
                  } else if (updateEvent) {
                    // フォールバック: propsから渡されたupdateEventを使用
                    updateEvent(updatedEvent);
                  }
                }
                
                // ActivityCodeの更新のみで、タブ状態はActivityCodeから自動判定される
              }}
            >
              {subTab}
            </button>
          );
        })}
      </div>
    );
  };

  /**
   * 目的間接タブの詳細タブをレンダリング
   */
  const renderIndirectDetailTabs = () => {
    if (selectedTab !== "indirect" || selectedIndirectSubTab !== "目的間接") {
      return null;
    }

    return (
      <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
        {SUBTABS.目的間接.map((subTab: string) => {
          const isSelected = currentIndirectDetailTab === subTab;

          return (
            <button
              key={subTab}
              className={`py-1 px-1 whitespace-nowrap mr-2 ${
                isSelected
                  ? "bg-blue-100 text-blue-800 font-medium rounded"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                const newCode = generateIndirectActivityCode(subTab);
                
                // リセットすべきフィールド
                const resetFields = {
                  meetingType: "",
                  workType: ""
                };
                
                if (selectedEvent) {
                  const updatedEvent = { 
                    ...selectedEvent, 
                    ...resetFields,
                    selectedIndirectDetailTab: subTab,
                    indirectDetailType: subTab,
                    activityCode: newCode,
                  };
                  
                  // Event ContextのupdateEventを使用
                  if (contextUpdateEvent && selectedEvent?.id) {
                    contextUpdateEvent(selectedEvent.id, updatedEvent);
                  } else if (updateEvent) {
                    // フォールバック: propsから渡されたupdateEventを使用
                    updateEvent(updatedEvent);
                  }
                }
              }}
            >
              {subTab}
            </button>
          );
        })}
      </div>
    );
  };

  // プロジェクトタブと目的間接タブの両方をレンダリング
  return (
    <>
      {renderProjectDetailTabs()}
      {renderIndirectDetailTabs()}
    </>
  );
};
