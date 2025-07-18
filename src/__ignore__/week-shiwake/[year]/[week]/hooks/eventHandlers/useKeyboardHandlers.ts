// ==========================================
// ファイル名: useKeyboardHandlers.ts
// 機能: キーボード操作イベントハンドラー（キーダウン、キーアップ）
// 技術: React Hooks, TypeScript
// ==========================================

import { useEffect } from 'react'

interface UseKeyboardHandlersProps {
  setIsCtrlPressed: (pressed: boolean) => void
}

export const useKeyboardHandlers = ({
  setIsCtrlPressed
}: UseKeyboardHandlersProps) => {
  // ==========================================
  // Ctrlキーの監視
  // ==========================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [setIsCtrlPressed])

  return {}
} 