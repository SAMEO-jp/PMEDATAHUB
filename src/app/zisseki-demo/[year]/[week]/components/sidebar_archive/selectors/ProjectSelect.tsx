"use client"

import { useState } from "react"
import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"
import { Project } from "../../../types"

// プロジェクト選択コンポーネントのProps（データのみ）
interface ProjectSelectProps {
  projects: Project[]        // ← 定数：プロジェクト一覧（既存のProject型を使用）
  label: string             // ← 定数：ラベル文字列
  isProjectTab: boolean     // ← 定数：プロジェクトタブかどうか
}

export const ProjectSelect = ({
  projects,
  label,
  isProjectTab
}: ProjectSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)  // ← 定数：ドロップダウンの開閉状態
  
  // Contextから取得するProps（定数 + 関数）
  const { 
    selectedEvent,            // ← 定数：選択中のイベント
    selectedProjectCode,      // ← 定数：選択中のプロジェクトコード
    purposeProjectCode,       // ← 定数：目的プロジェクトコード
    setSelectedProjectCode,   // ← 関数1：プロジェクトコードを設定
    setPurposeProjectCode,    // ← 関数2：目的プロジェクトコードを設定
    updateEvent              // ← 関数3：イベントを更新
  } = useEventContext();

  // 現在のプロジェクトコードと設定関数を決定
  const currentProjectCode = isProjectTab ? selectedProjectCode : purposeProjectCode;  // ← 定数で条件分岐
  const setProjectCode = isProjectTab ? setSelectedProjectCode : setPurposeProjectCode;  // ← 定数で条件分岐

  // プロジェクト変更時の処理
  const handleProjectChange = (projectCode: string) => {
    setProjectCode(projectCode)  // ← 関数1または2：プロジェクトコードを更新
    
    if (selectedEvent) {
      if (isProjectTab) {
        updateEvent(selectedEvent.id, {  // ← 関数3：イベントデータを更新
          ...selectedEvent,
          project: projectCode
        })
      } else {
        updateEvent(selectedEvent.id, {  // ← 関数3：イベントデータを更新
          ...selectedEvent,
          purposeProject: projectCode
        })
      }
    }
  }

  return (
    <div className="px-4 py-2 border-b">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          className="w-full p-2 text-left border rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}  // ← 定数でドロップダウンの開閉を制御
        >
          {currentProjectCode ? (  // ← 定数で条件分岐
            <span className="text-sm">{currentProjectCode}</span>  // ← 定数でプロジェクトコードを表示
          ) : (
            <span className="text-sm text-gray-400">プロジェクトを選択してください</span>
          )}
        </button>
        
        {isOpen && (  // ← 定数でドロップダウンの表示を制御
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2">
              <input
                type="text"
                placeholder="プロジェクトを検索..."
                className="w-full p-2 text-sm border rounded mb-2"
                onChange={(e) => {
                  // TODO: 優先度2 - プロジェクト検索機能の実装
                  // 実装内容:
                  // 1. 入力されたテキストでプロジェクトリストをフィルタリング
                  // 2. リアルタイム検索（debounce付き）
                  // 3. 検索結果のハイライト表示
                  // 4. キーボードナビゲーション対応
                  console.log('検索機能は後で実装予定:', e.target.value);
                }}
              />
            </div>
            <div className="max-h-48 overflow-auto">
              {projects.map((project: Project) => (  // ← 定数でプロジェクト一覧を表示（既存のProject型を使用）
                <button
                  key={project.projectCode || project.projectNumber}  // ← 既存のProject型のプロパティを使用
                  className="w-full p-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    handleProjectChange(project.projectCode || project.projectNumber || '')  // ← 既存のProject型のプロパティを使用
                    setIsOpen(false)  // ← 定数でドロップダウンを閉じる
                  }}
                >
                  <div className="font-medium">{project.projectCode || project.projectNumber}</div>
                  <div className="text-xs text-gray-500">{project.projectName || project.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 