"use client"

import React, { useState } from "react"
import { TimeGridEvent } from "../../types"

// 拡張可能なサイドバーのプロパティ型定義
type ExpandableSidebarProps = {
  selectedEvent: TimeGridEvent | null
  onEventUpdate: (updatedEvent: TimeGridEvent) => void
  features?: {
    basicInfo?: boolean
    designSubType?: boolean
    activityCode?: boolean
    debugInfo?: boolean
  }
}

/**
 * 段階的に機能を追加できる拡張可能なサイドバーコンポーネント
 * 
 * 機能:
 * - 基本情報の編集
 * - 設計サブタイプの選択（オプション）
 * - アクティビティコードの編集（オプション）
 * - デバッグ情報の表示（オプション）
 */
export const ExpandableSidebar = ({ 
  selectedEvent, 
  onEventUpdate,
  features = {
    basicInfo: true,
    designSubType: false,
    activityCode: false,
    debugInfo: false
  }
}: ExpandableSidebarProps) => {
  
  // イベントが選択されていない場合は何も表示しない
  if (!selectedEvent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4">イベント詳細</h3>
        <p className="text-gray-500">イベントを選択してください</p>
      </div>
    )
  }

  // 基本的なプロパティ編集ハンドラー
  const handlePropertyChange = (property: keyof TimeGridEvent, value: string) => {
    const updatedEvent = {
      ...selectedEvent,
      [property]: value
    }
    onEventUpdate(updatedEvent)
  }

  // 設計サブタイプ変更ハンドラー
  const handleDesignSubTypeChange = (subType: { name: string; code: string }) => {
    const updatedEvent = {
      ...selectedEvent,
      designSubType: subType.name,
      activityCode: `${selectedEvent.activityCode?.substring(0, 2) || 'DP'}${subType.code}`
    }
    onEventUpdate(updatedEvent)
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">イベント詳細</h3>
      
      {/* 基本情報セクション */}
      {features.basicInfo && (
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700 border-b pb-2">基本情報</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル
            </label>
            <input
              type="text"
              value={selectedEvent.title || ""}
              onChange={(e) => handlePropertyChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              value={selectedEvent.description || ""}
              onChange={(e) => handlePropertyChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* 設計サブタイプセクション */}
      {features.designSubType && (
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700 border-b pb-2">設計業務タイプ</h4>
          
          <div className="flex flex-wrap gap-2">
            {[
              { name: "検討書作成及びサイン", code: "01" },
              { name: "作図及び作図準備", code: "02" },
              { name: "作図前図面検討会", code: "03" },
              { name: "作図指示", code: "04" },
              { name: "作図（外注あり）", code: "05" },
              { name: "作図後図面検討会", code: "06" },
              { name: "検図", code: "07" },
              { name: "承認作業", code: "08" },
              { name: "出図確認", code: "09" },
              { name: "修正対応", code: "10" },
              { name: "その他", code: "11" },
            ].map((subType) => (
              <button
                key={subType.name}
                className={`px-3 py-1.5 rounded-full text-xs ${
                  selectedEvent.designSubType === subType.name
                    ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                }`}
                onClick={() => handleDesignSubTypeChange(subType)}
              >
                {subType.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* アクティビティコードセクション */}
      {features.activityCode && (
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700 border-b pb-2">アクティビティコード</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              コード
            </label>
            <input
              type="text"
              value={selectedEvent.activityCode || ""}
              onChange={(e) => handlePropertyChange("activityCode", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* デバッグ情報セクション */}
      {features.debugInfo && (
        <div className="mt-6 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">デバッグ情報</h4>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(selectedEvent, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
