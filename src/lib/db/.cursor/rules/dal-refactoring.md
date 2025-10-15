---
alwaysApply: false
---
# dal-refactoring.md

## このファイルについて
- **目的**: 既存DALコードのリファクタリング手順
- **読むべき人**: レガシーコードをリファクタリングする開発者
- **関連ファイル**: [dal-core.md](./dal-core.md)

## 🎯 現状の問題と目標

### 現状の問題点
1. ❌ フォルダ構造: すべて同じ階層に配置
2. ❌ 型の不統一: `DataResult<T>` と `DALResponse<T>` が混在
3. ❌ 命名規則: PascalCase と camelCase が混在
4. ❌ 機能の重複: 同じ機能が複数箇所に存在
5. ❌ エラーフィールド: `error: null` が混在

### 目標
✅ Cursorルール（dal-core.md）に完全準拠
✅ 保守性の高いコード
✅ セキュリティの確保

---

## 📋 リファクタリング計画

### フェーズ1: 型の統一（1日 - 最優先）

#### Step 1-1: DALResponse型を統一定義
```typescript
// types/api.ts
export type DALResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
```

#### Step 1-2: DataResult<T> を全置換
```bash
# 検索
grep -r "DataResult" src/lib/db/

# 置換（エディタの一括置換機能を使用）
DataResult → DALResponse
```

#### Step 1-3: error: null を削除
```typescript
// ❌ Before
return {
  success: true,
  data: result,
  error: null  // 削除
};

// ✅ After
return {
  success: true,
  data: result
};
```

#### Step 1-4: 余計なフィールドを削除
```typescript
// ❌ Before
return {
  success: true,
  count: result.length,  // 削除
  data: result
};

// ✅ After
return {
  success: true,
  data: result
};
```

---

### フェーズ2: 命名規則の統一（2日）

#### Step 2-1: 関数名をcamelCaseに変更
```typescript
// ❌ Before
export async function GetRecord() { }
export async function GetAllData() { }
export async function DeleteTable() { }

// ✅ After
export async function getRecord() { }
export async function getAllData() { }
export async function deleteTable() { }
```

#### Step 2-2: 一括置換スクリプト
```bash
# リネーム候補をリストアップ
grep -r "export async function [A-Z]" src/lib/db/

# 手動で修正するか、正規表現置換
# GetRecord → getRecord
# GetAllData → getAllData
# DeleteTable → deleteTable
```

---

### フェーズ3: フォルダ構造の再編（3日）

#### Step 3-1: フォルダ作成
```bash
mkdir -p src/lib/db/crud
mkdir -p src/lib/db/queries
mkdir -p src/lib/db/connection
```

#### Step 3-2: ファイル移動
```bash
# crud/ へ移動
mv src/lib/db/db_CRUD.ts src/lib/db/crud/
mv src/lib/db/db_GetData.ts src/lib/db/crud/
mv src/lib/db/db_advanced.ts src/lib/db/crud/

# queries/ へ移動＋リネーム
mv src/lib/db/kounyuCRUD.ts src/lib/db/queries/kounyuQueries.ts
mv src/lib/db/setsubiCRUD.ts src/lib/db/queries/setsubiQueries.ts

# connection/ へ移動
mv src/lib/db/db_connection.ts src/lib/db/connection/
```

#### Step 3-3: import文の更新
```typescript
// ❌ Before
import { getRecord } from '@src/lib/db/db_CRUD';
import { createKounyuMaster } from '@src/lib/db/kounyuCRUD';

// ✅ After
import { getRecord } from '@src/lib/db/crud/db_CRUD';
import { createKounyuMaster } from '@src/lib/db/queries/kounyuQueries';
```

すべてのimport文を検索して更新：
```bash
grep -r "from '@src/lib/db/db_" src/
grep -r "from '@src/lib/db/kounyu" src/
grep -r "from '@src/lib/db/setsubi" src/
```

---

### フェーズ4: 重複機能の削除（2日）

#### Step 4-1: getAllTables の統合

**削除**: `db_DeleteTable.ts` の `GetAllTables`
**保持**: `db_GetData.ts` の `getAllTables`（より詳細）

```typescript
// crud/db_TableManagement.ts （新規作成）
export async function getAllTables(): Promise<DALResponse<TableInfo[]>> {
  // db_GetData.ts の実装をコピー
}

export async function deleteTable(tableName: string): Promise<DALResponse<null>> {
  // db_DeleteTable.ts の実装をコピー
}
```

**db_DeleteTable.ts を削除**

#### Step 4-2: executeQuery の役割分離

**現状**: 2つの `executeQuery` が存在
1. `db_advanced.ts` - SELECT専用、セキュリティ重視
2. `db_CRUD.ts` - すべてのSQL、汎用的

**解決策**: 名前を変更して役割を明確化

```typescript
// crud/db_advanced.ts
export async function executeSelectQuery(/* ... */) {
  // SELECT専用、セキュリティチェック付き
}

// crud/db_CRUD.ts
export async function executeParameterizedQuery(/* ... */) {
  // INSERT/UPDATE/DELETE用、プレースホルダー必須
}
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
# または既存のテストスクリプト
```

#### Step 5-3: 手動テスト
- すべてのCRUD操作を実行
- エラーケースの確認
- トランザクション処理の確認

---

## ✅ リファクタリング完了チェックリスト

### 型とエラー処理
- [ ] すべての `DataResult<T>` を `DALResponse<T>` に置換
- [ ] `error: null` を削除
- [ ] 余計なフィールド（`count` 等）を削除
- [ ] 例外を投げていない（`success: false` を返す）

### 命名規則
- [ ] すべての関数名が camelCase
- [ ] ファイル名が適切（PascalCase を排除）

### フォルダ構造
- [ ] `crud/` フォルダに汎用CRUD関数を配置
- [ ] `queries/` フォルダに特殊クエリ関数を配置
- [ ] `connection/` フォルダにDB接続関数を配置

### 重複削除
- [ ] `getAllTables` を1つに統合
- [ ] `executeQuery` を役割別に分離
- [ ] 不要なファイルを削除

### import更新
- [ ] すべての import 文を更新
- [ ] コンパイルエラーなし

### セキュリティ
- [ ] プレースホルダーを使用
- [ ] テーブル名/カラム名をホワイトリスト検証
- [ ] 文字列連結を排除

### 動作確認
- [ ] すべてのテストが通過
- [ ] 手動テストで動作確認
- [ ] エラーケースの動作確認

---

## 🚀 段階的移行のヒント

### 一度に全部変更しない

**推奨**: 段階的に移行し、各段階でコミット

```bash
# Phase 1 完了後
git add .
git commit -m "refactor(dal): unify DALResponse type"

# Phase 2 完了後
git add .
git commit -m "refactor(dal): standardize naming conventions"

# Phase 3 完了後
git add .
git commit -m "refactor(dal): reorganize folder structure"

# Phase 4 完了後
git add .
git commit -m "refactor(dal): remove duplicate functions"

# Phase 5 完了後
git add .
git commit -m "refactor(dal): verify and test all changes"
```

### ブランチ戦略

```bash
# メインブランチから分岐
git checkout -b refactor/dal-layer

# 各フェーズをサブブランチで実施（オプション）
git checkout -b refactor/dal-phase1-types
# ... Phase 1 完了後マージ

git checkout -b refactor/dal-phase2-naming
# ... Phase 2 完了後マージ

# 最終的にメインにマージ
git checkout main
git merge refactor/dal-layer
```

---

## 📊 進捗管理

### タスクリスト

```markdown
## DAL Layer Refactoring Progress

### Phase 1: Type Unification (1 day)
- [ ] Define unified DALResponse<T> in types/api.ts
- [ ] Replace all DataResult<T> with DALResponse<T>
- [ ] Remove error: null fields
- [ ] Remove extra fields (count, etc.)

### Phase 2: Naming Conventions (2 days)
- [ ] Rename GetRecord → getRecord
- [ ] Rename GetAllData → getAllData
- [ ] Rename DeleteTable → deleteTable
- [ ] Update all function exports

### Phase 3: Folder Restructure (3 days)
- [ ] Create crud/, queries/, connection/ folders
- [ ] Move files to appropriate folders
- [ ] Rename *CRUD.ts → *Queries.ts
- [ ] Update all import statements

### Phase 4: Remove Duplicates (2 days)
- [ ] Consolidate getAllTables functions
- [ ] Separate executeQuery by role
- [ ] Delete redundant files

### Phase 5: Testing (2 days)
- [ ] Fix compilation errors
- [ ] Run automated tests
- [ ] Manual testing of CRUD operations
- [ ] Verify error handling
```
