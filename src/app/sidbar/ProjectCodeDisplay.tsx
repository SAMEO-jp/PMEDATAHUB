"use client"

import { ProjectSelect } from "../zisseki-demo/[year]/[week]/components/sidebar/components/ProjectSelect"
import { TimeGridEvent, Project } from "../zisseki-demo/[year]/[week]/types"

// プロジェクトコード表示コンポーネントのProps
interface ProjectCodeDisplayProps {
  selectedTab: string                    // ← 定数：現在選択中のタブ
  indirectSubTab: string                 // ← 定数：間接業務のサブタブ
  selectedProjectCode: string            // ← 定数：選択中のプロジェクトコード
  purposeProjectCode: string             // ← 定数：目的プロジェクトコード
  projects: Project[]                    // ← 定数：プロジェクト一覧
  selectedEvent: TimeGridEvent | null   // ← 定数：選択中のイベント
  updateEvent: (event: TimeGridEvent) => void  // ← 関数：イベント更新関数
  setSelectedProjectCode: (code: string) => void  // ← 関数1：プロジェクトコード設定
  setPurposeProjectCode: (code: string) => void   // ← 関数2：目的プロジェクトコード設定
}

export const ProjectCodeDisplay = ({
  selectedTab,
  indirectSubTab,
  selectedProjectCode,
  purposeProjectCode,
  projects,
  selectedEvent,
  updateEvent,
  setSelectedProjectCode,
  setPurposeProjectCode
}: ProjectCodeDisplayProps) => {
  return (
    <>
      {/* プロジェクトコード選択ドロップダウン - 条件付きレンダリング */}
      {/* 
        条件: プロジェクトタブ OR (間接業務タブ AND 目的間接サブタブ)
        役割: プロジェクトコードの選択機能を提供
        コンポーネント: ProjectSelect（Contextを使用するためProps不要）
      */}
      {(selectedTab === "project" || (selectedTab === "indirect" && indirectSubTab === "目的間接")) && (
        <ProjectSelect
          value={selectedTab === "project" ? selectedProjectCode : purposeProjectCode}
          onChange={selectedTab === "project" ? setSelectedProjectCode : setPurposeProjectCode}
          projects={projects}
          label={selectedTab === "project" ? "プロジェクトコード" : "目的プロジェクトコード"}
        />
      )}

      {/* 純間接の場合の固定プロジェクトコード表示 - 条件付きレンダリング */}
      {/* 
        条件: 間接業務タブ AND 純間接サブタブ
        役割: 純間接業務の固定コードを表示
      */}
      {selectedTab === "indirect" && indirectSubTab === "純間接" && (
        <div className="px-4 py-2 border-b">
          <label className="block text-xs font-medium text-gray-500 mb-1">純間接コード</label>
          <div className="p-2 bg-gray-100 rounded border text-gray-700">純間接（作業対象プロジェクトなし）</div>
        </div>
      )}

      {/* 控除時間の場合の固定プロジェクトコード表示 - 条件付きレンダリング */}
      {/* 
        条件: 間接業務タブ AND 控除時間サブタブ
        役割: 控除時間の固定コードを表示
      */}
      {selectedTab === "indirect" && indirectSubTab === "控除時間" && (
        <div className="px-4 py-2 border-b">
          <label className="block text-xs font-medium text-gray-500 mb-1">控除時間コード</label>
          <div className="p-2 bg-gray-100 rounded border text-gray-700">控除時間の為プロ番無し</div>
        </div>
      )}
    </>
  )
} 