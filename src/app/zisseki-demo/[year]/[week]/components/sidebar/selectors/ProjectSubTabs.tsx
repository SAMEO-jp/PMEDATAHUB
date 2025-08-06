"use client"

import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"

export const ProjectSubTabs = () => {
  // Contextから取得するProps（定数 + 関数）
  const { 
    selectedEvent,            // ← 定数：選択中のイベント
    activeSubTabs,           // ← 定数：サブタブの状態
    setActiveSubTab,         // ← 関数1：サブタブを設定
    updateActivityCodePrefix, // ← 関数2：業務分類コードを更新
    updateEvent              // ← 関数3：イベントを更新
  } = useEventContext();
  
  // イベントが選択されている場合は、そのイベントのタブ状態を表示
  const currentSubTab = selectedEvent?.selectedProjectSubTab || activeSubTabs.project  // ← 定数で現在のサブタブを決定

  // プロジェクトサブタブ変更時の処理
  const handleProjectSubTabChange = (subTab: string) => {
    setActiveSubTab('project', subTab);  // ← 関数1：サブタブ状態を更新
    updateActivityCodePrefix("project", subTab);  // ← 関数2：業務分類コードを更新
    
    // イベントが選択されている場合は、イベントデータも更新
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        selectedProjectSubTab: subTab,
        selectedTab: "project"
      };
      
      updateEvent(selectedEvent.id, updatedEvent);  // ← 関数3：イベントデータを更新
    }
  }

  return (
    <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
      {["計画", "設計", "会議", "購入品", "その他"].map((subTab) => (
        <button
          key={subTab}
          className={`py-1 px-1 whitespace-nowrap mr-2 ${
            currentSubTab === subTab  // ← 定数で比較してスタイルを決定
              ? "bg-blue-100 text-blue-800 font-medium rounded"  // 選択中：青背景
              : "text-gray-500 hover:text-gray-700"  // 非選択：グレー文字
          }`}
          onClick={() => handleProjectSubTabChange(subTab)}  // ← subTabを引数として渡す
        >
          {subTab}
        </button>
      ))}
    </div>
  )
} 