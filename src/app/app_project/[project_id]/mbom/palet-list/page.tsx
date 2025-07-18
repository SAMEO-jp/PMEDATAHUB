// ==========================================
// 変更記録
// 2025-01-XX PALET_LISTテーブル表示ページ作成
// ==========================================

'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { ArrowPathIcon, TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Button } from '@src/components/ui/button'
import { TableHead } from '@src/components/ui/table'
import { usePaletList } from '@src/hooks/usePaletData'

// ==========================================
// 型定義層
// ==========================================
interface PaletListData {
  palet_list_id: string;
  palet_master_id: string;
  palet_list_display_name: string;
  palet_quantity: number;
  created_at: string;
  updated_at: string;
}

// ==========================================
// ユーティリティ関数層
// ==========================================
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// ==========================================
// コンポーネント層
// ==========================================
export default function PaletListPage() {
  // ==========================================
  // パラメータとルーティング層
  // ==========================================
  const params = useParams()
  const router = useRouter()
  const projectId = params.project_id as string
  
  // ==========================================
  // 状態管理層
  // ==========================================
  const [isCreating, setIsCreating] = useState(false)
  
  // ==========================================
  // データ取得層
  // ==========================================
  const paletListQuery = usePaletList()

  // ==========================================
  // イベントハンドラ層
  // ==========================================
  const handleRefresh = () => {
    void paletListQuery.refetch()
  }

  const handleCreate = () => {
    setIsCreating(true)
    // TODO: 作成モーダルの実装
  }

  const handleEdit = (paletListId: string) => {
    console.log('パレットリスト編集:', paletListId)
    // TODO: 編集モーダルの実装
  }

  const handleDelete = (paletListId: string) => {
    if (confirm('このパレットリストを削除しますか？\n\nこの操作により、パレットリストID「' + paletListId + '」のデータが削除されます。')) {
      try {
        // TODO: 削除APIの実装
        console.log('パレットリスト削除:', paletListId)
        alert('パレットリストの削除が完了しました')
        void paletListQuery.refetch()
      } catch (error) {
        console.error('パレットリスト削除エラー:', error)
        alert('パレットリストの削除中にエラーが発生しました')
      }
    }
  }

  const handlePaletListClick = (paletListId: string) => {
    router.push(`/app_project/${projectId}/mbom/palet-list/${paletListId}`)
  }

  // ==========================================
  // レンダリング層
  // ==========================================
  // ローディング状態の表示
  if (paletListQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  // エラー状態の表示
  if (paletListQuery.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">{paletListQuery.error.message}</p>
          <Button onClick={handleRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            再試行
          </Button>
        </div>
      </div>
    )
  }

  const paletListData = paletListQuery.data?.data || []

  return (
    <div className="container mx-auto p-4">
      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">PALET_LIST管理</h1>
        <p className="text-slate-600">パレットリストの管理を行います</p>
      </div>

      {/* 操作ボタン */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={handleCreate} variant="default" size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            新規作成
          </Button>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          更新
        </Button>
      </div>

      {/* パレットリストテーブル */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <TableHead>パレットリストID</TableHead>
                <TableHead>パレットマスターID</TableHead>
                <TableHead>パレットリスト名</TableHead>
                <TableHead className="text-center">パレット数量</TableHead>
                <TableHead>作成日時</TableHead>
                <TableHead>更新日時</TableHead>
                <TableHead className="w-24 text-center">操作</TableHead>
              </tr>
            </thead>
            <tbody>
              {paletListData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    パレットリストが登録されていません
                  </td>
                </tr>
              ) : (
                paletListData.map((paletList) => (
                  <tr key={paletList.palet_list_id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900 font-mono text-sm">
                      {paletList.palet_list_id}
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-mono text-sm">
                      {paletList.palet_master_id}
                    </td>
                    <td 
                      className="px-6 py-4 text-slate-900 font-medium hover:text-blue-600 cursor-pointer"
                      onClick={() => handlePaletListClick(paletList.palet_list_id.toString())}
                    >
                      {paletList.palet_list_display_name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {paletList.palet_quantity}個
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {formatDate(paletList.created_at)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {formatDate(paletList.updated_at)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button 
                          onClick={() => handleEdit(paletList.palet_list_id.toString())}
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <PencilIcon className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(paletList.palet_list_id.toString())}
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 結果数表示 */}
      <div className="mt-4 p-3 border-t bg-slate-50 text-sm text-slate-600">
        {paletListData.length} 件
      </div>
    </div>
  )
} 