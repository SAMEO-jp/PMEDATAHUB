'use client'

import { ArrowPathIcon, TrashIcon, PencilIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@src/components/ui/button'
import { TableHead } from '@src/components/ui/table'

import React, { useState } from 'react'
import type { PaletMaster, KonpoPalet } from '@src/types/palet'

// ==========================================
// 型定義層
// ==========================================
interface PaletMasterListProps {
  masterData: PaletMaster[]
  konpoData: KonpoPalet[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onDelete?: (masterId: string) => Promise<boolean>
  onEdit?: (masterId: string) => void
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
export function PaletMasterList({ masterData, konpoData, loading, error, onRefresh, onDelete, onEdit }: PaletMasterListProps) {
  // ==========================================
  // 状態管理層
  // ==========================================
  const [expandedMasters, setExpandedMasters] = useState<Set<string>>(new Set())

  // ==========================================
  // イベントハンドラ層
  // ==========================================
  const toggleExpanded = (masterId: string) => {
    const newExpanded = new Set(expandedMasters)
    if (newExpanded.has(masterId)) {
      newExpanded.delete(masterId)
    } else {
      newExpanded.add(masterId)
    }
    setExpandedMasters(newExpanded)
  }

  // ==========================================
  // レンダリング層
  // ==========================================
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2'></div>
          <p className='text-slate-600 text-sm'>パレットマスターデータを読み込み中...</p>
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

  if (masterData.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <p className='text-slate-600 text-sm'>登録されたパレットマスターがありません</p>
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
        <h2 className='text-lg font-semibold text-slate-700'>パレットマスター一覧</h2>
        <Button onClick={onRefresh} variant='outline' size='sm'>
          <ArrowPathIcon className='w-4 h-4 mr-2' />
          更新
        </Button>
      </div>

      {/* パレットマスターリストテーブル */}
      <div className='flex-grow overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-slate-100 sticky top-0 z-10'>
            <tr>
              <TableHead className='w-12'></TableHead>
              <TableHead>マスターID</TableHead>
              <TableHead>パレット名</TableHead>
              <TableHead className='text-center'>構成部品数</TableHead>
              <TableHead>作成日時</TableHead>
              <TableHead>更新日時</TableHead>
              <TableHead className='w-24'></TableHead>
            </tr>
          </thead>
          <tbody>
            {masterData.map((master) => {
              // このマスターに属する構成パレットを取得
              const relatedKonpo = konpoData.filter(konpo => konpo.palet_master_id === master.palet_master_id);
              
              return (
                <React.Fragment key={master.palet_master_id}>
                  {/* メイン行 */}
                  <tr 
                    className='bg-white border-b hover:bg-slate-50 cursor-pointer transition-colors'
                    onClick={() => toggleExpanded(master.palet_master_id.toString())}
                  >
                    <td className='px-3 py-2 text-center'>
                      {expandedMasters.has(master.palet_master_id.toString()) ? (
                        <ChevronDownIcon className='w-4 h-4 text-slate-500' />
                      ) : (
                        <ChevronRightIcon className='w-4 h-4 text-slate-500' />
                      )}
                    </td>
                    <td className='px-3 py-2 text-slate-900 font-mono text-sm'>{master.palet_master_id}</td>
                    <td className='px-3 py-2 text-slate-900 font-medium'>{master.palet_master_display_name}</td>
                    <td className='px-3 py-2 text-center'>
                      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                        {relatedKonpo.length}種類
                      </span>
                    </td>
                    <td className='px-3 py-2 text-slate-600 text-sm'>{formatDate(master.created_at)}</td>
                    <td className='px-3 py-2 text-slate-600 text-sm'>{formatDate(master.updated_at)}</td>
                    <td className='px-3 py-2 text-center'>
                      <div className='flex gap-1 justify-center'>
                        <Button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onEdit?.(master.palet_master_id.toString()); 
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
                            void onDelete?.(master.palet_master_id.toString()); 
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
                  
                  {/* 展開行（構成パレット詳細） */}
                  {expandedMasters.has(master.palet_master_id.toString()) && (
                    <tr>
                      <td colSpan={7} className='bg-slate-50 p-4'>
                        <div className='space-y-3'>
                          <h4 className='font-medium text-slate-700'>構成パレット一覧</h4>
                          {relatedKonpo.length === 0 ? (
                            <p className='text-slate-500 text-sm'>構成パレットが登録されていません</p>
                          ) : (
                            <div className='overflow-x-auto'>
                              <table className='w-full text-sm'>
                                <thead className='bg-white'>
                                  <tr>
                                    <TableHead>部品ID</TableHead>
                                    <TableHead className='text-center'>数量</TableHead>
                                    <TableHead>作成日時</TableHead>
                                    <TableHead>更新日時</TableHead>
                                  </tr>
                                </thead>
                                <tbody>
                                  {relatedKonpo.map((konpo) => (
                                    <tr key={konpo.konpo_palet_id} className='bg-white border-b'>
                                      <td className='px-3 py-2 text-slate-900 font-mono text-sm'>{konpo.buhin_id}</td>
                                      <td className='px-3 py-2 text-center text-slate-900 font-medium'>{konpo.palet_buhin_quantity}</td>
                                      <td className='px-3 py-2 text-slate-600 text-sm'>{formatDate(konpo.created_at)}</td>
                                      <td className='px-3 py-2 text-slate-600 text-sm'>{formatDate(konpo.updated_at)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 結果数表示 */}
      <div className='p-3 border-t bg-slate-50 flex-shrink-0 text-sm text-slate-600'>
        {masterData.length} 件
      </div>
    </div>
  )
} 