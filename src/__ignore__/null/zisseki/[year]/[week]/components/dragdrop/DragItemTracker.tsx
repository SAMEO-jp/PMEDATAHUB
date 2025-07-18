// ========================================
// 完全修正版DragItemTracker.tsx
// ========================================

"use client"
import React, { useState, useEffect, createContext, useContext } from 'react'
import { DisplayEvent } from '../../types/event'
import { getCurrentUser } from '../../lib/user_data'

// ========================================
// 事前取得データ用のグローバル変数
// ========================================
let preloadedEventData: DisplayEvent | null = null

export const setPreloadedEventData = (data: DisplayEvent | null) => {
  preloadedEventData = data
  console.log('📦 事前取得データ保存:', { eventId: data?.key_id, height: data?.height })
}

export const getPreloadedEventData = (): DisplayEvent | null => {
  console.log('📤 事前取得データ取得:', { eventId: preloadedEventData?.key_id, height: preloadedEventData?.height })
  return preloadedEventData
}

// ========================================
// Context APIを使った状態管理
// ========================================

interface DragContextType {
  draggedItemId: string | null
  draggedItemHeight: number
  isProcessingDrag: boolean
  setDraggedItemHeight: (height: number) => void
  setDraggedItemId: (id: string | null) => void
  setIsProcessingDrag: (processing: boolean) => void
}

const DragContext = createContext<DragContextType | null>(null)

// ========================================
// Provider コンポーネント
// ========================================
export function DragProvider({ children }: { children: React.ReactNode }) {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [draggedItemHeight, setDraggedItemHeight] = useState<number>(0)
  const [isProcessingDrag, setIsProcessingDrag] = useState(false)

  // デバッグ用：値の変更を追跡
  useEffect(() => {
    if (draggedItemHeight > 0) {
      console.log('🔍 DragContext高さ更新:', {
        draggedItemId,
        draggedItemHeight,
        timestamp: new Date().toISOString()
      })
    }
  }, [draggedItemHeight, draggedItemId])

  const value = {
    draggedItemId,
    draggedItemHeight,
    isProcessingDrag,
    setDraggedItemHeight,
    setDraggedItemId,
    setIsProcessingDrag,
  }

  return (
    <DragContext.Provider value={value}>
      {children}
    </DragContext.Provider>
  )
}

// ========================================
// Custom Hook
// ========================================
export function useDragContext() {
  const context = useContext(DragContext)
  if (!context) {
    throw new Error('useDragContext must be used within DragProvider')
  }
  return context
}

// ========================================
// 後方互換性のための関数（一時的な移行用）
// ========================================

// 既存のコードでgetDraggedItemHeightを使っている場合の互換性維持
export const getDraggedItemHeight = (): number => {
  console.warn('⚠️ getDraggedItemHeight is deprecated. Use useDragContext() instead.')
  // グローバル変数の代替（一時的）
  return globalDraggedItemHeight
}

export const setDraggedItemHeight = (height: number): void => {
  console.warn('⚠️ setDraggedItemHeight is deprecated. Use useDragContext() instead.')
  globalDraggedItemHeight = height
}

// 一時的なグローバル変数（段階的移行のため）
let globalDraggedItemHeight: number = 0

// ========================================
// DragItemTrackerコンポーネント
// ========================================

interface DragItemTrackerProps {
  onDragStart?: (itemId: string) => void
  year: number
  week: number
}

export default function DragItemTracker({ onDragStart, year, week }: DragItemTrackerProps) {
  const [currentUserId, setCurrentUserId] = useState<string>("999999")

  // Contextが利用可能な場合は使用、そうでなければローカル状態
  let dragContext: DragContextType | null = null
  try {
    dragContext = useContext(DragContext)
  } catch {
    // Context外で使用されている場合
  }

  const [localDraggedItemId, setLocalDraggedItemId] = useState<string | null>(null)
  const [localIsProcessingDrag, setLocalIsProcessingDrag] = useState(false)

  // Context または ローカル状態を使用
  const draggedItemId = dragContext?.draggedItemId ?? localDraggedItemId
  const setDraggedItemId = dragContext?.setDraggedItemId ?? setLocalDraggedItemId
  const isProcessingDrag = dragContext?.isProcessingDrag ?? localIsProcessingDrag
  const setIsProcessingDrag = dragContext?.setIsProcessingDrag ?? setLocalIsProcessingDrag

  // 現在のユーザーIDを取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getCurrentUser()
        setCurrentUserId(userData.user_id || "999999")
      } catch {
        setCurrentUserId("999999")
      }
    }
    
    fetchCurrentUser()
  }, [])

  // ドラッグ開始前の処理
  const handlePreDragStart = async (itemId: string) => {
    if (isProcessingDrag) {
      console.log('🚨 重複処理をブロック:', itemId)
      return false
    }

    console.log('🚀 ドラッグ開始処理:', itemId)
    
    setIsProcessingDrag(true)
    setDraggedItemId(itemId)
    
    // ========================================
    // 🆕 ローカルストレージから最新データを事前取得
    // ========================================
    try {
      // ✅ page.tsxから渡された正確な年・週を使用
      const storageKey = `week_data_${year}_${week}_999999`
      
      console.log('🔍 事前データ取得開始:', { 
        itemId, 
        storageKey,
        '使用した年': year,
        '使用した週': week
      })
      
      const storedData = localStorage.getItem(storageKey)
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        const latestEvent = parsedData.find((item: DisplayEvent) => item.key_id === itemId)
        
        if (latestEvent) {
          setPreloadedEventData(latestEvent)
          
          // 高さも設定
          if (dragContext) {
            dragContext.setDraggedItemHeight(latestEvent.height)
          } else {
            globalDraggedItemHeight = latestEvent.height
          }
          
          console.log('✅ 事前データ取得成功:', {
            itemId,
            height: latestEvent.height,
            startDateTime: latestEvent.startDateTime,
            endDateTime: latestEvent.endDateTime
          })
        } else {
          console.log('🚨 アイテムが見つからない:', itemId)
          setPreloadedEventData(null)
        }
      } else {
        console.log('🚨 ローカルストレージにデータなし:', storageKey)
        setPreloadedEventData(null)
      }
    } catch (error) {
      console.error('🚨 事前データ取得エラー:', error)
      setPreloadedEventData(null)
    }
    
    if (onDragStart) {
      onDragStart(itemId)
    }
    
    // 即座に処理完了（setTimeout削除）
    setIsProcessingDrag(false)
    
    return true
  }

  // ドラッグ終了時のハンドラー
  const handleDragEnd = () => {
    console.log('🏁 ドラッグ終了')
    
    // 🆕 事前取得データをクリア
    setPreloadedEventData(null)
    
    setDraggedItemId(null)
    setIsProcessingDrag(false)
    
    // Context使用時は高さもリセット
    if (dragContext) {
      dragContext.setDraggedItemHeight(0)
    } else {
      // 後方互換性
      globalDraggedItemHeight = 0
    }
  }

  // グローバルイベントリスナー
  useEffect(() => {
    const handleGlobalDragStart = async (event: DragEvent) => {
      const target = event.target as HTMLElement
      const itemId = target.getAttribute('data-item-id')
      
      if (itemId) {
        const shouldProceed = await handlePreDragStart(itemId)
        
        if (!shouldProceed) {
          event.preventDefault()
          event.stopPropagation()
          return false
        }
      }
    }

    const handleGlobalDragEnd = () => {
      handleDragEnd()
    }

    const handleMouseDown = async (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const itemId = target.getAttribute('data-item-id')
      
      if (itemId) {
        await handlePreDragStart(itemId)
      }
    }

    document.addEventListener('dragstart', handleGlobalDragStart)
    document.addEventListener('dragend', handleGlobalDragEnd)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('dragstart', handleGlobalDragStart)
      document.removeEventListener('dragend', handleGlobalDragEnd)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [draggedItemId, currentUserId, isProcessingDrag])

  return null
}

// ========================================
// createDragTracker（後方互換性維持）
// ========================================
export const createDragTracker = () => {
  let localDraggedItemId: string | null = null
  let localStorageData: DisplayEvent | null = null
  let localIsProcessingDrag = false

  const trackPreDragStart = async (itemId: string, year: number, week: number) => {
    if (localIsProcessingDrag) {
      console.log('🚨 createDragTracker: 重複処理をブロック:', itemId)
      return false
    }

    console.log('🚀 createDragTracker: ドラッグ開始処理:', itemId)
    localIsProcessingDrag = true
    localDraggedItemId = itemId
    
    try {
      const weekDataKey = `week_data_${year}_${week}_999999`
      const weekData = localStorage.getItem(weekDataKey)
      
      if (weekData) {
        const parsedData = JSON.parse(weekData) as DisplayEvent[]
        const targetItem = parsedData.find((item: DisplayEvent) => item.key_id === itemId)
        
        if (targetItem) {
          localStorageData = targetItem
          
          // 後方互換性のためグローバル変数にも設定
          globalDraggedItemHeight = targetItem.height
          
          console.log('📏 アイテム高さ:', targetItem.height)
          
          // 即座に処理完了
          localIsProcessingDrag = false
          
          return true
        }
      }
    } catch (error) {
      console.error('❌ ローカルストレージエラー:', error)
    }
    
    localIsProcessingDrag = false
    localDraggedItemId = null
    return false
  }

  const trackDragEnd = () => {
    console.log('🏁 createDragTracker: ドラッグ終了')
    localDraggedItemId = null
    localStorageData = null
    localIsProcessingDrag = false
    globalDraggedItemHeight = 0
  }

  const getCurrentDraggedItem = () => ({
    draggedItemId: localDraggedItemId,
    localStorageData,
    isProcessingDrag: localIsProcessingDrag
  })

  return {
    trackPreDragStart,
    trackDragEnd,
    getCurrentDraggedItem
  }
}