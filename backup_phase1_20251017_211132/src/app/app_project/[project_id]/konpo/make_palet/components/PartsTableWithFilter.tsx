// ==========================================
// 変更記録
// 2025-06-30 部品表コンポーネントの再作成
// 2025-06-30 検索欄削除・カラム分離
// 2025-06-30 登録数量表示の改善・ドラッグ制限機能追加
// ==========================================

'use client'
import React, { useState } from 'react'
import { EyeIcon } from '@heroicons/react/24/outline'
import { TableHead } from '@src/components/ui/table'
import type { Part, PaletteItem } from '@src/app/app_project/[project_id]/konpo/make_palet/types/index'

// ==========================================
// 型定義層
// ==========================================
interface PartsTableWithFilterProps {
  parts: Part[]
  palette: PaletteItem[]
  draggingId: string | null
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onPreview: (img: string | null) => void
}

export function PartsTableWithFilter({
  parts,
  palette,
  draggingId,
  onDragStart,
  onDragEnd,
  onPreview,
}: PartsTableWithFilterProps) {
  // ==========================================
  // 状態管理層
  // ==========================================
  const [dragError, setDragError] = useState<string | null>(null)

  // ==========================================
  // ユーティリティ関数層
  // ==========================================
  // パレット内の部品数量を取得
  const getPaletteQuantity = (partId: string): number => {
    const paletteItem = palette.find(item => item.id === partId)
    return paletteItem ? paletteItem.selectedQty : 0
  }

  // 利用可能数量を計算（総数量 - 登録数量 - パレット内数量）
  const getAvailableQuantity = (part: Part): number => {
    const paletteQty = getPaletteQuantity(part.id)
    const totalRegistered = part.registeredQty + paletteQty
    return Math.max(0, part.qty - totalRegistered)
  }

  // 登録数量の表示色を決定
  const getRegisteredQuantityColor = (part: Part): string => {
    const paletteQty = getPaletteQuantity(part.id)
    const totalRegistered = part.registeredQty + paletteQty
    
    if (totalRegistered > part.qty) {
      return 'bg-red-100 text-red-800' // 超過時は赤
    } else if (paletteQty > 0) {
      return 'bg-orange-100 text-orange-800' // パレット内にある場合はオレンジ
    } else if (part.registeredQty > 0) {
      return 'bg-blue-100 text-blue-800' // 通常の登録済みは青
    } else {
      return 'bg-slate-100 text-slate-600' // 未登録はグレー
    }
  }

  // ==========================================
  // イベントハンドラ層
  // ==========================================
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, part: Part) => {
    const availableQty = getAvailableQuantity(part)
    
    if (availableQty <= 0) {
      e.preventDefault()
      setDragError(`${part.name}は利用可能数量がありません`)
      setTimeout(() => setDragError(null), 3000) // 3秒後に消去
      return
    }

    console.log('ドラッグ開始:', {
      id: part.id,
      partNumber: part.partNumber,
      zumenId: part.zumenId,
      name: part.name,
      availableQty
    }) // デバッグ用
    
    // 部品ID、部品番号、図面番号を含むJSONデータを作成
    const dragData = {
      id: part.id,
      partNumber: part.partNumber,
      zumenId: part.zumenId,
      name: part.name,
      desc: part.desc,
      qty: availableQty, // 利用可能数量を設定
      weight: part.weight,
      note: part.note,
      img: part.img
    }
    
    e.dataTransfer.setData('text/plain', part.id) // 後方互換性のため
    e.dataTransfer.setData('application/json', JSON.stringify(dragData))
    e.dataTransfer.effectAllowed = 'copy'
    onDragStart(part.id)
  }

  const handleDragEnd = () => {
    console.log('ドラッグ終了') // デバッグ用
    onDragEnd()
  }

  // ==========================================
  // レンダリング層
  // ==========================================
  return (
    <div className='h-full flex flex-col'>
      {/* エラーメッセージ */}
      {dragError && (
        <div className='p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm mb-2'>
          {dragError}
        </div>
      )}

      {/* テーブル */}
      <div className='flex-grow overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-slate-100 sticky top-0 z-10'>
            <tr>
              <TableHead>図面番号</TableHead>
              <TableHead>部品番号</TableHead>
              <TableHead>部品名</TableHead>
              <TableHead className='text-center'>数量</TableHead>
              <TableHead className='text-center'>登録数量</TableHead>
              <TableHead className='text-center'>登録済み</TableHead>
              <TableHead className='text-right'>重量(kg)</TableHead>
              <TableHead className='text-center'>操作</TableHead>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => {
              const paletteQty = getPaletteQuantity(part.id)
              const totalRegistered = part.registeredQty + paletteQty
              const availableQty = getAvailableQuantity(part)
              const canDrag = availableQty > 0

              return (
                <tr
                  key={part.id}
                  draggable={canDrag}
                  onDragStart={(e) => handleDragStart(e, part)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white border-b hover:bg-slate-50 ${
                    canDrag ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-60'
                  } ${
                    draggingId === part.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''
                  }`}
                >
                  <td className='px-3 py-2 text-slate-600'>{part.zumenId}</td>
                  <td className='px-3 py-2 text-slate-900 font-medium'>{part.partNumber}</td>
                  <td className='px-3 py-2 text-slate-900'>{part.name}</td>
                  <td className='px-3 py-2 text-center text-slate-900'>{part.qty}</td>
                  <td className='px-3 py-2 text-center'>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRegisteredQuantityColor(part)}`}>
                      {totalRegistered}
                    </span>
                  </td>
                  <td className='px-3 py-2 text-center'>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      totalRegistered > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {totalRegistered > 0 ? '済' : '未'}
                    </span>
                  </td>
                  <td className='px-3 py-2 text-right text-slate-900'>{part.weight.toFixed(2)}</td>
                  <td className='px-3 py-2 text-center'>
                    <button
                      onClick={() => onPreview(part.img)}
                      className='p-1 text-slate-400 hover:text-slate-600 transition-colors'
                      title='プレビュー'
                    >
                      <EyeIcon className='w-4 h-4' />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 結果数表示 */}
      <div className='p-3 border-t bg-slate-50 flex-shrink-0 text-sm text-slate-600'>
        {parts.length} 件
      </div>
    </div>
  )
} 