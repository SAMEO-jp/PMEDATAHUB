---
alwaysApply: true
---
# dal-core.md

## このファイルについて
- **目的**: DAL層の基本ルールと必須要件
- **読むべき人**: DAL関数を実装するすべての開発者
- **関連ファイル**: [dal-security.md](./dal-security.md), [dal-patterns.md](./dal-patterns.md)

## 🎯 このフォルダの役割

src/lib/db/ は**データアクセス層（DAL）専用**です。

### やること
- ✅ データベース操作のみを行う
- ✅ 戻り値は必ず DALResponse<T> 型

### やらないこと
- ❌ ビジネスロジックを含めない
- ❌ tRPCに関するコードは書かない
- ❌ React/Componentに関するコードは書かない
- ❌ 例外を投げない（success: false を返す）

---

## 📂 ファイル配置の判断基準

### crud/ フォルダに置くべきもの
✅ 単一テーブルのSELECT/INSERT/UPDATE/DELETE
✅ WHERE句のみの単純な条件
✅ 1-2箇所からしか呼ばれない汎用的な操作

### queries/ フォルダに置くべきもの
✅ 2つ以上のテーブルをJOINする
✅ 集計関数（SUM, COUNT, AVG等）を使用する
✅ GROUP BYやHAVINGを含む
✅ サブクエリを含む
✅ 3箇所以上から呼び出される処理
✅ ビジネスロジック固有の複雑な条件分岐

### 実例
```typescript
// ✅ crud/db_CRUD.ts に置く
export async function getRecord<T>(table: string, id: number): Promise<DALResponse<T>>
export async function createRecord<T>(table: string, data: T): Promise<DALResponse<T>>

// ✅ queries/projectMemberQueries.ts に置く
export async function getProjectMembers(projectId: string): Promise<DALResponse<ProjectMember[]>> {
  // LEFT JOIN を使用
  return await db('PROJECT_MEMBER')
    .leftJoin('USER', 'PROJECT_MEMBER.USER_ID', 'USER.ID')
    .leftJoin('ROLE', 'PROJECT_MEMBER.ROLE_ID', 'ROLE.ID')
    .where('PROJECT_MEMBER.PROJECT_ID', projectId)
    .select('USER.NAME', 'ROLE.ROLE_NAME', ...);
}
```

---

## 🔌 DB接続管理（必須パターン）

### MUST: finallyブロックで必ず接続を閉じる

```typescript
// ✅ Good: 確実にクローズ
export async function getRecord<T>(
  table: string,
  id: number,
  config: TableConfig
): Promise<DALResponse<T>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const result = await db.get(`SELECT * FROM ${table} WHERE ${config.idColumn} = ?`, [id]);

    if (!result) {
      return {
        success: false,
        error: { code: 'RECORD_NOT_FOUND', message: `指定されたID(${id})のデータが見つかりません` }
      };
    }

    return { success: true, data: result as T };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'データベースエラーが発生しました'
      }
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DB close error:', closeErr);
      }
    }
  }
}
```

---

## 🎯 戻り値の統一（必須）

### MUST: DALResponse<T> 型を使用

```typescript
// types/api.ts で定義済み
export type DALResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
```

### ✅ 正しい実装

```typescript
// 成功時
return { success: true, data: result };

// 失敗時
return {
  success: false,
  error: {
    code: 'RECORD_NOT_FOUND',
    message: 'User-friendly error message'
  }
};
```

### ❌ 避けるべきパターン

```typescript
// ❌ 例外を投げる
if (!result) {
  throw new Error('Not found');  // DALでは投げない！
}

// ❌ error を null にする
return { success: true, data: result, error: null };

// ❌ 追加フィールド
return { success: true, data: result, count: 10 };
```

---

## 📛 命名規則

### 関数名: camelCase（必須）

```typescript
// ✅ Good
export async function getRecord() { }
export async function getAllRecords() { }
export async function createRecord() { }

// ❌ Bad: PascalCase
export async function GetRecord() { }
export async function GetAllRecords() { }
```

### ファイル名

```typescript
// ✅ Good
db_CRUD.ts
db_GetData.ts
userQueries.ts
projectMemberQueries.ts

// ❌ Bad: PascalCase
UserQueries.ts
```

---

## 🎯 エラーコードの標準化

### 推奨エラーコード

| コード | 意味 | 使用場面 |
|--------|------|----------|
| `RECORD_NOT_FOUND` | レコードが見つからない | SELECT結果が空 |
| `DATABASE_ERROR` | DB操作エラー | catch節のデフォルト |
| `VALIDATION_ERROR` | バリデーションエラー | 入力値の検証失敗 |
| `DUPLICATE_ENTRY` | 重複エラー | UNIQUE制約違反 |
| `FOREIGN_KEY_ERROR` | 外部キー制約違反 | 参照整合性エラー |
| `TRANSACTION_ERROR` | トランザクションエラー | COMMIT/ROLLBACK失敗 |

---

## 📋 実装チェックリスト

新しいDAL関数を作る前に確認：

- [ ] 適切なフォルダ（crud/ or queries/）に配置しているか？
- [ ] 戻り値が DALResponse<T> 型か？
- [ ] finally で DB接続を閉じているか？
- [ ] 例外を投げていないか？（success: false を返す）
- [ ] 関数名が camelCase か？
- [ ] エラーコードが標準化されているか？
