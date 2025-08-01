import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/db_connection';
import type { Database } from 'sqlite';
import type { BomFlatRow } from '@src/types/db_bom';

export async function GET(
  request: Request,
  { params }: { params: { zumen_id: string } }
) {
  const zumenId = params.zumen_id;
  let db: Database | null = null;

  try {
    db = await initializeDatabase();

    // 図面、部品、部材の情報を結合して取得
    const query = `
      SELECT 
        -- 図面情報
        z.ROWID as Zumen_ROWID,
        z.Zumen_ID,
        z.project_ID,
        z.Zumen_Name,
        z.Zumen_Kind,
        z.Kumitate_Zumen,
        z.Souti_ID,
        z.Souti_name,
        z.rev_number,
        z.Tantou_a1,
        z.Tantou_a2,
        z.Tantou_b1,
        z.Tantou_b2,
        z.Tantou_c1,
        z.Tantou_c2,
        z.status,
        z.Syutuzubi_Date,
        z.Sakuzu_a,
        z.Sakuzu_b,
        z.Sakuzu_date,
        z.Scale,
        z.Size,
        z.Sicret_code,
        z.WRITEver,
        z.KANREN_ZUMEN,
        
        -- 部品情報
        p.ROWID as Part_ROWID,
        p.PART_ID,
        p.QUANTITY,
        p.SPARE_QUANTITY,
        p.PART_NAME,
        p.REMARKS,
        p.TEHAI_DIVISION,
        p.TEHAI_ID,
        p.MANUFACTURER,
        p.PART_PROJECT_ID,
        p.ZUMEN_ID as PART_ZUMEN_ID,
        p.PART_TANNI_WEIGHT,
        
        -- 部材情報
        b.ROWID as Buzai_ROWID,
        b.BUZAI_ID,
        b.ZUMEN_ID as BUZAI_ZUMEN_ID,
        b.PART_ID as BUZAI_PART_ID,
        b.BUZAI_NAME,
        b.BUZAI_WEIGHT,
        b.BUZAI_QUANTITY,
        b.ZAISITU_NAME
      FROM BOM_ZUMEN z
      LEFT JOIN BOM_PART p ON z.Zumen_ID = p.ZUMEN_ID
      LEFT JOIN BOM_BUZAI b ON p.PART_ID = b.PART_ID AND z.Zumen_ID = b.ZUMEN_ID
      WHERE z.Zumen_ID = ?
      ORDER BY p.PART_ID, b.BUZAI_ID
    `;

    const rows = await db.all(query, [zumenId]);

    // 結果を整形
    const flatRows: BomFlatRow[] = rows.map(row => ({
      // 図面情報
      Zumen_ROWID: row.Zumen_ROWID,
      Zumen_ID: row.Zumen_ID,
      project_ID: row.project_ID,
      Zumen_Name: row.Zumen_Name,
      Zumen_Kind: row.Zumen_Kind,
      Kumitate_Zumen: row.Kumitate_Zumen,
      Souti_ID: row.Souti_ID,
      Souti_name: row.Souti_name,
      rev_number: row.rev_number,
      Tantou_a1: row.Tantou_a1,
      Tantou_a2: row.Tantou_a2,
      Tantou_b1: row.Tantou_b1,
      Tantou_b2: row.Tantou_b2,
      Tantou_c1: row.Tantou_c1,
      Tantou_c2: row.Tantou_c2,
      status: row.status,
      Syutuzubi_Date: row.Syutuzubi_Date,
      Sakuzu_a: row.Sakuzu_a,
      Sakuzu_b: row.Sakuzu_b,
      Sakuzu_date: row.Sakuzu_date,
      Scale: row.Scale,
      Size: row.Size,
      Sicret_code: row.Sicret_code,
      WRITEver: row.WRITEver,
      KANREN_ZUMEN: row.KANREN_ZUMEN,

      // 部品情報
      Part_ROWID: row.Part_ROWID,
      PART_ID: row.PART_ID,
      QUANTITY: row.QUANTITY,
      SPARE_QUANTITY: row.SPARE_QUANTITY,
      PART_NAME: row.PART_NAME,
      REMARKS: row.REMARKS,
      TEHAI_DIVISION: row.TEHAI_DIVISION,
      TEHAI_ID: row.TEHAI_ID,
      MANUFACTURER: row.MANUFACTURER,
      PART_PROJECT_ID: row.PART_PROJECT_ID,
      PART_ZUMEN_ID: row.PART_ZUMEN_ID,
      PART_TANNI_WEIGHT: row.PART_TANNI_WEIGHT,

      // 部材情報
      Buzai_ROWID: row.Buzai_ROWID,
      BUZAI_ID: row.BUZAI_ID,
      BUZAI_ZUMEN_ID: row.BUZAI_ZUMEN_ID,
      BUZAI_PART_ID: row.BUZAI_PART_ID,
      BUZAI_NAME: row.BUZAI_NAME,
      BUZAI_WEIGHT: row.BUZAI_WEIGHT,
      BUZAI_QUANTITY: row.BUZAI_QUANTITY,
      ZAISITU_NAME: row.ZAISITU_NAME
    }));

    return NextResponse.json({
      success: true,
      data: flatRows,
      error: null
    });

  } catch (error) {
    console.error('BOMデータの取得に失敗しました:', error);
    return NextResponse.json({
      success: false,
      data: null,
      error: 'データベースエラーが発生しました'
    }, { status: 500 });
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
