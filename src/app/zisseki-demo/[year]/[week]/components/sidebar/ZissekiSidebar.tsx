"use client"

import { ZissekiSidebarProps } from "../../types"
import { useEquipmentData } from "./hooks/useEquipmentData"
import { usePurchaseData } from "./hooks/usePurchaseData"
import { SidebarLayout } from "./SidebarLayout"
import { ConditionalContent } from "./components/ConditionalContent"
import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"


/**
 * 実績入力サイドバーのメインコンポーネント
 * 
 * このコンポーネントは以下の責務を持ちます：
 * - 状態管理hooksの統合
 * - イベントハンドリングの統合
 * - レンダリング制御
 * 
 * 設計方針：
 * - データフローの制御のみに集中
 * - 詳細なUIロジックは子コンポーネントに委譲
 * - 型安全性の確保
 */
export const ZissekiSidebar = ({
  selectedTab,
  setSelectedTab,
  selectedProjectSubTab,
  _setSelectedProjectSubTab,
  selectedEvent,
  _hasChanges,
  handleDeleteEvent,
  updateEvent,
  _employees,
  projects,
  setSelectedEvent,
  _currentUser,
  indirectSubTab = "純間接",
  setIndirectSubTab = () => {},
}: ZissekiSidebarProps) => {

  // デバッグ用: selectedEventの値を確認
  console.log('ZissekiSidebar - selectedEvent:', selectedEvent);
  console.log('ZissekiSidebar - selectedEvent truthy:', !!selectedEvent);

  // ========================================
  // 1. 状態管理hooks
  // ========================================
  
  // Event Contextから統合された状態を取得
  const { 
    selectedProjectCode, 
    purposeProjectCode,
    tabDetails,
    setSelectedProjectCode,
    setPurposeProjectCode,
    setTabDetail,
    setIndirectDetail,
    updateEvent: contextUpdateEvent
  } = useEventContext();
  
  // 設備データの取得と管理
  const equipmentData = useEquipmentData(
    selectedProjectCode, 
    selectedProjectSubTab, 
    ""
  )
  
  // 購入品データの取得と管理（現在は未使用だが将来の拡張用）
  const _purchaseData = usePurchaseData(
    selectedProjectCode, 
    equipmentData.equipmentNumber || ""
  )

  // ========================================
  // 2. イベントハンドリング
  // ========================================
  
  // 業務分類コード更新関数（Event Contextから直接取得）
  const updateActivityCodePrefix = (tab: string, subTab?: string) => {
    if (!selectedEvent) return;
    
    // 業務分類コードの更新ロジック
    let newActivityCode = selectedEvent.activityCode || '';
    let newBusinessCode = selectedEvent.businessCode || '';
    
    // タブに基づいて業務分類コードを更新
    switch (tab) {
      case 'planning':
        if (subTab === '計画図') {
          newActivityCode = 'PP01'; // 計画図のデフォルトコード
          newBusinessCode = 'PP01';
        } else if (subTab === '見積り') {
          newActivityCode = 'PT01'; // 見積りのデフォルトコード
          newBusinessCode = 'PT01';
        }
        break;
      case 'design':
        if (subTab === '計画図') {
          newActivityCode = 'DP01'; // 設計-計画図のデフォルトコード
          newBusinessCode = 'DP01';
        } else if (subTab === '詳細図') {
          newActivityCode = 'DS01'; // 設計-詳細図のデフォルトコード
          newBusinessCode = 'DS01';
        }
        break;
      case 'meeting':
        if (subTab === '内部定例') {
          newActivityCode = 'MN01'; // 会議-内部定例のデフォルトコード
          newBusinessCode = 'MN01';
        } else if (subTab === '外部定例') {
          newActivityCode = 'MG01'; // 会議-外部定例のデフォルトコード
          newBusinessCode = 'MG01';
        }
        break;
      case 'other':
        if (subTab === '出張') {
          newActivityCode = 'OT01'; // その他-出張のデフォルトコード
          newBusinessCode = 'OT01';
        } else if (subTab === '〇対応') {
          newActivityCode = 'OC01'; // その他-対応のデフォルトコード
          newBusinessCode = 'OC01';
        }
        break;
      case 'indirect':
        newActivityCode = 'I001'; // 間接業務のデフォルトコード
        newBusinessCode = 'I001';
        break;
      default:
        // デフォルトの場合は既存のコードを維持
        break;
    }
    
    // イベントを更新
    const updatedEvent = {
      ...selectedEvent,
      activityCode: newActivityCode,
      businessCode: newBusinessCode
    };
    
    // Event ContextのupdateEventを使用（eventIdが必要）
    if (contextUpdateEvent && selectedEvent?.id) {
      contextUpdateEvent(selectedEvent.id, updatedEvent);
    } else if (updateEvent) {
      // フォールバック: propsから渡されたupdateEventを使用
      updateEvent(updatedEvent);
    }
  };

  // ========================================
  // 3. Props統合
  // ========================================
  
  // ConditionalContentに渡すpropsを統合
  // Props Drillingを避けるため、スプレッド構文で渡す
  const conditionalContentProps = {
    // 基本props（親から受け取ったprops）
    selectedTab,
    selectedProjectSubTab,
    selectedEvent,
    projects,
    updateEvent,
    handleDeleteEvent,
    setSelectedEvent,
    setIndirectSubTab,
    
    // サイドバー状態（Event Contextから取得）
    selectedOtherSubTab: tabDetails.indirect.otherSubTab,
    selectedIndirectDetailTab: tabDetails.indirect.indirectDetailTab,
    selectedProjectCode: selectedProjectCode,
    purposeProjectCode: purposeProjectCode,
    // Event Contextから取得したsetter
    setSelectedProjectCode,
    setPurposeProjectCode,
    setSelectedProjectSubTab: _setSelectedProjectSubTab,
    setSelectedOtherSubTab: (value: string) => setTabDetail('indirect', 'otherSubTab', value),
    setSelectedIndirectDetailTab: (value: string) => setIndirectDetail('indirectDetailTab', value),
    
    // 設備データ（設備hooksから取得）
    equipmentNumber: equipmentData.equipmentNumber,
    equipmentName: equipmentData.equipmentName,
    equipmentOptions: equipmentData.equipmentOptions,
    isLoadingEquipment: equipmentData.isLoadingEquipment,
    equipmentNumbers: equipmentData.equipmentNumbers,
    setEquipmentNumber: equipmentData.setEquipmentNumber,
    setEquipmentName: equipmentData.setEquipmentName,
    
    // 間接業務関連
    indirectSubTab,
    
    // イベントハンドリング（直接実装）
    updateActivityCodePrefix,
  }

  // ========================================
  // 4. レンダリング
  // ========================================
  
  return (
    <SidebarLayout
      selectedEvent={selectedEvent}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      updateActivityCodePrefix={updateActivityCodePrefix}
    >
      {/* 条件分岐ロジックを子コンポーネントに委譲 */}
      <ConditionalContent {...conditionalContentProps} />
    </SidebarLayout>
  );
};
      