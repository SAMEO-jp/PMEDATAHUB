/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/connection/db_connection';

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
  let db: any = null; // SQLite3.Database縺ｮ繧､繝ｳ繧ｹ繧ｿ繝ｳ繧ｹ

  try {
    db = await initializeDatabase();
    console.log('DB: Database connection established');

    // Get parts from BUZAI_PART and KONPO_TANNI that need konpo tanni preparation
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
          console.error('繧ｯ繧ｨ繝ｪ螳溯｡後お繝ｩ繝ｼ:', err);
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
    console.error('譴ｱ蛹・ｺ門ｙ繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:', error);
    return NextResponse.json(
      { success: false, error: '譴ｱ蛹・ｺ門ｙ繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆' },
      { status: 500 }
    );
  } finally {
    if (db) {
      try {
        db.close();
        console.log('DB: 繝・・繧ｿ繝吶・繧ｹ謗･邯壹ｒ髢峨§縺ｾ縺励◆');
      } catch (err) {
        console.error('DB: 繝・・繧ｿ繝吶・繧ｹ謗･邯壹・繧ｯ繝ｭ繝ｼ繧ｺ縺ｫ螟ｱ謨励＠縺ｾ縺励◆:', err);
      }
    }
  }
}
