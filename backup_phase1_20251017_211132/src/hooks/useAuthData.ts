/**
 * @file 認証関連のカスタムフック
 * tRPCを使用した認証機能のデータ操作を提供
 */

import { trpc } from '@src/lib/trpc/client';
import { useAuthStore } from '@src/store/authStore';
import type { LoginUser } from '@src/types/auth';

/**
 * ユーザー検索フック
 * 名前による部分一致検索を行う
 * @param name 検索する名前（2文字以上で有効）
 */
export const useUserSearch = (name: string) => {
  return trpc.auth.searchUsers.useQuery(
    { name },
    { 
      enabled: name.length >= 2, // 2文字以上で検索実行
      staleTime: 30 * 1000, // 30秒キャッシュ
      gcTime: 5 * 60 * 1000, // 5分間キャッシュ保持
      refetchOnWindowFocus: false, // フォーカス時の再取得を無効
    }
  );
};

/**
 * ユーザー存在確認フック
 * UserIDの存在確認のみを行う軽量な確認用
 * @param userId 確認するユーザーID
 */
export const useUserValidation = (userId: string) => {
  return trpc.auth.validateUser.useQuery(
    { userId },
    {
      enabled: userId.length > 0, // UserIDが入力されている場合のみ実行
      staleTime: 60 * 1000, // 1分キャッシュ
      gcTime: 5 * 60 * 1000, // 5分間キャッシュ保持
      refetchOnWindowFocus: false,
    }
  );
};

/**
 * 認証関連のMutationフック
 * ログイン・ログアウト処理を提供
 */
export const useAuthMutations = () => {
  const { setUser, clearUser } = useAuthStore();
  const utils = trpc.useUtils();
  
  // ログインMutation
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (response) => {
      console.log('Login success:', response);
      if (response.success && response.data) {
        // Zustandストアにユーザー情報を保存
        setUser(response.data as any);
        
        // localStorageにも保存（永続化）
        try {
          localStorage.setItem('auth_user', JSON.stringify(response.data));
          console.log('User data saved to localStorage');
        } catch (error) {
          console.error('Failed to save user to localStorage:', error);
        }
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  // ログアウトMutation
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: (response) => {
      console.log('Logout success:', response);
      
      // Zustandストアをクリア
      clearUser();
      
      // localStorageからも削除
      try {
        localStorage.removeItem('auth_user');
        console.log('User data removed from localStorage');
      } catch (error) {
        console.error('Failed to remove user from localStorage:', error);
      }
      
      // 関連するクエリのキャッシュをクリア
      utils.auth.searchUsers.invalidate();
      utils.auth.validateUser.invalidate();
    },
    onError: (error) => {
      console.error('Logout error:', error);
    }
  });

  // ヘルパー関数
  const login = (userId: string) => {
    console.log('Attempting login for userId:', userId);
    loginMutation.mutate({ userId });
  };

  const logout = () => {
    console.log('Attempting logout');
    logoutMutation.mutate();
  };

  return { 
    loginMutation, 
    logoutMutation,
    login,
    logout,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};

/**
 * 認証状態の初期化フック
 * アプリ起動時にlocalStorageからユーザー情報を復元
 */
export const useAuthInitialize = () => {
  const { setUser, user, clearUser } = useAuthStore();

  const initialize = () => {
    // 既にユーザーがセットされている場合はスキップ
    if (user) {
      console.log('User already initialized:', user);
      return;
    }

    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        const userData: LoginUser = JSON.parse(stored);
        
        // データの妥当性を簡単にチェック
        if (userData.user_id && userData.name_japanese) {
          setUser(userData);
          console.log('User data restored from localStorage:', userData);
        } else {
          console.warn('Invalid user data in localStorage, removing...');
          localStorage.removeItem('auth_user');
        }
      } else {
        console.log('No stored user data found');
      }
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      // 破損したデータを削除
      localStorage.removeItem('auth_user');
    }
  };

  const clearStoredUser = () => {
    try {
      localStorage.removeItem('auth_user');
      clearUser();
      console.log('Stored user data cleared');
    } catch (error) {
      console.error('Failed to clear stored user data:', error);
    }
  };

  return { 
    initialize,
    clearStoredUser,
    hasStoredUser: !!user,
  };
};