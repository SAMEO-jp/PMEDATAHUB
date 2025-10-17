// ==========================================
// 変更記録
// 2025-06-30 部品関連型定義の再作成
// ==========================================

import { ReactNode } from 'react'

// ==========================================
// 部品型定義
// ==========================================
export interface Part {
  id: string
  icon: ReactNode
  name: string
  desc: string
  qty: number
  note: string
  weight: number
  img: string
  zumenId: string
  registeredQty: number
  partNumber: string
}

// ==========================================
// パレットアイテム型定義
// ==========================================
export interface PaletteItem {
  id: string
  icon: ReactNode
  name: string
  desc: string
  selectedQty: number
  note: string
  weight: number
  img: string
  zumenId: string
  partNumber: string
} 