"use client"

import React, { useState } from 'react'
import { useZissekiMonthData } from '@src/hooks/useZissekiData'
import type { TimeGridEvent } from '@src/app/zisseki-demo/[year]/[week]/types'

interface ZissekiDataViewProps {
  year: number
  month: number
}



interface ZissekiDataRow {
  id: string
  title: string
  description: string
  project: string
  startDateTime: string
  endDateTime: string
  activityCode: string
  employeeNumber: string
  equipmentNumber: string
  equipmentName: string
  purposeProject: string
  departmentCode: string
  status: string
  category: string
  selectedTab: string
  selectedProjectSubTab: string
  selectedIndirectSubTab: string
  createdAt: string
  updatedAt: string
}

export default function ZissekiDataView({ year, month }: ZissekiDataViewProps) {
  const { data, isLoading, error } = useZissekiMonthData(year, month)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = useState(false) // フィルター表示状態

  // zissekiデータを表示用の形式に変換
  const convertToDisplayData = (events: (TimeGridEvent & { createdAt: string; updatedAt: string })[]): ZissekiDataRow[] => {
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      project: event.project,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      activityCode: event.activityCode || '',
      employeeNumber: event.employeeNumber || '',
      equipmentNumber: event.equipmentNumber || '',
      equipmentName: event.equipmentName || '',
      purposeProject: event.purposeProject || '',
      departmentCode: event.departmentCode || '',
      status: event.status || '',
      category: event.category || '',
      selectedTab: event.selectedTab || '',
      selectedProjectSubTab: event.selectedProjectSubTab || '',
      selectedIndirectSubTab: event.selectedIndirectSubTab || '',
      createdAt: event.createdAt || '',
      updatedAt: event.updatedAt || '',
    }))
  }

  // ソート関数
  const sortData = (data: ZissekiDataRow[]) => {
    if (!sortField) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortField as keyof ZissekiDataRow]
      const bValue = b[sortField as keyof ZissekiDataRow]

      if (aValue === null || aValue === undefined) return sortDirection === "asc" ? 1 : -1
      if (bValue === null || bValue === undefined) return sortDirection === "asc" ? -1 : 1

      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortDirection === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
      }

      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }

  // フィルタリング関数
  const filterData = (data: ZissekiDataRow[]) => {
    return data.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        const cellValue = String(row[key as keyof ZissekiDataRow] || "").toLowerCase()
        return cellValue.includes(value.toLowerCase())
      })
    })
  }

  // CSVダウンロード
  const downloadCSV = () => {
    const events = (data?.data?.events || []) as (TimeGridEvent & { createdAt: string; updatedAt: string })[]
    const displayData = convertToDisplayData(events)
    const processedData = filterData(sortData(displayData))
    
    const columns = [
      { id: 'id', name: 'ID' },
      { id: 'title', name: 'タイトル' },
      { id: 'description', name: '説明' },
      { id: 'project', name: 'プロジェクト' },
      { id: 'startDateTime', name: '開始日時' },
      { id: 'endDateTime', name: '終了日時' },
      { id: 'activityCode', name: '業務コード' },
      { id: 'employeeNumber', name: '社員番号' },
      { id: 'equipmentNumber', name: '設備番号' },
      { id: 'equipmentName', name: '設備名' },
      { id: 'purposeProject', name: '目的プロジェクト' },
      { id: 'departmentCode', name: '部署コード' },
      { id: 'status', name: '状態' },
      { id: 'category', name: 'カテゴリ' },
      { id: 'selectedTab', name: '選択タブ' },
      { id: 'selectedProjectSubTab', name: 'プロジェクトサブタブ' },
      { id: 'selectedIndirectSubTab', name: '間接業務サブタブ' },
      { id: 'createdAt', name: '作成日時' },
      { id: 'updatedAt', name: '更新日時' },
    ]

    const headers = columns.map((col) => col.name).join(",")
    const rows = processedData.map((row) => {
      return columns
        .map((col) => {
          const value = row[col.id as keyof ZissekiDataRow] !== undefined && row[col.id as keyof ZissekiDataRow] !== null ? row[col.id as keyof ZissekiDataRow] : ""
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(",")
    })

    const csv = [headers, ...rows].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.setAttribute("href", url)
    a.setAttribute("download", `zisseki_data_${year}_${month}_${new Date().toISOString().slice(0, 10)}.csv`)
    a.click()

    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        エラーが発生しました: {error.message}
      </div>
    )
  }

  const events = (data?.data?.events || []) as (TimeGridEvent & { createdAt: string; updatedAt: string })[]
  const displayData = convertToDisplayData(events)
  const processedData = filterData(sortData(displayData))

  const columns = [
    { id: 'id', name: 'ID', checked: true },
    { id: 'title', name: 'タイトル', checked: true },
    { id: 'description', name: '説明', checked: false },
    { id: 'project', name: 'プロジェクト', checked: true },
    { id: 'startDateTime', name: '開始日時', checked: true },
    { id: 'endDateTime', name: '終了日時', checked: true },
    { id: 'activityCode', name: '業務コード', checked: true },
    { id: 'employeeNumber', name: '社員番号', checked: true },
    { id: 'equipmentNumber', name: '設備番号', checked: false },
    { id: 'equipmentName', name: '設備名', checked: false },
    { id: 'purposeProject', name: '目的プロジェクト', checked: false },
    { id: 'departmentCode', name: '部署コード', checked: false },
    { id: 'status', name: '状態', checked: true },
    { id: 'category', name: 'カテゴリ', checked: false },
    { id: 'selectedTab', name: '選択タブ', checked: false },
    { id: 'selectedProjectSubTab', name: 'プロジェクトサブタブ', checked: false },
    { id: 'selectedIndirectSubTab', name: '間接業務サブタブ', checked: false },
    { id: 'createdAt', name: '作成日時', checked: false },
    { id: 'updatedAt', name: '更新日時', checked: false },
  ]

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold">実績データ ({year}年{month}月)</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded text-sm font-medium ${
              showFilters
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {showFilters ? "フィルター非表示" : "フィルター表示"}
          </button>
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            CSVダウンロード
          </button>
        </div>
      </div>

      {/* フィルター（条件付き表示） */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {column.name}
                </label>
                <input
                  type="text"
                  value={filters[column.id] || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, [column.id]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`${column.name}でフィルター`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* データテーブル */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      if (sortField === column.id) {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                      } else {
                        setSortField(column.id)
                        setSortDirection("asc")
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      {column.name}
                      {sortField === column.id && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.length > 0 ? (
                processedData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200"
                      >
                        {row[column.id as keyof ZissekiDataRow] || ""}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    データがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600">
          総件数: {processedData.length}件
        </div>
      </div>
    </div>
  )
}
