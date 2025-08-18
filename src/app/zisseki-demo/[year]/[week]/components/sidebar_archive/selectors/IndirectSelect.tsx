"use client"

import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"

export const IndirectSelect = () => {
  // Contextから取得するProps（定数 + 関数）
  const { 
    selectedEvent,        // ← 定数：選択中のイベント
    getActiveSubTab,     // ← 関数：サブタブの状態を取得
    setActiveSubTab,     // ← 関数1：サブタブを設定
    handleUpdateEvent    // ← 関数2：イベントを更新
  } = useEventContext();

  // イベントが選択されている場合は、そのイベントのタブ状態を表示
  const currentIndirectSubTab = selectedEvent?.selectedIndirectSubTab || getActiveSubTab('indirect') || '純間接'  // ← 定数で現在のサブタブを決定

  // 間接業務サブタブ変更時の処理
  const handleIndirectSubTabChange = (subTab: string) => {
    setActiveSubTab('indirect', subTab);  // ← 関数1：サブタブ状態を更新
    
    if (selectedEvent) {
      handleUpdateEvent({  // ← 関数2：イベントデータを更新
        ...selectedEvent,
        selectedIndirectSubTab: subTab,
        selectedTab: "indirect",
        indirectType: subTab
      });
    }
  }

  return (
    <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
      {["純間接", "目的間接", "控除時間"].map((subTab) => (
        <button
          key={subTab}
          className={`py-1 px-1 whitespace-nowrap mr-2 ${
            currentIndirectSubTab === subTab  // ← 定数で比較してスタイルを決定
              ? "bg-blue-100 text-blue-800 font-medium rounded"  // 選択中：青背景
              : "text-gray-500 hover:text-gray-700"  // 非選択：グレー文字
          }`}
          onClick={() => handleIndirectSubTabChange(subTab)}  // ← subTabを引数として渡す
        >
          {subTab}
        </button>
      ))}
    </div>
  )
} 