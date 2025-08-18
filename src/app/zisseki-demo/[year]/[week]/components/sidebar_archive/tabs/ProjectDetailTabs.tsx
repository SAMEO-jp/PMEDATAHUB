"use client"

import React, { useEffect } from 'react';
import { TimeGridEvent } from "../../../types";
import { SUBTABS } from "../../../constants";
import { useEventContext } from "../../../context/EventContext";

/**
 * ProjectDetailTabs コンポーネント
 * 
 * 実績管理システムにおけるプロジェクト業務の詳細分類を管理するコンポーネント。
 * 選択されたプロジェクトのサブタブ（計画、設計、会議、その他、購入品）に応じて、
 * さらに詳細な分類タブを表示し、業務分類コード（activityCode）の自動生成を行います。
 * 
 * 主要機能:
 * - 条件付きレンダリング（プロジェクトタブの特定サブタブ時のみ表示）
 * - 業務分類コードの自動生成（4桁形式: [業務種別][詳細分類][00]）
 * - 選択状態の管理（イベント選択時はactivityCodeから判定、未選択時はデフォルト値）
 * - EventContextとの統合（推奨）とProps経由の更新（フォールバック）
 */
interface ProjectDetailTabsProps {
  selectedTab: string                    // 現在選択中のメインタブ（"project" | "indirect"）
  selectedProjectSubTab: string         // 現在選択中のプロジェクトサブタブ（"計画" | "設計" | "会議" | "その他" | "購入品"）
  selectedOtherSubTab: string           // その他タブの詳細選択状態
  setSelectedOtherSubTab: (tab: string) => void  // その他タブ更新関数
  selectedEvent: TimeGridEvent | null   // 選択中のイベント（nullの場合は新規作成モード）
  updateEvent: (event: TimeGridEvent) => void    // イベント更新関数（フォールバック用）
}

export const ProjectDetailTabs = ({
  selectedTab,
  selectedProjectSubTab,
  selectedOtherSubTab,
  setSelectedOtherSubTab,
  selectedEvent,
  updateEvent
}: ProjectDetailTabsProps) => {
  // Event ContextからupdateEventを取得（推奨の更新方法）
  const { updateEvent: contextUpdateEvent } = useEventContext();

  // イベントが選択されている場合は、そのイベントのタブ状態を表示
  // 未選択時は親コンポーネントから渡されたselectedOtherSubTabを使用
  const currentOtherSubTab = selectedEvent?.selectedOtherSubTab || selectedOtherSubTab
  

  /**
   * activityCodeからサブタブを判定する関数
   * 
   * 4桁の業務分類コードの3桁目（詳細分類）を解析して、
   * 対応するサブタブ名を返します。
   * 
   * @param activityCode - 4桁の業務分類コード（例: "PP00", "DN00"）
   * @param selectedProjectSubTab - 現在選択中のプロジェクトサブタブ
   * @returns 対応するサブタブ名、または空文字列
   */
  const getSubTabFromActivityCode = (activityCode: string, selectedProjectSubTab: string): string => {
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
      // 購入品の場合は、インデックスから判定
      const index = parseInt(thirdChar);
      if (!isNaN(index) && SUBTABS.購入品[index]) {
        return SUBTABS.購入品[index];
      }
    }
    
    return "";
  };

  /**
   * 副作用: activityCodeが変更された時に選択状態を更新
   * 
   * イベントのactivityCodeが変更された際に、対応するサブタブの選択状態を
   * 自動的に更新します。デバッグ用のログも出力します。
   */
  useEffect(() => {
    if (selectedEvent?.activityCode && selectedEvent?.selectedProjectSubTab) {
      const expectedSubTab = getSubTabFromActivityCode(selectedEvent.activityCode, selectedEvent.selectedProjectSubTab);
      console.log('activityCode変更による選択状態更新:', {
        activityCode: selectedEvent.activityCode,
        expectedSubTab,
        currentSubTabType: selectedEvent.subTabType
      });
    }
  }, [selectedEvent?.activityCode, selectedEvent?.selectedProjectSubTab]);

  // 計画、設計、会議、その他、購入品タブのサブタブ表示
  // 条件: selectedTab === "project" かつ特定のサブタブが選択されている場合のみ表示
  if (selectedTab === "project" && 
    (selectedProjectSubTab === "計画" || selectedProjectSubTab === "設計" || selectedProjectSubTab === "会議" || selectedProjectSubTab === "その他" || selectedProjectSubTab === "購入品") && 
    SUBTABS[selectedProjectSubTab]?.length > 0) {
    return (
      <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
        {SUBTABS[selectedProjectSubTab].map((subTab: string) => {
          // 選択状態の判定をシンプルに変更（間接タブと同じアプローチ）
          let isSelected = false;
          
          // その他タブの場合は、selectedOtherSubTabとの比較で判定
          if (selectedProjectSubTab === "その他") {
            isSelected = currentOtherSubTab === subTab;
          } else {
            // イベントが選択されている場合は、そのイベントのactivityCodeから判定
            if (selectedEvent?.activityCode) {
              const expectedSubTab = getSubTabFromActivityCode(selectedEvent.activityCode, selectedProjectSubTab);
              isSelected = expectedSubTab === subTab;
            } else {
              // イベントが選択されていない場合は、デフォルトの選択状態を使用
              const defaults: Record<string, string> = {
                計画: '計画図',
                設計: '計画図', 
                会議: '内部定例',
                その他: '出張',
                購入品: '設備'
              };
              isSelected = defaults[selectedProjectSubTab] === subTab;
            }
          }

          // デバッグ用ログ
          console.log('ProjectDetailTabs - 選択状態デバッグ:', {
            subTab,
            selectedProjectSubTab,
            selectedEventId: selectedEvent?.id,
            selectedEventActivityCode: selectedEvent?.activityCode,
            isSelected
          });

          return (
            <button
              key={subTab}
              className={`py-1 px-1 whitespace-nowrap mr-2 ${
                isSelected 
                  ? "bg-blue-100 text-blue-800 font-medium rounded" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                /**
                 * タブクリック時の処理
                 * 
                 * 1. サブタブに基づいて3桁目の文字を設定
                 * 2. 業務分類コードのプレフィックスを決定
                 * 3. 4桁の業務分類コードを生成
                 * 4. イベントを更新（EventContext優先、Propsフォールバック）
                 * 5. その他タブの場合はselectedOtherSubTabも更新
                 */
                
                // サブタブに基づいて3桁目の文字を設定
                let thirdChar = "0"; // デフォルト
                
                // 計画タブの詳細分類設定
                if (selectedProjectSubTab === "計画") {
                  if (subTab === "計画図") thirdChar = "P";
                  else if (subTab === "検討書") thirdChar = "C";
                  else if (subTab === "見積り") thirdChar = "T";
                }
                // 設計タブの詳細分類設定
                else if (selectedProjectSubTab === "設計") {
                  if (subTab === "計画図") thirdChar = "P";
                  else if (subTab === "詳細図") thirdChar = "S";
                  else if (subTab === "組立図") thirdChar = "K";
                  else if (subTab === "改正図") thirdChar = "R";
                }
                // 会議タブの詳細分類設定
                else if (selectedProjectSubTab === "会議") {
                  if (subTab === "内部定例") thirdChar = "N";
                  else if (subTab === "外部定例") thirdChar = "G";
                  else if (subTab === "プロ進行") thirdChar = "J";
                  else if (subTab === "その他") thirdChar = "O";
                }
                // その他タブの詳細分類設定
                else if (selectedProjectSubTab === "その他") {
                  if (subTab === "出張") thirdChar = "T";
                  else if (subTab === "〇対応") thirdChar = "C";
                  else if (subTab === "プロ管理") thirdChar = "M";
                  else if (subTab === "資料") thirdChar = "D";
                  else if (subTab === "その他") thirdChar = "O";
                }
                // 購入品タブの詳細分類設定（インデックスベース）
                else if (selectedProjectSubTab === "購入品") {
                  // 購入品の場合は、サブタブのインデックスに基づいて3桁目を設定
                  const purchaseIndex = SUBTABS.購入品.indexOf(subTab);
                  if (purchaseIndex >= 0) {
                    thirdChar = purchaseIndex.toString().padStart(2, '0');
                  }
                }
                
                // 業務分類コードの最初の文字（プレフィックス）を決定
                let codePrefix = "P";
                if (selectedProjectSubTab === "計画") codePrefix = "P";
                else if (selectedProjectSubTab === "設計") codePrefix = "D";
                else if (selectedProjectSubTab === "会議") codePrefix = "M";
                else if (selectedProjectSubTab === "その他") codePrefix = "O";
                else if (selectedProjectSubTab === "購入品") codePrefix = "P";
                
                // 4桁コードを構成（下二桁は00固定）
                const newCode = `${codePrefix}${thirdChar}00`;
                
                // リセットが必要なフィールドを特定（将来の拡張用）
                const resetFields = {
                  planningSubType: "",
                  estimateSubType: "",
                  designSubType: "",
                  designTypeCode: "",
                  meetingType: "",
                  meetingCode: ""
                };
                
                // イベントが選択されている場合は更新
                if (selectedEvent) {
                  const updatedEvent = {
                    ...selectedEvent,
                    activityCode: newCode,
                  };
                  
                  // Event ContextのupdateEventを使用（推奨、イベントIDベース）
                  if (contextUpdateEvent && selectedEvent?.id) {
                    contextUpdateEvent(selectedEvent.id, updatedEvent);
                  } else if (updateEvent) {
                    // フォールバック: propsから渡されたupdateEventを使用
                    updateEvent(updatedEvent);
                  }
                }
                
                // その他タブの場合は、selectedOtherSubTabも更新
                if (selectedProjectSubTab === "その他") {
                  setSelectedOtherSubTab(subTab);
                }
              }}
            >
              {subTab}
            </button>
          );
        })}
      </div>
    )
  }

  // 条件に合わない場合は何も表示しない
  return null
} 