---
alwaysApply: false
---
# dal-patterns.md

## このファイルについて
- **目的**: DAL層の実装パターン集
- **読むべき人**: より高度な実装が必要な開発者
- **関連ファイル**: [dal-core.md](./dal-core.md), [dal-security.md](./dal-security.md)

## 🔄 トランザクション管理

### パターン1: runTransaction ヘルパーを使用

```typescript
// crud/db_advanced.ts
export async function runTransaction<T>(
  callback: (db: Database) => Promise<T>
): Promise<DALResponse<T>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    await db.run('BEGIN TRANSACTION');

    const result = await callback(db);

    await db.run('COMMIT');
    return { success: true, data: result };
  } catch (error) {
    if (db) {
      try {
        await db.run('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }
    return {
      success: false,
      error: {
        code: 'TRANSACTION_ERROR',
        message: error instanceof Error ? error.message : 'Transaction failed'
      }
    };
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// 使用例
export async function transferFunds(
  fromAccount: number,
  toAccount: number,
  amount: number
): Promise<DALResponse<null>> {
  return await runTransaction(async (db) => {
    await db.run(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [amount, fromAccount]
    );
    await db.run(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, toAccount]
    );
    return null;
  });
}
```

### パターン2: 手動トランザクション管理

```typescript
export async function complexOperation(): Promise<DALResponse<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    await db.run('BEGIN TRANSACTION');

    // 複数操作
    await db.run('INSERT INTO table1 ...');
    await db.run('UPDATE table2 ...');
    await db.run('DELETE FROM table3 ...');

    await db.run('COMMIT');
    return { success: true, data: null };
  } catch (error) {
    if (db) {
      try {
        await db.run('ROLLBACK');
      } catch (rollbackErr) {
        console.error('Rollback failed:', rollbackErr);
      }
    }
    return {
      success: false,
      error: {
        code: 'TRANSACTION_ERROR',
        message: error instanceof Error ? error.message : 'Operation failed'
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

## 🧪 テスト可能な設計

### パターン1: DB接続を外から注入

```typescript
// ✅ Good: テスト時にモックDBを注入できる
export async function getRecord<T>(
  table: AllowedTable,
  id: number,
  db?: Database  // ← オプショナル
): Promise<DALResponse<T>> {
  const database = db || await initializeDatabase();
  const shouldClose = !db;  // 外部から渡されてない場合のみクローズ

  try {
    const query = `SELECT * FROM ${table} WHERE id = ?`;
    const result = await database.get(query, [id]);

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
    if (shouldClose && database) {
      await database.close();
    }
  }
}

// テスト時の使用例
const mockDb = createMockDatabase();
const result = await getRecord('users', 1, mockDb);
```

---

## 📊 ページネーション

### パターン1: オフセットベース

```typescript
export async function paginate<T>(
  table: AllowedTable,
  page: number,
  limit: number,
  where?: string,
  whereValues: (string | number)[] = []
): Promise<DALResponse<{
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const offset = (page - 1) * limit;
    const whereClause = where ? `WHERE ${where}` : '';

    // 総件数を取得
    const countQuery = `SELECT COUNT(*) as total FROM ${table} ${whereClause}`;
    const countResult = await db.get(countQuery, whereValues);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    // データを取得
    const query = `
      SELECT *
      FROM ${table}
      ${whereClause}
      LIMIT ? OFFSET ?
    `;
    const data = await db.all(query, [...whereValues, limit, offset]);

    return {
      success: true,
      data: {
        data: data as T[],
        total,
        page,
        limit,
        totalPages
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Pagination failed'
      }
    };
  } finally {
    if (db) {
      await db.close();
    }
  }
}
```

### パターン2: カーソルベース

```typescript
export async function paginateByCursor<T extends { id: number }>(
  table: AllowedTable,
  limit: number,
  cursor?: number
): Promise<DALResponse<{
  data: T[];
  nextCursor?: number;
  hasMore: boolean;
}>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = cursor
      ? `SELECT * FROM ${table} WHERE id > ? ORDER BY id LIMIT ?`
      : `SELECT * FROM ${table} ORDER BY id LIMIT ?`;

    const params = cursor ? [cursor, limit + 1] : [limit + 1];
    const data = await db.all(query, params);

    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;
    const nextCursor = hasMore && items.length > 0
      ? items[items.length - 1].id
      : undefined;

    return {
      success: true,
      data: {
        data: items as T[],
        nextCursor,
        hasMore
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Pagination failed'
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

## 🔍 検索とフィルタリング

### 動的WHERE句の構築

```typescript
export async function searchRecords<T>(
  table: AllowedTable,
  filters: Record<string, string | number | boolean>
): Promise<DALResponse<T[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // WHERE句を動的に構築
    const conditions: string[] = [];
    const values: (string | number | boolean)[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (conditions.length === 0) {
      // フィルタなしの場合は全件取得
      const query = `SELECT * FROM ${table}`;
      const data = await db.all(query);
      return { success: true, data: data as T[] };
    }

    const whereClause = conditions.join(' AND ');
    const query = `SELECT * FROM ${table} WHERE ${whereClause}`;
    const data = await db.all(query, values);

    return { success: true, data: data as T[] };
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

---

## 🎨 その他の便利パターン

### パターン: バッチINSERT

```typescript
export async function batchInsert<T extends Record<string, unknown>>(
  table: AllowedTable,
  records: T[]
): Promise<DALResponse<number>> {
  if (records.length === 0) {
    return { success: true, data: 0 };
  }

  return await runTransaction(async (db) => {
    const columns = Object.keys(records[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

    let insertedCount = 0;
    for (const record of records) {
      const values = Object.values(record);
      await db.run(query, values);
      insertedCount++;
    }

    return insertedCount;
  });
}
```

### パターン: EXISTS チェック

```typescript
export async function exists(
  table: AllowedTable,
  id: number,
  idColumn = 'id'
): Promise<DALResponse<boolean>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const query = `SELECT 1 FROM ${table} WHERE ${idColumn} = ? LIMIT 1`;
    const result = await db.get(query, [id]);

    return { success: true, data: !!result };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Exists check failed'
      }
    };
  } finally {
    if (db) {
      await db.close();
    }
  }
}
```
