// 高さ関連の型定義
export interface HeightTypes {
  // イベントの基本型で使用する一般的な高さ
  height: number
  
  // 新規作成時に設定される元の高さ
  originalHeight: number
  
  // リサイズ時に計算される新しい高さ
  calculatedHeight: number
  
  // ドラッグ操作時に使用する高さ
  draggableHeight: number
}

// 高さの用途を明確にするための型
export type EventHeight = number
export type OriginalHeight = number
export type CalculatedHeight = number
export type DraggableHeight = number

// 高さの用途を表す定数
export const HEIGHT_USAGE = {
  EVENT: 'event' as const,
  ORIGINAL: 'original' as const,
  CALCULATED: 'calculated' as const,
  DRAGGABLE: 'draggable' as const,
} as const

export type HeightUsage = typeof HEIGHT_USAGE[keyof typeof HEIGHT_USAGE] 