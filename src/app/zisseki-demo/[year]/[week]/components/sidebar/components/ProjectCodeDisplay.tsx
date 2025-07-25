"use client"

import { ProjectSelect } from "../selectors/ProjectSelect"

interface ProjectCodeDisplayProps {
  selectedTab: string
  indirectSubTab: string
  selectedProjectCode: string
  purposeProjectCode: string
  projects: any[]
  selectedEvent: any
  updateEvent: (event: any) => void
  setSelectedProjectCode: (code: string) => void
  setPurposeProjectCode: (code: string) => void
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
      {/* プロジェクトコード選択ドロップダウン - プロジェクトタブまたは目的間接タブの場合のみ表示 */}
      {(selectedTab === "project" || (selectedTab === "indirect" && indirectSubTab === "目的間接")) && (
        <ProjectSelect
          projects={projects}
          selectedProjectCode={selectedTab === "project" ? selectedProjectCode : purposeProjectCode}
          onChange={(projectCode) => {
            if (selectedTab === "project") {
              setSelectedProjectCode(projectCode);
            } else {
              setPurposeProjectCode(projectCode);
            }
          }}
          label={selectedTab === "project" ? "プロジェクトコード" : "目的プロジェクトコード"}
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
          isProjectTab={selectedTab === "project"}
        />
      )}

      {/* 純間接の場合の固定プロジェクトコード表示 */}
      {selectedTab === "indirect" && indirectSubTab === "純間接" && (
        <div className="px-4 py-2 border-b">
          <label className="block text-xs font-medium text-gray-500 mb-1">純間接コード</label>
          <div className="p-2 bg-gray-100 rounded border text-gray-700">純間接（作業対象プロジェクトなし）</div>
        </div>
      )}

      {/* 控除時間の場合の固定プロジェクトコード表示 */}
      {selectedTab === "indirect" && indirectSubTab === "控除時間" && (
        <div className="px-4 py-2 border-b">
          <label className="block text-xs font-medium text-gray-500 mb-1">控除時間コード</label>
          <div className="p-2 bg-gray-100 rounded border text-gray-700">控除時間の為プロ番無し</div>
        </div>
      )}
    </>
  )
} 