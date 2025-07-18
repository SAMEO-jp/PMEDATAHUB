'use client'

import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Button } from '@src/components/ui/button'
import { TableHead } from '@src/components/ui/table'

import React from 'react'
import type { KonpoPalet } from '@src/types/palet'

// ==========================================
// 型定義層
// ==========================================
interface PaletteTableProps {
  data: KonpoPalet[]
  loading: boolean
  error: string | null
  onRefresh: () => void
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
export function PaletteTable({ data, loading, error, onRefresh }: PaletteTableProps) {
  // ==========================================
  // レンダリング層
  // ==========================================
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2'></div>
          <p className='text-slate-600 text-sm'>パレットデータを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <p className='text-red-600 mb-2'>エラーが発生しました</p>
          <p className='text-slate-600 text-sm mb-4'>{error}</p>
          <Button onClick={onRefresh} variant='outline' size='sm'>
            <ArrowPathIcon className='w-4 h-4 mr-2' />
            再試行
          </Button>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <p className='text-slate-600 text-sm'>登録されたパレットがありません</p>
          <Button onClick={onRefresh} variant='outline' size='sm'>
            <ArrowPathIcon className='w-4 h-4 mr-2' />
            更新
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full flex flex-col'>
      {/* ヘッダー */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold text-slate-700'>KONPO_PALETテーブル</h2>
        <Button onClick={onRefresh} variant='outline' size='sm'>
          <ArrowPathIcon className='w-4 h-4 mr-2' />
          更新
        </Button>
      </div>

      {/* パレットテーブル */}
      <div className='flex-grow overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-slate-100 sticky top-0 z-10'>
            <tr>
              <TableHead>構成パレットID</TableHead>
              <TableHead>パレットマスターID</TableHead>
              <TableHead>部品ID</TableHead>
              <TableHead className='text-center'>部品数量</TableHead>
              <TableHead>作成日時</TableHead>
              <TableHead>更新日時</TableHead>
            </tr>
          </thead>
          <tbody>
            {data.map((palet) => (
              <tr key={palet.konpo_palet_id} className='bg-white border-b hover:bg-slate-50'>
                <td className='px-3 py-2 text-slate-900 font-mono text-sm'>{palet.konpo_palet_id}</td>
                <td className='px-3 py-2 text-slate-900 font-mono text-sm'>{palet.palet_master_id}</td>
                <td className='px-3 py-2 text-slate-900 font-medium'>{palet.buhin_id}</td>
                <td className='px-3 py-2 text-center'>
                  <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    {palet.palet_buhin_quantity}個
                  </span>
                </td>
                <td className='px-3 py-2 text-slate-600 text-sm'>{formatDate(palet.created_at)}</td>
                <td className='px-3 py-2 text-slate-600 text-sm'>{formatDate(palet.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 結果数表示 */}
      <div className='p-3 border-t bg-slate-50 flex-shrink-0 text-sm text-slate-600'>
        {data.length} 件
      </div>
    </div>
  )
} 