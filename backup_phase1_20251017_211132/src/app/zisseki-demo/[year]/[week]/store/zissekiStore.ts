import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { WorkTimeData, Employee, User, Project } from '../types';

// localStorage操作用のユーティリティ関数
const storageKeys = {
  workTimes: 'zisseki-work-times',
  employees: 'zisseki-employees',
  projects: 'zisseki-projects',
  currentUser: 'zisseki-current-user'
};

const storageUtils = {
  save: <T>(key: string, data: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  },
  
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      const parsed = JSON.parse(item) as T;
      return parsed;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  },
  
  clear: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to clear ${key}:`, error);
    }
  },
  
  clearAll: (): void => {
    try {
      Object.values(storageKeys).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear all storage:', error);
    }
  }
};

interface ZissekiState {
  // ========================================
  // 実績データ（localStorage優先）
  // ========================================
  workTimes: WorkTimeData[];
  
  // ========================================
  // マスターデータ（localStorage優先）
  // ========================================
  employees: Employee[];
  projects: Project[];
  currentUser: User | null;
  
  // ========================================
  // システム状態（Storeで管理）
  // ========================================
  loading: boolean;
  error: string | null;
  isInitialized: boolean; // 初期化完了フラグ
  
  // ========================================
  // セッター
  // ========================================
  setWorkTimes: (workTimes: WorkTimeData[]) => void;
  setEmployees: (employees: Employee[]) => void;
  setProjects: (projects: Project[]) => void;
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsInitialized: (isInitialized: boolean) => void;
  
  // ========================================
  // 複合アクション（localStorage保存付き）
  // ========================================
  updateWorkTimes: (newWorkTimes: WorkTimeData[]) => void;
  updateEmployees: (newEmployees: Employee[]) => void;
  updateProjects: (newProjects: Project[]) => void;
  updateCurrentUser: (newUser: User) => void;
  
  // ========================================
  // データ管理
  // ========================================
  resetData: () => void;
  initializeFromStorage: () => void;
  loadFromLocalStorage: () => void; // localStorageから読み込み専用
  
  // ========================================
  // 実績データ専用アクション
  // ========================================
  updateWorkTime: (date: string, startTime: string, endTime: string) => void;
}

export const useZissekiStore = create<ZissekiState>()(
  devtools(
    (set, get) => ({
      // ========================================
      // 初期状態
      // ========================================
      workTimes: [],
      employees: [],
      projects: [],
      currentUser: null,
      loading: false,
      error: null,
      isInitialized: false,
      
      // ========================================
      // セッター
      // ========================================
      setWorkTimes: (workTimes) => set({ workTimes }),
      setEmployees: (employees) => set({ employees }),
      setProjects: (projects) => set({ projects }),
      setCurrentUser: (currentUser) => set({ currentUser }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setIsInitialized: (isInitialized) => set({ isInitialized }),
      
      // ========================================
      // 複合アクション（localStorage保存付き）
      // ========================================
      updateWorkTimes: (newWorkTimes) => {
        set({ workTimes: newWorkTimes });
        storageUtils.save(storageKeys.workTimes, newWorkTimes);
      },
      
      // 初期化アクション
      initializeFromStorage: async () => {
        try {
          set({ isInitialized: true });
        } catch (error) {
          console.error('Failed to initialize from storage:', error);
          set({ isInitialized: true });
        }
      },
    }),
    { name: 'zisseki-store' }
  )
); 