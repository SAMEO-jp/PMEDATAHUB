"use client"

import { Event } from "../../../types"

interface PurchaseItemSelectorProps {
  selectedTab: string
  selectedProjectSubTab: string
  selectedEvent: Event | null
  updateEvent: (event: Event) => void
}

export const PurchaseItemSelector = ({
  selectedTab,
  selectedProjectSubTab,
  selectedEvent,
  updateEvent
}: PurchaseItemSelectorProps) => {
  if (selectedTab !== "project" || selectedProjectSubTab !== "購入品") {
    return null
  }

  return (
    <div className="border-b bg-gray-50">
      <div className="px-4 py-2">
        <select 
          className="w-full py-1 border rounded text-sm" 
          value={selectedEvent?.activityColumn || "0"}
          onChange={(e) => {
            const newColumn = e.target.value;
            // 行は"1"（汎用）固定
            const row = "1"; 
            // 横列の値を2桁の数字に変換
            const columnCode =
              newColumn === "0" ? "00" :
              newColumn === "1" ? "01" :
              newColumn === "2" ? "02" :
              newColumn === "3" ? "03" :
              newColumn === "4" ? "04" :
              newColumn === "5" ? "05" :
              newColumn === "6" ? "06" :
              newColumn === "7" ? "07" :
              newColumn === "8" ? "08" :
              newColumn === "9" ? "09" :
              newColumn === "A" ? "10" :
              newColumn === "B" ? "11" :
              newColumn === "C" ? "12" :
              newColumn === "D" ? "13" :
              newColumn === "E" ? "14" :
              newColumn === "F" ? "15" :
              newColumn === "G" ? "16" : "00";
              
            // プレフィックスはP（購入品タブは常にP）
            const newCode = `P${row}${columnCode}`;
            if (selectedEvent) {
              updateEvent({
                ...selectedEvent,
                activityColumn: newColumn,
                activityCode: newCode,
                businessCode: newCode
              });
            }
          }}
        >
          <option value="0">00: 計画図作成</option>
          <option value="1">01: 仕様書作成準備</option>
          <option value="2">02: 仕様書作成・発行</option>
          <option value="3">03: 見積仕様比較検討</option>
          <option value="4">04: 契約確定確認</option>
          <option value="5">05: KOM</option>
          <option value="6">06: 確定仕様対応</option>
          <option value="7">07: 納入図対応</option>
          <option value="8">08: 工事用資料整備</option>
          <option value="9">09: 図面化及び出図対応</option>
          <option value="A">10: 試運転要領</option>
          <option value="B">11: 取説</option>
          <option value="C">12: 検査要領対応</option>
          <option value="D">13: 検査対応</option>
          <option value="E">14: 出荷調整対応</option>
          <option value="F">15: 検定対応</option>
          <option value="G">16: その他</option>
        </select>
      </div>
    </div>
  )
} 