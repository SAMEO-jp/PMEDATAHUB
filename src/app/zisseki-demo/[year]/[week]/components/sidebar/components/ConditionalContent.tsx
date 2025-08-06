import { TimeGridEvent, Project } from "../../../types"
import { ProjectCodeDisplay } from "./ProjectCodeDisplay"
import { ProjectSubTabs } from "../selectors/ProjectSubTabs"
import { IndirectSubTabs } from "../selectors/IndirectSubTabs"
import { ProjectDetailTabs } from "../tabs/ProjectDetailTabs"
import { IndirectDetailTabs } from "../tabs/IndirectDetailTabs"
import { EquipmentSelector } from "../selectors/EquipmentSelector"
import { PurchaseItemSelector } from "../tabs/PurchaseItemSelector"
import { PlanningTabContent } from "../tabs/PlanningTabContent"
import { DesignTabContent } from "../tabs/DesignTabContent"
import { MeetingTabContent } from "../tabs/MeetingTabContent"
import { OtherTabContent } from "../tabs/OtherTabContent"
import { EventDetailForm } from "../forms/EventDetailForm"

// 設備オプションの型定義
interface EquipmentOption {
  id: string;
  name: string;
}

interface ConditionalContentProps {
  selectedTab: string
  selectedProjectSubTab: string
  selectedOtherSubTab: string
  selectedIndirectDetailTab: string
  indirectSubTab: string
  selectedProjectCode: string
  purposeProjectCode: string
  equipmentNumber: string
  equipmentName: string
  equipmentOptions: EquipmentOption[]  // ← any[]からEquipmentOption[]に変更
  isLoadingEquipment: boolean
  selectedEvent: TimeGridEvent | null
  projects: Project[]  // ← 既存のProject型を使用
  updateEvent: (event: TimeGridEvent) => void
  setSelectedProjectCode: (code: string) => void
  setPurposeProjectCode: (code: string) => void
  setSelectedOtherSubTab: (tab: string) => void
  setSelectedIndirectDetailTab: (tab: string) => void
  setEquipmentNumber: (num: string) => void
  setEquipmentName: (name: string) => void
  handleDeleteEvent: () => void
  setSelectedEvent: (event: TimeGridEvent | null) => void
}

export const ConditionalContent = ({
  selectedTab,
  selectedProjectSubTab,
  selectedOtherSubTab,
  selectedIndirectDetailTab,
  indirectSubTab,
  selectedProjectCode,
  purposeProjectCode,
  equipmentNumber,
  equipmentName,
  equipmentOptions,
  isLoadingEquipment,
  selectedEvent,
  projects,
  updateEvent,
  setSelectedProjectCode,
  setPurposeProjectCode,
  setSelectedOtherSubTab,
  setSelectedIndirectDetailTab,
  setEquipmentNumber,
  setEquipmentName,
  handleDeleteEvent,
  setSelectedEvent,
}: ConditionalContentProps) => {
  
  // デバッグ用: selectedEventの値を確認
  console.log('ConditionalContent - selectedEvent:', selectedEvent);
  console.log('ConditionalContent - selectedEvent type:', typeof selectedEvent);
  console.log('ConditionalContent - selectedEvent truthy:', !!selectedEvent);

  return (
    <>
      {/* プロジェクトコード表示 - 常に表示 */}
      <ProjectCodeDisplay
        selectedTab={selectedTab}
        indirectSubTab={indirectSubTab}
        selectedProjectCode={selectedProjectCode}
        purposeProjectCode={purposeProjectCode}
        projects={projects}
        selectedEvent={selectedEvent}
        updateEvent={updateEvent}
        setSelectedProjectCode={setSelectedProjectCode}
        setPurposeProjectCode={setPurposeProjectCode}
      />

      {/* プロジェクトタブのサブタブ表示 - 条件付きレンダリング */}
      {/* 
        条件: selectedTab === "project" の時のみ表示
        役割: プロジェクトのサブタブ（計画、設計、会議、購入品、その他）を表示
        コンポーネント: ProjectSubTabs（Contextを使用するためProps不要）
      */}
      {selectedTab === "project" && (
        <ProjectSubTabs />
      )}

      {/* 間接業務タブのサブタブ表示 - 条件付きレンダリング */}
      {/* 
        条件: selectedTab === "indirect" の時のみ表示
        役割: 間接業務のサブタブ（純間接、目的間接、控除時間）を表示
        コンポーネント: IndirectSubTabs（Contextを使用するためProps不要）
      */}
      {selectedTab === "indirect" && (
        <IndirectSubTabs />
      )}

      {/* プロジェクト詳細タブ - 常に表示 */}
      {selectedTab === "project" && (selectedProjectSubTab === "計画" || selectedProjectSubTab === "設計" || selectedProjectSubTab === "会議" || selectedProjectSubTab === "その他") && (
        <ProjectDetailTabs
          selectedTab={selectedTab}
          selectedProjectSubTab={selectedProjectSubTab}
          selectedOtherSubTab={selectedOtherSubTab}
          setSelectedOtherSubTab={setSelectedOtherSubTab}
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
        />
      )}

      {/* 間接業務詳細タブ - 常に表示 */}
      {selectedTab === "indirect" && (
        <IndirectDetailTabs
          selectedTab={selectedTab}
          indirectSubTab={indirectSubTab}
          selectedIndirectDetailTab={selectedIndirectDetailTab}
          setSelectedIndirectDetailTab={setSelectedIndirectDetailTab}
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
        />
      )}

      {/* 設備選択 - 条件付きレンダリング */}
      {/* 
        条件: selectedTab === "project" && selectedProjectSubTab === "設計" の時のみ表示
        役割: 設備番号と設備名の選択機能を提供
        コンポーネント: EquipmentSelector（Contextを使用するためProps不要）
      */}
      {selectedTab === "project" && selectedProjectSubTab === "設計" && (
        <EquipmentSelector
          equipmentNumber={equipmentNumber}
          equipmentName={equipmentName}
          equipmentOptions={equipmentOptions}
          isLoadingEquipment={isLoadingEquipment}
          setEquipmentNumber={setEquipmentNumber}
          setEquipmentName={setEquipmentName}
        />
      )}

      {/* 購入品選択 - 常に表示 */}
      {selectedTab === "project" && selectedProjectSubTab === "購入品" && (
        <PurchaseItemSelector
          selectedTab={selectedTab}
          selectedProjectSubTab={selectedProjectSubTab}
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
        />
      )}

      {/* 計画タブの詳細コンテンツ */}
      {selectedTab === "project" && selectedProjectSubTab === "計画" && (
        <PlanningTabContent
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
        />
      )}

      {/* 設計タブの詳細コンテンツ */}
      {selectedTab === "project" && selectedProjectSubTab === "設計" && (
        <DesignTabContent
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
        />
      )}

      {/* 会議タブの詳細コンテンツ */}
      {selectedTab === "project" && selectedProjectSubTab === "会議" && (
        <MeetingTabContent
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
        />
      )}

      {/* その他タブの詳細コンテンツ */}
      {selectedTab === "project" && selectedProjectSubTab === "その他" && (
        <OtherTabContent
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
        />
      )}

      {/* イベントが選択されている場合は編集フォームを表示 */}
      {selectedEvent && (
        <EventDetailForm
          selectedEvent={selectedEvent}
          selectedTab={selectedTab}
          selectedProjectSubTab={selectedProjectSubTab}
          updateEvent={updateEvent}
          handleDeleteEvent={handleDeleteEvent}
          setSelectedEvent={setSelectedEvent}
          projects={projects}
        />
      )}
    </>
  )
} 