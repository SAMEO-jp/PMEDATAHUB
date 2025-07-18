// リサイズ機能専用の定数
export const RESIZE_TIME_SLOT_HEIGHT = 64 // 1時間の高さ（px）
export const RESIZE_FIFTEEN_MIN_HEIGHT = RESIZE_TIME_SLOT_HEIGHT / 4 // 15分の高さ（px）
export const RESIZE_FIFTEEN_MIN_RATIO = 15 // 15分（分単位）
export const RESIZE_MINUTE_SLOTS = [0, 30] // 30分刻みのスロット

// リサイズハンドルの設定
export const RESIZE_HANDLE_HEIGHT = 8 // リサイズハンドルの高さ（px）

// リサイズ時のスナップ設定
export const RESIZE_SNAP_MINUTES = 10 // 10分刻みにスナップ 