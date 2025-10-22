import { NextResponse } from 'next/server';
import { initializeDatabase } from '../../../../../lib/db/connection/db_connection';

/**
 * 驕ｸ謚槭＆繧後◆蜊倅ｽ巧D縺ｮ繝ｪ繧ｹ繝・D繧呈峩譁ｰ縺吶ｋAPI
 * 繝ｪ繧ｹ繝・D縺ｯ驕ｸ謚槭＆繧後◆荳ｭ縺ｧ譛繧り凶縺・腰菴巧D繧貞渕縺ｫ逕滓・
 * 繝ｪ繧ｹ繝・D縺檎ｩｺ縺ｮ蝣ｴ蜷医・縺ｿ譖ｴ譁ｰ蜿ｯ閭ｽ
 * 蜷梧凾縺ｫKONPO_LIST繝・・繝悶Ν縺ｫ譁ｰ隕上Ξ繧ｳ繝ｼ繝峨ｒ菴懈・
 */
export async function POST(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    const { selectedIds } = await request.json();
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
      return NextResponse.json(
        { error: '驕ｸ謚槭＆繧後◆蜊倅ｽ巧D縺後≠繧翫∪縺帙ｓ' },
        { status: 400 }
      );
    }

    const db = await initializeDatabase();

    const youngestId = selectedIds.sort()[0];
    const newListId = youngestId.replace('KT-', 'KL-');

    // Check if selected konpo tanni IDs have existing list IDs
    const checkResult = await db.all(`
      SELECT KONPO_TANNI_ID, KONPO_LIST_ID
      FROM KONPO_TANNI
      WHERE KONPO_TANNI_ID IN (${selectedIds.map(() => '?').join(',')})
    `, selectedIds);

    // Check if any records already have list IDs set
    const hasExistingListId = checkResult.some(record => 
      record.KONPO_LIST_ID && record.KONPO_LIST_ID.trim() !== ''
    );

    if (hasExistingListId) {
      return NextResponse.json(
        { error: 'Some records already have list IDs assigned' },
        { status: 400 }
      );
    }

    // 繝医Λ繝ｳ繧ｶ繧ｯ繧ｷ繝ｧ繝ｳ髢句ｧ・    await db.run('BEGIN TRANSACTION');

    try {
      // 繝ｪ繧ｹ繝・D繧呈峩譁ｰ
      const updateResult = await db.run(`
        UPDATE KONPO_TANNI
        SET KONPO_LIST_ID = ?
        WHERE KONPO_TANNI_ID IN (${selectedIds.map(() => '?').join(',')})
      `, [newListId, ...selectedIds]);

      // KONPO_LIST繝・・繝悶Ν縺ｫ譁ｰ隕上Ξ繧ｳ繝ｼ繝峨ｒ菴懈・
      await db.run(`
        INSERT INTO KONPO_LIST (
          KONPO_LIST_ID,
          PROJECT_ID
        ) VALUES (?, ?)
      `, [newListId, params.project_id]);

      // 繝医Λ繝ｳ繧ｶ繧ｯ繧ｷ繝ｧ繝ｳ繧偵さ繝溘ャ繝・      await db.run('COMMIT');

      return NextResponse.json({
        success: true,
        message: '繝ｪ繧ｹ繝・D縺ｮ譖ｴ譁ｰ縺ｨ譁ｰ隕上Μ繧ｹ繝医・菴懈・縺悟ｮ御ｺ・＠縺ｾ縺励◆',
        data: {
          newListId,
          updatedCount: updateResult.changes
        }
      });

    } catch (error) {
      // 繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺溷ｴ蜷医・繝ｭ繝ｼ繝ｫ繝舌ャ繧ｯ
      await db.run('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error in make_konpo_list route:', error);
    return NextResponse.json(
      { error: '繝ｪ繧ｹ繝・D縺ｮ譖ｴ譁ｰ縺ｫ螟ｱ謨励＠縺ｾ縺励◆' },
      { status: 500 }
    );
  }
}
