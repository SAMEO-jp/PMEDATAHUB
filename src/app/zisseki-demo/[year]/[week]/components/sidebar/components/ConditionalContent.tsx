import { Event } from '../../../types'
import { ProjectSubTabs } from '../selectors/ProjectSubTabs'
import { IndirectSubTabs } from '../selectors/IndirectSubTabs'
import { IndirectDetailTabs } from '../tabs/IndirectDetailTabs'
import { ProjectDetailTabs } from '../tabs/ProjectDetailTabs'
import { PurchaseItemSelector } from '../tabs/PurchaseItemSelector'
import { EquipmentSelector } from '../selectors/EquipmentSelector'
import { ActivityCodeDisplay } from '../displays/ActivityCodeDisplay'
import { EventDetailForm } from '../forms/EventDetailForm'
import { ProjectCodeDisplay } from './ProjectCodeDisplay'

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
  equipmentOptions: any[]
  isLoadingEquipment: boolean
  equipmentNumbers: string[]
  selectedEvent: Event | null
  projects: any[]
  updateEvent: (event: Event) => void
  setSelectedProjectCode: (code: string) => void
  setPurposeProjectCode: (code: string) => void
  setSelectedOtherSubTab: (tab: string) => void
  setSelectedIndirectDetailTab: (tab: string) => void
  setIndirectSubTab: (tab: string) => void
  setEquipmentNumber: (num: string) => void
  setEquipmentName: (name: string) => void
  handleDeleteEvent: () => void
  setSelectedEvent: (event: Event | null) => void
  updateActivityCodePrefix: (tab: string, subTab?: string) => void
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
  equipmentNumbers,
  selectedEvent,
  projects,
  updateEvent,
  setSelectedProjectCode,
  setPurposeProjectCode,
  setSelectedOtherSubTab,
  setSelectedIndirectDetailTab,
  setIndirectSubTab,
  setEquipmentNumber,
  setEquipmentName,
  handleDeleteEvent,
  setSelectedEvent,
  updateActivityCodePrefix,
}: ConditionalContentProps) => {
  return (
    <>
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

      {selectedTab === "project" && (
        <ProjectSubTabs
          selectedProjectSubTab={selectedProjectSubTab}
          setSelectedProjectSubTab={(subTab) => {
            // サブタブ変更時の処理
            updateActivityCodePrefix(selectedTab, subTab)
          }}
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
          updateActivityCodePrefix={updateActivityCodePrefix}
        />
      )}

      {selectedTab === "indirect" && (
        <IndirectSubTabs
          indirectSubTab={indirectSubTab}
          setIndirectSubTab={setIndirectSubTab}
          selectedIndirectDetailTab={selectedIndirectDetailTab}
          setSelectedIndirectDetailTab={setSelectedIndirectDetailTab}
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
        />
      )}

      <IndirectDetailTabs
        selectedTab={selectedTab}
        indirectSubTab={indirectSubTab}
        selectedIndirectDetailTab={selectedIndirectDetailTab}
        setSelectedIndirectDetailTab={setSelectedIndirectDetailTab}
        selectedEvent={selectedEvent}
        updateEvent={updateEvent}
      />

      <ProjectDetailTabs
        selectedTab={selectedTab}
        selectedProjectSubTab={selectedProjectSubTab}
        selectedOtherSubTab={selectedOtherSubTab}
        setSelectedOtherSubTab={setSelectedOtherSubTab}
        selectedEvent={selectedEvent}
        updateEvent={updateEvent}
      />

      <PurchaseItemSelector
        selectedTab={selectedTab}
        selectedProjectSubTab={selectedProjectSubTab}
        selectedEvent={selectedEvent}
        updateEvent={updateEvent}
      />

      <EquipmentSelector
        selectedTab={selectedTab}
        selectedProjectSubTab={selectedProjectSubTab}
        selectedProjectCode={selectedProjectCode}
        equipmentNumber={equipmentNumber}
        equipmentName={equipmentName}
        equipmentOptions={equipmentOptions}
        isLoadingEquipment={isLoadingEquipment}
        equipmentNumbers={equipmentNumbers}
        selectedEvent={selectedEvent}
        updateEvent={updateEvent}
        setEquipmentNumber={setEquipmentNumber}
        setEquipmentName={setEquipmentName}
      />

      <ActivityCodeDisplay
        selectedEvent={selectedEvent}
        selectedTab={selectedTab}
        equipmentNumber={equipmentNumber}
        equipmentName={equipmentName}
      />

      <EventDetailForm
        selectedEvent={selectedEvent}
        selectedTab={selectedTab}
        selectedProjectSubTab={selectedProjectSubTab}
        updateEvent={updateEvent}
        handleDeleteEvent={handleDeleteEvent}
        setSelectedEvent={setSelectedEvent}
      />
    </>
  )
} 