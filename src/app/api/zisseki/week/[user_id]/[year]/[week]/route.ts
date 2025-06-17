import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// データベース接続を取得する関数
async function getDb() {
  const db = await open({
    filename: './data/achievements.db',
    driver: sqlite3.Database
  })
  return db
}

export async function GET(
  request: Request,
  { params }: { params: { user_id: string; year: string; week: string } }
) {
  try {
    const { user_id, year, week } = params
    const db = await getDb()

    const result = await db.all(
      `SELECT 
        key_id as keyID,
        user_id as employeeNumber,
        startDateTime,
        endDateTime,
        subject,
        content,
        type,
        projectNumber,
        position,
        facility,
        status,
        businessCode,
        departmentCode,
        weekCode,
        year,
        week,
        classification5,
        classification6,
        classification7,
        classification8,
        classification9
      FROM ZISSEKI
      WHERE user_id = ?
      AND year = ?
      AND week = ?
      ORDER BY startDateTime ASC`,
      [user_id, year, week]
    )

    await db.close()

    return NextResponse.json({
      success: true,
      data: result
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

    const db = await getDb()

    // トランザクション開始
    await db.run('BEGIN TRANSACTION')

    try {
      // 既存データの削除
      const deleteResult = await db.run(
        `DELETE FROM ZISSEKI 
         WHERE user_id = ? 
         AND year = ? 
         AND week = ?`,
        [user_id, year, week]
      )

      console.log(`削除されたレコード数: ${deleteResult.changes}`)

      // 新しいデータを挿入
      for (const event of events) {
        // データの検証
        if (!event.keyID) {
          console.error('イベントデータにkeyIDが存在しません:', event);
          continue;
        }

        const {
          keyID,
          employeeNumber,
          startDateTime,
          endDateTime,
          subject,
          content,
          type,
          projectNumber,
          position,
          facility,
          status,
          businessCode,
          departmentCode,
          weekCode,
          classification5,
          classification6,
          classification7,
          classification8,
          classification9
        } = event

        // データを挿入
        await db.run(
          `INSERT INTO ZISSEKI (
            key_id,
            user_id,
            startDateTime,
            endDateTime,
            subject,
            content,
            type,
            organizer,
            projectNumber,
            position,
            facility,
            status,
            businessCode,
            departmentCode,
            weekCode,
            year,
            week,
            classification1,
            classification2,
            classification3,
            classification4,
            classification5,
            classification6,
            classification7,
            classification8,
            classification9,
            createdAt,
            updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [
            keyID,
            employeeNumber,
            startDateTime,
            endDateTime,
            subject,
            content,
            type,
            null, // organizer
            projectNumber,
            position,
            facility,
            status,
            businessCode,
            departmentCode,
            weekCode,
            year,
            week,
            null, // classification1
            null, // classification2
            null, // classification3
            null, // classification4
            classification5,
            classification6,
            classification7,
            classification8,
            classification9
          ]
        )

        console.log(`挿入されたレコードID: ${keyID}`)
      }

      // トランザクションをコミット
      await db.run('COMMIT')

      return NextResponse.json({
        success: true,
        message: "データを保存しました",
        data: { events }
      })
    } catch (error) {
      // エラーが発生した場合はロールバック
      await db.run('ROLLBACK')
      console.error("データベース操作中にエラーが発生:", error)
      throw error
    } finally {
      await db.close()
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
  }
}
