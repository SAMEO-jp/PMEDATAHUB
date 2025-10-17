// ==========================================
// ファイル名: PaletteList.tsx
// 機能: パレットリスト表示コンポーネント
// 技術: React, TypeScript
// 作成日: 2025-06-30
// ==========================================

'use client';

import { ChevronDownIcon, ChevronRightIcon, ArrowPathIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Button } from '@src/components/ui/button'
import { TableHead } from '@src/components/ui/table'
import { useRouter, useParams } from 'next/navigation'

import React, { useState, useMemo } from 'react'

import type { PaletListItem, AggregatedPalet } from '../types/index'

// ==========================================
// 型定義層
// ==========================================
interface PaletteListProps {
  data: PaletListItem[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onDelete?: (paletId: string) => Promise<boolean>
  onEdit?: (paletId: string) => void
}

// 新しいテーブル構造に対応した集約パレット型


// ==========================================
// ユーティリティ関数層
// ==========================================
const aggregatePaletData = (data: PaletListItem[]): AggregatedPalet[] => {
  // 新しいテーブル構造では、データは既にパレットマスター単位でグループ化されている
  return data.map(item => ({
    paletId: item.konpo_palet_master_id,
    paletName: item.palet_display_name,
    totalQuantity: item.palet_quantity,
    itemCount: 1, // 新しい構造では1つのパレットマスターにつき1つのアイテム
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  })).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// ==========================================
// コンポーネント層
// ==========================================
export function PaletteList({ data, loading, error, onRefresh, onDelete, onEdit }: PaletteListProps) {
  // ==========================================
  // 状態管理層
  // ==========================================
  const [expandedPalets, setExpandedPalets] = useState<Set<string>>(new Set())
  const router = useRouter()
  const params = useParams()
  const projectId = params.project_id as string

  // ==========================================
  // データ処理層
  // ==========================================
  const aggregatedData = useMemo(() => aggregatePaletData(data), [data])

  // ==========================================
  // イベントハンドラ層
  // ==========================================
  const toggleExpanded = (paletId: string) => {
    const newExpanded = new Set(expandedPalets)
    if (newExpanded.has(paletId)) {
      newExpanded.delete(paletId)
    } else {
      newExpanded.add(paletId)
    }
    setExpandedPalets(newExpanded)
  }

  const handlePaletClick = (paletId: string) => {
    router.push(`/app_project/${projectId}/mbom/${paletId}`)
  }

  // ==========================================
  // ユーティリティ関数層
  // ==========================================
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

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

  if (aggregatedData.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <p className='text-slate-600 mb-4'>登録されたパレットがありません</p>
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
        <h2 className='text-lg font-semibold text-slate-700'>登録済みパレット一覧</h2>
        <Button onClick={onRefresh} variant='outline' size='sm'>
          <ArrowPathIcon className='w-4 h-4 mr-2' />
          更新
        </Button>
      </div>

      {/* パレットリストテーブル */}
      <div className='flex-grow overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-slate-100 sticky top-0 z-10'>
            <tr>
              <TableHead className='w-12'></TableHead>
              <TableHead>パレット名</TableHead>
              <TableHead>パレットID</TableHead>
              <TableHead className='text-center'>パレット個数</TableHead>
              <TableHead>作成日時</TableHead>
              <TableHead>更新日時</TableHead>
              <TableHead className='w-12'></TableHead>
            </tr>
          </thead>
          <tbody>
            {aggregatedData.map((palet) => (
              <React.Fragment key={palet.paletId}>
                {/* メイン行 */}
                <tr 
                  className='bg-white border-b hover:bg-slate-50 cursor-pointer transition-colors'
                  onClick={() => toggleExpanded(palet.paletId)}
                >
                  <td className='px-3 py-2 text-center'>
                    {expandedPalets.has(palet.paletId) ? (
                      <ChevronDownIcon className='w-4 h-4 text-slate-500' />
                    ) : (
                      <ChevronRightIcon className='w-4 h-4 text-slate-500' />
                    )}
                  </td>
                  <td 
                    className='px-3 py-2 text-slate-900 font-medium hover:text-blue-600 cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaletClick(palet.paletId);
                    }}
                  >
                    {palet.paletName}
                  </td>
                  <td className='px-3 py-2 text-slate-900 font-mono text-sm'>{palet.paletId}</td>
                  <td className='px-3 py-2 text-center'>
                    <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                      {palet.totalQuantity}個
                    </span>
                  </td>
                  <td className='px-3 py-2 text-slate-600 text-sm'>{formatDate(palet.createdAt)}</td>
                  <td className='px-3 py-2 text-slate-600 text-sm'>{formatDate(palet.updatedAt)}</td>
                  <td className='px-3 py-2 text-center'>
                    <div className='flex gap-1 justify-center'>
                      <Button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onEdit?.(palet.paletId); 
                        }}
                        variant='ghost' 
                        size='sm'
                        className='h-8 w-8 p-0'
                      >
                        <PencilIcon className='w-4 h-4 text-blue-600' />
                      </Button>
                      <Button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          void onDelete?.(palet.paletId);  
                        }}
                        variant='ghost' 
                        size='sm'
                        className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                      >
                        <TrashIcon className='w-4 h-4' />
                      </Button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* 結果数表示 */}
      <div className='p-3 border-t bg-slate-50 flex-shrink-0 text-sm text-slate-600'>
        {aggregatedData.length} 件
      </div>
    </div>
  )
} 