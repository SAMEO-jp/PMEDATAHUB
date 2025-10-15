---
alwaysApply: true
---
# trpc-core.md

## このファイルについて
- **目的**: 新規プロジェクトで最初に読むべきtRPCの基本セットアップ内容
- **読むべき人**: 新規プロジェクト開始時、tRPC導入時
- **関連ファイル**: [trpc-dal.md](./trpc-dal.md), [trpc-error-handling.md](./trpc-error-handling.md), [trpc-patterns.md](./trpc-patterns.md), [trpc-reference.md](./trpc-reference.md)

## Context:
[tRPC](mdc:https:/trpc.io)はエンドツーエンドの型安全なAPIを可能にし、スキーマ、コード生成、またはランタイムエラーなしでAPIを構築・消費できるようにします。これらのルールは、tRPC v11のベストプラクティスに従い、**createTRPCReact + 手動Provider設定**を使用するプロジェクト向けです。

## プロジェクト構造
推奨されるtRPCセットアップ構造：
```md
├── src
│   ├── app
│   │   ├── api
│   │   │   └── trpc
│   │   │       └── [trpc]
│   │   │           └── route.ts  # tRPC HTTPハンドラーのみ
│   │   └── layout.tsx  # TRPCProviderをここに配置
│   ├── lib
│   │   ├── trpc
│   │   │   ├── client.ts      # createTRPCReact設定
│   │   │   ├── Provider.tsx   # 手動Provider設定
│   │   │   ├── trpc.ts        # プロシージャヘルパー
│   │   │   └── routers
│   │   │       ├── _app.ts    # メインアプリルーター
│   │   │       ├── app
│   │   │       │   └── [feature].ts # アプリページ固有ルーター
│   │   │       └── db
│   │   │           └── [feature].ts # データベース固有ルーター
│   │   └── db/                # データアクセス層
│   │       ├── db_advanced.ts
│   │       ├── db_connection.ts
│   │       ├── db_CRUD.ts
│   │       ├── db_DeleteTable.ts
│   │       └── db_GetData.ts
│   └── hooks
│       └── use[Feature]Data.ts # カスタムフック
```

## サーバーサイドセットアップ

### tRPCバックエンドの初期化

```typescript
// lib/trpc/trpc.ts
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    headers: opts.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
```

### ルーターの作成

```typescript
// lib/trpc/routers/_app.ts
import { createTRPCRouter } from '../trpc';
import { userRouter } from './user';
import { postRouter } from './post';

export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
```

### 機能別ルーターの作成

```typescript
// src/lib/trpc/routers/user.ts

/**
 * @file ユーザー（User）に関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
// データベース操作関数をインポート（実際の実装に置き換えてください）
import { getRecord, updateRecord, getAllRecords, createRecord } from '@src/lib/db/db_CRUD';
import { createTRPCRouter, publicProcedure } from '../trpc';

/**
 * ユーザー関連のプロシージャをまとめたルーター。
 * `createTRPCRouter` を使って定義します。
 * ここで定義されたプロシージャは `trpc.user.getAll` のようにクライアントから呼び出されます。
 */
export const userRouter = createTRPCRouter({
  /**
   * 全てのユーザーを取得するプロシージャ。
   * .query() を使用するため、これはデータを取得する（読み取り）操作です。
   */
  getAll: publicProcedure
    .query(async () => {
      const data = handleDALResult(await getAllRecords('users'));
      return successResponse(data);
    }),

  /**
   * 新しいユーザーを作成するプロシージャ。
   * .mutation() を使用するため、これはデータを変更する（書き込み）操作です。
   */
  create: publicProcedure
    // .input() でクライアントからの入力データを検証します。
    // z (Zod) を使ってスキーマを定義し、バリデーションルールを指定します。
    .input(z.object({
      name: z.string().min(1, '名前は必須です'),
      email: z.string().email('有効なメールアドレスを入力してください'),
      age: z.number().min(0, '年齢は0以上である必要があります'),
    }))
    // mutationの引数から検証済みの `input` を受け取ります。
    .mutation(async ({ input }) => {
      // --- データベース操作 ---
      // 検証済みの `input` データを使って、データベースに新しいユーザーを作成します。
      // const data = handleDALResult(await createRecord('users', input));
      // return successResponse(data);
      // -----

      // モックデータ（サンプル）を返す
      return successResponse(input);
    }),

  /**
   * 条件を指定してユーザーを検索するプロシージャ。
   * .query() を使用するため、これもデータを取得する操作です。
   */
  search: publicProcedure
    // 検索条件を .input() で定義します。
    // .optional() を付けることで、そのフィールドが省略可能になります。
    .input(z.object({
      name: z.string().optional(),
      email: z.string().optional(),
    }))
    // queryの引数から検証済みの `input` (検索条件) を受け取ります。
    .query(async ({ input }) => {
      // --- 検索ロジック ---
      // `input.name` や `input.email` を使ってデータベースを検索するロジックをここに実装します。
      // const data = handleDALResult(await searchRecords('users', input));
      // return successResponse(data);
      // ---
      // モックデータ（サンプル）を返す
      return successResponse([]);
    }),
});
```

## クライアントサイドセットアップ

### createTRPCReact設定

```typescript
// lib/trpc/client.ts
import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from './routers/_app';

export const trpc = createTRPCReact<AppRouter>();
```

### 手動Provider設定

```typescript
// lib/trpc/Provider.tsx
'use client';

import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import superjson from 'superjson';

import { trpc } from './client';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### レイアウトでのProvider配置

```typescript
// app/layout.tsx
import { TRPCProvider } from '@src/lib/trpc/Provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
```

## 環境変数の型安全性

### 🚨 重要な注意事項

**`process.env`を直接使用することは避けてください。** 環境変数の型安全性を保証するために、Zodを使用したバリデーションを必ず実装してください。

### 環境変数スキーマの定義

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // 必須環境変数
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform((val) => parseInt(val, 10)),

  // オプション環境変数（デフォルト値付き）
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_API_BASE_URL: z.string().optional().default(''),

  // データベース関連
  DATABASE_URL: z.string().url('有効なデータベースURLを指定してください'),

  // 認証関連
  JWT_SECRET: z.string().min(32, 'JWT_SECRETは32文字以上である必要があります'),

  // 外部API関連
  EXTERNAL_API_KEY: z.string().optional(),
  EXTERNAL_API_URL: z.string().url().optional(),
});

// 環境変数の検証と型安全な取得
export const env = envSchema.parse(process.env);

// 型定義のエクスポート
export type Env = z.infer<typeof envSchema>;
```

### 環境変数使用の実装例

```typescript
// lib/trpc/Provider.tsx
'use client';

import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import superjson from 'superjson';
import { env } from '@src/lib/env';
import { trpc } from './client';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';

  // 型安全な環境変数アクセス
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return `http://localhost:${env.PORT}`;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### API設定での使用例

```typescript
// lib/apiRequest.ts
import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { NextRequest } from 'next/server';

import { env } from '@src/lib/env';

const api = axios.create({
  // 型安全な環境変数アクセス
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    console.error('API error:', error);
    if (error.response?.status === 401) {
      console.warn('401: 認証エラー');
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 開発環境での環境変数チェック

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // ... スキーマ定義
});

// 開発環境でのみ環境変数をチェック
if (process.env.NODE_ENV === 'development') {
  try {
    envSchema.parse(process.env);
    console.log('✅ 環境変数の検証が完了しました');
  } catch (error) {
    console.error('❌ 環境変数の検証に失敗しました:', error);
    process.exit(1);
  }
}

export const env = envSchema.parse(process.env);
```

### 環境変数の型安全性チェックリスト

- [ ] `process.env`を直接使用していないか
- [ ] Zodスキーマで環境変数を定義しているか
- [ ] 必須環境変数が適切に検証されているか
- [ ] オプション環境変数にデフォルト値が設定されているか
- [ ] 開発環境で環境変数の検証が行われているか
- [ ] 型安全な環境変数アクセスが実装されているか
- [ ] 環境変数の値が適切にバリデーションされているか

### 🚫 避けるべきパターン

```typescript
// ❌ 悪い例：直接的なprocess.env使用
function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`; // 型安全性なし
}

// ❌ 悪い例：バリデーションなし
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '', // 型安全性なし
});

// ❌ 悪い例：transformerの間違った指定場所
trpc.createClient({
  transformer: superjson, // ❌ ここではなく
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
```

### ✅ 推奨パターン

```typescript
// ✅ 良い例：型安全な環境変数アクセス
import { env } from '@src/lib/env';

function getBaseUrl() {
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return `http://localhost:${env.PORT}`; // 型安全
}

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL, // 型安全
});

// ✅ 良い例：transformerの正しい指定場所
trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson, // ✅ ここ
    }),
  ],
});
```

## バージョン互換性

このガイドはtRPC v11用で、以下が必要です：
- TypeScript >= 5.7.2
- @trpc/react-query >= 11.4.3
- @tanstack/react-query >= 5.81.5
- 厳密なTypeScriptモード（tsconfig.jsonで`"strict": true`）

## その他のリソース

- [tRPC公式ドキュメント](mdc:https:/trpc.io/docs)
- [React Query公式ドキュメント](mdc:https:/tanstack.com/query/latest)
- [Zod公式ドキュメント](mdc:https:/zod.dev)
