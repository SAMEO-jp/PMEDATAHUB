"use client"

import React, { useState, useContext, useEffect } from 'react'
import { ViewModeContext } from '../../../ViewModeContext'
import type { TimeGridEvent } from '@src/app/zisseki-demo/[year]/[week]/types'

interface ZissekiDataViewProps {
  year: number
  month: number
  events: TimeGridEvent[]
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
  equipmentOrPurchase: string
  createdAt: string
  updatedAt: string
}

export default function ZissekiDataView({ year, month, events }: ZissekiDataViewProps) {
  const { showFilters } = useContext(ViewModeContext)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // 日時フォーマット関数
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return {
      date: `${month}/${day}`,
      time: `${hours}:${minutes}`
    }
  }

  // タイトル省略関数
  const truncateTitle = (title: string, maxLength: number = 13) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '…' : title
  }

  // 説明省略関数
  const truncateDescription = (description: string, maxLength: number = 30) => {
    return description.length > maxLength ? description.substring(0, maxLength) + '…' : description
  }

  // 装置OR購入品の表示用データを生成する関数
  const getEquipmentOrPurchase = (event: TimeGridEvent & { createdAt: string; updatedAt: string }) => {
    // 設備番号と設備名がある場合
    if (event.equipmentNumber && event.equipmentName) {
      return `${event.equipmentNumber} - ${event.equipmentName}`
    }
    // 設備番号のみの場合
    if (event.equipmentNumber) {
      return event.equipmentNumber
    }
    // 設備名のみの場合
    if (event.equipmentName) {
      return event.equipmentName
    }
    // アイテム名がある場合（購入品の可能性）
    if (event.itemName) {
      return event.itemName
    }
    // 何もない場合は空文字
    return ''
  }

  // zissekiデータを表示用の形式に変換
  const convertToDisplayData = (eventsData: (TimeGridEvent & { createdAt: string; updatedAt: string })[]): ZissekiDataRow[] => {
    return eventsData.map((event) => {
      const startFormatted = formatDateTime(event.startDateTime)
      const endFormatted = formatDateTime(event.endDateTime)
      
      return {
        id: event.id,
        title: truncateTitle(event.title),
        description: truncateDescription(event.description || ''),
        project: event.project,
        startDateTime: startFormatted.date,
        endDateTime: `${startFormatted.time} ~ ${endFormatted.time}`,
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
        equipmentOrPurchase: getEquipmentOrPurchase(event),
        createdAt: event.createdAt || '',
        updatedAt: event.updatedAt || '',
      }
    })
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
    const eventsData = events as (TimeGridEvent & { createdAt: string; updatedAt: string })[]
    const displayData = convertToDisplayData(eventsData)
    const processedData = filterData(sortData(displayData))
    
    const csvColumns = [
      { id: 'startDateTime', name: '日付' },
      { id: 'endDateTime', name: '時刻' },
      { id: 'title', name: 'タイトル' },
      { id: 'project', name: 'プロジェクト番号' },
      { id: 'activityCode', name: '業務コード' },
      { id: 'equipmentOrPurchase', name: '装置OR購入品' },
      { id: 'status', name: '状態' },
      { id: 'description', name: '説明' },
      { id: 'employeeNumber', name: '社員番号' },
      { id: 'equipmentNumber', name: '設備番号' },
      { id: 'equipmentName', name: '設備名' },
      { id: 'purposeProject', name: '目的プロジェクト' },
      { id: 'departmentCode', name: '部署コード' },
      { id: 'category', name: 'カテゴリ' },
      { id: 'selectedTab', name: '選択タブ' },
      { id: 'selectedProjectSubTab', name: 'プロジェクトサブタブ' },
      { id: 'selectedIndirectSubTab', name: '間接業務サブタブ' },
      { id: 'id', name: 'ID' },
      { id: 'createdAt', name: '作成日時' },
      { id: 'updatedAt', name: '更新日時' },
    ]

    const headers = csvColumns.map((col) => col.name).join(",")
    const rows = processedData.map((row) => {
      return csvColumns
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

  // CSVダウンロード関数をHeaderContentに登録
  useEffect(() => {
    const event = new CustomEvent('updateHeaderData', {
      detail: { downloadCSV }
    })
    document.dispatchEvent(event)
  }, [downloadCSV])


  const eventsData = events as (TimeGridEvent & { createdAt: string; updatedAt: string })[]
  const displayData = convertToDisplayData(eventsData)
  const processedData = filterData(sortData(displayData))
  
  // ページネーション計算
  const totalItems = processedData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = processedData.slice(startIndex, endIndex)
  
  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  // フィルターやソートが変更されたらページを1に戻す
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortField, sortDirection])

  const columns = [
    { id: 'startDateTime', name: '日付', checked: true },
    { id: 'endDateTime', name: '時刻', checked: true },
    { id: 'title', name: 'タイトル', checked: true },
    { id: 'project', name: 'プロジェクト番号', checked: true },
    { id: 'activityCode', name: '業務コード', checked: true },
    { id: 'equipmentOrPurchase', name: '装置OR購入品', checked: true },
    { id: 'status', name: '状態', checked: true },
    { id: 'description', name: '説明', checked: true },
    { id: 'employeeNumber', name: '社員番号', checked: false },
    { id: 'equipmentNumber', name: '設備番号', checked: false },
    { id: 'equipmentName', name: '設備名', checked: false },
    { id: 'purposeProject', name: '目的プロジェクト', checked: false },
    { id: 'departmentCode', name: '部署コード', checked: false },
    { id: 'category', name: 'カテゴリ', checked: false },
    { id: 'selectedTab', name: '選択タブ', checked: false },
    { id: 'selectedProjectSubTab', name: 'プロジェクトサブタブ', checked: false },
    { id: 'selectedIndirectSubTab', name: '間接業務サブタブ', checked: false },
    { id: 'id', name: 'ID', checked: false },
    { id: 'createdAt', name: '作成日時', checked: false },
    { id: 'updatedAt', name: '更新日時', checked: false },
  ]

  return (
    <div className="space-y-4">
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
                {columns.filter(column => column.checked).map((column) => (
                  <th
                    key={column.id}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 border-r border-gray-200 cursor-pointer hover:bg-gray-100"
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
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {columns.filter(column => column.checked).map((column) => (
                      <td
                        key={column.id}
                        className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200 border-r border-gray-200"
                      >
                        {row[column.id as keyof ZissekiDataRow] || ""}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.filter(column => column.checked).length}
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

      {/* 統計情報とページネーション */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            総件数: {totalItems}件 (ページ {currentPage}/{totalPages})
          </div>
          
          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              {/* 前のページボタン */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                前へ
              </button>
              
              {/* ページ番号 */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              {/* 次のページボタン */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                次へ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
