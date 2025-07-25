import { useEffect } from 'react'
import { Event } from '../../../types'
import { useSidebarState } from './useSidebarState'

interface UseEventHandlersProps {
  selectedEvent: Event | null
  setEquipmentNumber: (num: string) => void
  setEquipmentName: (name: string) => void
  updateEvent: (event: Event) => void
  indirectSubTab: string
}

export const useEventHandlers = ({
  selectedEvent,
  setEquipmentNumber,
  setEquipmentName,
  updateEvent,
  indirectSubTab,
}: UseEventHandlersProps) => {
  const { setSelectedProjectCode, updateEventWithActivityCode } = useSidebarState()

  // コンポーネントがマウントされたときに、選択されたイベントからプロジェクトと製番を設定
  useEffect(() => {
    if (selectedEvent) {
      if (selectedEvent.project) {
        setSelectedProjectCode(selectedEvent.project)
      }
      if (selectedEvent.equipmentNumber) {
        setEquipmentNumber(selectedEvent.equipmentNumber)
      }
      if (selectedEvent.equipmentName) {
        setEquipmentName(selectedEvent.equipmentName)
      }
    }
  }, [selectedEvent, setEquipmentNumber, setEquipmentName, setSelectedProjectCode])

  // タブ切り替え時に業務分類コードを更新する関数
  const updateActivityCodePrefix = (tab: string, subTab?: string) => {
    if (!selectedEvent) return;
    
    const updatedEvent = updateEventWithActivityCode(selectedEvent, tab, subTab, indirectSubTab);
    updateEvent(updatedEvent);
  };

  return {
    updateActivityCodePrefix,
  }
} 