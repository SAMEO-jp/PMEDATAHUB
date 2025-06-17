/* eslint-disable @typescript-eslint/no-explicit-any */

import { initializeDatabase,DataResult,TableConfig ,TableReadConfig} from '@src/lib/db/db_connection';

/*********************************************************
/*** IDに基づいてデータを取得する ***/ 
/*********************************************************
 * @param id - 取得対象のID
 * @param config - テーブル設定（テーブル名とIDカラム名）
 * @returns 取得結果（成功/失敗、データ、エラーメッセージ）
 * 接続管理は後から考えること
 **********************************************************/

export async function GetRecode<T=unknown>(id: string | number, config: TableConfig): Promise<DataResult<T>> {
  let db: any = null;
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
  let db: any = null;
    try {
        db = await initializeDatabase();
        const query = `
          SELECT * 
          FROM ${config.tableName} 
          WHERE ${conditionExpr}`;
        const result = await db.all(query, conditionValues);
        return {
          success: true,
          data: result as T,
          count: result.length,
          error: null
        };
  } catch (error) {
        console.error('データの取得に失敗しました:', error);
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
 * 全データを取得する
 * @param config - テーブル設定（テーブル名とIDカラム名）
 * @returns 取得結果（成功/失敗、データ、エラーメッセージ）
**********************************************************/

export async function GetAllData<T=unknown>(config: TableReadConfig): Promise<DataResult<T>> {
  let db: any = null;
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



