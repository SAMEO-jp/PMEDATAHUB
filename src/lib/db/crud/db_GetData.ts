/* eslint-disable @typescript-eslint/no-explicit-any */

import { initializeDatabase, DataResult, TableConfig, TableReadConfig } from '../connection/db_connection';
import type { Database } from 'sqlite';

/*********************************************************
/*** IDに基づいてデータを取得する ***/ 
/*********************************************************
 * @param id - 取得対象のID
 * @param config - テーブル設定（テーブル名とIDカラム名）
 * @returns 取得結果（成功/失敗、データ、エラーメッセージ）
 * 接続管理は後から考えること
 **********************************************************/

export async function GetRecode<T=unknown>(id: string | number, config: TableConfig): Promise<DataResult<T>> {
  let db: Database | null = null;
    try {
        // データベース接続
        db           =  await initializeDatabase();
        // クエリ組み立て
        const query  = `SELECT * FROM ${config.tableName} WHERE ${config.idColumn} = ?`;
        // クエリ実行
        const result = await db.get(query, [id]);
        // データが見つからなかった場合
        if (!result) {
            return {
                success: false,
                error: `指定されたID(${id})のデータが見つかりません`,
                data: null
            };
        }
        // 正常に取得できた場合
        return {
            success: true,
            error: null,
            data: result
        };
    }catch (error) {
        console.error('データの取得に失敗しました:', error);
        return {
            success: false,
            error: 'データベースエラーが発生しました',
            data: null
        };
    }finally {
    // dbが存在する時だけ安全にclose
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
/*** 条件に基づいてデータを取得する ***/ 
/*********************************************************
 * @param conditions - 検索条件（WHERE句の条件）
 * @param config - テーブル設定（テーブル名とIDカラム名）
 * @returns 取得結果（成功/失敗、データ、エラーメッセージ）
 **********************************************************/
export async function GetConditionData<T=unknown>(
  conditionExpr: string,
  conditionValues: (string | number)[],
  config: TableConfig
): Promise<DataResult<T>> {
  let db: Database | null = null;
  try {
    console.log('GetConditionData: データベース接続開始');
    db = await initializeDatabase();
    console.log('GetConditionData: データベース接続成功');

    const query = `
      SELECT * 
      FROM ${config.tableName} 
      WHERE ${conditionExpr}`;
    console.log('GetConditionData: 実行クエリ:', query);
    console.log('GetConditionData: パラメータ:', conditionValues);

    const result = await db.all(query, conditionValues);
    console.log('GetConditionData: 取得件数:', result.length);
    console.log('GetConditionData: 最初のレコード:', result[0]);

    return {
      success: true,
      data: result as T,
      count: result.length,
      error: null
    };
  } catch (error) {
    console.error('GetConditionData: データの取得に失敗しました:', error);
    return {
      success: false,
      error: 'データベースエラーが発生しました',
      count: 0,
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
        console.log('GetConditionData: データベース接続を閉じました');
      } catch (closeErr) {
        console.warn('GetConditionData: DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
}

/**********************************************************
 * 全データを取得する
 * @param config - テーブル設定（テーブル名とIDカラム名）
 * @returns 取得結果（成功/失敗、データ、エラーメッセージ）
**********************************************************/

export async function GetAllData<T=unknown>(config: TableReadConfig): Promise<DataResult<T>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const query = `SELECT * FROM ${config.tableName}`;
    const result = await db.all(query);
    return { success: true, error: null,count: result.length, data: result as T };}
  catch (error) {
    console.error('データの取得に失敗しました:', error);
    return { success: false, error: 'データベースエラーが発生しました', count: 0, data: null };}
  finally {
    if (db) {
      try {await db.close();} 
      catch (closeErr) {console.warn('DBクローズ時にエラーが発生しました:', closeErr);}
    }
  }
}

/**********************************************************
 * データベース内の全テーブル一覧を取得する
 * @returns 取得結果（成功/失敗、データ、エラーメッセージ）
**********************************************************/

export interface TableInfo {
  id: string;
  name: string;
  description: string;
  records: number;
  lastUpdated: string;
  tags: string[];
}

export async function getAllTables(): Promise<DataResult<TableInfo[]>> {
  let db: any = null;
  try {
    db = await initializeDatabase();
    
    // SQLiteのシステムテーブルからテーブル一覧を取得
    const query = `
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      AND name NOT LIKE 'sqlite_%'
      ORDER BY name`;
    
    const tables = await db.all(query);
    
    // 各テーブルの詳細情報を取得
    const tableInfos: TableInfo[] = [];
    
    for (const table of tables) {
      try {
        // レコード数を取得
        const countQuery = `SELECT COUNT(*) as count FROM ${table.name}`;
        const countResult = await db.get(countQuery);
        const recordCount = countResult?.count || 0;
        
        // テーブル情報を構築
        const tableInfo: TableInfo = {
          id: `table_${tableInfos.length}`,
          name: table.name,
          description: `${table.name}テーブル`,
          records: recordCount,
          lastUpdated: new Date().toLocaleDateString('ja-JP'),
          tags: getTableTags(table.name), // タグを自動生成
        };
        
        tableInfos.push(tableInfo);
      } catch (error) {
        console.warn(`テーブル ${table.name} の情報取得に失敗:`, error);
        // エラーが発生しても他のテーブルは処理を続行
      }
    }
    
    return { 
      success: true, 
      error: null, 
      count: tableInfos.length, 
      data: tableInfos 
    };
  } catch (error) {
    console.error('テーブル一覧の取得に失敗しました:', error);
    return { 
      success: false, 
      error: 'データベースエラーが発生しました', 
      count: 0, 
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

/**********************************************************
 * 特定のテーブル情報を取得する
 * @param tableName - テーブル名
 * @returns 取得結果（成功/失敗、データ、エラーメッセージ）
**********************************************************/

export async function getTableInfo(tableName: string): Promise<DataResult<TableInfo>> {
  let db: any = null;
  try {
    db = await initializeDatabase();
    
    // テーブルが存在するかチェック
    const tableExistsQuery = `
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      AND name = ?`;
    
    const tableExists = await db.get(tableExistsQuery, [tableName]);
    
    if (!tableExists) {
      return {
        success: false,
        error: `テーブル '${tableName}' が見つかりません`,
        data: null
      };
    }
    
    // レコード数を取得
    const countQuery = `SELECT COUNT(*) as count FROM ${tableName}`;
    const countResult = await db.get(countQuery);
    const recordCount = countResult?.count || 0;
    
    // テーブル情報を構築
    const tableInfo: TableInfo = {
      id: `table_${tableName}`,
      name: tableName,
      description: `${tableName}テーブル`,
      records: recordCount,
      lastUpdated: new Date().toLocaleDateString('ja-JP'),
      tags: getTableTags(tableName),
    };
    
    return { 
      success: true, 
      error: null, 
      data: tableInfo 
    };
  } catch (error) {
    console.error('テーブル情報の取得に失敗しました:', error);
    return { 
      success: false, 
      error: 'データベースエラーが発生しました', 
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

/**********************************************************
 * テーブル名からタグを自動生成する
 * @param tableName - テーブル名
 * @returns タグの配列
**********************************************************/

function getTableTags(tableName: string): string[] {
  const tags: string[] = [];
  
  // テーブル名のパターンからタグを自動生成
  if (tableName.toLowerCase().includes('user')) {
    tags.push('ユーザー');
  }
  if (tableName.toLowerCase().includes('project')) {
    tags.push('プロジェクト');
  }
  if (tableName.toLowerCase().includes('kintai')) {
    tags.push('勤怠');
    tags.push('人事');
  }
  if (tableName.toLowerCase().includes('bom')) {
    tags.push('BOM');
  }
  if (tableName.toLowerCase().includes('konpo')) {
    tags.push('梱包');
  }
  if (tableName.toLowerCase().includes('zumen')) {
    tags.push('図面');
  }
  if (tableName.toLowerCase().includes('master') || tableName.toLowerCase().includes('m_')) {
    tags.push('マスター');
  }
  if (tableName.toLowerCase().includes('history')) {
    tags.push('履歴');
  }
  if (tableName.toLowerCase().includes('settings') || tableName.toLowerCase().includes('config')) {
    tags.push('設定');
  }
  if (tableName.toLowerCase().includes('ticket')) {
    tags.push('チケット');
  }
  if (tableName.toLowerCase().includes('purchase')) {
    tags.push('購買');
  }
  if (tableName.toLowerCase().includes('equipment')) {
    tags.push('機材');
  }
  
  // デフォルトタグ
  if (tags.length === 0) {
    tags.push('その他');
  }
  
  return tags;
}

/**
 * テーブルを削除する
 * @param tableName - 削除対象のテーブル名
 * @returns 削除結果（成功/失敗、エラーメッセージ）
 */
export async function deleteTable(tableName: string): Promise<DataResult<null>> {
  let db: any = null;
  try {
    db = await initializeDatabase();
    
    // テーブルが存在するかチェック
    const checkQuery = `
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      AND name = ?`;
    
    const tableExists = await db.get(checkQuery, [tableName]);
    
    if (!tableExists) {
      return {
        success: false,
        error: `テーブル '${tableName}' が見つかりません`,
        data: null
      };
    }
    
    // テーブルを削除
    const dropQuery = `DROP TABLE ${tableName}`;
    await db.run(dropQuery);
    
    return {
      success: true,
      error: null,
      data: null
    };
  } catch (error) {
    console.error('テーブル削除に失敗しました:', error);
    return {
      success: false,
      error: 'データベースエラーが発生しました',
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

/**********************************************************
 * テーブルのスキーマ情報を取得する
 * @param tableName - テーブル名
 * @returns スキーマ情報（成功/失敗、データ、エラーメッセージ）
**********************************************************/

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  primary: boolean;
  autoIncrement: boolean;
  comment?: string;
}

export interface TableSchema {
  tableName: string;
  columns: ColumnInfo[];
}

export async function getTableSchema(tableName: string): Promise<DataResult<TableSchema>> {
  let db: any = null;
  try {
    db = await initializeDatabase();
    
    // テーブルが存在するかチェック
    const tableExistsQuery = `
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      AND name = ?`;
    
    const tableExists = await db.get(tableExistsQuery, [tableName]);
    
    if (!tableExists) {
      return {
        success: false,
        error: `テーブル '${tableName}' が見つかりません`,
        data: null
      };
    }
    
    // カラム情報を取得
    const pragmaQuery = `PRAGMA table_info(${tableName})`;
    const columns = await db.all(pragmaQuery);
    
    const columnInfos: ColumnInfo[] = columns.map((col: any) => ({
      name: col.name,
      type: col.type,
      nullable: col.notnull === 0,
      primary: col.pk === 1,
      autoIncrement: col.pk === 1 && col.type.toUpperCase() === 'INTEGER',
      comment: `${col.name}カラム`
    }));
    
    const schema: TableSchema = {
      tableName,
      columns: columnInfos
    };
    
    return { 
      success: true, 
      error: null, 
      data: schema 
    };
  } catch (error) {
    console.error('テーブルスキーマの取得に失敗しました:', error);
    return { 
      success: false, 
      error: 'データベースエラーが発生しました', 
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

/**********************************************************
 * テーブルの詳細情報を取得する
 * @param tableName - テーブル名
 * @returns 詳細情報（成功/失敗、データ、エラーメッセージ）
**********************************************************/

export interface IndexInfo {
  name: string;
  type: string;
  columns: string[];
}

export interface TableDetail {
  name: string;
  description: string;
  columns: ColumnInfo[];
  indexes: IndexInfo[];
  records: number;
  size: string;
  lastUpdated: string;
}

export async function getTableDetail(tableName: string): Promise<DataResult<TableDetail>> {
  let db: any = null;
  try {
    db = await initializeDatabase();
    
    // テーブルが存在するかチェック
    const tableExistsQuery = `
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      AND name = ?`;
    
    const tableExists = await db.get(tableExistsQuery, [tableName]);
    
    if (!tableExists) {
      return {
        success: false,
        error: `テーブル '${tableName}' が見つかりません`,
        data: null
      };
    }
    
    // スキーマ情報を取得
    const schemaResult = await getTableSchema(tableName);
    if (!schemaResult.success || !schemaResult.data) {
      return {
        success: false,
        error: 'スキーマ情報の取得に失敗しました',
        data: null
      };
    }
    
    // レコード数を取得
    const countQuery = `SELECT COUNT(*) as count FROM ${tableName}`;
    const countResult = await db.get(countQuery);
    const recordCount = countResult?.count || 0;
    
    // インデックス情報を取得
    const indexQuery = `PRAGMA index_list(${tableName})`;
    const indexes = await db.all(indexQuery);
    
    const indexInfos: IndexInfo[] = [];
    
    for (const index of indexes) {
      const indexInfoQuery = `PRAGMA index_info(${index.name})`;
      const indexColumns = await db.all(indexInfoQuery);
      
      indexInfos.push({
        name: index.name,
        type: index.unique ? 'UNIQUE' : 'INDEX',
        columns: indexColumns.map((col: any) => col.name)
      });
    }
    
    // プライマリキーインデックスを追加
    const primaryColumns = schemaResult.data.columns.filter(col => col.primary);
    if (primaryColumns.length > 0) {
      indexInfos.unshift({
        name: 'PRIMARY',
        type: 'PRIMARY',
        columns: primaryColumns.map(col => col.name)
      });
    }
    
    const tableDetail: TableDetail = {
      name: tableName,
      description: `${tableName}テーブルの詳細情報`,
      columns: schemaResult.data.columns,
      indexes: indexInfos,
      records: recordCount,
      size: calculateTableSize(recordCount),
      lastUpdated: new Date().toLocaleDateString('ja-JP')
    };
    
    return { 
      success: true, 
      error: null, 
      data: tableDetail 
    };
  } catch (error) {
    console.error('テーブル詳細の取得に失敗しました:', error);
    return { 
      success: false, 
      error: 'データベースエラーが発生しました', 
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

/**********************************************************
 * テーブルサイズを計算する（概算）
 * @param recordCount - レコード数
 * @returns サイズ文字列
**********************************************************/

function calculateTableSize(recordCount: number): string {
  // 概算：1レコードあたり平均1KBと仮定
  const sizeKB = recordCount * 1;
  
  if (sizeKB < 1024) {
    return `${sizeKB} KB`;
  } else if (sizeKB < 1024 * 1024) {
    return `${(sizeKB / 1024).toFixed(1)} MB`;
  } else {
    return `${(sizeKB / (1024 * 1024)).toFixed(1)} GB`;
  }
}



