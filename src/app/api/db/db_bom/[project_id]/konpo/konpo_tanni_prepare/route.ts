/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/db_connection';

interface PrepareData {
  ZUMEN_ID: string;
  PART_ID: string;
  PART_KO: string;
  ZENSU_KO: string;
  KONPO_TANNI_ID: string | null;
  KONPO_LIST_ID: string | null;
}

export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  let db: any = null; // SQLite3.Databaseのインスタンス

  try {
    db = await initializeDatabase();
    console.log('DB: データベース接続成功');

    // BUZAI_PARTとKONPO_TANNIを結合して、梱包単位が未作成の部品を取得
    const query = `
      SELECT 
        bp.ZUMEN_ID,
        bp.PART_ID,
        bp.PART_KO,
        bp.ZENSU_KO,
        kt.KONPO_TANNI_ID,
        kt.KONPO_LIST_ID
      FROM BUZAI_PART_LIST bp
      LEFT JOIN KONPO_TANNI kt ON 
        bp.ZUMEN_ID = kt.ZUMEN_ID AND 
        bp.PART_ID = kt.PART_ID
      ORDER BY bp.ZUMEN_ID, bp.PART_ID
    `;

    const result = await new Promise<PrepareData[]>((resolve, reject) => {
      db.all(query, (err: Error | null, rows: PrepareData[]) => {
        if (err) {
          console.error('クエリ実行エラー:', err);
          reject(err);
          return;
        }
        resolve(rows);
      });
    });

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length
    });

  } catch (error) {
    console.error('梱包準備データの取得に失敗しました:', error);
    return NextResponse.json(
      { success: false, error: '梱包準備データの取得に失敗しました' },
      { status: 500 }
    );
  } finally {
    if (db) {
      try {
        db.close();
        console.log('DB: データベース接続を閉じました');
      } catch (err) {
        console.error('DB: データベース接続のクローズに失敗しました:', err);
      }
    }
  }
}
