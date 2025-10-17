// ================================
// 層／用途: パレット情報表示部品
// 役割/目的: パレットの状況・部品数・重量・日付を表示
// 補足メモ: page.tsxから分割、propsで値を受け取る
// ================================

import React, { useState, useEffect } from 'react'
import { Input } from '@src/components/ui/input'
import { Label } from '@src/components/ui/label'

type Props = {
  status: string
  partCount: number
  totalWeight: number
  createdAt: string
  updatedAt: string
  displayName: string
  paletteQuantity: number
  onDisplayNameChange: (name: string) => void
  onPaletteQuantityChange: (quantity: number) => void
}

export const PaletteInfo: React.FC<Props> = ({ 
  status, 
  partCount, 
  totalWeight, 
  createdAt, 
  updatedAt,
  displayName,
  paletteQuantity,
  onDisplayNameChange,
  onPaletteQuantityChange
}) => {
  const [quantityInputValue, setQuantityInputValue] = useState(paletteQuantity.toString())

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuantityInputValue(value)
    
    if (value === '') {
      return
    }
    
    const newQuantity = parseInt(value) || 0
    onPaletteQuantityChange(Math.max(0, newQuantity))
  }

  const handleQuantityBlur = () => {
    if (quantityInputValue === '') {
      setQuantityInputValue('0')
      onPaletteQuantityChange(0)
    }
  }

  useEffect(() => {
    setQuantityInputValue(paletteQuantity.toString())
  }, [paletteQuantity])

  return (
  <div className='space-y-3 mb-3'>
    {/* 入力フィールド */}
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div>
        <Label htmlFor="displayName" className="text-sm font-medium text-slate-700">
          表示パレット名
        </Label>
        <Input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          placeholder="例: 組立パレットA"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="paletteQuantity" className="text-sm font-medium text-slate-700">
          パレット個数
        </Label>
        <Input
          id="paletteQuantity"
          type="number"
          min="0"
          value={quantityInputValue}
          onChange={handleQuantityChange}
          onBlur={handleQuantityBlur}
          className="mt-1"
        />
      </div>
    </div>
    
    {/* 情報表示 */}
    <div className='grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm text-slate-600 border-t border-b border-slate-200 py-2'>
      <div><strong>状況:</strong> <span className={partCount ? 'text-blue-600 font-medium' : 'text-green-600 font-medium'}>{status}</span></div>
      <div><strong>総部品数:</strong> <span className='font-medium'>{partCount}</span></div>
      <div><strong>総重量:</strong> <span className='font-medium'>{totalWeight.toFixed(2)} kg</span></div>
      <div><strong>登録日:</strong> <span className='font-medium'>{createdAt}</span></div>
      <div><strong>更新日:</strong> <span className='font-medium'>{updatedAt}</span></div>
    </div>
  </div>
  )
}
// ================================ 