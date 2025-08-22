// ==========================================
// ファイル名: authStore.ts
// 機能: 認証状態管理（Zustand）
// 技術: Zustand, persist middleware
// 作成日: 2024-12-19
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==========================================
// 型定義
// ==========================================

/**
 * ユーザー情報インターフェース
 */
export interface User {
  id: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

/**
 * 認証状態インターフェース
 */
interface AuthState {
  // === 認証状態 ===
  isAuthenticated: boolean;        // ログイン状態
  currentUser: User | null;        // 現在のユーザー情報
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
  login: (userId: string) => Promise<boolean>;  // ログイン処理
  logout: () => void;                          // ログアウト処理
  setCurrentUser: (user: User | null) => void; // ユーザー情報設定
  
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
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // === 初期状態 ===
      isAuthenticated: false,
      currentUser: null,
      isLoading: false,
      isLoginModalOpen: false,
      error: null,

      // === 認証アクション ===
      /**
       * ログイン処理
       * @param userId ユーザーID
       * @returns ログイン成功時true、失敗時false
       */
      login: async (userId: string): Promise<boolean> => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch('/api/loginmodals/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });

          if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.error || 'ログインに失敗しました。';
            set({ error: errorMessage, isLoading: false });
            return false;
          }

          const userData: User = await response.json();
          
          // ローカルストレージに保存（永続化）
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          // 状態を更新
          set({
            isAuthenticated: true,
            currentUser: userData,
            isLoading: false,
            error: null,
            isLoginModalOpen: false, // ログイン成功時はモーダルを閉じる
          });
          
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({
            error: 'ログイン中にエラーが発生しました。',
            isLoading: false,
          });
          return false;
        }
      },

      /**
       * ログアウト処理
       */
      logout: () => {
        // ローカルストレージから削除
        localStorage.removeItem('currentUser');
        
        // 状態をリセット
        set({
          isAuthenticated: false,
          currentUser: null,
          error: null,
          isLoginModalOpen: false,
        });
        
        // ページをリロード（必要に応じて）
        window.location.reload();
      },

      /**
       * 現在のユーザー情報を設定
       * @param user ユーザー情報（nullでログアウト状態）
       */
      setCurrentUser: (user: User | null) => {
        set({
          currentUser: user,
          isAuthenticated: !!user,
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
        currentUser: state.currentUser,
      }),
      
      /**
       * 初期化時の処理
       * ローカルストレージからユーザー情報を復元
       */
      onRehydrateStorage: () => (state) => {
        if (state) {
          // ローカルストレージからユーザー情報を取得
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              state.setCurrentUser(userData);
            } catch (error) {
              console.error('Failed to parse stored user data:', error);
              localStorage.removeItem('currentUser');
            }
          }
        }
      },
    }
  )
);

// ==========================================
// カスタムフック（利便性向上）
// ==========================================

/**
 * 認証状態管理のカスタムフック
 * useAuthStoreの状態とアクションを使いやすい形で提供
 * 
 * @returns 認証状態とアクションのオブジェクト
 * 
 * @example
 * ```typescript
 * const { 
 *   isAuthenticated, 
 *   currentUser, 
 *   login,
 *   logout,
 *   openLoginModal 
 * } = useAuth();
 * 
 * // ログイン処理
 * const handleLogin = async (userId: string) => {
 *   const success = await login(userId);
 *   if (success) {
 *     console.log('ログイン成功');
 *   }
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
    currentUser: store.currentUser,             // 現在のユーザー情報
    isLoading: store.isLoading,                 // ローディング状態
    isLoginModalOpen: store.isLoginModalOpen,   // ログインモーダルの開閉状態
    error: store.error,                         // エラーメッセージ
    
    // === アクション（状態変更） ===
    login: store.login,                         // ログイン処理
    logout: store.logout,                       // ログアウト処理
    setCurrentUser: store.setCurrentUser,       // ユーザー情報設定
    openLoginModal: store.openLoginModal,       // ログインモーダルを開く
    closeLoginModal: store.closeLoginModal,     // ログインモーダルを閉じる
    toggleLoginModal: store.toggleLoginModal,   // ログインモーダルを切り替え
    setLoading: store.setLoading,               // ローディング状態設定
    setError: store.setError,                   // エラー状態設定
    clearError: store.clearError,               // エラーをクリア
  };
};
