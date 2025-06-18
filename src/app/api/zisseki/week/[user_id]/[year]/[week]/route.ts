import { NextResponse } from 'next/server'
import { GetConditionData } from '@src/lib/db/db_GetData'
import { initializeDatabase } from '@src/lib/db/db_connection'

// テーブル設定
const ZISSEKI_CONFIG = {
  tableName: 'ZISSEKI',
  idColumn: 'key_id'
}

export async function GET(
  request: Request,
  { params }: { params: { user_id: string; year: string; week: string } }
) {
  try {
    const { user_id, year, week } = params
    console.log('API呼び出し:', { user_id, year, week })

    // 条件式とパラメータを設定
    const conditionExpr = 'user_id = ? AND year = ? AND week = ? ORDER BY startDateTime ASC'
    const conditionValues = [user_id, year, week]
    console.log('検索条件:', { conditionExpr, conditionValues })

    // データを取得
    const result = await GetConditionData(conditionExpr, conditionValues, ZISSEKI_CONFIG)
    console.log('取得結果:', result)

    if (!result.success) {
      console.error('データ取得エラー:', result.error)
      return NextResponse.json(
        { 
          success: false, 
          message: result.error || "データの取得に失敗しました" 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error) {
    console.error("週次実績データの取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "データの取得に失敗しました" 
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { user_id: string; year: string; week: string } }
) {
  let db: any = null;
  try {
    const { user_id, year, week } = params
    const body = await request.json()
    
    // データ構造の検証
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: "データ形式が不正です" },
        { status: 400 }
      )
    }

    // イベントデータの取得
    const events = Array.isArray(body) ? body : body.events || [];

    // リクエストデータのバリデーション
    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { success: false, message: "イベントデータが不正です" },
        { status: 400 }
      )
    }

    // データベース接続
    db = await initializeDatabase();

    // トランザクション開始
    await db.run('BEGIN TRANSACTION');

    try {
      // 既存データの削除
      await db.run(
        `DELETE FROM ZISSEKI 
         WHERE user_id = ? 
         AND year = ? 
         AND week = ?`,
        [user_id, year, week]
      );

      // 新しいデータを挿入
      for (const event of events) {
        if (!event.key_id) {
          console.error('イベントデータにkey_idが存在しません:', event);
          continue;
        }

        await db.run(
          `INSERT INTO ZISSEKI (
            key_id, user_id, startDateTime, endDateTime, subject, content,
            type, organizer, projectNumber, position, facility, status,
            businessCode, departmentCode, year, week, activityMaincode,
            activitySubcode, activityCode, equipmenNumber, projectType,
            phase, projectSubType, height, top, color, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [
            event.key_id,
            user_id,
            event.startDateTime,
            event.endDateTime,
            event.subject,
            event.content,
            event.type,
            event.organizer || null,
            event.projectNumber,
            event.position,
            event.facility,
            event.status,
            event.businessCode,
            event.departmentCode,
            year,
            week,
            event.activityMaincode || null,
            event.activitySubcode || null,
            event.activityCode || null,
            event.equipmenNumber || null,
            event.projectType || null,
            event.phase || null,
            event.projectSubType || null,
            event.height || null,
            event.top || null,
            event.color || null
          ]
        );
      }

      // トランザクションをコミット
      await db.run('COMMIT');

      return NextResponse.json({
        success: true,
        message: "データを保存しました",
        data: { events }
      });
    } catch (error) {
      // エラーが発生した場合はロールバック
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error("週次実績データの保存中にエラーが発生しました:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "データの保存に失敗しました" 
      },
      { status: 500 }
    )
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
