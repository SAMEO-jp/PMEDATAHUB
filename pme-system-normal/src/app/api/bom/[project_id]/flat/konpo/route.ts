/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/connection/db_connection';

export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  let db: any = null;
  try {
    const projectId = params.project_id;
    db = await initializeDatabase();

    if (!db) {
      throw new Error('繝・・繧ｿ繝吶・繧ｹ縺ｮ蛻晄悄蛹悶↓螟ｱ謨励＠縺ｾ縺励◆');
    }

    const query = `
      SELECT
        z.project_ID,
        z.Zumen_ID,
        z.Zumen_Name,
        p.PART_ID,
        p.PART_NAME,
        p.QUANTITY,
        p.SPARE_QUANTITY,
        p.MANUFACTURER,
        b.BUZAI_ID,
        b.BUZAI_NAME,
        b.BUZAI_WEIGHT,
        b.BUZAI_QUANTITY,
        b.ZAISITU_NAME,
        kt.KONPO_TANNI_ID,
        kt.PART_KO,
        kt.ZENSU_KO,
        kl.KONPO_LIST_ID,
        kl.KONPO_LIST_WEIGHT,
        kl.HASSOU_IN,
        kl.HASSOU_TO
      FROM BOM_ZUMEN z
      INNER JOIN BOM_PART p
        ON z.Zumen_ID = p.ZUMEN_ID
      LEFT JOIN BOM_BUZAI b
        ON b.Zumen_ID = p.ZUMEN_ID AND b.PART_ID = p.PART_ID
      LEFT JOIN KONPO_TANNI kt
        ON kt.ZUMEN_ID = p.ZUMEN_ID AND kt.PART_ID = p.PART_ID
      LEFT JOIN KONPO_LIST kl
        ON kt.KONPO_LIST_ID = kl.KONPO_LIST_ID
      WHERE z.project_ID = ?
    `;

    const result = await db.all(query, [projectId]);

    return NextResponse.json(result);
  } catch (error) {
    console.error('繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:', error);
    return NextResponse.json(
      { error: '繝・・繧ｿ繝吶・繧ｹ繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆' },
      { status: 500 }
    );
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DB繧ｯ繝ｭ繝ｼ繧ｺ譎ゅ↓繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆:', closeErr);
      }
    }
  }
}
