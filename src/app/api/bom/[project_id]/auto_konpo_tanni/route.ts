//projedt make konnpo繝壹・繧ｸ逕ｨ

import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/connection/db_connection';

export async function POST(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    const projectId = params.project_id;
    const db = await initializeDatabase();

    // 繝・ヰ繝・げ逕ｨ: projectId繝√ぉ繝・け
    if (!projectId) {
      return NextResponse.json({ error: '繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺後≠繧翫∪縺帙ｓ' }, { status: 400 });
    }

    // Select parts for auto konpo tanni
    const selectResult = await db.all(`
      SELECT
        p.PART_ID,
        p.ZUMEN_ID,
        p.QUANTITY
      FROM BOM_ZUMEN z
      INNER JOIN BOM_PART p
        ON z.Zumen_ID = p.ZUMEN_ID
      LEFT JOIN KONPO_TANNI kt
        ON kt.ZUMEN_ID = p.ZUMEN_ID AND kt.PART_ID = p.PART_ID
      WHERE z.project_ID = ?
        AND kt.KONPO_TANNI_ID IS NULL
    `, [projectId]);

    // KONPO_TANNI 縺ｫ謖ｿ蜈･
    const insertResult = await db.run(`
      INSERT INTO KONPO_TANNI (
        KONPO_TANNI_ID,
        ZUMEN_ID,
        PART_ID,
        PART_KO,
        ZENSU_KO,
        KONPO_LIST_ID
      )
      SELECT
        'KT-' || p.ZUMEN_ID || '-' || p.PART_ID AS KONPO_TANNI_ID,
        p.ZUMEN_ID,
        p.PART_ID,
        CAST(p.QUANTITY AS INTEGER),
        '',
        NULL
      FROM BOM_ZUMEN z
      INNER JOIN BOM_PART p
        ON z.Zumen_ID = p.ZUMEN_ID
      LEFT JOIN KONPO_TANNI kt
        ON kt.ZUMEN_ID = p.ZUMEN_ID AND kt.PART_ID = p.PART_ID
      WHERE z.project_ID = ?
        AND kt.KONPO_TANNI_ID IS NULL
    `, [projectId]);

    return NextResponse.json({
      success: true,
      message: '繧ｳ繝ｳ繝昴・繝阪Φ繝亥腰菴阪・逋ｻ骭ｲ縺悟ｮ御ｺ・＠縺ｾ縺励◆',
      data: {
        selected: selectResult,
        inserted: insertResult.changes
      }
    });

  } catch (error) {
    console.error('Error in konpo route:', error);
    return NextResponse.json(
      { error: '繧ｳ繝ｳ繝昴・繝阪Φ繝亥腰菴阪・逋ｻ骭ｲ縺ｫ螟ｱ謨励＠縺ｾ縺励◆' },
      { status: 500 }
    );
  }
}
