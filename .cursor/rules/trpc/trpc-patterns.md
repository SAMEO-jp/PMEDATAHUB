---
alwaysApply: false
---
# trpc-patterns.md

## このファイルについて
- **目的**: 実際のコーディング時の参考となる実装パターン集
- **読むべき人**: tRPC APIを実装する開発者、実装例を参考にしたい開発者
- **関連ファイル**: [trpc-core.md](./trpc-core.md), [trpc-error-handling.md](./trpc-error-handling.md), [trpc-reference.md](./trpc-reference.md)

## ベストプラクティス

### 認証・認可パターン

#### protectedProcedure の実装
```typescript
// lib/trpc/trpc.ts
import { initTRPC } from '@trpc/server';

const t = initTRPC.context<typeof createTRPCContext>().create({
  // ... 既存の設定
});

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
```

#### 使用例
```typescript
export const userRouter = createTRPCRouter({
  // 認証が必要
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const data = handleDALResult(
      await getRecord('users', ctx.session.user.id)
    );
    return successResponse(data);
  }),

  // 管理者のみ
  deleteUser: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const data = handleDALResult(
        await deleteRecord('users', input.id)
      );
      return successResponse(data);
    }),
});
```

### ページネーション/無限スクロールパターン

#### カーソルベースページネーション
```typescript
export const userRouter = createTRPCRouter({
  getList: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      cursor: z.number().optional(), // 最後のID
    }))
    .query(async ({ input }) => {
      const query = input.cursor
        ? `SELECT * FROM users WHERE id > ${input.cursor} ORDER BY id LIMIT ${input.limit}`
        : `SELECT * FROM users ORDER BY id LIMIT ${input.limit}`;

      const data = handleDALResult(await getAllRecords('users', query));

      return successResponse({
        items: data,
        nextCursor: data.length === input.limit ? data[data.length - 1].id : undefined,
      });
    }),
});
```

#### フロントエンドでの無限スクロール
```typescript
const { data, fetchNextPage, hasNextPage } = trpc.user.getList.useInfiniteQuery(
  { limit: 20 },
  {
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  }
);
```

### N+1問題の回避

❌ 悪い例（N+1問題）:
```typescript
export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const posts = await getAllRecords('posts');

    // 各投稿に対してループでユーザーを取得 = N+1問題
    for (const post of posts) {
      post.author = await getRecord('users', post.userId);
    }

    return successResponse(posts);
  }),
});
```

✅ 良い例（JOINまたはバッチ取得）:
```typescript
export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    // JOINで1回のクエリで取得
    const postsWithAuthors = handleDALResult(
      await getPostsWithAuthors() // queries/postQueries.ts
    );
    return successResponse(postsWithAuthors);
  }),
});

// queries/postQueries.ts
export async function getPostsWithAuthors() {
  return await db('posts')
    .leftJoin('users', 'posts.userId', 'users.id')
    .select('posts.*', 'users.name as authorName');
}
```

### 1. カスタムフックによるロジックの集約
tRPCのデータ操作（QueryやMutation）は、関連するテーブル（機能）ごとにカスタムフックへ集約することを推奨します。これにより、コンポーネントの関心をUIに集中させ、データロジックを再利用しやすくします。

#### 命名規則
 - ファイル名: hooks/use{TableName}Data.ts 例: hooks/useUserData.ts, hooks/usePostData.ts
 - フック名: use{TableName}Data 例: useUserData, usePostData

```typescript
// hooks/useFeatureData.ts
import { trpc } from '@src/lib/trpc/client';

export const useFeatureAll = () => {
  return trpc.feature.getAll.useQuery();
};

export const useFeatureSearch = (filters: Record<string, any>) => {
  return trpc.feature.search.useQuery(filters, {
    enabled: Object.values(filters).some(value => value && value.length > 0)
  });
};

export const useFeatureMutations = () => {
  const utils = trpc.useUtils();

  const createMutation = trpc.feature.create.useMutation({
    onSuccess: () => {
      void utils.feature.getAll.invalidate();
      void utils.feature.search.invalidate();
    }
  });

  const updateMutation = trpc.feature.update.useMutation({
    onSuccess: () => {
      void utils.feature.getAll.invalidate();
      void utils.feature.search.invalidate();
    }
  });

  const deleteMutation = trpc.feature.delete.useMutation({
    onSuccess: () => {
      void utils.feature.getAll.invalidate();
      void utils.feature.search.invalidate();
    }
  });

  return { createMutation, updateMutation, deleteMutation };
};
```

### 2. コンポーネントでの使用

```tsx
// components/FeatureComponent.tsx
'use client';

import { useState } from 'react';
import { trpc } from '@src/lib/trpc/client';
import { useFeatureMutations } from '@src/hooks/useFeatureData';

export function FeatureComponent() {
  const { data: allData, isLoading } = trpc.feature.getAll.useQuery();
  const { createMutation, updateMutation, deleteMutation } = useFeatureMutations();
  const utils = trpc.useUtils();

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData);
  };

  const handleUpdate = (id: number, updates: any) => {
    updateMutation.mutate({ id, data: updates });
  };

  const handleDelete = (id: number) => {
    if (confirm('本当に削除しますか？')) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div>
      {/* UI実装 */}
    </div>
  );
}
```

### 3. パフォーマンス最適化

```typescript
// クエリの最適化
const { data, isLoading } = trpc.feature.getAll.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  cacheTime: 10 * 60 * 1000, // 10分間キャッシュ保持
});

// 条件付きクエリ
const { data: searchData } = trpc.feature.search.useQuery(
  searchFilters,
  {
    enabled: Object.values(searchFilters).some(value => value && value.length > 0),
    refetchOnWindowFocus: false,
  }
);

// ミューテーションの最適化
const createMutation = trpc.feature.create.useMutation({
  onMutate: async (newData) => {
    // 楽観的更新
    await utils.feature.getAll.cancel();
    const previousData = utils.feature.getAll.getData();
    utils.feature.getAll.setData(undefined, (old) => [...(old || []), newData]);
    return { previousData };
  },
  onError: (err, newData, context) => {
    // エラー時にロールバック
    if (context?.previousData) {
      utils.feature.getAll.setData(undefined, context.previousData);
    }
  },
  onSuccess: () => {
    // 成功時に再フェッチ
    void utils.feature.getAll.invalidate();
  },
});
```

### 4. 型安全性の確保

```typescript
import { z } from 'zod';

// types/feature.ts
export interface Feature {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Zodスキーマ
export const FeatureSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  description: z.string().optional(),
});

// 高度な型推論
export const FeatureCreateSchema = FeatureSchema.extend({
  // 作成時に必要な追加フィールド
});

export const FeatureUpdateSchema = FeatureSchema.partial().extend({
  id: z.number(),
});

export const FeatureSearchSchema = z.object({
  name: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});
```

## バリデーション実装

### Zodスキーマによる入力検証

#### 基本バリデーション
```typescript
const UserSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  age: z.number().min(0, '年齢は0以上である必要があります'),
});
```

#### 条件付きバリデーション
```typescript
const ConditionalSchema = z.object({
  type: z.enum(['admin', 'user']),
  permissions: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.type === 'admin' && (!data.permissions || data.permissions.length === 0)) {
    return false;
  }
  return true;
}, {
  message: '管理者の場合は権限を指定してください',
});
```

#### カスタムバリデーション
```typescript
const CustomValidationSchema = z.object({
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

// 非同期バリデーション
const AsyncValidationSchema = z.object({
  email: z.string().email(),
}).refine(async (data) => {
  // データベースで重複チェック
  const existingUser = await checkEmailExists(data.email);
  return !existingUser;
}, {
  message: 'このメールアドレスは既に使用されています',
});
```

#### 高度なバリデーション例
```typescript
// 日付範囲バリデーション
const DateRangeSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start < end;
}, {
  message: '終了日は開始日より後である必要があります',
});

// ネストされたオブジェクト
const NestedSchema = z.object({
  user: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
  settings: z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  }).optional(),
});

// 配列バリデーション
const ArraySchema = z.object({
  tags: z.array(z.string().min(1).max(20)).min(1).max(5),
  items: z.array(z.object({
    name: z.string().min(1),
    quantity: z.number().min(1),
  })).min(1),
});
```

## 機能別ルーターの作成（完全な例）

### ユーザー管理ルーター
```typescript
// lib/trpc/routers/user.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { handleDALResult, successResponse, withErrorHandling } from '../helpers';
import { getAllRecords, getRecord, createRecord, updateRecord, deleteRecord } from '@src/lib/db/db_CRUD';
import { searchUsers } from '@src/lib/db/queries/userQueries';

// スキーマ定義
const UserCreateSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  age: z.number().min(0, '年齢は0以上である必要があります').optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

const UserUpdateSchema = UserCreateSchema.partial();

const UserSearchSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

/**
 * ユーザー関連のプロシージャをまとめたルーター。
 */
export const userRouter = createTRPCRouter({
  // 全ユーザー取得
  getAll: publicProcedure.query(async () => {
    const data = handleDALResult(
      await getAllRecords('users'),
      'ユーザー一覧の取得に失敗しました'
    );
    return successResponse(data);
  }),

  // ID指定取得
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const data = handleDALResult(
        await getRecord('users', input.id),
        'ユーザーが見つかりません'
      );
      return successResponse(data);
    }),

  // 検索
  search: publicProcedure
    .input(UserSearchSchema)
    .query(async ({ input }) => {
      const data = handleDALResult(
        await searchUsers(input),
        '検索に失敗しました'
      );
      return successResponse(data);
    }),

  // 作成
  create: publicProcedure
    .input(UserCreateSchema)
    .mutation(async ({ input }) => {
      // 重複チェックなどのビジネスロジック
      const existingUser = await getAllRecords('users', `SELECT * FROM users WHERE email = '${input.email}'`);
      if (existingUser.success && existingUser.data && existingUser.data.length > 0) {
        throwTRPCError('BAD_REQUEST', 'このメールアドレスは既に使用されています');
      }

      const data = handleDALResult(
        await createRecord('users', input),
        'ユーザーの作成に失敗しました'
      );
      return successResponse(data);
    }),

  // 更新
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      data: UserUpdateSchema,
    }))
    .mutation(async ({ input }) => {
      const data = handleDALResult(
        await updateRecord('users', input.id, input.data),
        'ユーザーの更新に失敗しました'
      );
      return successResponse(data);
    }),

  // 削除
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const data = handleDALResult(
        await deleteRecord('users', input.id),
        'ユーザーの削除に失敗しました'
      );
      return successResponse(data);
    }),

  // 統計情報
  getStats: publicProcedure
    .query(async () => {
      return withErrorHandling(async () => {
        const totalResult = handleDALResult(
          await getAllRecords('users', 'SELECT COUNT(*) as count FROM users'),
          '統計情報の取得に失敗しました'
        );

        const roleStatsResult = handleDALResult(
          await getAllRecords('users', 'SELECT role, COUNT(*) as count FROM users GROUP BY role'),
          '役割別統計の取得に失敗しました'
        );

        return successResponse({
          total: totalResult[0]?.count || 0,
          byRole: roleStatsResult.reduce((acc, item) => {
            if (item.role) {
              acc[item.role] = item.count;
            }
            return acc;
          }, {} as Record<string, number>),
        });
      }, '統計情報の取得に失敗しました');
    }),
});
```

### プロジェクト管理ルーター
```typescript
// lib/trpc/routers/project.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { handleDALResult, successResponse, withErrorHandling, throwTRPCError } from '../helpers';
import { getRecord, createRecord, updateRecord, deleteRecord } from '@src/lib/db/db_CRUD';
import { getProjectMembers } from '@src/lib/db/queries/projectMemberQueries';

// スキーマ定義
const ProjectCreateSchema = z.object({
  プロジェクト名: z.string().min(1, 'プロジェクト名は必須です'),
  プロジェクトステータスID: z.number(),
  クライアント名ID: z.number(),
  開始予定日: z.string().optional(),
  終了予定日: z.string().optional(),
});

const ProjectUpdateSchema = ProjectCreateSchema.partial();

const ProjectSearchSchema = z.object({
  プロジェクト名: z.string().optional(),
  プロジェクトステータスID: z.number().optional(),
  クライアント名ID: z.number().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

/**
 * プロジェクト関連のプロシージャをまとめたルーター。
 */
export const projectRouter = createTRPCRouter({
  // 全プロジェクト取得（ページネーション対応）
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const query = `SELECT * FROM projects LIMIT ${input.limit} OFFSET ${input.offset}`;
      const data = handleDALResult(
        await getAllRecords('projects', query),
        'プロジェクト一覧の取得に失敗しました'
      );
      return successResponse(data);
    }),

  // ID指定取得
  getById: publicProcedure
    .input(z.object({ ID: z.number() }))
    .query(async ({ input }) => {
      const data = handleDALResult(
        await getRecord('projects', input.ID, 'ID'),
        'プロジェクトが見つかりません'
      );
      return successResponse(data);
    }),

  // 検索
  search: publicProcedure
    .input(ProjectSearchSchema)
    .query(async ({ input }) => {
      const { limit, offset, ...filters } = input;
      const conditions: string[] = [];
      const params: any[] = [];

      if (filters.プロジェクト名) {
        conditions.push("プロジェクト名 LIKE ?");
        params.push(`%${filters.プロジェクト名}%`);
      }

      if (filters.プロジェクトステータスID !== undefined) {
        conditions.push("プロジェクトステータスID = ?");
        params.push(filters.プロジェクトステータスID);
      }

      if (filters.クライアント名ID !== undefined) {
        conditions.push("クライアント名ID = ?");
        params.push(filters.クライアント名ID);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const query = `SELECT * FROM projects ${whereClause} LIMIT ${limit} OFFSET ${offset}`;

      const data = handleDALResult(
        await getAllRecords('projects', query, params),
        'プロジェクト検索に失敗しました'
      );
      return successResponse(data);
    }),

  // 作成
  create: publicProcedure
    .input(ProjectCreateSchema)
    .mutation(async ({ input }) => {
      const data = handleDALResult(
        await createRecord('projects', input),
        'プロジェクトの作成に失敗しました'
      );
      return successResponse(data);
    }),

  // 更新
  update: publicProcedure
    .input(z.object({
      ID: z.number(),
      data: ProjectUpdateSchema,
    }))
    .mutation(async ({ input }) => {
      const data = handleDALResult(
        await updateRecord('projects', input.ID, input.data, 'ID'),
        'プロジェクトの更新に失敗しました'
      );
      return successResponse(data);
    }),

  // 削除
  delete: publicProcedure
    .input(z.object({ ID: z.number() }))
    .mutation(async ({ input }) => {
      const data = handleDALResult(
        await deleteRecord('projects', input.ID, 'ID'),
        'プロジェクトの削除に失敗しました'
      );
      return successResponse(data);
    }),

  // プロジェクトメンバー取得
  getMembers: publicProcedure
    .input(z.object({
      プロジェクトID: z.string().min(1, 'プロジェクトIDは必須です'),
    }))
    .query(async ({ input }) => {
      const data = handleDALResult(
        await getProjectMembers(input.プロジェクトID),
        'プロジェクトメンバーの取得に失敗しました'
      );
      return successResponse(data);
    }),

  // メンバーの追加
  addMember: publicProcedure
    .input(z.object({
      プロジェクトID: z.string().min(1, 'プロジェクトIDは必須です'),
      ユーザーID: z.string().min(1, 'ユーザーIDは必須です'),
      役割: z.string().min(1, '役割は必須です'),
    }))
    .mutation(async ({ input }) => {
      // 既にメンバーでないかチェック
      const existingMembers = await getProjectMembers(input.プロジェクトID);
      if (existingMembers.success && existingMembers.data) {
        const isAlreadyMember = existingMembers.data.some(
          member => member.ユーザーID === input.ユーザーID
        );
        if (isAlreadyMember) {
          throwTRPCError('BAD_REQUEST', 'このユーザーは既にプロジェクトメンバーです');
        }
      }

      const data = handleDALResult(
        await createRecord('PROJECT_MEMBER', {
          PROJECT_ID: input.プロジェクトID,
          USER_ID: input.ユーザーID,
          ROLE: input.役割,
        }),
        'メンバーの追加に失敗しました'
      );
      return successResponse(data);
    }),

  // メンバーの削除
  removeMember: publicProcedure
    .input(z.object({
      プロジェクトID: z.string().min(1, 'プロジェクトIDは必須です'),
      ユーザーID: z.string().min(1, 'ユーザーIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      return withErrorHandling(async () => {
        const result = await executeQuery(
          'DELETE FROM PROJECT_MEMBER WHERE PROJECT_ID = ? AND USER_ID = ?',
          [input.プロジェクトID, input.ユーザーID]
        );

        if (!result.success || result.data?.changes === 0) {
          throwTRPCError('NOT_FOUND', 'メンバーが見つからないか、削除に失敗しました');
        }

        return successResponse(null);
      }, 'メンバーの削除に失敗しました');
    }),

  // プロジェクトとメンバーの複合取得
  getProjectWithMembers: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) =>
      withErrorHandling(async () => {
        const project = handleDALResult(
          await getRecord('projects', input.projectId, 'ID'),
          'プロジェクトが見つかりません'
        );

        const members = handleDALResult(
          await getProjectMembers(project.ID.toString()),
          'メンバー情報の取得に失敗しました'
        );

        return successResponse({ project, members });
      }, 'プロジェクト詳細の取得に失敗しました')
    ),
});
```

## ファイル命名規則

### ルーター関連
- **ルーター**: `[feature].ts` (例: `user.ts`, `post.ts`, `project.ts`)
- **メインルーター**: `_app.ts`
- **機能別サブルーター**: `app/[feature].ts`, `db/[feature].ts`

### フック関連
- **カスタムフック**: `use[Feature]Data.ts` (例: `useUserData.ts`, `usePostData.ts`)
- **ユーティリティフック**: `use[Utility].ts` (例: `useDebounce.ts`, `useLocalStorage.ts`)

### テスト関連
- **テストコンポーネント**: `[Feature]TRPCTest.tsx` (例: `UserTRPCTest.tsx`, `PostTRPCTest.tsx`)
- **テストページ**: `test-[feature]-trpc/page.tsx` (例: `test-user-trpc/page.tsx`)

### データアクセス層
- **特殊クエリ関数**: `[feature]Queries.ts` (例: `userQueries.ts`, `projectMemberQueries.ts`)
- **汎用CRUD関数**: `db_[function].ts` (例: `db_CRUD.ts`, `db_GetData.ts`)
- **接続関連**: `db_connection.ts`
- **高度な操作**: `db_advanced.ts`

### 型定義
- **機能別型**: `[feature].ts` (例: `user.ts`, `project.ts`)
- **API関連型**: `api.ts`
- **共通型**: `common.ts`

### コンポーネント
- **ページコンポーネント**: `page.tsx`, `[id]/page.tsx`
- **レイアウト**: `layout.tsx`
- **機能別コンポーネント**: `[Feature]Component.tsx` (例: `UserList.tsx`, `ProjectCard.tsx`)
- **UIコンポーネント**: `ui/[component].tsx`

### ユーティリティ
- **ヘルパー関数**: `helpers.ts`, `utils.ts`
- **定数**: `constants.ts`
- **設定**: `config.ts`

## 📋 パターン実装チェックリスト

- [ ] カスタムフックでロジックを集約しているか
- [ ] コンポーネントの関心をUIに集中させているか
- [ ] パフォーマンス最適化を実装しているか
- [ ] Zodスキーマで型安全性を確保しているか
- [ ] バリデーションが適切に実装されているか
- [ ] 機能別ルーターが適切に構造化されているか
- [ ] ファイル命名規則に従っているか
- [ ] テストファイルが適切に作成されているか
- [ ] エラーハンドリングが統一されているか
- [ ] コードの再利用性を考慮しているか
