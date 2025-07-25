"use client"

import { ZissekiSidebarProps } from "../../types"
import { useEquipmentData } from "./hooks/useEquipmentData"
import { usePurchaseData } from "./hooks/usePurchaseData"
import { useSidebarState } from "./hooks/useSidebarState"
import { useEventHandlers } from "./hooks/useEventHandlers"
import { SidebarLayout } from "./SidebarLayout"
import { ConditionalContent } from "./components/ConditionalContent"


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

  // ========================================
  // 1. 状態管理hooks
  // ========================================
  
  // Zustandによるグローバル状態管理
  const sidebarState = useSidebarState()
  
  // 設備データの取得と管理
  const equipmentData = useEquipmentData(
    sidebarState.selectedProjectCode, 
    selectedProjectSubTab, 
    ""
  )
  
  // 購入品データの取得と管理（現在は未使用だが将来の拡張用）
  const _purchaseData = usePurchaseData(
    sidebarState.selectedProjectCode, 
    equipmentData.equipmentNumber || ""
  )

  // ========================================
  // 2. イベントハンドリング
  // ========================================
  
  // イベント処理ロジックの統合
  const eventHandlers = useEventHandlers({
    selectedEvent,
    setEquipmentNumber: equipmentData.setEquipmentNumber,
    setEquipmentName: equipmentData.setEquipmentName,
    updateEvent,
    indirectSubTab,
  })

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
    
    // サイドバー状態（Zustandから取得）
    selectedOtherSubTab: sidebarState.selectedOtherSubTab,
    selectedIndirectDetailTab: sidebarState.selectedIndirectDetailTab,
    selectedProjectCode: sidebarState.selectedProjectCode,
    purposeProjectCode: sidebarState.purposeProjectCode,
    setSelectedProjectCode: sidebarState.setSelectedProjectCode,
    setPurposeProjectCode: sidebarState.setPurposeProjectCode,
    setSelectedOtherSubTab: sidebarState.setSelectedOtherSubTab,
    setSelectedIndirectDetailTab: sidebarState.setSelectedIndirectDetailTab,
    
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
    
    // イベントハンドリング（イベントhooksから取得）
    updateActivityCodePrefix: eventHandlers.updateActivityCodePrefix,
  }

  // ========================================
  // 4. レンダリング
  // ========================================
  
  return (
    <SidebarLayout
      selectedEvent={selectedEvent}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      updateActivityCodePrefix={eventHandlers.updateActivityCodePrefix}
    >
      {/* 条件分岐ロジックを子コンポーネントに委譲 */}
      <ConditionalContent {...conditionalContentProps} />
    </SidebarLayout>
  );
};
      