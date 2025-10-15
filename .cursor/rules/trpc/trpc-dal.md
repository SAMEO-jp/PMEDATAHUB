---
alwaysApply: true
---
# trpc-dal.md

## このファイルについて
- **目的**: データベース操作の統一ルールとデータアクセス層の設計原則
- **読むべき人**: データベース操作を実装する開発者、DAL層の設計者
- **関連ファイル**: [trpc-core.md](./trpc-core.md), [trpc-error-handling.md](./trpc-error-handling.md)

## データアクセス層（DAL）の統一

### 📁 利用するファイル
以下のファイルを必ず利用する:
- `src/lib/db/db_advanced.ts`
- `src/lib/db/db_connection.ts`
- `src/lib/db/db_CRUD.ts`
- `src/lib/db/db_DeleteTable.ts`
- `src/lib/db/db_GetData.ts`

### 📂 データアクセス層の構造化
データアクセス層（DAL）は、以下の構造で整理すること:

#### フォルダ構成
```md
src/lib/db/
├── queries/              # 特殊なビジネスロジックを含むクエリ関数
│   ├── userQueries.ts         # ユーザー関連の特殊クエリ
│   ├── projectMemberQueries.ts # プロジェクトメンバー関連の特殊クエリ
│   └── [feature]Queries.ts     # 機能別の特殊クエリ
├── crud/                 # 汎用CRUD操作関数
│   ├── db_CRUD.ts
│   ├── db_GetData.ts
│   └── db_advanced.ts
├── connection/           # DB接続関連
│   └── db_connection.ts
└── [その他の汎用ファイル]
```

#### queries/フォルダに置くべき基準

✅ queries/に置くべきケース:
- 2つ以上のテーブルをJOINする
- 集計関数（SUM, COUNT, AVG等）を使用する
- GROUP BYやHAVINGを含む
- サブクエリを含む
- 3箇所以上から呼び出される処理
- ビジネスロジック固有の複雑な条件分岐を含む

❌ crud/に置くべきケース:
- 単一テーブルのSELECT/INSERT/UPDATE/DELETE
- WHERE句のみの単純な条件
- 1-2箇所からしか呼ばれない
- 汎用的なCRUD操作

📝 実例:
// ✅ queries/projectMemberQueries.ts に置く
export async function getProjectMembers(projectId: string) {
  return await db('PROJECT_MEMBER')
    .leftJoin('USER', 'PROJECT_MEMBER.USER_ID', 'USER.ID')
    .leftJoin('ROLE', 'PROJECT_MEMBER.ROLE_ID', 'ROLE.ID')
    .where('PROJECT_MEMBER.PROJECT_ID', projectId)
    .select('USER.NAME', 'ROLE.ROLE_NAME', ...);
}

// ❌ crud/db_CRUD.ts に置く
export async function getRecord<T>(table: string, id: number) {
  return await db(table).where('id', id).first();
}

#### 使用例
```typescript
// ✅ 良い例：汎用CRUD関数
import { getAllRecords, createRecord } from '../crud/db_CRUD';

// ✅ 良い例：特殊クエリ関数
import { getProjectMembers } from '../queries/projectMemberQueries';

// ❌ 避けるべき例：直接DB操作をtRPCルーターに記述
const result = await db.raw('SELECT * FROM users u LEFT JOIN projects p ON ...');
```

### 🔄 戻り値の統一フォーマット
DB アクセス関数（例: `getRecord()`, `updateById()` など）は、戻り値に必ず以下の構造を含める:

```typescript
// 成功時
{
  success: true,
  data: T
}

// 失敗時
{
  success: false,
  error: {
    code: string,
    message: string
  }
}
```

### 🚫 例外処理の方針
- DAL 側で `success: false` となった場合は**例外を投げない**
- 呼び出し元の tRPC プロシージャで `TRPCError` にマッピングして返却する

### 🔧 ORM使用時の注意
Prisma・Knex・TypeORM などの ORM を利用する場合も、「結果が取得できたか/できなかったか」の判定を行うユーティリティを必ず挟む。

#### 実装例:
```typescript
// src/lib/db/db_CRUD.ts
export async function getRecord<T>(table: string, id: number): Promise<DALResponse<T>> {
  try {
    const result = await db(table).where('id', id).first();

    if (!result) {
      return {
        success: false,
        error: {
          code: 'RECORD_NOT_FOUND',
          message: `Record with id ${id} not found in ${table}`
        }
      };
    }

    return {
      success: true,
      data: result as T
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown database error'
      }
    };
  }
}
```

### 🏗️ 型定義の統一

#### DALResponse型
```typescript
// types/api.ts
export type DALResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    code: string;
    message: string;
  };
};
```

#### 使用例
```typescript
import type { DALResponse } from '@src/types/api';

// DAL関数での使用
export async function getUserById(id: number): Promise<DALResponse<User>> {
  try {
    const user = await db('users').where('id', id).first();

    if (!user) {
      return {
        success: false,
        error: {
          code: 'RECORD_NOT_FOUND',
          message: `User with id ${id} not found`
        }
      };
    }

    return {
      success: true,
      data: user
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown database error'
      }
    };
  }
}
```

### 📋 DAL実装チェックリスト

- [ ] 指定されたDALファイルを正しく利用しているか
- [ ] フォルダ構造がqueries/crud/connectionで整理されているか
- [ ] 戻り値が統一されたフォーマットになっているか
- [ ] DAL側で例外を投げていないか
- [ ] ORM使用時に適切な判定ユーティリティを挟んでいるか
- [ ] 型定義が統一されているか
- [ ] 汎用関数と特殊クエリ関数が適切に分離されているか
- [ ] 複雑なJOINをtRPCルーター内に直接記述していないか

### 🚫 避けるべきパターン

```typescript
// ❌ DAL側で例外を投げる
export async function getUserById(id: number): Promise<User> {
  const user = await db('users').where('id', id).first();
  if (!user) {
    throw new Error('User not found'); // ❌ 避ける
  }
  return user;
}

// ❌ 統一されていない戻り値形式
export async function getUserById(id: number) {
  const user = await db('users').where('id', id).first();
  return user; // undefinedが返る可能性あり
}

// ❌ tRPCルーター内で直接DB操作
export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    // ❌ 直接DB操作
    const users = await db('users').select('*');
    return { success: true, data: users };
  }),
});
```

### ✅ 推奨パターン

```typescript
// ✅ DAL関数
export async function getUserById(id: number): Promise<DALResponse<User>> {
  try {
    const user = await db('users').where('id', id).first();

    if (!user) {
      return {
        success: false,
        error: {
          code: 'RECORD_NOT_FOUND',
          message: `User with id ${id} not found`
        }
      };
    }

    return {
      success: true,
      data: user
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown database error'
      }
    };
  }
}

// ✅ tRPCルーターでの使用
export const userRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await getUserById(input.id);

      if (!result.success) {
        throw new TRPCError({
          code: result.error.code === 'RECORD_NOT_FOUND' ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
          message: result.error.message
        });
      }

      return { success: true, data: result.data };
    }),
});
```
