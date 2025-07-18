// ==========================================
// ファイル名: authStore.ts
// 機能: 統合認証状態管理（Zustand）
// 技術: Zustand, persist middleware
// 作成日: 2024-12-19
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/src/features/loginmodal/types/user';

// ==========================================
// 型定義層
// ==========================================
interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// ==========================================
// Zustandストア定義
// ==========================================
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // 初期状態
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // アクション
      login: (user: User) => {
        set({ 
          currentUser: user, 
          isAuthenticated: true,
          error: null 
        });
        
        // ローカルストレージとの同期（念のため）
        localStorage.setItem('currentUser', JSON.stringify(user));
      },

      logout: () => {
        set({ 
          currentUser: null, 
          isAuthenticated: false,
          error: null 
        });
        
        // ローカルストレージのクリア
        localStorage.removeItem('currentUser');
        
        // ページリロード（必要に応じて）
        window.location.reload();
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

// ==========================================
// カスタムフック（利便性向上）
// ==========================================
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    // 状態
    user: store.currentUser,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    
    // アクション
    login: store.login,
    logout: store.logout,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
  };
}; 