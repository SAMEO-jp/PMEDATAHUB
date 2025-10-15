---
alwaysApply: true
---
# types-core.md

## このファイルについて
- **目的**: types フォルダの基本ルールと必須要件
- **読むべき人**: 型定義を作成するすべての開発者
- **関連ファイル**: [types-organization.md](./types-organization.md), [types-patterns.md](./types-patterns.md)

## 🎯 このフォルダの役割

src/types/ は**型定義とスキーマの専用フォルダ**です。

### やること
- ✅ TypeScript の型定義（interface, type）
- ✅ Zod スキーマの定義
- ✅ 型とスキーマを同じファイルに配置

### やらないこと
- ❌ ビジネスロジックを書かない
- ❌ データベース操作を書かない
- ❌ API呼び出しを書かない
- ❌ React コンポーネントを書かない

---

## 📛 命名規則

### ファイル名: camelCase または kebab-case

```typescript
// ✅ Good
project.ts
user.ts
bom-buhin.ts
table-schema.ts

// ❌ Bad
Project.ts           # PascalCase は避ける
projectTypes.ts      # Types suffix は冗長
project_types.ts     # snake_case は避ける
```

### 型名: PascalCase

```typescript
// ✅ Good
export interface Project { }
export interface User { }
export interface BomBuhin { }

// ❌ Bad
export interface project { }      # camelCase
export interface IProject { }     # I prefix は不要
export interface ProjectType { }  # Type suffix は冗長
```

### スキーマ名: PascalCase + Schema suffix

```typescript
// ✅ Good
export const ProjectSchema = z.object({ });
export const UserSchema = z.object({ });
export const BomBuhinSchema = z.object({ });

// ❌ Bad
export const projectSchema = z.object({ });         # camelCase
export const ProjectInputSchema = z.object({ });    # Input は曖昧
export const CreateProjectSchema = z.object({ });   # 順序が不統一
```

---

## 🔗 型とスキーマの定義方法

### MUST: 同じファイルに型とスキーマを配置

```typescript
// ✅ Good: 型とスキーマが同じファイル
// types/entities/project.ts
import { z } from 'zod';

/**
 * プロジェクトのDB型
 */
export interface Project {
  ID: number;
  プロジェクトID: string;
  プロジェクト名: string;
  プロジェクト説明?: string;
}

/**
 * ProjectのZodスキーマ
 */
export const ProjectSchema = z.object({
  ID: z.number().int().positive(),
  プロジェクトID: z.string().min(1, 'プロジェクトIDは必須です'),
  プロジェクト名: z.string().min(1, 'プロジェクト名は必須です'),
  プロジェクト説明: z.string().optional(),
});

// ❌ Bad: 別ファイルに分離（schemas/フォルダは使わない）
```

### MUST: JSDoc でドキュメントを書く

```typescript
// ✅ Good: 説明的なコメント
/**
 * プロジェクトのDB型
 * データベースのprojectsテーブルと1:1対応
 */
export interface Project {
  /** プライマリキー（自動生成） */
  ID: number;

  /** プロジェクトの一意識別子 */
  プロジェクトID: string;

  /** プロジェクト名（必須） */
  プロジェクト名: string;

  /** プロジェクトの詳細説明（オプション） */
  プロジェクト説明?: string;
}

// ❌ Bad: コメントなし
export interface Project {
  ID: number;
  プロジェクトID: string;
  プロジェクト名: string;
  プロジェクト説明?: string;
}
```

---

## 🎨 派生スキーマの作成

### パターン1: omit で作成用スキーマ

```typescript
/**
 * プロジェクト作成用スキーマ
 * IDは自動生成されるため除外
 */
export const ProjectCreateSchema = ProjectSchema.omit({ ID: true });

// 型推論
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
```

### パターン2: partial で更新用スキーマ

```typescript
/**
 * プロジェクト更新用スキーマ
 * すべてのフィールドをオプショナルに
 */
export const ProjectUpdateSchema = ProjectSchema.partial();

// 型推論
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
```

### パターン3: extend で検索用スキーマ

```typescript
/**
 * プロジェクト検索用スキーマ
 */
export const ProjectSearchSchema = z.object({
  プロジェクト名: z.string().optional(),
  プロジェクトステータスID: z.number().int().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// 型推論
export type ProjectSearch = z.infer<typeof ProjectSearchSchema>;
```

---

## 🚫 避けるべきパターン

### ❌ Bad: schemas/ フォルダを作成

```typescript
// ❌ Bad: 型とスキーマを別ファイルに分離
// types/entities/project.ts
export interface Project { }

// types/schemas/project.ts
export const ProjectSchema = z.object({ });

// 理由: ファイルが2倍になり、同期が難しい
```

### ❌ Bad: 型から推論しない

```typescript
// ❌ Bad: 手動で型を定義
export const ProjectSchema = z.object({
  ID: z.number(),
  name: z.string(),
});

export interface Project {  // 手動で同じ定義
  ID: number;
  name: string;
}

// ✅ Good: z.infer で推論（小規模な型の場合）
export const ProjectSchema = z.object({
  ID: z.number(),
  name: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;
```

**推奨**: DB型が複雑な場合は interface を先に定義し、Zodは別途定義
**理由**: JSDocが書きやすく、型の独立性が高い

### ❌ Bad: プレフィックスの不統一

```typescript
// ❌ Bad: プレフィックスが混在
db_project.ts
zap_db_zumen.ts
project.ts

// ✅ Good: プレフィックスなしで統一
project.ts
zumen.ts
user.ts
```

---

## 📋 型定義チェックリスト

新しい型を作る前に確認：

- [ ] 適切なフォルダ（api/entities/modules/utils）に配置しているか？
- [ ] 型とスキーマが同じファイルにあるか？
- [ ] 命名規則に従っているか？（型: PascalCase, スキーマ: PascalCase + Schema）
- [ ] JSDocコメントを書いているか？
- [ ] 派生スキーマ（Create, Update）を作成しているか？
- [ ] z.infer で型推論を活用しているか？

---

## 🔗 関連ドキュメント

- **フォルダ構造**: [types-organization.md](./types-organization.md)
- **実装パターン**: [types-patterns.md](./types-patterns.md)
- **移行ガイド**: [types-migration.md](./types-migration.md)
- **DAL層のルール**: `../../lib/db/.cursorrules/dal-core.md`
- **tRPC層のルール**: `../../../.cursorrules/trpc/trpc-core.md`
