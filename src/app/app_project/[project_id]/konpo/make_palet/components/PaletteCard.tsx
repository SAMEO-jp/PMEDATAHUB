// ================================
// 層／用途: パレット内カード部品
// 役割/目的: パレット内の部品カード表示・数量変更・削除
// 補足メモ: page.tsxから分割、型・UI・イベントをpropsで受け取る
// ================================

import React, { useState, useEffect } from 'react'
import { Card } from '@src/components/ui/card'
import { Input } from '@src/components/ui/input'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { PaletteItem } from '@src/app/app_project/[project_id]/konpo/make_palet/types/index'

type Props = {
  item: PaletteItem
  onRemove: (id: string) => void
  onQtyChange: (id: string, delta: number) => void
  onQtyInputChange: (id: string, newQty: number) => void
}

export const PaletteCard: React.FC<Props> = ({ item, onRemove, onQtyChange, onQtyInputChange }) => {
  const [inputValue, setInputValue] = useState(item.selectedQty.toString())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    // 空文字列の場合は0として扱わず、入力値をそのまま保持
    if (value === '') {
      return
    }
    
    const newQty = parseInt(value) || 0
    onQtyInputChange(item.id, Math.max(0, newQty))
  }

  const handleInputBlur = () => {
    // フォーカスが外れた時に空文字列の場合は0を設定
    if (inputValue === '') {
      setInputValue('1')
      onQtyInputChange(item.id, 0)
    }
  }

  // item.selectedQtyが変更された時にinputValueを更新
  useEffect(() => {
    setInputValue(item.selectedQty.toString())
  }, [item.selectedQty])

  return (
    <Card className='w-full p-3 relative border border-slate-200'>
      <button
        className='absolute -top-2 -right-2 bg-white rounded-full z-10'
        onClick={() => onRemove(item.id)}
      >
        <XMarkIcon className='w-5 h-5 text-red-500 hover:text-red-700' />
      </button>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          {item.icon}
          <h3 className='font-bold text-slate-800 ml-2'>{item.name}</h3>
        </div>
        <div className='flex items-center border border-slate-300 rounded-md'>
          <button className='w-7 h-7 text-lg font-bold text-slate-600 hover:bg-slate-200 rounded-l-md' onClick={() => onQtyChange(item.id, -1)}>-</button>
          <Input 
            type='number' 
            value={inputValue} 
            min={0} 
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className='w-16 h-7 text-center font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none' 
          />
          <button className='w-7 h-7 text-lg font-bold text-slate-600 hover:bg-slate-200 rounded-r-md' onClick={() => onQtyChange(item.id, 1)}>+</button>
        </div>
      </div>
      <p className='text-xs text-slate-500 mb-2'>{item.desc}</p>
      <div className='grid grid-cols-2 gap-4 text-xs'>
        <div className='flex justify-between'>
          <span className='text-slate-500'>図面番号:</span>
          <span className='font-medium text-slate-700'>{item.zumenId}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-slate-500'>部品番号:</span>
          <span className='font-medium text-slate-700'>{item.partNumber}</span>
        </div>
      </div>
    </Card>
  )
}
// ================================ 