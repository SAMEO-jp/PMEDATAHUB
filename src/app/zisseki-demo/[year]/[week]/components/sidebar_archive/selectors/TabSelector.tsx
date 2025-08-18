"use client"

import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext";

export const TabSelector = () => {
  // Contextから取得するProps（1つの定数 + 2つの関数）
  const { 
    getActiveTab,           // ← 関数：現在選択中のタブを取得
    setActiveTab,           // ← 関数1：タブを変更する関数
    updateActivityCodePrefix // ← 関数2：業務分類コードを更新する関数
  } = useEventContext();

  const activeTab = getActiveTab() || 'project'; // ← 現在のアクティブタブを取得

  // タブ切り替え時の処理
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);                    // ← 関数1：タブ状態を更新
    updateActivityCodePrefix(tab);        // ← 関数2：業務分類コードを更新
  };

  return (
    <div className="flex space-x-1">
      {/* プロジェクトタブボタン */}
      <button
        className={`px-3 py-1 text-xs rounded ${
          activeTab === "project"  // ← 定数で比較してスタイルを決定
            ? "bg-blue-500 text-white"    // 選択中：青背景・白文字
            : "bg-gray-200 text-gray-700 hover:bg-gray-300" // 非選択：グレー背景
        }`}
        onClick={() => handleTabChange("project")}  // ← "project"を引数として渡す
      >
        プロジェクト
      </button>
      
      {/* 間接業務タブボタン */}
      <button
        className={`px-3 py-1 text-xs rounded ${
          activeTab === "indirect"  // ← 定数で比較してスタイルを決定
            ? "bg-blue-500 text-white"    // 選択中：青背景・白文字
            : "bg-gray-200 text-gray-700 hover:bg-gray-300" // 非選択：グレー背景
        }`}
        onClick={() => handleTabChange("indirect")}  // ← "indirect"を引数として渡す
      >
        間接業務
      </button>
    </div>
  );
}; 