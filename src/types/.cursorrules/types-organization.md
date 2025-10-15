---
alwaysApply: true
---
# types-organization.md

## このファイルについて
- **目的**: types フォルダの構造とファイル配置ルール
- **読むべき人**: 新しい型を作成する開発者
- **関連ファイル**: [types-core.md](./types-core.md), [types-patterns.md](./types-patterns.md)

## 📂 フォルダ構造

```
types/
├── api/              # API通信の共通型
├── entities/         # DBエンティティ（1テーブル = 1ファイル）
├── modules/          # ビジネスロジックの型（複数テーブル）
└── utils/            # ユーティリティ型
```

---

## 1. api/ - API通信の共通型

### 配置基準
- ✅ アプリケーション全体で使われるAPI通信の型
- ✅ ドメインに依存しない
- ✅ 複数の機能で使われる

### ファイル例

```typescript
// types/api/response.ts
/**
 * DAL層の統一レスポンス型
 */
export type DALResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

/**
 * tRPCの統一レスポンス型
 */
export type TRPCSuccessResponse<T> = {
  success: true;
  data: T;
};
```

```typescript
// types/api/pagination.ts
/**
 * オフセットベースのページネーション結果
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * カーソルベースのページネーション結果
 */
export interface CursorPaginatedResult<T> {
  data: T[];
  nextCursor?: number;
  hasMore: boolean;
}
```

```typescript
// types/api/error.ts
/**
 * エラーコード定義
 */
export type ErrorCode =
  | 'RECORD_NOT_FOUND'
  | 'DATABASE_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN';

export interface ErrorDetail {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}
```

---

## 2. entities/ - DBエンティティ

### 配置基準
- ✅ データベースのテーブル1つに対応
- ✅ DBのカラムのみを含む
- ✅ 他のテーブルとの関連は含まない

### ファイル例

```typescript
// types/entities/project.ts
import { z } from 'zod';

/**
 * projectsテーブルの型定義
 * データベースのカラムと1:1対応
 */
export interface Project {
  ID: number;
  プロジェクトID: string;
  プロジェクト名: string;
  プロジェクト説明?: string;
  プロジェクト開始日?: Date;
  プロジェクト終了日?: Date;
  プロジェクトステータスID?: number;
  クライアント名ID?: number;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * ProjectのZodスキーマ
 */
export const ProjectSchema = z.object({
  ID: z.number().int().positive(),
  プロジェクトID: z.string().min(1, 'プロジェクトIDは必須です'),
  プロジェクト名: z.string().min(1, 'プロジェクト名は必須です'),
  プロジェクト説明: z.string().optional(),
  プロジェクト開始日: z.date().optional(),
  プロジェクト終了日: z.date().optional(),
  プロジェクトステータスID: z.number().int().optional(),
  クライアント名ID: z.number().int().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// CRUD用の派生スキーマ
export const ProjectCreateSchema = ProjectSchema.omit({
  ID: true,
  created_at: true,
  updated_at: true
});

export const ProjectUpdateSchema = ProjectSchema.partial();

// 型推論
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
```

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
  updated_at: Date;
}

export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email('有効なメールアドレスを入力してください'),
  name: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内です'),
  age: z.number().int().min(0, '年齢は0以上です').max(150, '年齢は150以下です').optional(),
  role: z.enum(['admin', 'user']),
  created_at: z.date(),
  updated_at: z.date(),
});

export const UserCreateSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const UserUpdateSchema = UserSchema.partial();

export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
```

---

## 3. modules/ - ビジネスロジックの型

### 配置基準
- ✅ 複数のテーブルを組み合わせる
- ✅ JOINしたデータ、集計データ
- ✅ ビジネスロジックで使用する型
- ✅ UI特有のデータ構造（フォームデータ等）

### フォルダ構成

```
modules/
├── bom/
│   ├── types.ts       # BOM関連の型
│   └── form.ts        # BOMフォーム用の型
├── konpo/
│   ├── types.ts       # 梱包関連の型
│   └── form.ts        # 梱包フォーム用の型
└── project/
    ├── types.ts       # プロジェクト関連の複合型
    └── business-group.ts
```

### ファイル例

```typescript
// types/modules/bom/types.ts
import { z } from 'zod';
import type { Project } from '@src/types/entities/project';
import type { User } from '@src/types/entities/user';

/**
 * BOM（部品表）の詳細型
 * 複数テーブルのJOIN結果
 */
export interface BomWithDetails {
  // BOMテーブルのデータ
  id: number;
  bom_number: string;
  bom_name: string;
  description?: string;

  // 関連テーブルのデータ（JOIN）
  project: Pick<Project, 'ID' | 'プロジェクト名'>;
  creator: Pick<User, 'id' | 'name'>;
  buhin_list: BomBuhin[];

  // 計算フィールド
  total_parts_count: number;
  estimated_cost: number;

  created_at: Date;
  updated_at: Date;
}

/**
 * BOM部品の詳細
 */
export interface BomBuhin {
  id: number;
  buhin_code: string;
  buhin_name: string;
  quantity: number;
  unit: string;
  unit_price?: number;
}

/**
 * フラットBOM（階層構造を展開）
 */
export interface FlatBom {
  level: number;        // 階層レベル（計算値）
  path: string[];       // パス（計算値）
  bom_id: number;
  parent_bom_id?: number;
  buhin_code: string;
  buhin_name: string;
  quantity: number;
  total_quantity: number;  // 累積数量（計算値）
}

/**
 * BOM検索用スキーマ
 */
export const BomSearchSchema = z.object({
  project_id: z.string().optional(),
  bom_name: z.string().optional(),
  buhin_code: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type BomSearch = z.infer<typeof BomSearchSchema>;
```

```typescript
// types/modules/bom/form.ts
import { z } from 'zod';

/**
 * BOM作成用のフォームデータ
 * UI層で使用する型（DBと異なる構造）
 */
export interface BomFormData {
  project_id: string;
  bom_name: string;
  description?: string;
  buhin_list: Array<{
    buhin_code: string;
    quantity: number;
    unit: string;
  }>;
}

/**
 * BomFormDataのZodスキーマ
 */
export const BomFormSchema = z.object({
  project_id: z.string().min(1, 'プロジェクトIDは必須です'),
  bom_name: z.string().min(1, 'BOM名は必須です'),
  description: z.string().optional(),
  buhin_list: z.array(z.object({
    buhin_code: z.string().min(1, '部品コードは必須です'),
    quantity: z.number().min(1, '数量は1以上である必要があります'),
    unit: z.string().min(1, '単位は必須です'),
  })).min(1, '少なくとも1つの部品を追加してください'),
});

export type BomFormInput = z.infer<typeof BomFormSchema>;
```

```typescript
// types/modules/project/types.ts
import type { Project } from '@src/types/entities/project';
import type { User } from '@src/types/entities/user';

/**
 * プロジェクトとメンバーの複合型
 */
export interface ProjectWithMembers {
  project: Project;
  members: Array<{
    user: User;
    role: string;
    assigned_at: Date;
  }>;
  member_count: number;  // 計算値
  admin_count: number;   // 計算値
}

/**
 * プロジェクト統計情報
 */
export interface ProjectStats {
  project_id: string;
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;  // 計算値（%）
  total_budget: number;
  spent_budget: number;
  budget_usage_rate: number;  // 計算値（%）
}
```

---

## 4. utils/ - ユーティリティ型

### 配置基準
- ✅ 特定のドメインに依存しない汎用型
- ✅ 型操作のヘルパー
- ✅ メタデータ型

### ファイル例

```typescript
// types/utils/common.ts
/**
 * 部分的にRequired化
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 部分的にOptional化
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * IDを除外した型
 */
export type WithoutId<T extends { id: number }> = Omit<T, 'id'>;

/**
 * タイムスタンプを除外した型
 */
export type WithoutTimestamps<T> = Omit<T, 'created_at' | 'updated_at'>;

/**
 * Nullable型をOptional型に変換
 */
export type NullableToOptional<T> = {
  [K in keyof T]: null extends T[K] ? Exclude<T[K], null> | undefined : T[K];
};
```

```typescript
// types/utils/table-schema.ts
/**
 * テーブルメタデータ
 */
export interface TableSchema {
  tableName: string;
  columns: ColumnInfo[];
  indexes: IndexInfo[];
  recordCount: number;
  lastUpdated: string;
}

/**
 * カラム情報
 */
export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  primary: boolean;
  autoIncrement: boolean;
  comment?: string;
}

/**
 * インデックス情報
 */
export interface IndexInfo {
  name: string;
  type: 'PRIMARY' | 'UNIQUE' | 'INDEX';
  columns: string[];
}

/**
 * テーブル情報（簡易版）
 */
export interface TableInfo {
  id: string;
  name: string;
  description: string;
  records: number;
  lastUpdated: string;
  tags: string[];
}
```

---

## 🔍 ファイル配置の判断フローチャート

新しい型を定義する時の判断基準：

```
新しい型を定義したい
    ↓
    ├─ API通信で共通的に使う型？
    │   （DALResponse, PaginatedResult等）
    │   → YES: api/ へ
    │
    ├─ DBテーブル1つに対応する型？
    │   （プライマリキー、カラムのみ）
    │   → YES: entities/ へ
    │
    ├─ 複数テーブルを組み合わせる型？
    │   （JOIN、集計、計算フィールド、フォームデータ）
    │   → YES: modules/ へ
    │
    └─ 汎用的なヘルパー型？
        （型操作、メタデータ）
        → YES: utils/ へ
```

### 具体例で判断

```typescript
// ❓ どこに置く？
export type DALResponse<T> = { success: boolean; data: T };
// ✅ api/response.ts （API通信で共通）

// ❓ どこに置く？
export interface Project { ID: number; プロジェクト名: string; }
// ✅ entities/project.ts （projectsテーブルそのもの）

// ❓ どこに置く？
export interface ProjectWithMembers {
  project: Project;
  members: User[];
  member_count: number;  // 計算値
}
// ✅ modules/project/types.ts （複数テーブルのJOIN + 計算）

// ❓ どこに置く？
export interface BomFormData {
  project_id: string;
  bom_name: string;
  buhin_list: Array<{ buhin_code: string; quantity: number; }>;
}
// ✅ modules/bom/form.ts （UIフォーム用）

// ❓ どこに置く？
export type WithoutId<T> = Omit<T, 'id'>;
// ✅ utils/common.ts （汎用ヘルパー）

// ❓ どこに置く？
export interface TableSchema { tableName: string; columns: ColumnInfo[]; }
// ✅ utils/table-schema.ts （メタデータ）
```

---

## 📦 index.ts によるエクスポート

### modules/ 配下での使用

```typescript
// types/modules/bom/index.ts
export * from './types';
export * from './form';

// 使用例
import { BomWithDetails, BomFormData } from '@src/types/modules/bom';
```

### プロジェクト全体での使用（オプション）

```typescript
// types/index.ts
// 共通型
export * from './api/response';
export * from './api/pagination';

// 主要エンティティ
export * from './entities/project';
export * from './entities/user';

// モジュール
export * from './modules/bom';
export * from './modules/konpo';
export * from './modules/project';

// 使用例
import { Project, User, BomWithDetails, DALResponse } from '@src/types';
```

**注意**: プロジェクト規模によっては避ける（バンドルサイズ増加の可能性）

---

## 📋 ファイル配置チェックリスト

新しい型ファイルを作る前に確認：

- [ ] この型はどのフォルダに属するか判断したか？
- [ ] 命名規則に従っているか？（ファイル名: camelCase）
- [ ] 同じ目的のファイルが既に存在しないか確認したか？
- [ ] modules/ の場合、適切なサブフォルダを作成したか？
- [ ] index.ts での再エクスポートが必要か検討したか？

---

## 🔗 関連ドキュメント

- **基本ルール**: [types-core.md](./types-core.md)
- **実装パターン**: [types-patterns.md](./types-patterns.md)
- **移行ガイド**: [types-migration.md](./types-migration.md)
