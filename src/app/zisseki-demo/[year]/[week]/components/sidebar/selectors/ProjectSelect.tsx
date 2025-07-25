"use client"

import { useState } from "react"

interface ProjectSelectProps {
  projects: any[]
  selectedProjectCode: string
  onChange: (projectCode: string) => void
  label: string
  selectedEvent: any
  updateEvent: (event: any) => void
  isProjectTab: boolean
}

export const ProjectSelect = ({
  projects,
  selectedProjectCode,
  onChange,
  label,
  selectedEvent,
  updateEvent,
  isProjectTab
}: ProjectSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleProjectChange = (projectCode: string) => {
    onChange(projectCode)
    
    if (selectedEvent) {
      if (isProjectTab) {
        updateEvent({
          ...selectedEvent,
          project: projectCode
        })
      } else {
        updateEvent({
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
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedProjectCode ? (
            <span className="text-sm">{selectedProjectCode}</span>
          ) : (
            <span className="text-sm text-gray-400">プロジェクトを選択してください</span>
          )}
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2">
              <input
                type="text"
                placeholder="プロジェクトを検索..."
                className="w-full p-2 text-sm border rounded mb-2"
                onChange={(e) => {
                  // 検索機能は後で実装
                }}
              />
            </div>
            <div className="max-h-48 overflow-auto">
              {projects.map((project) => (
                <button
                  key={project.project_id}
                  className="w-full p-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    handleProjectChange(project.project_id)
                    setIsOpen(false)
                  }}
                >
                  <div className="font-medium">{project.project_id}</div>
                  <div className="text-xs text-gray-500">{project.project_name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 