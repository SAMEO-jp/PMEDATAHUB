"use client"

import React, { useState, useEffect } from "react"
import { Project } from "../../types/event"

interface Event {
  id: string
  title: string
  start: string
  end: string
  project?: string
  equipmentNumber?: string
  equipmentName?: string
  purchaseItem?: {
    id: string
    name: string
    description: string
  }
  purposeProject?: string
  activityCode?: string
}

interface ProjectSelectProps {
  projects: Project[]
  selectedProjectCode: string
  onChange: (code: string) => void
  label: string
  selectedEvent: Event | null
  updateEvent: (event: Event) => void
  isProjectTab: boolean
}

export function ProjectSelect({
  projects,
  selectedProjectCode,
  onChange,
  label,
  selectedEvent,
  updateEvent,
  isProjectTab,
}: ProjectSelectProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectCode, setNewProjectCode] = useState("")

  // プロジェクトリストの初期化と更新
  useEffect(() => {
    if (projects) {
      setFilteredProjects(projects)
    }
  }, [projects])

  // 検索フィルタリング
  useEffect(() => {
    if (projects) {
      const filtered = projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProjects(filtered)
    }
  }, [searchTerm, projects])

  const handleProjectChange = (projectCode: string) => {
    onChange(projectCode)
    if (selectedEvent && updateEvent) {
      updateEvent({
        ...selectedEvent,
        project: projectCode
      })
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="プロジェクトを検索..."
          className="flex-1 px-3 py-2 border rounded-md"
        />
      </div>
      <div className="max-h-40 overflow-y-auto">
        {filteredProjects && filteredProjects.length > 0 ? (
          <ul className="space-y-1">
            {filteredProjects.map((project) => (
              <li
                key={project.id}
                className={`p-2 rounded-md cursor-pointer ${
                  selectedProjectCode === project.code
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleProjectChange(project.code)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color || "#4B5563" }}
                  />
                  <div>
                    <div className="text-sm font-medium">{project.code}</div>
                    <div className="text-xs text-gray-500">{project.name}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-center py-2">
            {searchTerm ? "プロジェクトが見つかりません" : "プロジェクトがありません"}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newProjectCode}
          onChange={(e) => setNewProjectCode(e.target.value)}
          placeholder="プロジェクトコード"
          className="w-1/3 px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="プロジェクト名"
          className="flex-1 px-3 py-2 border rounded-md"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleProjectChange(newProjectCode)
            }
          }}
        />
        <button
          onClick={() => handleProjectChange(newProjectCode)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          追加
        </button>
      </div>
    </div>
  )
} 