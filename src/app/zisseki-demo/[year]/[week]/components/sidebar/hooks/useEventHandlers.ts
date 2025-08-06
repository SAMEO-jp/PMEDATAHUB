import { useEffect } from 'react'
import { TimeGridEvent } from '../../../types'
import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"

interface UseEventHandlersProps {
  selectedEvent: TimeGridEvent | null
  setEquipmentNumber: (num: string) => void
  setEquipmentName: (name: string) => void
  updateEvent: (event: TimeGridEvent) => void
  indirectSubTab: string
}

export const useEventHandlers = ({
  selectedEvent,
  setEquipmentNumber,
  setEquipmentName,
  updateEvent,
  indirectSubTab,
}: UseEventHandlersProps) => {
  const { setSelectedProjectCode } = useEventContext()

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
    
    updateEvent(updatedEvent);
  };

  return {
    updateActivityCodePrefix,
  }
} 