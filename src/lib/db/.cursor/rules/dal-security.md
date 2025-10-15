---
alwaysApply: true
---
# dal-security.md

## このファイルについて
- **目的**: DAL層のセキュリティ対策
- **読むべき人**: DAL関数を実装するすべての開発者
- **関連ファイル**: [dal-core.md](./dal-core.md)

## 🔒 SQLインジェクション対策（必須）

### Rule 1: プレースホルダーを常に使用

#### ✅ MUST: プレースホルダー使用

```typescript
// ✅ Good: プレースホルダー使用
export async function getUserByEmail(email: string): Promise<DALResponse<User>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await db.get(query, [email]);  // ← プレースホルダー

    if (!result) {
      return {
        success: false,
        error: { code: 'RECORD_NOT_FOUND', message: 'User not found' }
      };
    }

    return { success: true, data: result as User };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Database error'
      }
    };
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// ❌ NEVER: 文字列連結
export async function getUserByEmail(email: string): Promise<DALResponse<User>> {
  const query = `SELECT * FROM users WHERE email = '${email}'`;  // ❌ 危険！
  // SQLインジェクション脆弱性
}
```

### Rule 2: 動的テーブル名/カラム名はホワイトリスト検証

#### ✅ MUST: 型とホワイトリストで制限

```typescript
// ✅ Good: 型レベルで制限
const ALLOWED_TABLES = ['users', 'projects', 'tasks', 'comments'] as const;
type AllowedTable = typeof ALLOWED_TABLES[number];

export async function getRecord<T>(
  table: AllowedTable,  // ← 型で制限
  id: number
): Promise<DALResponse<T>> {
  // ランタイムチェック（念のため）
  if (!ALLOWED_TABLES.includes(table)) {
    return {
      success: false,
      error: { code: 'INVALID_TABLE', message: 'Invalid table name' }
    };
  }

  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    // テーブル名はホワイトリスト検証済みなので安全
    const query = `SELECT * FROM ${table} WHERE id = ?`;
    const result = await db.get(query, [id]);

    if (!result) {
      return {
        success: false,
        error: { code: 'RECORD_NOT_FOUND', message: 'Record not found' }
      };
    }

    return { success: true, data: result as T };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Database error'
      }
    };
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// ❌ Bad: 検証なし
export async function getRecord<T>(table: string, id: number) {
  const query = `SELECT * FROM ${table} WHERE id = ?`;  // ❌ 危険！
  // table に '; DROP TABLE users; --' が渡される可能性
}
```

#### カラム名のホワイトリスト例

```typescript
// ✅ Good: カラム名も制限
const ALLOWED_SORT_COLUMNS = ['id', 'created_at', 'updated_at', 'name'] as const;
type AllowedSortColumn = typeof ALLOWED_SORT_COLUMNS[number];

export async function getAllRecordsSorted<T>(
  table: AllowedTable,
  sortBy: AllowedSortColumn = 'id',
  order: 'ASC' | 'DESC' = 'ASC'
): Promise<DALResponse<T[]>> {
  if (!ALLOWED_SORT_COLUMNS.includes(sortBy)) {
    return {
      success: false,
      error: { code: 'INVALID_COLUMN', message: 'Invalid sort column' }
    };
  }

  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const query = `SELECT * FROM ${table} ORDER BY ${sortBy} ${order}`;
    const result = await db.all(query);
    return { success: true, data: result as T[] };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Database error'
      }
    };
  } finally {
    if (db) {
      await db.close();
    }
  }
}
```

---

## 🛡️ SELECT専用executeQueryのセキュリティ

### READ専用クエリ実行関数

```typescript
// crud/db_advanced.ts
export async function executeSelectQuery(
  sqlQuery: string,
  limit = 100
): Promise<DALResponse<QueryResult>> {
  let db: Database | null = null;

  try {
    // 1. SELECT文のみ許可
    const normalized = sqlQuery.trim().toUpperCase();
    if (!normalized.startsWith('SELECT')) {
      return {
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only SELECT queries are allowed' }
      };
    }

    // 2. 危険なキーワードを検出
    const dangerousKeywords = [
      'DROP', 'DELETE', 'INSERT', 'UPDATE', 'CREATE', 'ALTER',
      'TRUNCATE', 'REPLACE', 'EXEC', 'EXECUTE',
      '--', '/*', '*/', 'xp_', 'sp_'
    ];

    for (const keyword of dangerousKeywords) {
      if (normalized.includes(keyword)) {
        return {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Dangerous keyword detected: ${keyword}`
          }
        };
      }
    }

    // 3. セミコロンで複数文を防ぐ
    if (sqlQuery.includes(';')) {
      return {
        success: false,
        error: { code: 'FORBIDDEN', message: 'Multiple statements not allowed' }
      };
    }

    // 4. LIMIT強制（大量データ取得を防ぐ）
    let modifiedQuery = sqlQuery;
    if (!normalized.includes('LIMIT')) {
      modifiedQuery += ` LIMIT ${limit}`;
    }

    db = await initializeDatabase();
    const startTime = Date.now();
    const rows = await db.all(modifiedQuery);
    const executionTime = (Date.now() - startTime) / 1000;

    return {
      success: true,
      data: {
        query: sqlQuery,
        rows,
        rowCount: rows.length,
        executionTime,
        executedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Query execution failed'
      }
    };
  } finally {
    if (db) {
      await db.close();
    }
  }
}
```

---

## 🚫 絶対にやってはいけないこと

### ❌ NEVER: 文字列連結でクエリを組み立てる

```typescript
// ❌ 最悪の例
export async function searchUsers(keyword: string) {
  const query = `SELECT * FROM users WHERE name LIKE '%${keyword}%'`;
  // keyword = "'; DROP TABLE users; --" で全データ削除される
}

// ✅ 正しい例
export async function searchUsers(keyword: string): Promise<DALResponse<User[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const query = 'SELECT * FROM users WHERE name LIKE ?';
    const result = await db.all(query, [`%${keyword}%`]);
    return { success: true, data: result as User[] };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Search failed'
      }
    };
  } finally {
    if (db) {
      await db.close();
    }
  }
}
```

### ❌ NEVER: ユーザー入力を直接使用

```typescript
// ❌ 危険
export async function getRecordByColumn(table: string, column: string, value: string) {
  const query = `SELECT * FROM ${table} WHERE ${column} = '${value}'`;
  // すべてのパラメータが危険
}

// ✅ 安全
export async function getUserByEmail(email: string): Promise<DALResponse<User>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await db.get(query, [email]);

    if (!result) {
      return {
        success: false,
        error: { code: 'RECORD_NOT_FOUND', message: 'User not found' }
      };
    }

    return { success: true, data: result as User };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Database error'
      }
    };
  } finally {
    if (db) {
      await db.close();
    }
  }
}
```

---

## 📋 セキュリティチェックリスト

新しいDAL関数を作る前に確認：

- [ ] プレースホルダー（`?`）を使用しているか？
- [ ] 動的なテーブル名/カラム名をホワイトリストで検証しているか？
- [ ] 文字列連結でクエリを組み立てていないか？
- [ ] ユーザー入力を直接クエリに埋め込んでいないか？
- [ ] executeSelectQuery でSELECT専用を強制しているか？
- [ ] LIMIT句を強制しているか？（大量データ取得防止）
- [ ] 危険なキーワードをチェックしているか？
