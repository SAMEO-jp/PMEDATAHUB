// ==========================================
// ファイル名: authStore.ts
// 機能: 認証状態管理（Zustand）
// 技術: Zustand, persist middleware
// 作成日: 2024-12-19
// 更新日: 2025-01-XX（tRPC対応）
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginUser } from '@src/types/auth';

/**
 * 認証状態インターフェース
 */
interface AuthState {
  // === 認証状態 ===
  isAuthenticated: boolean;        // ログイン状態
  user: LoginUser | null;          // 現在のユーザー情報（tRPCの型に対応）
  isLoading: boolean;              // ローディング状態
  
  // === UI状態 ===
  isLoginModalOpen: boolean;       // ログインモーダルの開閉状態
  
  // === エラー状態 ===
  error: string | null;            // エラーメッセージ
}

/**
 * 認証アクションインターフェース
 */
interface AuthActions {
  // === 認証アクション ===
  setUser: (user: LoginUser | null) => void;   // ユーザー情報設定（tRPC連携用）
  clearUser: () => void;                       // ユーザー情報クリア
  
  // === UIアクション ===
  openLoginModal: () => void;                  // ログインモーダルを開く
  closeLoginModal: () => void;                 // ログインモーダルを閉じる
  toggleLoginModal: () => void;                // ログインモーダルを切り替え
  
  // === 状態管理 ===
  setLoading: (loading: boolean) => void;      // ローディング状態設定
  setError: (error: string | null) => void;    // エラー状態設定
  clearError: () => void;                      // エラーをクリア
}

// ==========================================
// Zustandストア定義
// ==========================================

/**
 * 認証状態管理ストア
 * Zustandのcreateとpersistミドルウェアを使用して、
 * 認証状態の管理とローカルストレージへの永続化を実現
 * tRPCフックと連携してログイン処理を行う
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // === 初期状態 ===
      isAuthenticated: false,
      user: null,
      isLoading: false,
      isLoginModalOpen: false,
      error: null,

      // === 認証アクション ===
      /**
       * ユーザー情報を設定
       * @param user ユーザー情報（nullでログアウト状態）
       */
      setUser: (user: LoginUser | null) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoginModalOpen: false, // ログイン成功時はモーダルを閉じる
          error: null,
        });
      },

      /**
       * ユーザー情報をクリア（ログアウト）
       */
      clearUser: () => {
        set({
          isAuthenticated: false,
          user: null,
          error: null,
          isLoginModalOpen: false,
        });
      },

      // === UIアクション ===
      /**
       * ログインモーダルを開く
       */
      openLoginModal: () => {
        set({ isLoginModalOpen: true, error: null });
      },

      /**
       * ログインモーダルを閉じる
       */
      closeLoginModal: () => {
        set({ isLoginModalOpen: false, error: null });
      },

      /**
       * ログインモーダルの開閉を切り替え
       */
      toggleLoginModal: () => {
        set((state) => ({
          isLoginModalOpen: !state.isLoginModalOpen,
          error: null,
        }));
      },

      // === 状態管理 ===
      /**
       * ローディング状態を設定
       * @param loading ローディング状態
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * エラー状態を設定
       * @param error エラーメッセージ
       */
      setError: (error: string | null) => {
        set({ error });
      },

      /**
       * エラーをクリア
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      // === 永続化設定 ===
      name: 'auth-storage',  // ローカルストレージのキー名
      
      /**
       * 永続化する状態を選択
       * UI状態（モーダルの開閉など）は永続化しない
       */
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

// ==========================================
// カスタムフック（利便性向上）
// ==========================================

/**
 * 認証状態管理のカスタムフック
 * useAuthStoreの状態とアクションを使いやすい形で提供
 * tRPCベースの認証システムと連携
 * 
 * @returns 認証状態とアクションのオブジェクト
 * 
 * @example
 * ```typescript
 * const { 
 *   isAuthenticated, 
 *   user, 
 *   setUser,
 *   clearUser,
 *   openLoginModal 
 * } = useAuth();
 * 
 * // ログイン成功時（tRPCフック経由）
 * const handleLoginSuccess = (loginData: LoginUser) => {
 *   setUser(loginData);
 * };
 * 
 * // ログインモーダルを開く
 * openLoginModal();
 * ```
 */
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    // === 状態（読み取り専用） ===
    isAuthenticated: store.isAuthenticated,     // ログイン状態
    user: store.user,                           // 現在のユーザー情報
    isLoading: store.isLoading,                 // ローディング状態
    isLoginModalOpen: store.isLoginModalOpen,   // ログインモーダルの開閉状態
    error: store.error,                         // エラーメッセージ
    
    // === アクション（状態変更） ===
    setUser: store.setUser,                     // ユーザー情報設定
    clearUser: store.clearUser,                 // ユーザー情報クリア
    openLoginModal: store.openLoginModal,       // ログインモーダルを開く
    closeLoginModal: store.closeLoginModal,     // ログインモーダルを閉じる
    toggleLoginModal: store.toggleLoginModal,   // ログインモーダルを切り替え
    setLoading: store.setLoading,               // ローディング状態設定
    setError: store.setError,                   // エラー状態設定
    clearError: store.clearError,               // エラーをクリア
  };
};
