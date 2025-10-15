---
alwaysApply: false
---
# trpc-testing.md

## このファイルについて
- **目的**: tRPCルーターのテスト戦略と実装例
- **読むべき人**: tRPC APIのテストを書く開発者
- **関連ファイル**: [trpc-core.md](./trpc-core.md), [trpc-dal.md](./trpc-dal.md), [trpc-error-handling.md](./trpc-error-handling.md), [trpc-patterns.md](./trpc-patterns.md)

## tRPCルーターのテスト戦略

### テストの種類
1. **ユニットテスト**: 個々のプロシージャのロジックをテスト
2. **統合テスト**: 複数のプロシージャや外部依存関係を含むテスト
3. **E2Eテスト**: 実際のHTTPリクエストを通じたテスト

### 推奨テストツール
- **Vitest**: 高速でTypeScript対応のテストランナー
- **@trpc/server**: tRPCのテストユーティリティ

## ユニットテスト例

### 基本的なテストセットアップ
```typescript
// __tests__/userRouter.test.ts
import { appRouter } from '../lib/trpc/routers/_app';
import { createInnerTRPCContext } from '../lib/trpc/trpc';
import type { AppRouter } from '../lib/trpc/routers/_app';

describe('userRouter', () => {
  let ctx: ReturnType<typeof createInnerTRPCContext>;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    ctx = createInnerTRPCContext({
      headers: new Headers(),
      // モックされたセッション情報
      session: { user: { id: 1, role: 'user' } }
    });
    caller = appRouter.createCaller(ctx);
  });

  it('should get user by id', async () => {
    const result = await caller.user.getById({ id: 1 });

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('id', 1);
  });

  it('should throw error for non-existent user', async () => {
    await expect(
      caller.user.getById({ id: 999 })
    ).rejects.toThrow('ユーザーが見つかりません');
  });
});
```

### モックを使用したテスト
```typescript
// データベース操作をモック化
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { appRouter } from '../lib/trpc/routers/_app';

const mockGetRecord = vi.fn();
vi.mock('../lib/db/db_CRUD', () => ({
  getRecord: mockGetRecord
}));

describe('userRouter with mocks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user data on success', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    mockGetRecord.mockResolvedValue({
      success: true,
      data: mockUser
    });

    const ctx = createInnerTRPCContext({ headers: new Headers() });
    const caller = appRouter.createCaller(ctx);

    const result = await caller.user.getById({ id: 1 });

    expect(result.success).toBe(true);
    expect(result.data).toBe(mockUser);
    expect(mockGetRecord).toHaveBeenCalledWith('users', 1);
  });

  it('should handle database errors', async () => {
    mockGetRecord.mockResolvedValue({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Connection failed' }
    });

    const ctx = createInnerTRPCContext({ headers: new Headers() });
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.user.getById({ id: 1 })
    ).rejects.toThrow('Connection failed');
  });
});
```

### 認証・認可のテスト
```typescript
describe('authentication and authorization', () => {
  it('should allow access for authenticated user', async () => {
    const ctx = createInnerTRPCContext({
      headers: new Headers(),
      session: { user: { id: 1, role: 'user' } }
    });
    const caller = appRouter.createCaller(ctx);

    const result = await caller.user.getProfile();

    expect(result.success).toBe(true);
  });

  it('should deny access for unauthenticated user', async () => {
    const ctx = createInnerTRPCContext({
      headers: new Headers(),
      session: null // 認証なし
    });
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.user.getProfile()
    ).rejects.toThrow('UNAUTHORIZED');
  });

  it('should allow admin operations for admin user', async () => {
    const ctx = createInnerTRPCContext({
      headers: new Headers(),
      session: { user: { id: 1, role: 'admin' } }
    });
    const caller = appRouter.createCaller(ctx);

    const result = await caller.user.deleteUser({ id: 2 });

    expect(result.success).toBe(true);
  });

  it('should deny admin operations for regular user', async () => {
    const ctx = createInnerTRPCContext({
      headers: new Headers(),
      session: { user: { id: 1, role: 'user' } } // 管理者権限なし
    });
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.user.deleteUser({ id: 2 })
    ).rejects.toThrow('FORBIDDEN');
  });
});
```

### バリデーションのテスト
```typescript
describe('input validation', () => {
  it('should accept valid input', async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers() });
    const caller = appRouter.createCaller(ctx);

    const validInput = {
      name: 'Valid Name',
      email: 'valid@example.com',
      age: 25
    };

    const result = await caller.user.create(validInput);

    expect(result.success).toBe(true);
  });

  it('should reject invalid email', async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers() });
    const caller = appRouter.createCaller(ctx);

    const invalidInput = {
      name: 'Valid Name',
      email: 'invalid-email', // 無効なメールアドレス
      age: 25
    };

    await expect(
      caller.user.create(invalidInput)
    ).rejects.toThrow(); // Zodバリデーションエラー
  });

  it('should reject negative age', async () => {
    const ctx = createInnerTRPCContext({ headers: new Headers() });
    const caller = appRouter.createCaller(ctx);

    const invalidInput = {
      name: 'Valid Name',
      email: 'valid@example.com',
      age: -5 // 無効な年齢
    };

    await expect(
      caller.user.create(invalidInput)
    ).rejects.toThrow('年齢は0以上である必要があります');
  });
});
```

### ページネーションのテスト
```typescript
describe('pagination', () => {
  it('should return paginated results', async () => {
    const mockUsers = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' }
    ];

    mockGetAllRecords.mockResolvedValue({
      success: true,
      data: mockUsers
    });

    const ctx = createInnerTRPCContext({ headers: new Headers() });
    const caller = appRouter.createCaller(ctx);

    const result = await caller.user.getList({
      limit: 2,
      cursor: 0
    });

    expect(result.success).toBe(true);
    expect(result.data.items).toHaveLength(2);
    expect(result.data.nextCursor).toBe(3);
  });

  it('should handle cursor-based pagination', async () => {
    const mockUsers = [
      { id: 3, name: 'User 3' },
      { id: 4, name: 'User 4' }
    ];

    mockGetAllRecords.mockResolvedValue({
      success: true,
      data: mockUsers
    });

    const ctx = createInnerTRPCContext({ headers: new Headers() });
    const caller = appRouter.createCaller(ctx);

    const result = await caller.user.getList({
      limit: 2,
      cursor: 2 // ID 2より後のデータを取得
    });

    expect(result.success).toBe(true);
    expect(result.data.items[0].id).toBeGreaterThan(2);
  });
});
```

## テストユーティリティ

### 共通のテストヘルパー
```typescript
// __tests__/testUtils.ts
import { createInnerTRPCContext } from '../lib/trpc/trpc';
import { appRouter } from '../lib/trpc/routers/_app';

export function createTestCaller(session?: any) {
  const ctx = createInnerTRPCContext({
    headers: new Headers(),
    session: session || null
  });
  return appRouter.createCaller(ctx);
}

export function createAuthenticatedCaller(user = { id: 1, role: 'user' }) {
  return createTestCaller({ user });
}

export function createAdminCaller() {
  return createTestCaller({ user: { id: 1, role: 'admin' } });
}

// 成功レスポンスの検証ヘルパー
export function expectSuccessResponse<T>(result: any): asserts result is { success: true; data: T } {
  expect(result.success).toBe(true);
  expect(result).toHaveProperty('data');
}

// エラーレスポンスの検証ヘルパー
export function expectErrorResponse(result: any): asserts result is { success: false; error: { code: string; message: string } } {
  expect(result.success).toBe(false);
  expect(result).toHaveProperty('error');
  expect(result.error).toHaveProperty('code');
  expect(result.error).toHaveProperty('message');
}
```

### 使用例
```typescript
describe('userRouter with helpers', () => {
  it('should work with authenticated user', async () => {
    const caller = createAuthenticatedCaller();

    const result = await caller.user.getProfile();
    expectSuccessResponse(result);
    expect(result.data.id).toBe(1);
  });

  it('should reject unauthenticated access', async () => {
    const caller = createTestCaller();

    await expect(
      caller.user.getProfile()
    ).rejects.toThrow('UNAUTHORIZED');
  });
});
```

## テスト実行と設定

### Vitest設定
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### テストセットアップファイル
```typescript
// src/__tests__/setup.ts
import { vi } from 'vitest';

// グローバルなテスト設定
vi.mock('../lib/db/db_CRUD');
vi.mock('../lib/db/queries/userQueries');

// データベースモックのデフォルト動作
import { getRecord, getAllRecords } from '../lib/db/db_CRUD';
vi.mocked(getRecord).mockResolvedValue({
  success: false,
  error: { code: 'RECORD_NOT_FOUND', message: 'Not found' }
});

vi.mocked(getAllRecords).mockResolvedValue({
  success: true,
  data: []
});
```

### テストスクリプト
```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## 📋 テスト実装チェックリスト

- [ ] 各プロシージャの正常系テストを実装しているか
- [ ] エラーケースのテストを実装しているか
- [ ] 認証・認可のテストを実装しているか
- [ ] 入力バリデーションのテストを実装しているか
- [ ] ページネーションのテストを実装しているか
- [ ] データベース操作のモック化が適切か
- [ ] テストヘルパーを活用しているか
- [ ] テストカバレッジが十分か（最低70%以上を目安）
- [ ] CI/CDでテストが実行される設定になっているか
