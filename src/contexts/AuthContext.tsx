'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, User } from '@/src/store/authStore';

// ==========================================
// 認証コンテキストの型定義
// ==========================================

/**
 * 認証コンテキストの型定義
 * Zustandストアの状態とアクションをそのまま提供
 */
interface AuthContextType {
  // === 状態（読み取り専用） ===
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  error: string | null;
  
  // === アクション（状態変更） ===
  login: (userId: string) => Promise<boolean>;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  toggleLoginModal: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// ==========================================
// コンテキスト作成
// ==========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==========================================
// プロバイダーコンポーネント
// ==========================================

/**
 * 認証プロバイダーコンポーネント
 * ZustandストアをReact Contextでラップし、
 * 子コンポーネントに認証状態とアクションを提供
 * 
 * @param children 子コンポーネント
 * 
 * @example
 * ```tsx
 * // アプリケーションのルートで使用
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * 
 * // 子コンポーネントで使用
 * const { isAuthenticated, login, logout } = useAuthContext();
 * ```
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Zustandストアから認証状態とアクションを取得
  const authState = useAuth();

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// カスタムフック
// ==========================================

/**
 * 認証コンテキストを使用するカスタムフック
 * AuthProvider内でのみ使用可能
 * 
 * @returns 認証状態とアクション
 * 
 * @throws Error AuthProvider外で使用された場合
 * 
 * @example
 * ```tsx
 * function LoginButton() {
 *   const { isAuthenticated, login, openLoginModal } = useAuthContext();
 *   
 *   if (isAuthenticated) {
 *     return <button onClick={logout}>ログアウト</button>;
 *   }
 *   
 *   return <button onClick={openLoginModal}>ログイン</button>;
 * }
 * ```
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}

// ==========================================
// 利便性のためのエクスポート
// ==========================================

/**
 * 認証状態のみを取得するカスタムフック
 * 状態の変更が必要ない場合に使用
 * 
 * @returns 認証状態のみ
 */
export function useAuthState() {
  const { 
    isAuthenticated, 
    currentUser, 
    isLoading, 
    isLoginModalOpen, 
    error 
  } = useAuthContext();
  
  return {
    isAuthenticated,
    currentUser,
    isLoading,
    isLoginModalOpen,
    error,
  };
}

/**
 * 認証アクションのみを取得するカスタムフック
 * 状態の読み取りが必要ない場合に使用
 * 
 * @returns 認証アクションのみ
 */
export function useAuthActions() {
  const {
    login,
    logout,
    setCurrentUser,
    openLoginModal,
    closeLoginModal,
    toggleLoginModal,
    setLoading,
    setError,
    clearError,
  } = useAuthContext();
  
  return {
    login,
    logout,
    setCurrentUser,
    openLoginModal,
    closeLoginModal,
    toggleLoginModal,
    setLoading,
    setError,
    clearError,
  };
}
