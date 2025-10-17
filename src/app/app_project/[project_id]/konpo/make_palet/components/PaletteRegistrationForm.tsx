'use client'

import { useState, useEffect } from 'react'
import { Button } from '@src/components/ui/button'
import { Input } from '@src/components/ui/input'
import { Label } from '@src/components/ui/label'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface PaletteRegistrationFormProps {
  isOpen: boolean
  onClose: () => void
  onRegister: (displayName: string, quantity: number) => void
  defaultQuantity: number
  loading: boolean
}

export function PaletteRegistrationForm({
  isOpen,
  onClose,
  onRegister,
  defaultQuantity,
  loading
}: PaletteRegistrationFormProps) {
  const [displayName, setDisplayName] = useState('')
  const [quantity, setQuantity] = useState(defaultQuantity)
  const [quantityInputValue, setQuantityInputValue] = useState(defaultQuantity.toString())

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuantityInputValue(value)
    
    if (value === '') {
      return
    }
    
    const newQuantity = parseInt(value) || 0
    setQuantity(Math.max(0, newQuantity))
  }

  const handleQuantityBlur = () => {
    if (quantityInputValue === '') {
      setQuantityInputValue('0')
      setQuantity(0)
    }
  }

  useEffect(() => {
    setQuantityInputValue(defaultQuantity.toString())
    setQuantity(defaultQuantity)
  }, [defaultQuantity])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (displayName.trim() && quantity >= 0) {
      onRegister(displayName.trim(), quantity)
      setDisplayName('')
      setQuantity(defaultQuantity)
    }
  }

  const handleCancel = () => {
    setDisplayName('')
    setQuantity(defaultQuantity)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-700">パレット登録</h3>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="displayName" className="text-sm font-medium text-slate-700">
              表示パレット名 *
            </Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="例: 組立パレットA"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">
              パレット数量 *
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantityInputValue}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              required
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !displayName.trim() || quantity < 0}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  登録中...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  登録
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 