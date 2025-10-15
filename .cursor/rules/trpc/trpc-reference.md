---
alwaysApply: false
---
# trpc-reference.md

## このファイルについて
- **目的**: 即座に参照できるチートシートとクイックリファレンス
- **読むべき人**: 実装中にすぐに確認したい開発者、トラブルシューティング中の開発者
- **関連ファイル**: [trpc-core.md](./trpc-core.md), [trpc-dal.md](./trpc-dal.md), [trpc-error-handling.md](./trpc-error-handling.md), [trpc-patterns.md](./trpc-patterns.md)

## 📋 実装チェックリスト

### 基本セットアップ
- [ ] `lib/trpc/trpc.ts` が正しく初期化されているか
- [ ] `lib/trpc/client.ts` がcreateTRPCReactを使用しているか
- [ ] `lib/trpc/Provider.tsx` が手動で設定されているか
- [ ] `app/layout.tsx` でTRPCProviderが配置されているか
- [ ] 環境変数が型安全にアクセスされているか
- [ ] TypeScriptのstrictモードが有効か

### データアクセス層
- [ ] 指定されたDALファイルを正しく利用しているか
- [ ] フォルダ構造がqueries/crud/connectionで整理されているか
- [ ] 戻り値が統一されたフォーマットになっているか
- [ ] DAL側で例外を投げていないか
- [ ] ORM使用時に適切な判定ユーティリティを挟んでいるか
- [ ] 型定義が統一されているか
- [ ] 汎用関数と特殊クエリ関数が適切に分離されているか
- [ ] 複雑なJOINをtRPCルーター内に直接記述していないか

### エラーハンドリング
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

### パターン実装
- [ ] カスタムフックでロジックを集約しているか
- [ ] コンポーネントの関心をUIに集中させているか
- [ ] パフォーマンス最適化を実装しているか
- [ ] Zodスキーマで型安全性を確保しているか
- [ ] バリデーションが適切に実装されているか
- [ ] 機能別ルーターが適切に構造化されているか
- [ ] ファイル命名規則に従っているか
- [ ] テストファイルが適切に作成されているか
- [ ] コードの再利用性を考慮しているか

## 🚫 避けるべきパターン一覧

### データアクセス層
- ❌ DAL層で例外を投げる
- ❌ 統一されていないレスポンス形式
- ❌ 適切でないエラーハンドリング
- ❌ 型安全性を無視した実装
- ❌ 不適切なログ出力
- ❌ バリデーションを省略する
- ❌ DAL層の関数を直接呼び出さない
- ❌ エラーコードを統一しない

### クライアント/サーバー設定
- ❌ transformerをcreateClientの直接オプションに指定する
- ❌ 機能別ルーターをHTTPハンドラーと同じディレクトリに配置する
- ❌ process.envを直接使用する
- ❌ 汎用関数と特殊クエリ関数を同じ階層に混在させる
- ❌ 複雑なJOINをtRPCルーター内に直接記述する

### コンポーネント設計
- ❌ tRPCのデータ操作をコンポーネントに直接記述
- ❌ 再利用性の低いロジック
- ❌ パフォーマンスを考慮しないクエリ
- ❌ 型安全性を無視した実装
- ❌ 適切でないエラーハンドリング

## ✅ 推奨パターン一覧

### 基本構造
```typescript
// ✅ 良い例：DAL関数
export async function getUserById(id: number): Promise<DALResponse<User>> {
  try {
    const user = await db('users').where('id', id).first();
    if (!user) {
      return {
        success: false,
        error: { code: 'RECORD_NOT_FOUND', message: `User not found` }
      };
    }
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: { code: 'DATABASE_ERROR', message: error.message }
    };
  }
}

// ✅ 良い例：tRPCルーター
export const userRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const data = handleDALResult(await getUserById(input.id));
      return successResponse(data);
    }),
});
```

### フック集約
```typescript
// ✅ 良い例：カスタムフック
export const useUserMutations = () => {
  const utils = trpc.useUtils();

  const createMutation = trpc.user.create.useMutation({
    onSuccess: () => void utils.user.getAll.invalidate(),
  });

  return { createMutation };
};
```

### エラーハンドリング
```typescript
// ✅ 良い例：ヘルパー使用
getById: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const data = handleDALResult(await getRecord('users', input.id));
    return successResponse(data);
  }),

// ✅ 良い例：複雑な処理
complexOperation: publicProcedure
  .mutation(async () =>
    withErrorHandling(async () => {
      const user = handleDALResult(await getRecord('users', 1));
      const profile = handleDALResult(await getRecord('profiles', 1));
      return successResponse({ user, profile });
    })
  ),
```

## エラーコード一覧

### tRPC標準エラーコード
- `BAD_REQUEST`: リクエストの形式が不正（400）
- `UNAUTHORIZED`: 認証が必要（401）
- `FORBIDDEN`: アクセス権限なし（403）
- `NOT_FOUND`: リソースが見つからない（404）
- `INTERNAL_SERVER_ERROR`: サーバー内部エラー（500）

### DALエラーコード → tRPCマッピング
| DAL Error Code | tRPC Error Code | 説明 |
|----------------|------------------|------|
| `RECORD_NOT_FOUND` | `NOT_FOUND` | レコードが見つからない |
| `VALIDATION_ERROR` | `BAD_REQUEST` | バリデーションエラー |
| `UNAUTHORIZED` | `UNAUTHORIZED` | 認証が必要 |
| `FORBIDDEN` | `FORBIDDEN` | アクセス権限なし |
| その他 | `INTERNAL_SERVER_ERROR` | サーバー内部エラー |

### ビジネスロジックエラー
- `DUPLICATE_ENTRY`: 重複エラー
- `VALIDATION_FAILED`: バリデーション失敗
- `PERMISSION_DENIED`: 権限不足
- `RESOURCE_CONFLICT`: リソース競合

## よく使うヘルパー関数

### lib/trpc/helpers.ts
```typescript
// DAL結果をtRPCレスポンスに変換
handleDALResult<T>(result: DALResponse<T>, errorMessage?: string): T

// エラーハンドリングラッパー
withErrorHandling<T>(fn: () => Promise<T>, errorMessage?: string): Promise<T>

// エラーコードマッピング
mapDALErrorToTRPC(dalErrorCode?: string): TRPCErrorCode

// 成功レスポンス作成
successResponse<T>(data: T): { success: true; data: T }

// カスタムエラー投げ
throwTRPCError(code: TRPCErrorCode, message: string): never
```

### 使用例
```typescript
// シンプルな使用
const data = handleDALResult(await getRecord('users', id));
return successResponse(data);

// 複雑な処理
return withErrorHandling(async () => {
  const user = handleDALResult(await getRecord('users', id));
  const profile = handleDALResult(await getRecord('profiles', id));
  return successResponse({ user, profile });
});

// エラーハンドリング
if (user.role !== 'admin') {
  throwTRPCError('FORBIDDEN', '管理者権限が必要です');
}
```

## ファイル命名規則クイックガイド

### 📁 ディレクトリ構造
```
src/
├── app/
│   ├── api/trpc/[trpc]/route.ts     # HTTPハンドラー
│   └── layout.tsx                   # TRPCProvider配置
├── lib/
│   ├── trpc/
│   │   ├── trpc.ts                  # 初期化
│   │   ├── client.ts                # createTRPCReact
│   │   ├── Provider.tsx             # 手動Provider
│   │   ├── helpers.ts               # ヘルパー関数
│   │   └── routers/
│   │       ├── _app.ts              # メインルーター
│   │       ├── [feature].ts         # 機能別ルーター
│   │       └── db/[feature].ts      # DBルーター
│   ├── db/
│   │   ├── crud/db_CRUD.ts          # 汎用CRUD
│   │   ├── queries/[feature].ts     # 特殊クエリ
│   │   └── db_connection.ts         # 接続
│   └── env.ts                       # 環境変数
├── hooks/
│   └── use[Feature]Data.ts          # カスタムフック
└── types/
    ├── [feature].ts                 # 機能別型
    └── api.ts                       # API関連型
```

### 📝 命名規則
| 種類 | パターン | 例 |
|------|----------|-----|
| ルーター | `[feature].ts` | `user.ts`, `project.ts` |
| カスタムフック | `use[Feature]Data.ts` | `useUserData.ts` |
| テストページ | `test-[feature]-trpc/page.tsx` | `test-user-trpc/page.tsx` |
| 特殊クエリ | `[feature]Queries.ts` | `userQueries.ts` |
| 型定義 | `[feature].ts` | `user.ts`, `project.ts` |
| コンポーネント | `[Feature]Component.tsx` | `UserList.tsx` |

## 一般的な問題と解決法

### 🔍 よくある問題

#### 1. 型エラーが発生する
```typescript
// ❌ 問題：型が合わない
const result = await getRecord('users', id);
return result.data; // 型エラーが発生

// ✅ 解決：handleDALResultを使用
const data = handleDALResult(await getRecord('users', id));
return successResponse(data);
```

#### 2. エラーハンドリングが冗長
```typescript
// ❌ 問題：重複コードが多い
getById: publicProcedure.query(async ({ input }) => {
  try {
    const result = await getRecord('users', input.id);
    if (!result.success) {
      throw new TRPCError({ code: 'NOT_FOUND', message: '...' });
    }
    return { success: true, data: result.data };
  } catch (error) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '...' });
  }
}),

// ✅ 解決：ヘルパー関数を使用
getById: publicProcedure.query(async ({ input }) => {
  const data = handleDALResult(await getRecord('users', input.id));
  return successResponse(data);
}),
```

#### 3. パフォーマンスが悪い
```typescript
// ❌ 問題：不要な再フェッチ
const { data } = trpc.user.getAll.useQuery();

// ✅ 解決：キャッシュ設定
const { data } = trpc.user.getAll.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // 5分
});
```

#### 4. コンポーネントが複雑
```typescript
// ❌ 問題：ロジックが散らばる
function UserComponent() {
  const { data, isLoading } = trpc.user.getAll.useQuery();
  const createMutation = trpc.user.create.useMutation({
    onSuccess: () => {/* 再フェッチ */},
  });
  // ... ロジックが散らばる
}

// ✅ 解決：カスタムフックを使用
function UserComponent() {
  const { data, isLoading } = trpc.user.getAll.useQuery();
  const { createMutation } = useUserMutations();
  // UIに集中できる
}
```

## その他のリソース

### 📚 公式ドキュメント
- [tRPC公式ドキュメント](mdc:https:/trpc.io/docs)
- [React Query公式ドキュメント](mdc:https:/tanstack.com/query/latest)
- [Zod公式ドキュメント](mdc:https:/zod.dev)

### 🛠️ ツール・ライブラリ
- **tRPC v11**: エンドツーエンド型安全API
- **@tanstack/react-query v5**: データフェッチング
- **Zod**: TypeScriptファーストスキーマバリデーション
- **SQLite**: 軽量データベース（開発用）

### 🔧 バージョン要件
- TypeScript >= 5.7.2
- @trpc/react-query >= 11.4.3
- @tanstack/react-query >= 5.81.5
- 厳密なTypeScriptモード（`"strict": true`）

### 📞 サポート
- **Slack**: [tRPCコミュニティ](https://trpc.io/discord)
- **GitHub**: [tRPCリポジトリ](https://github.com/trpc/trpc)
- **Issues**: バグ報告・機能リクエスト

---

## 🎯 クイックスタート

新規プロジェクトでtRPCを導入する場合：

1. **基本セットアップ**: [trpc-core.md](./trpc-core.md) を参照
2. **データアクセス**: [trpc-dal.md](./trpc-dal.md) でDAL層を構築
3. **エラーハンドリング**: [trpc-error-handling.md](./trpc-error-handling.md) を実装
4. **実装パターン**: [trpc-patterns.md](./trpc-patterns.md) で開発開始
5. **テスト**: [trpc-testing.md](./trpc-testing.md) でテストを書く

既存プロジェクトで改善する場合：

1. **チェックリスト**を確認して問題点を特定
2. **避けるべきパターン**を修正
3. **推奨パターン**を適用
4. **ヘルパー関数**を導入して簡略化
5. **テストを追加**: [trpc-testing.md](./trpc-testing.md) を参考に
