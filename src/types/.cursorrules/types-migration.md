---
alwaysApply: false
---
# types-migration.md

## このファイルについて
- **目的**: 既存のtypesフォルダをリファクタリングする手順
- **読むべき人**: レガシーコードを整理する開発者
- **関連ファイル**: [types-core.md](./types-core.md), [types-organization.md](./types-organization.md)

## 🎯 現状と目標

### 現状の問題点
```
types/
├── 20+ files（すべて同じ階層）
├── box/（1つだけフォルダ（不統一）
├── db_project.ts（プレフィックス混在）
├── zap_db_zumen_detail.ts（プレフィックス混在）
└── project.ts（プレフィックスなし）
```

### 目標
```
types/
├── api/              # API関連の型
├── entities/         # DBエンティティ
├── modules/          # 機能モジュール
└── utils/            # ユーティリティ型
```

---

## 📋 リファクタリング計画

### フェーズ1: フォルダ作成とグループ化（1週間）

#### Step 1-1: 基本フォルダの作成
```bash
# フォルダ作成
mkdir -p types/api
mkdir -p types/entities
mkdir -p types/modules/{bom,konpo,project,zumen}
mkdir -p types/utils
```

#### Step 1-2: ファイル分類リスト作成

現状のファイルを分類：

**api/ へ移動**:
- `api.ts`
- `auth.ts`

**entities/ へ移動**:
- `project.ts`
- `user.ts`
- `busho.ts`
- `seiban.ts`
- `task.ts`

**modules/bom/ へ移動**:
- `bom_buhin.ts` → `buhin.ts`
- `db_bom.ts` → `db.ts`
- `flat-bom.ts` → `flat.ts`

**modules/konpo/ へ移動**:
- `db_konpo.ts` → `db.ts`
- `box/box.ts` → `box.ts`
- `palet.ts`

**modules/project/ へ移動**:
- `db_project.ts` → `db.ts`
- `projectBusinessGroup.ts` → `business-group.ts`

**modules/zumen/ へ移動**:
- `zap_db_zumen_detail.ts` → `detail.ts`

**utils/ へ移動**:
- `table-schema.ts`
- `tableManagement.ts` → `table-management.ts`

**その他**:
- `obsidian.ts`
- `photo.ts`
- `kounyu.ts`
- `setsubi.ts`

#### Step 1-3: ファイル移動

```bash
# api/
git mv types/api.ts types/api/response.ts
git mv types/auth.ts types/api/

# entities/
git mv types/project.ts types/entities/
git mv types/user.ts types/entities/
git mv types/busho.ts types/entities/
git mv types/seiban.ts types/entities/
git mv types/task.ts types/entities/

# modules/bom/
git mv types/bom_buhin.ts types/modules/bom/buhin.ts
git mv types/db_bom.ts types/modules/bom/db.ts
git mv types/flat-bom.ts types/modules/bom/flat.ts

# modules/konpo/
git mv types/db_konpo.ts types/modules/konpo/db.ts
git mv types/box/box.ts types/modules/konpo/box.ts
git mv types/palet.ts types/modules/konpo/

# modules/project/
git mv types/db_project.ts types/modules/project/db.ts
git mv types/projectBusinessGroup.ts types/modules/project/business-group.ts

# modules/zumen/
git mv types/zap_db_zumen_detail.ts types/modules/zumen/detail.ts

# utils/
git mv types/table-schema.ts types/utils/
git mv types/tableManagement.ts types/utils/table-management.ts
```

---

### フェーズ2: index.ts の作成（1日）

#### Step 2-1: modules/ 配下にindex.ts作成

```typescript
// types/modules/bom/index.ts
export * from './buhin';
export * from './db';
export * from './flat';
```

```typescript
// types/modules/konpo/index.ts
export * from './box';
export * from './palet';
export * from './db';
```

```typescript
// types/modules/project/index.ts
export * from './db';
export * from './business-group';
```

#### Step 2-2: トップレベルのindex.ts（オプション）

```typescript
// types/index.ts
// API
export * from './api/response';
export * from './api/auth';

// Entities
export * from './entities/project';
export * from './entities/user';

// Modules
export * from './modules/bom';
export * from './modules/konpo';
export * from './modules/project';

// Utils
export * from './utils/common';
export * from './utils/table-schema';
```

---

### フェーズ3: import文の更新（2-3日）

#### Step 3-1: すべてのimport文を検索

```bash
# 各ファイルのimport文を検索
grep -r "from '@src/types/bom_buhin'" src/
grep -r "from '@src/types/db_bom'" src/
grep -r "from '@src/types/project'" src/
grep -r "from '@src/types/user'" src/
# ... 他のファイルも同様
```

#### Step 3-2: import文を更新

```typescript
// ❌ Before
import { BomBuhin } from '@src/types/bom_buhin';
import { DbBom } from '@src/types/db_bom';
import { FlatBom } from '@src/types/flat-bom';

// ✅ After（個別import）
import { BomBuhin } from '@src/types/modules/bom/buhin';
import { DbBom } from '@src/types/modules/bom/db';
import { FlatBom } from '@src/types/modules/bom/flat';

// ✅ After（index.tsを使用）
import { BomBuhin, DbBom, FlatBom } from '@src/types/modules/bom';
```

```typescript
// ❌ Before
import { Project } from '@src/types/project';
import { DbProject } from '@src/types/db_project';

// ✅ After
import { Project } from '@src/types/entities/project';
import { DbProject } from '@src/types/modules/project/db';
```

#### Step 3-3: 一括置換スクリプト（オプション）

VS Codeの検索置換機能を使用：

```
検索: from '@src/types/bom_buhin'
置換: from '@src/types/modules/bom/buhin'

検索: from '@src/types/db_bom'
置換: from '@src/types/modules/bom/db'

# ... 他のファイルも同様
```

---

### フェーズ4: 型定義の改善（1週間）

#### Step 4-1: interfaceとZodスキーマを同じファイルに統合

```typescript
// ❌ Before（schemas/フォルダを使っていた場合）
// types/entities/project.ts
export interface Project { }

// types/schemas/project.ts
export const ProjectSchema = z.object({ });

// ✅ After
// types/entities/project.ts
export interface Project { }
export const ProjectSchema = z.object({ });
export const ProjectCreateSchema = ProjectSchema.omit({ ID: true });
export const ProjectUpdateSchema = ProjectSchema.partial();
```

#### Step 4-2: JSDocコメントの追加

```typescript
// ✅ 説明的なコメントを追加
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
```

#### Step 4-3: 派生スキーマの作成

```typescript
// 各エンティティファイルに追加
export const ProjectCreateSchema = ProjectSchema.omit({
  ID: true,
  created_at: true,
  updated_at: true
});

export const ProjectUpdateSchema = ProjectSchema.partial();

export const ProjectSearchSchema = z.object({
  プロジェクト名: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// 型推論
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
export type ProjectSearch = z.infer<typeof ProjectSearchSchema>;
```

---

### フェーズ5: 動作確認とテスト（2日）

#### Step 5-1: コンパイルエラーの解消
```bash
npm run build
# または
tsc --noEmit
```

#### Step 5-2: テストの実行
```bash
npm test
```

#### Step 5-3: 手動テスト
- すべてのページが正常に表示されるか
- フォーム送信が動作するか
- データ取得が正常に機能するか

---

## ✅ リファクタリング完了チェックリスト

### フォルダ構造
- [ ] api/, entities/, modules/, utils/ フォルダを作成
- [ ] modules/ 配下にサブフォルダを作成（bom, konpo, project, zumen）
- [ ] すべてのファイルを適切なフォルダに配置

### ファイル命名
- [ ] プレフィックス（db_, zap_db_等）を削除または統一
- [ ] ファイル名が camelCase または kebab-case
- [ ] 重複するファイル名がないか確認

### index.ts
- [ ] modules/ 配下に index.ts を作成
- [ ] トップレベルの index.ts を作成（オプション）

### import文
- [ ] すべての import 文を更新
- [ ] コンパイルエラーがないか確認

### 型定義
- [ ] interface と Zodスキーマが同じファイルにあるか
- [ ] JSDocコメントを追加したか
- [ ] 派生スキーマ（Create, Update）を作成したか
- [ ] z.infer で型推論を活用しているか

### 動作確認
- [ ] すべてのテストが通過
- [ ] 手動テストで動作確認
- [ ] エラーケースの動作確認

---

## 🚀 段階的移行のヒント

### 一度に全部変更しない

```bash
# Phase 1 完了後
git add types/api types/entities types/modules/bom
git commit -m "refactor(types): create folder structure and move bom types"

# Phase 2 完了後
git add types/modules/konpo types/modules/project
git commit -m "refactor(types): move konpo and project types"

# Phase 3 完了後
git add .
git commit -m "refactor(types): update all import statements"

# Phase 4 完了後
git add .
git commit -m "refactor(types): add JSDoc and derived schemas"
```

### 優先順位をつける

**高優先度**（最初に移行）:
1. api/ - 全体で使われる
2. entities/ - 主要テーブル（project, user等）
3. modules/bom/ - 使用頻度が高い

**中優先度**（次に移行）:
4. modules/konpo/
5. modules/project/
6. utils/

**低優先度**（最後に移行）:
7. modules/zumen/
8. その他のファイル

---

## 📊 進捗管理

### タスクリスト

```markdown
## Types Folder Refactoring Progress

### Phase 1: Folder Structure (1 week)
- [ ] Create api/, entities/, modules/, utils/ folders
- [ ] Create subfolders in modules/ (bom, konpo, project, zumen)
- [ ] Classify all existing files
- [ ] Move files to appropriate folders

### Phase 2: Create index.ts (1 day)
- [ ] Create index.ts in modules/bom/
- [ ] Create index.ts in modules/konpo/
- [ ] Create index.ts in modules/project/
- [ ] Create top-level index.ts (optional)

### Phase 3: Update Imports (2-3 days)
- [ ] Search all import statements
- [ ] Update imports to new paths
- [ ] Fix compilation errors

### Phase 4: Improve Type Definitions (1 week)
- [ ] Consolidate interface and Zod schema in same file
- [ ] Add JSDoc comments
- [ ] Create derived schemas (Create, Update, Search)
- [ ] Use z.infer for type inference

### Phase 5: Testing (2 days)
- [ ] Fix compilation errors
- [ ] Run automated tests
- [ ] Manual testing of all features
- [ ] Verify error handling
```
