---
alwaysApply: false
---
# types-patterns.md

## このファイルについて
- **目的**: 型定義とZodスキーマの実装パターン集
- **読むべき人**: より高度な実装が必要な開発者
- **関連ファイル**: [types-core.md](./types-core.md), [types-organization.md](./types-organization.md)

## 🎨 Zodスキーマのパターン

### パターン1: 基本的なスキーマ定義

```typescript
// types/entities/user.ts
import { z } from 'zod';

export interface User {
  id: number;
  email: string;
  name: string;
  age?: number;
  role: 'admin' | 'user';
  created_at: Date;
}

export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email('有効なメールアドレスを入力してください'),
  name: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内です'),
  age: z.number().int().min(0, '年齢は0以上です').max(150, '年齢は150以下です').optional(),
  role: z.enum(['admin', 'user']),
  created_at: z.date(),
});
```

### パターン2: 条件付きバリデーション

```typescript
// types/modules/project/form.ts
import { z } from 'zod';

export const ProjectFormSchema = z.object({
  プロジェクト名: z.string().min(1, 'プロジェクト名は必須です'),
  プロジェクト開始日: z.string().optional(),
  プロジェクト終了日: z.string().optional(),
  プロジェクトステータスID: z.number().int().optional(),
}).refine((data) => {
  // 条件付きバリデーション: 終了日は開始日より後
  if (data.プロジェクト開始日 && data.プロジェクト終了日) {
    return new Date(data.プロジェクト開始日) < new Date(data.プロジェクト終了日);
  }
  return true;
}, {
  message: '終了日は開始日より後である必要があります',
  path: ['プロジェクト終了日'],  // エラーを特定のフィールドに紐付け
});
```

### パターン3: 複雑なバリデーション

```typescript
// types/modules/bom/form.ts
import { z } from 'zod';

export const BomFormSchema = z.object({
  bom_name: z.string().min(1, 'BOM名は必須です'),
  buhin_list: z.array(z.object({
    buhin_code: z.string().min(1, '部品コードは必須です'),
    quantity: z.number().min(1, '数量は1以上です'),
  })).min(1, '少なくとも1つの部品を追加してください'),
  total_budget: z.number().optional(),
}).refine((data) => {
  // 複雑なバリデーション: 重複チェック
  const codes = data.buhin_list.map(item => item.buhin_code);
  const uniqueCodes = new Set(codes);
  return codes.length === uniqueCodes.size;
}, {
  message: '部品コードが重複しています',
  path: ['buhin_list'],
}).refine((data) => {
  // 複雑なバリデーション: 予算チェック
  if (data.total_budget) {
    const totalQuantity = data.buhin_list.reduce((sum, item) => sum + item.quantity, 0);
    return totalQuantity <= data.total_budget;
  }
  return true;
}, {
  message: '総数量が予算を超えています',
  path: ['buhin_list'],
});
```

### パターン4: ネストされたスキーマ

```typescript
// types/modules/konpo/form.ts
import { z } from 'zod';

const BoxContentSchema = z.object({
  item_code: z.string().min(1),
  item_name: z.string().min(1),
  quantity: z.number().int().min(1),
  weight: z.number().min(0),
  dimensions: z.object({
    width: z.number().min(0),
    height: z.number().min(0),
    depth: z.number().min(0),
  }),
});

export const KonpoFormSchema = z.object({
  project_id: z.string().min(1),
  boxes: z.array(z.object({
    box_code: z.string().min(1),
    contents: z.array(BoxContentSchema).min(1),
    palet_code: z.string().optional(),
  })).min(1, '少なくとも1つの箱を追加してください'),
});

export type KonpoFormInput = z.infer<typeof KonpoFormSchema>;
```

---

## 🔄 派生スキーマの作成パターン

### パターン1: omit で作成用スキーマ

```typescript
export const ProjectSchema = z.object({
  ID: z.number(),
  プロジェクトID: z.string(),
  プロジェクト名: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

// IDとタイムスタンプを除外
export const ProjectCreateSchema = ProjectSchema.omit({
  ID: true,
  created_at: true,
  updated_at: true
});

export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
```

### パターン2: pick で特定フィールドのみ

```typescript
// 特定フィールドのみを含むスキーマ
export const ProjectSummarySchema = ProjectSchema.pick({
  ID: true,
  プロジェクトID: true,
  プロジェクト名: true,
});

export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;
```

### パターン3: partial で更新用スキーマ

```typescript
// すべてのフィールドをオプショナルに
export const ProjectUpdateSchema = ProjectSchema.partial();

export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
```

### パターン4: extend で追加フィールド

```typescript
// 基本スキーマを拡張
export const ProjectWithStatsSchema = ProjectSchema.extend({
  total_tasks: z.number().int(),
  completed_tasks: z.number().int(),
  completion_rate: z.number().min(0).max(100),
});

export type ProjectWithStats = z.infer<typeof ProjectWithStatsSchema>;
```

### パターン5: merge で複数スキーマを結合

```typescript
const BaseProjectSchema = z.object({
  ID: z.number(),
  プロジェクト名: z.string(),
});

const ProjectMetadataSchema = z.object({
  created_at: z.date(),
  updated_at: z.date(),
  created_by: z.string(),
});

// 2つのスキーマを結合
export const FullProjectSchema = BaseProjectSchema.merge(ProjectMetadataSchema);

export type FullProject = z.infer<typeof FullProjectSchema>;
```

---

## 🎯 検索・フィルター用スキーマ

### パターン1: 基本的な検索スキーマ

```typescript
export const ProjectSearchSchema = z.object({
  プロジェクト名: z.string().optional(),
  プロジェクトステータスID: z.number().int().optional(),
  クライアント名ID: z.number().int().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type ProjectSearch = z.infer<typeof ProjectSearchSchema>;
```

### パターン2: 日付範囲検索

```typescript
export const DateRangeSearchSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.start_date) <= new Date(data.end_date);
  }
  return true;
}, {
  message: '終了日は開始日以降である必要があります',
});
```

### パターン3: 複数条件検索

```typescript
export const AdvancedSearchSchema = z.object({
  // テキスト検索
  keyword: z.string().optional(),

  // 数値範囲検索
  min_price: z.number().optional(),
  max_price: z.number().optional(),

  // 列挙型検索
  status: z.array(z.enum(['active', 'completed', 'archived'])).optional(),

  // 日付範囲検索
  start_date: z.string().optional(),
  end_date: z.string().optional(),

  // ソート
  sort_by: z.enum(['name', 'created_at', 'updated_at']).default('created_at'),
  order: z.enum(['ASC', 'DESC']).default('DESC'),

  // ページネーション
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});
```

---

## 🧩 型推論の活用

### パターン1: z.infer で型を生成

```typescript
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

// Zodスキーマから型を推論
export type User = z.infer<typeof UserSchema>;
```

### パターン2: 派生スキーマの型推論

```typescript
export const UserCreateSchema = UserSchema.omit({ id: true });
export const UserUpdateSchema = UserSchema.partial();

// 派生スキーマからも型推論
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
```

### パターン3: 複雑な型推論

```typescript
export const ProjectFormSchema = z.object({
  name: z.string(),
  members: z.array(z.object({
    user_id: z.string(),
    role: z.enum(['admin', 'member']),
  })),
});

// ネストされた型も推論可能
export type ProjectFormInput = z.infer<typeof ProjectFormSchema>;
// {
//   name: string;
//   members: Array<{
//     user_id: string;
//     role: 'admin' | 'member';
//   }>;
// }
```

---

## 🎨 高度なパターン

### パターン1: discriminated union（判別可能な共用体）

```typescript
const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.unknown(),
});

const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export const APIResponseSchema = z.discriminatedUnion('success', [
  SuccessResponseSchema,
  ErrorResponseSchema,
]);

export type APIResponse = z.infer<typeof APIResponseSchema>;
// { success: true; data: unknown } | { success: false; error: { code: string; message: string } }
```

### パターン2: transform で値を変換

```typescript
export const DateStringSchema = z.string().transform((val) => new Date(val));

export const UserInputSchema = z.object({
  name: z.string(),
  birth_date: DateStringSchema,  // 文字列 → Date に変換
  age: z.string().transform((val) => parseInt(val, 10)),  // 文字列 → 数値に変換
});

export type UserInput = z.infer<typeof UserInputSchema>;
// { name: string; birth_date: Date; age: number }
```

### パターン3: preprocess で前処理

```typescript
export const TrimmedStringSchema = z.preprocess(
  (val) => typeof val === 'string' ? val.trim() : val,
  z.string().min(1)
);

export const UserFormSchema = z.object({
  name: TrimmedStringSchema,  // 自動的にトリム
  email: TrimmedStringSchema,
});
```

---

## 📋 実装パターンチェックリスト

新しいスキーマを作る前に確認：

- [ ] 基本的なバリデーションルールを定義したか？
- [ ] エラーメッセージを日本語で設定したか？
- [ ] 条件付きバリデーションが必要な場合、refine を使用したか？
- [ ] ネストされたオブジェクトのバリデーションが必要な場合、適切に定義したか？
- [ ] 派生スキーマ（Create, Update, Search）を作成したか？
- [ ] z.infer で型推論を活用したか？
- [ ] 複雑なバリデーションの場合、適切にエラーパスを指定したか？

---

## 🔗 関連ドキュメント

- **基本ルール**: [types-core.md](./types-core.md)
- **フォルダ構造**: [types-organization.md](./types-organization.md)
- **移行ガイド**: [types-migration.md](./types-migration.md)
