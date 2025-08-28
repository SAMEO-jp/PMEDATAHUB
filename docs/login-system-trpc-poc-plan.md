# ログインシステム tRPC POC実装計画書

## 1. 概要
tRPCベースでUSERテーブル（318件のレコード）を使用した簡単なログイン機能のPOCを実装する。
既存のtRPC構造に準拠し、統一されたAPI設計で実装する。

### 1.1 最小限の機能要件
- UserID直接入力によるログイン
- 氏名検索によるUserID取得→ログイン
- 簡単なセッション管理（ブラウザストレージ使用）

## 2. tRPC API設計

### 2.1 ルーター構造
```
src/lib/trpc/routers/
├── _app.ts          # メインアプリルーター
├── db/
│   ├── auth.ts      # 認証関連 (新規作成)
│   └── ...
└── ...
```

### 2.2 authルーター仕様

#### ファイル: `src/lib/trpc/routers/db/auth.ts`
```typescript
export const authRouter = createTRPCRouter({
  // ユーザー検索（名前による部分一致）
  searchUsers: publicProcedure
    .input(z.object({
      name: z.string().min(2, '名前は2文字以上入力してください'),
    }))
    .query(async ({ input }) => {
      // SELECT user_id, name_japanese, bumon, syokui FROM USER 
      // WHERE name_japanese LIKE '%name%' LIMIT 10
    }),

  // ユーザー存在確認・ログイン
  login: publicProcedure
    .input(z.object({
      userId: z.string().min(1, 'UserIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      // SELECT * FROM USER WHERE user_id = userId
    }),

  // ログアウト
  logout: publicProcedure
    .mutation(async () => {
      // セッション削除処理
    }),
});
```

## 3. 実装タスク

### タスク1: データアクセス層の実装 (15分)
#### ファイル: `src/lib/db/userQueries.ts`
```typescript
import { GetConditionData, GetAllData } from '@src/lib/db/db_GetData';

// ユーザー検索
export async function searchUsersByName(name: string) {
  return await GetConditionData(
    'name_japanese LIKE ?',
    [`%${name}%`],
    { 
      tableName: 'USER',
      selectColumns: ['user_id', 'name_japanese', 'bumon', 'syokui'],
      limit: 10
    }
  );
}

// ユーザー取得
export async function getUserById(userId: string) {
  return await GetConditionData(
    'user_id = ?',
    [userId],
    { tableName: 'USER' }
  );
}
```

### タスク2: tRPCルーター作成 (30分)
#### ファイル: `src/lib/trpc/routers/db/auth.ts`
```typescript
/**
 * @file 認証（Authentication）に関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { searchUsersByName, getUserById } from '@src/lib/db/userQueries';
import { createTRPCRouter, publicProcedure } from '../../trpc';

export const authRouter = createTRPCRouter({
  /**
   * ユーザー検索プロシージャ
   * 名前による部分一致検索を行う
   */
  searchUsers: publicProcedure
    .input(z.object({
      name: z.string().min(2, '名前は2文字以上入力してください'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await searchUsersByName(input.name);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'ユーザー検索に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC auth.searchUsers error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ユーザー検索に失敗しました',
        });
      }
    }),

  /**
   * ログインプロシージャ
   * UserIDでユーザー存在確認とログイン処理
   */
  login: publicProcedure
    .input(z.object({
      userId: z.string().min(1, 'UserIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await getUserById(input.userId);
        
        if (!result.success || !result.data || result.data.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定されたUserIDのユーザーが見つかりません',
          });
        }

        const user = result.data[0];
        
        // 簡単なセッション情報を返す（実際のJWT等は後で実装）
        return { 
          success: true, 
          data: {
            user_id: user.user_id,
            name_japanese: user.name_japanese,
            company: user.company,
            bumon: user.bumon,
            sitsu: user.sitsu,
            ka: user.ka,
            syokui: user.syokui,
            loginTime: new Date().toISOString(),
          }
        };
      } catch (error) {
        console.error("tRPC auth.login error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ログインに失敗しました',
        });
      }
    }),

  /**
   * ログアウトプロシージャ
   */
  logout: publicProcedure
    .mutation(async () => {
      try {
        // セッション削除処理（POCなので簡単に）
        return { 
          success: true, 
          data: { logoutTime: new Date().toISOString() } 
        };
      } catch (error) {
        console.error("tRPC auth.logout error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ログアウトに失敗しました',
        });
      }
    }),
});
```

### タスク3: ルーター統合 (5分)
#### ファイル: `src/lib/trpc/routers/_app.ts` に追加
```typescript
import { authRouter } from './db/auth';

export const appRouter = createTRPCRouter({
  // 既存のルーター...
  auth: authRouter,  // 追加
});
```

### タスク4: 型定義 (10分)
#### ファイル: `src/types/auth.ts`
```typescript
export interface User {
  user_id: string;
  name_japanese: string;
  company: string;
  bumon: string;
  sitsu: string;
  ka: string;
  syokui: string;
}

export interface UserSearchResult {
  user_id: string;
  name_japanese: string;
  bumon: string;
  syokui: string;
}

export interface LoginUser extends User {
  loginTime: string;
}

export interface AuthState {
  user: LoginUser | null;
  isLoggedIn: boolean;
}
```

### タスク5: カスタムフック作成 (20分)
#### ファイル: `src/hooks/useAuthData.ts`
```typescript
import { trpc } from '@src/lib/trpc/client';
import { useAuthStore } from '@src/store/authStore';

/**
 * ユーザー検索フック
 */
export const useUserSearch = (name: string) => {
  return trpc.auth.searchUsers.useQuery(
    { name },
    { 
      enabled: name.length >= 2,
      staleTime: 30 * 1000, // 30秒キャッシュ
    }
  );
};

/**
 * 認証関連のMutationフック
 */
export const useAuthMutations = () => {
  const { setUser, clearUser } = useAuthStore();
  
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (response) => {
      if (response.success && response.data) {
        setUser(response.data);
        // localStorageに保存
        localStorage.setItem('auth_user', JSON.stringify(response.data));
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      clearUser();
      localStorage.removeItem('auth_user');
    },
    onError: (error) => {
      console.error('Logout error:', error);
    }
  });

  return { 
    loginMutation, 
    logoutMutation,
    // ヘルパー関数
    login: (userId: string) => loginMutation.mutate({ userId }),
    logout: () => logoutMutation.mutate(),
  };
};

/**
 * 認証状態の初期化フック
 */
export const useAuthInitialize = () => {
  const { setUser } = useAuthStore();

  const initialize = () => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUser(user);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('auth_user');
      }
    }
  };

  return { initialize };
};
```

### タスク6: 状態管理更新 (15分)
#### ファイル: `src/store/authStore.ts`
```typescript
import { create } from 'zustand';
import type { LoginUser } from '@src/types/auth';

interface AuthState {
  user: LoginUser | null;
  isLoggedIn: boolean;
  setUser: (user: LoginUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: true }),
  clearUser: () => set({ user: null, isLoggedIn: false }),
}));
```

### タスク7: ログインモーダル更新 (45分)
#### ファイル: `src/components/auth/LoginModal.tsx` の更新
```typescript
'use client';

import { useState } from 'react';
import { useUserSearch, useAuthMutations } from '@src/hooks/useAuthData';
import type { UserSearchResult } from '@src/types/auth';

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [method, setMethod] = useState<'userid' | 'name'>('userid');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  // tRPCフックの使用
  const { data: searchData, isLoading: isSearching } = useUserSearch(name);
  const { login, loginMutation } = useAuthMutations();

  const handleLogin = () => {
    const loginUserId = method === 'userid' ? userId : selectedUser?.user_id;
    if (loginUserId) {
      login(loginUserId);
      onClose();
    }
  };

  const searchResults = searchData?.success ? searchData.data : [];

  return (
    <div className="modal">
      {/* ログインモーダルUI実装 */}
      <div className="modal-content">
        <h2>ログイン</h2>
        
        {/* ログイン方法選択 */}
        <div>
          <label>
            <input 
              type="radio" 
              value="userid" 
              checked={method === 'userid'}
              onChange={(e) => setMethod(e.target.value as 'userid')}
            />
            UserID直接入力
          </label>
          <label>
            <input 
              type="radio" 
              value="name" 
              checked={method === 'name'}
              onChange={(e) => setMethod(e.target.value as 'name')}
            />
            名前から検索
          </label>
        </div>

        {/* UserID直接入力 */}
        {method === 'userid' && (
          <div>
            <input
              type="text"
              placeholder="UserIDを入力"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
        )}

        {/* 名前検索 */}
        {method === 'name' && (
          <div>
            <input
              type="text"
              placeholder="名前を入力"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            {isSearching && <div>検索中...</div>}
            
            {searchResults.length > 0 && (
              <div>
                {searchResults.map((user) => (
                  <div 
                    key={user.user_id}
                    onClick={() => setSelectedUser(user)}
                    className={selectedUser?.user_id === user.user_id ? 'selected' : ''}
                  >
                    {user.name_japanese} ({user.user_id}) - {user.bumon} {user.syokui}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ボタン */}
        <div>
          <button 
            onClick={handleLogin}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'ログイン中...' : 'ログイン'}
          </button>
          <button onClick={onClose}>キャンセル</button>
        </div>

        {/* エラー表示 */}
        {loginMutation.error && (
          <div className="error">
            {loginMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
}
```

## 4. 実装順序

### ステップ1: データアクセス層 (15分)
1. `src/lib/db/userQueries.ts` 作成
2. 既存のdb関数を使用したクエリ実装

### ステップ2: tRPCルーター (35分)
1. `src/lib/trpc/routers/db/auth.ts` 作成
2. `src/lib/trpc/routers/_app.ts` にルーター追加
3. 型定義作成

### ステップ3: フロントエンド (60分)
1. カスタムフック作成
2. 状態管理更新
3. ログインモーダル更新

### ステップ4: 動作確認 (20分)
1. tRPCクエリ/ミューテーション動作テスト
2. UI動作確認
3. 簡単な調整

## 5. POC完了後の動作イメージ

1. **UserID直接入力の場合**:
   ```typescript
   // trpc.auth.login.useMutation() 使用
   await login({ userId: "338844" })
   ```

2. **名前検索の場合**:
   ```typescript
   // trpc.auth.searchUsers.useQuery() 使用
   const { data } = useUserSearch("立木")
   // ユーザー選択後
   await login({ userId: selectedUser.user_id })
   ```

## 6. 制約事項・今後の課題

### POCの制約
- パスワード認証なし（UserID存在確認のみ）
- セキュリティ機能なし
- エラーハンドリング最小限
- 簡単なlocalStorage使用

### 今後の改善点
- JWT実装
- セッション管理強化
- 権限管理追加
- セキュリティ強化

---

**推定作業時間**: 約2時間  
**tRPC準拠**: 既存の統一API構造に完全準拠  
**作成日**: 2025-08-28  
**バージョン**: tRPC POC 1.0