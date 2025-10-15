---
alwaysApply: true
---
# trpc-error-handling.md

## このファイルについて
- **目的**: エラー処理の統一とヘルパー関数による簡略化
- **読むべき人**: tRPC APIを実装する開発者、エラーハンドリングを改善したい開発者
- **関連ファイル**: [trpc-core.md](./trpc-core.md), [trpc-dal.md](./trpc-dal.md), [trpc-patterns.md](./trpc-patterns.md)

## ヘルパー関数による統一的なエラー処理

### helpers.ts の実装

```typescript
// lib/trpc/helpers.ts
import { TRPCError } from '@trpc/server';
import type { DALResponse } from '@src/types/api';

/**
 * DAL層のレスポンスをtRPCレスポンスに変換するヘルパー関数
 * @param result DAL層からの戻り値
 * @param errorMessage エラー時のメッセージ（省略可）
 * @returns 成功時は data を返す
 * @throws TRPCError エラー時
 */
export function handleDALResult<T>(
  result: DALResponse<T>,
  errorMessage?: string
): T {
  if (!result.success) {
    throw new TRPCError({
      code: result.error?.code === 'RECORD_NOT_FOUND' ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
      message: errorMessage || result.error?.message || 'データの操作に失敗しました',
    });
  }
  return result.data as T;
}

/**
 * 汎用的なエラーハンドリングラッパー
 * @param fn 実行する非同期関数
 * @param errorMessage エラー時のメッセージ
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'データの操作に失敗しました'
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // 既にTRPCErrorの場合はそのまま再スロー
    if (error instanceof TRPCError) {
      throw error;
    }

    // その他のエラーは汎用エラーに変換
    console.error('Unexpected error:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage,
    });
  }
}

/**
 * DALエラーコードをtRPCエラーコードにマッピング
 */
export function mapDALErrorToTRPC(dalErrorCode?: string): 'BAD_REQUEST' | 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR' {
  switch (dalErrorCode) {
    case 'RECORD_NOT_FOUND':
      return 'NOT_FOUND';
    case 'VALIDATION_ERROR':
      return 'BAD_REQUEST';
    default:
      return 'INTERNAL_SERVER_ERROR';
  }
}

/**
 * 成功レスポンスを作成するヘルパー
 */
export function successResponse<T>(data: T) {
  return { success: true as const, data };
}

/**
 * カスタムTRPCエラーを投げるヘルパー
 */
export function throwTRPCError(
  code: 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR',
  message: string
): never {
  throw new TRPCError({ code, message });
}
```

## tRPCルーターでの使用パターン

### 基本的なCRUD操作

```typescript
// lib/trpc/routers/user.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { handleDALResult, successResponse } from '../helpers';
import {
  getAllRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord
} from '@src/lib/db/db_CRUD';

export const userRouter = createTRPCRouter({
  // ✅ Before: 15行 → After: 3行
  getAll: publicProcedure.query(async () => {
    const data = handleDALResult(await getAllRecords('users'), 'ユーザー一覧の取得に失敗しました');
    return successResponse(data);
  }),

  // ✅ Before: 20行 → After: 5行
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const data = handleDALResult(
        await getRecord('users', input.id),
        'ユーザーが見つかりません'
      );
      return successResponse(data);
    }),

  // ✅ 検索（オプショナルフィルター対応）
  search: publicProcedure
    .input(z.object({
      name: z.string().optional(),
      email: z.string().optional(),
    }))
    .query(async ({ input }) => {
      // queries/配下の特殊クエリ関数を使う想定
      const { searchUsers } = await import('@src/lib/db/queries/userQueries');
      const data = handleDALResult(
        await searchUsers(input),
        '検索に失敗しました'
      );
      return successResponse(data);
    }),

  // ✅ 作成
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1, '名前は必須です'),
      email: z.string().email('有効なメールアドレスを入力してください'),
      age: z.number().min(0, '年齢は0以上である必要があります'),
    }))
    .mutation(async ({ input }) => {
      const data = handleDALResult(
        await createRecord('users', input),
        'ユーザーの作成に失敗しました'
      );
      return successResponse(data);
    }),

  // ✅ 更新
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        age: z.number().min(0).optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      const data = handleDALResult(
        await updateRecord('users', input.id, input.data),
        'ユーザーの更新に失敗しました'
      );
      return successResponse(data);
    }),

  // ✅ 削除
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const data = handleDALResult(
        await deleteRecord('users', input.id),
        'ユーザーの削除に失敗しました'
      );
      return successResponse(data);
    }),
});
```

### 複数のDAL操作を含む複雑な処理

```typescript
// lib/trpc/routers/project.ts
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { handleDALResult, successResponse, withErrorHandling } from '../helpers';
import { getRecord, updateRecord } from '@src/lib/db/db_CRUD';
import { getProjectMembers } from '@src/lib/db/queries/projectMemberQueries';

export const projectRouter = createTRPCRouter({
  // ✅ 複数のDAL操作を伴う複雑な操作
  getProjectWithMembers: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) =>
      withErrorHandling(async () => {
        // 複数のDAL操作を順次実行
        const project = handleDALResult(
          await getRecord('projects', input.projectId),
          'プロジェクトが見つかりません'
        );

        const members = handleDALResult(
          await getProjectMembers(input.projectId),
          'メンバー情報の取得に失敗しました'
        );

        return successResponse({ project, members });
      }, 'プロジェクト詳細の取得に失敗しました')
    ),

  // ✅ トランザクション的な操作（複数更新）
  updateProjectAndNotify: publicProcedure
    .input(z.object({
      projectId: z.number(),
      updates: z.object({
        name: z.string().optional(),
        status: z.enum(['active', 'completed', 'archived']).optional(),
      }),
      notifyMembers: z.boolean().default(false),
    }))
    .mutation(async ({ input }) =>
      withErrorHandling(async () => {
        // プロジェクト更新
        const updatedProject = handleDALResult(
          await updateRecord('projects', input.projectId, input.updates),
          'プロジェクトの更新に失敗しました'
        );

        // 通知が必要な場合
        if (input.notifyMembers) {
          const members = handleDALResult(
            await getProjectMembers(input.projectId),
            'メンバー情報の取得に失敗しました'
          );

          // 通知ロジック（簡略化）
          // await sendNotifications(members);
        }

        return successResponse(updatedProject);
      }, 'プロジェクトの更新処理に失敗しました')
    ),
});
```

### ビジネスロジックによるバリデーション

```typescript
// lib/trpc/routers/restricted.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { handleDALResult, successResponse, throwTRPCError } from '../helpers';
import { getRecord, deleteRecord } from '@src/lib/db/db_CRUD';

export const restrictedRouter = createTRPCRouter({
  deleteUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // ビジネスロジックによるバリデーション
      const user = handleDALResult(
        await getRecord('users', input.id),
        'ユーザーが見つかりません'
      );

      if (user.role === 'admin') {
        throwTRPCError('FORBIDDEN', '管理者ユーザーは削除できません');
      }

      const result = handleDALResult(
        await deleteRecord('users', input.id),
        'ユーザーの削除に失敗しました'
      );

      return successResponse(result);
    }),
});
```

## エラーハンドリングのパターン選択

### パターン1: シンプルなDAL操作（推奨）

```typescript
// 最も一般的なパターン
getById: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const data = handleDALResult(await getRecord('users', input.id));
    return successResponse(data);
  }),
```

### パターン2: カスタムエラーメッセージ

```typescript
// エラーメッセージをカスタマイズする場合
getById: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const data = handleDALResult(
      await getRecord('users', input.id),
      '指定されたユーザーが見つかりません'
    );
    return successResponse(data);
  }),
```

### パターン3: 複数操作を含む複雑な処理

```typescript
// withErrorHandlingを使用
complexOperation: publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) =>
    withErrorHandling(async () => {
      const user = handleDALResult(await getRecord('users', input.id));
      const profile = handleDALResult(await getRecord('profiles', input.id));

      // 何らかの処理
      const result = await processUserAndProfile(user, profile);

      return successResponse(result);
    }, 'ユーザーとプロフィールの処理に失敗しました')
  ),
```

### パターン4: ビジネスロジックバリデーション

```typescript
// 条件分岐によるエラー
createAdmin: publicProcedure
  .input(z.object({ userId: z.number(), adminLevel: z.number() }))
  .mutation(async ({ input }) => {
    const user = handleDALResult(await getRecord('users', input.userId));

    if (user.role !== 'premium') {
      throwTRPCError('FORBIDDEN', 'プレミアムユーザーのみ管理者になれます');
    }

    if (input.adminLevel > 10) {
      throwTRPCError('BAD_REQUEST', '管理者レベルは10以下である必要があります');
    }

    const result = handleDALResult(
      await createRecord('admins', { userId: input.userId, level: input.adminLevel })
    );

    return successResponse(result);
  }),
```

## 統一されたレスポンス形式

### 成功レスポンス
```typescript
{
  success: true,
  data: T,
  message?: string  // オプション
}
```

### エラーレスポンス
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

## エラーコードのマッピング

### DALエラーコード → tRPCエラーコード

| DAL Error Code | tRPC Error Code | 説明 |
|----------------|------------------|------|
| `RECORD_NOT_FOUND` | `NOT_FOUND` | レコードが見つからない |
| `VALIDATION_ERROR` | `BAD_REQUEST` | バリデーションエラー |
| `UNAUTHORIZED` | `UNAUTHORIZED` | 認証が必要 |
| `FORBIDDEN` | `FORBIDDEN` | アクセス権限なし |
| その他 | `INTERNAL_SERVER_ERROR` | サーバー内部エラー |

### 標準tRPCエラーコード

- `BAD_REQUEST`: リクエストの形式が不正（400）
- `UNAUTHORIZED`: 認証が必要（401）
- `FORBIDDEN`: アクセス権限なし（403）
- `NOT_FOUND`: リソースが見つからない（404）
- `INTERNAL_SERVER_ERROR`: サーバー内部エラー（500）

## 📊 ビフォー・アフター比較

### Before（従来のパターン）
```typescript
getById: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    try {
      const result = await getRecord('users', input.id);

      if (!result.success) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: result.error?.message || 'ユーザーが見つかりません',
        });
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error("tRPC project.getById error:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'データの取得に失敗しました',
      });
    }
  }),
```
**コード行数: 20行**

### After（簡略化パターン）
```typescript
getById: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const data = handleDALResult(
      await getRecord('users', input.id),
      'ユーザーが見つかりません'
    );
    return successResponse(data);
  }),
```
**コード行数: 7行（65%削減）**

## 🚫 避けるべきパターン

```typescript
// ❌ 直接TRPCErrorを使用
export const badRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const result = await getRecord('users', input.id);
        if (!result.success) {
          throw new TRPCError({ // ❌ 直接使用
            code: 'NOT_FOUND',
            message: result.error?.message || 'ユーザーが見つかりません',
          });
        }
        return { success: true, data: result.data };
      } catch (error) {
        throw new TRPCError({ // ❌ 直接使用
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの取得に失敗しました',
        });
      }
    }),
});

// ❌ 一貫性のないエラーハンドリング
export const inconsistentRouter = createTRPCRouter({
  getById: publicProcedure
    .query(async () => {
      const result = await getRecord('users', 1);
      if (!result.success) {
        return { error: 'Not found' }; // ❌ 一貫性なし
      }
      return result.data; // ❌ 形式が異なる
    }),
});

// ❌ コンソールログの多用
export const verboseRouter = createTRPCRouter({
  getById: publicProcedure
    .query(async () => {
      console.log('Starting getById'); // ❌ 不要なログ
      const result = await getRecord('users', 1);
      console.log('DAL result:', result); // ❌ 詳細ログ
      if (!result.success) {
        console.error('Error occurred:', result.error); // ❌ エラーログ
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      console.log('Success, returning data'); // ❌ 成功ログ
      return successResponse(result.data);
    }),
});
```

## ✅ 推奨パターン

```typescript
// ✅ ヘルパー関数を使用
export const goodRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const data = handleDALResult(await getRecord('users', input.id));
      return successResponse(data);
    }),

  // ✅ 複雑な処理にはwithErrorHandling
  complexOperation: publicProcedure
    .mutation(async () =>
      withErrorHandling(async () => {
        const user = handleDALResult(await getRecord('users', 1));
        const profile = handleDALResult(await getRecord('profiles', 1));
        return successResponse({ user, profile });
      })
    ),

  // ✅ ビジネスロジックバリデーション
  createAdmin: publicProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const user = handleDALResult(await getRecord('users', input.userId));

      if (user.role !== 'premium') {
        throwTRPCError('FORBIDDEN', 'プレミアムユーザーのみ管理者になれます');
      }

      const result = handleDALResult(await createRecord('admins', { userId: input.userId }));
      return successResponse(result);
    }),
});
```

## 📋 エラーハンドリング実装チェックリスト

- [ ] `lib/trpc/helpers.ts` が作成されているか
- [ ] `handleDALResult` 関数が適切に使用されているか
- [ ] `successResponse` 関数でレスポンスを統一しているか
- [ ] 複雑な処理には `withErrorHandling` を使用しているか
- [ ] ビジネスロジックバリデーションには `throwTRPCError` を使用しているか
- [ ] 直接 `TRPCError` を使用していないか
- [ ] エラーメッセージがユーザーフレンドリーか
- [ ] コンソールログの出力が最小限か
- [ ] エラーコードのマッピングが適切か
- [ ] レスポンス形式が統一されているか
