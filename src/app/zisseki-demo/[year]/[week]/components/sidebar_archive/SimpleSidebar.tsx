"use client"

import React from "react"
import { TimeGridEvent } from "../../types"

// シンプルなサイドバーのプロパティ型定義
type SimpleSidebarProps = {
  selectedEvent: TimeGridEvent | null
  onEventUpdate: (updatedEvent: TimeGridEvent) => void
}

/**
 * 最小限のシンプルなサイドバーコンポーネント
 * 
 * 機能:
 * - 選択されたイベントのプロパティを表示
 * - 基本的な編集機能を提供
 * - 変更を親コンポーネントに返す
 */
export const SimpleSidebar = ({ selectedEvent, onEventUpdate }: SimpleSidebarProps) => {
  
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

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">イベント詳細</h3>
      
      {/* 基本情報セクション */}
      <div className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            アクティビティコード
          </label>
          <input
            type="text"
            value={selectedEvent.activityCode || ""}
            onChange={(e) => handlePropertyChange("activityCode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* デバッグ情報 */}
      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">デバッグ情報</h4>
        <pre className="text-xs text-gray-600 overflow-auto">
          {JSON.stringify(selectedEvent, null, 2)}
        </pre>
      </div>
    </div>
  )
}
