// ドラッグ＆ドロップ機能専用の定数
export const DRAG_TIME_SLOT_HEIGHT = 64 // 1時間の高さ（px）
export const DRAG_FIFTEEN_MIN_HEIGHT = DRAG_TIME_SLOT_HEIGHT / 4 // 15分の高さ（px）
export const DRAG_FIFTEEN_MIN_RATIO = 15 // 15分（分単位）
export const DRAG_MINUTE_SLOTS = [0, 30] // 30分刻みのスロット

// ドラッグ＆ドロップのタイプ定義
export const DRAG_EVENT_TYPE = 'EVENT'

// ドラッグ中の視覚効果設定
export const DRAG_OPACITY = 0.5
export const DRAG_SCALE = 1.05
export const DRAG_TRANSITION_DURATION = '0.2s'

// ドロップエリアの視覚効果設定
export const DROP_OVERLAY_OPACITY = 0.5
export const DROP_OVERLAY_COLOR = 'bg-green-200' 