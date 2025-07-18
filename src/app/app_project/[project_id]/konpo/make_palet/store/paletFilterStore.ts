// ==========================================
// ファイル名: paletFilterStore.ts
// 機能: パレットフィルタ状態管理（Zustand）
// 技術: Zustand
// 作成日: 2025-06-30
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterType } from '../types/index';

// ==========================================
// 型定義層
// ==========================================
interface PaletFilterState {
  filterType: FilterType;
  lastUpdated: number;
  filterHistory: FilterType[];
}

interface PaletFilterActions {
  setFilterType: (type: FilterType) => void;
  resetFilter: () => void;
  getFilterStats: () => { [key in FilterType]: number };
}

// ==========================================
// Zustandストア定義
// ==========================================
export const usePaletFilterStore = create<PaletFilterState & PaletFilterActions>()(
  persist(
    (set, get) => ({
      // 初期状態
      filterType: 'all',
      lastUpdated: Date.now(),
      filterHistory: ['all'],

      // アクション
      setFilterType: (type: FilterType) => {
        const currentState = get();
        const newHistory = [...currentState.filterHistory, type].slice(-5); // 最新5件を保持
        
        console.log(`フィルタ変更: ${currentState.filterType} → ${type}`); // デバッグ用
        
        set({ 
          filterType: type,
          lastUpdated: Date.now(),
          filterHistory: newHistory
        });
      },

      resetFilter: () => {
        console.log('フィルタリセット'); // デバッグ用
        set({ 
          filterType: 'all',
          lastUpdated: Date.now(),
          filterHistory: ['all']
        });
      },

      getFilterStats: () => {
        // この関数は外部からpartsデータを受け取る必要があるため、
        // 実際の使用時には別途実装
        return {
          all: 0,
          registered: 0,
          unregistered: 0,
          overregistered: 0
        };
      },
    }),
    {
      name: 'palet-filter-storage',
      partialize: (state) => ({ 
        filterType: state.filterType,
        lastUpdated: state.lastUpdated,
        filterHistory: state.filterHistory
      }),
    }
  )
);

// ==========================================
// カスタムフック（利便性向上）
// ==========================================
export const usePaletFilter = () => {
  const store = usePaletFilterStore();
  
  return {
    // 状態
    filterType: store.filterType,
    lastUpdated: store.lastUpdated,
    filterHistory: store.filterHistory,
    
    // アクション
    setFilterType: store.setFilterType,
    resetFilter: store.resetFilter,
    getFilterStats: store.getFilterStats,
    
    // 便利なメソッド
    isFilterActive: () => store.filterType !== 'all',
    getFilterLabel: () => {
      const labels = {
        all: '全部品',
        registered: '登録済み',
        unregistered: '未登録',
        overregistered: '過剰登録'
      };
      return labels[store.filterType];
    }
  };
}; 