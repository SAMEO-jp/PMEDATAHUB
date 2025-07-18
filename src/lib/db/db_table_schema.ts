import { initializeDatabase, DataResult } from '@src/lib/db/db_connection';
import type { Database } from 'sqlite';
import type { ColumnInfo, TableSchemaChange } from '@src/types/table-schema';

/*********************************************************
 * テーブル構造変更用のDAL関数群
 * カラムの追加、削除、名前変更、順番変更を管理
 *********************************************************/

// SQLiteのPRAGMA結果の型定義
interface PragmaColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

/*********************************************************
 * テーブルの現在の構造を取得
 * @param tableName - テーブル名
 * @returns テーブル構造情報
 *********************************************************/
export async function getTableSchema(
  tableName: string
): Promise<DataResult<ColumnInfo[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    
    // PRAGMA table_infoを使用してテーブル構造を取得
    const columns = await db.all<PragmaColumnInfo[]>(`PRAGMA table_info(${tableName})`);
    
    const columnInfos: ColumnInfo[] = columns.map((col: PragmaColumnInfo) => ({
      name: col.name,
      type: col.type,
      notNull: col.notnull === 1,
      defaultValue: col.dflt_value || undefined,
      primaryKey: col.pk === 1
    }));
    
    return {
      success: true,
      data: columnInfos,
      error: null
    };
  } catch (error) {
    console.error('テーブル構造の取得に失敗しました:', error);
    return {
      success: false,
      error: 'テーブル構造の取得に失敗しました',
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
}

/*********************************************************
 * カラムを追加
 * @param tableName - テーブル名
 * @param columnInfo - 追加するカラム情報
 * @returns 実行結果
 *********************************************************/
export async function addColumn(
  tableName: string,
  columnInfo: ColumnInfo
): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    
    // カラム定義を構築
    let columnDef = `${columnInfo.name} ${columnInfo.type}`;
    if (columnInfo.notNull) {
      columnDef += ' NOT NULL';
    }
    if (columnInfo.defaultValue !== undefined) {
      columnDef += ` DEFAULT ${columnInfo.defaultValue}`;
    }
    if (columnInfo.primaryKey) {
      columnDef += ' PRIMARY KEY';
    }
    
    const query = `ALTER TABLE ${tableName} ADD COLUMN ${columnDef}`;
    await db.run(query);
    
    return {
      success: true,
      data: null,
      error: null
    };
  } catch (error) {
    console.error('カラム追加に失敗しました:', error);
    return {
      success: false,
      error: 'カラム追加に失敗しました',
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
}

/*********************************************************
 * カラム名を変更（SQLiteの制限により、新しいテーブルを作成して再構築）
 * @param tableName - テーブル名
 * @param oldColumnName - 古いカラム名
 * @param newColumnName - 新しいカラム名
 * @returns 実行結果
 *********************************************************/
export async function renameColumn(
  tableName: string,
  oldColumnName: string,
  newColumnName: string
): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    
    // 現在のテーブル構造を取得
    const schemaResult = await getTableSchema(tableName);
    if (!schemaResult.success || !schemaResult.data) {
      return {
        success: false,
        error: 'テーブル構造の取得に失敗しました',
        data: null
      };
    }
    
    const columns = schemaResult.data;
    
    // カラム名を変更
    const updatedColumns = columns.map(col => 
      col.name === oldColumnName ? { ...col, name: newColumnName } : col
    );
    
    // 新しいテーブルを作成
    const tempTableName = `${tableName}_temp_${Date.now()}`;
    const createTableQuery = await buildCreateTableQuery(tempTableName, updatedColumns);
    await db.run(createTableQuery);
    
    // データを移行
    const columnNames = columns.map(col => col.name).join(', ');
    const newColumnNames = updatedColumns.map(col => col.name).join(', ');
    const copyQuery = `INSERT INTO ${tempTableName} (${newColumnNames}) SELECT ${columnNames} FROM ${tableName}`;
    await db.run(copyQuery);
    
    // 古いテーブルを削除
    await db.run(`DROP TABLE ${tableName}`);
    
    // 新しいテーブルを元の名前に変更
    await db.run(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`);
    
    return {
      success: true,
      data: null,
      error: null
    };
  } catch (error) {
    console.error('カラム名変更に失敗しました:', error);
    return {
      success: false,
      error: 'カラム名変更に失敗しました',
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
}

/*********************************************************
 * カラムを削除（SQLiteの制限により、新しいテーブルを作成して再構築）
 * @param tableName - テーブル名
 * @param columnName - 削除するカラム名
 * @returns 実行結果
 *********************************************************/
export async function dropColumn(
  tableName: string,
  columnName: string
): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    
    // 現在のテーブル構造を取得
    const schemaResult = await getTableSchema(tableName);
    if (!schemaResult.success || !schemaResult.data) {
      return {
        success: false,
        error: 'テーブル構造の取得に失敗しました',
        data: null
      };
    }
    
    const columns = schemaResult.data;
    
    // 削除対象のカラムが存在するかチェック
    const targetColumn = columns.find(col => col.name === columnName);
    if (!targetColumn) {
      return {
        success: false,
        error: '指定されたカラムが存在しません',
        data: null
      };
    }
    
    // 削除対象以外のカラムを抽出
    const remainingColumns = columns.filter(col => col.name !== columnName);
    
    // 新しいテーブルを作成
    const tempTableName = `${tableName}_temp_${Date.now()}`;
    const createTableQuery = await buildCreateTableQuery(tempTableName, remainingColumns);
    await db.run(createTableQuery);
    
    // データを移行
    const remainingColumnNames = remainingColumns.map(col => col.name).join(', ');
    const copyQuery = `INSERT INTO ${tempTableName} (${remainingColumnNames}) SELECT ${remainingColumnNames} FROM ${tableName}`;
    await db.run(copyQuery);
    
    // 古いテーブルを削除
    await db.run(`DROP TABLE ${tableName}`);
    
    // 新しいテーブルを元の名前に変更
    await db.run(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`);
    
    return {
      success: true,
      data: null,
      error: null
    };
  } catch (error) {
    console.error('カラム削除に失敗しました:', error);
    return {
      success: false,
      error: 'カラム削除に失敗しました',
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
}

/*********************************************************
 * カラムの型を変更（SQLiteの制限により、新しいテーブルを作成して再構築）
 * @param tableName - テーブル名
 * @param columnName - 変更するカラム名
 * @param newColumnInfo - 新しいカラム情報
 * @returns 実行結果
 *********************************************************/
export async function modifyColumn(
  tableName: string,
  columnName: string,
  newColumnInfo: ColumnInfo
): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    
    // 現在のテーブル構造を取得
    const schemaResult = await getTableSchema(tableName);
    if (!schemaResult.success || !schemaResult.data) {
      return {
        success: false,
        error: 'テーブル構造の取得に失敗しました',
        data: null
      };
    }
    
    const columns = schemaResult.data;
    
    // 変更対象のカラムが存在するかチェック
    const targetColumn = columns.find(col => col.name === columnName);
    if (!targetColumn) {
      return {
        success: false,
        error: '指定されたカラムが存在しません',
        data: null
      };
    }
    
    // カラム情報を更新
    const updatedColumns = columns.map(col => 
      col.name === columnName ? { ...col, ...newColumnInfo } : col
    );
    
    // 新しいテーブルを作成
    const tempTableName = `${tableName}_temp_${Date.now()}`;
    const createTableQuery = await buildCreateTableQuery(tempTableName, updatedColumns);
    await db.run(createTableQuery);
    
    // データを移行
    const columnNames = columns.map(col => col.name).join(', ');
    const newColumnNames = updatedColumns.map(col => col.name).join(', ');
    const copyQuery = `INSERT INTO ${tempTableName} (${newColumnNames}) SELECT ${columnNames} FROM ${tableName}`;
    await db.run(copyQuery);
    
    // 古いテーブルを削除
    await db.run(`DROP TABLE ${tableName}`);
    
    // 新しいテーブルを元の名前に変更
    await db.run(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`);
    
    return {
      success: true,
      data: null,
      error: null
    };
  } catch (error) {
    console.error('カラム変更に失敗しました:', error);
    return {
      success: false,
      error: 'カラム変更に失敗しました',
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
}

/*********************************************************
 * CREATE TABLEクエリを構築
 * @param tableName - テーブル名
 * @param columns - カラム情報の配列
 * @returns CREATE TABLEクエリ
 *********************************************************/
async function buildCreateTableQuery(
  tableName: string,
  columns: ColumnInfo[]
): Promise<string> {
  const columnDefinitions = columns.map(col => {
    let def = `${col.name} ${col.type}`;
    if (col.notNull) {
      def += ' NOT NULL';
    }
    if (col.defaultValue !== undefined) {
      def += ` DEFAULT ${col.defaultValue}`;
    }
    if (col.primaryKey) {
      def += ' PRIMARY KEY';
    }
    return def;
  });
  
  return `CREATE TABLE ${tableName} (${columnDefinitions.join(', ')})`;
}

/*********************************************************
 * テーブル構造変更の一括実行
 * @param changes - 変更操作の配列
 * @returns 実行結果
 *********************************************************/
export async function executeTableSchemaChanges(
  changes: TableSchemaChange[]
): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    await db.run('BEGIN TRANSACTION');
    
    for (const change of changes) {
      let result: DataResult<null>;
      
      switch (change.operation) {
        case 'add':
          if (!change.newColumnDefinition) {
            throw new Error('カラム追加にはnewColumnDefinitionが必要です');
          }
          result = await addColumn(change.tableName, change.newColumnDefinition);
          if (!result.success) {
            throw new Error(result.error || 'カラム追加に失敗しました');
          }
          break;
          
        case 'drop':
          result = await dropColumn(change.tableName, change.columnName);
          if (!result.success) {
            throw new Error(result.error || 'カラム削除に失敗しました');
          }
          break;
          
        case 'rename':
          if (!change.newColumnName) {
            throw new Error('カラム名変更にはnewColumnNameが必要です');
          }
          result = await renameColumn(change.tableName, change.columnName, change.newColumnName);
          if (!result.success) {
            throw new Error(result.error || 'カラム名変更に失敗しました');
          }
          break;
          
        case 'modify':
          if (!change.newColumnDefinition) {
            throw new Error('カラム変更にはnewColumnDefinitionが必要です');
          }
          result = await modifyColumn(change.tableName, change.columnName, change.newColumnDefinition);
          if (!result.success) {
            throw new Error(result.error || 'カラム変更に失敗しました');
          }
          break;
          
        default:
          throw new Error(`未対応の操作: ${change.operation}`);
      }
    }
    
    await db.run('COMMIT');
    return {
      success: true,
      data: null,
      error: null
    };
  } catch (error) {
    if (db) {
      try {
        await db.run('ROLLBACK');
      } catch (rollbackError) {
        console.error('ロールバックに失敗しました:', rollbackError);
      }
    }
    console.error('テーブル構造変更の実行に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'テーブル構造変更に失敗しました',
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
} 