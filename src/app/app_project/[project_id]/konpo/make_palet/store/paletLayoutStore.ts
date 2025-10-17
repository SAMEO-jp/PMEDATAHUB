// ==========================================
// ファイル名: paletLayoutStore.ts
// 機能: パレットレイアウト状態管理（Zustand）
// 技術: Zustand
// 作成日: 2025-06-30
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LayoutType } from '../types/index';

interface PaletLayoutState {
  layoutType: LayoutType;
  lastUpdated: number;
}

interface PaletLayoutActions {
  setLayoutType: (type: LayoutType) => void;
  resetLayout: () => void;
}

// ==========================================
// Zustandストア定義
// ==========================================
export const usePaletLayoutStore = create<PaletLayoutState & PaletLayoutActions>()(
  persist(
    (set) => ({
      // 初期状態
      layoutType: 'normal',
      lastUpdated: Date.now(),

      // アクション
      setLayoutType: (type: LayoutType) => set({ 
        layoutType: type,
        lastUpdated: Date.now()
      }),

      resetLayout: () => set({ 
        layoutType: 'normal',
        lastUpdated: Date.now()
      }),
    }),
    {
      name: 'palet-layout-storage',
      partialize: (state) => ({ 
        layoutType: state.layoutType,
        lastUpdated: state.lastUpdated
      }),
    }
  )
);

// ==========================================
// カスタムフック（利便性向上）
// ==========================================
export const usePaletLayout = () => {
  const store = usePaletLayoutStore();
  
  return {
    // 状態
    layoutType: store.layoutType,
    lastUpdated: store.lastUpdated,
    
    // アクション
    setLayoutType: store.setLayoutType,
    resetLayout: store.resetLayout,
  };
}; 