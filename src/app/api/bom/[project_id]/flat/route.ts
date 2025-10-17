/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/connection/db_connection';
import type { ApiResponse } from '@src/types/api';

// ==========================================
// 蝙句ｮ夂ｾｩ螻､・医Ξ繧ｹ繝昴Φ繧ｹ蝙九√ョ繝ｼ繧ｿ蝙具ｼ・// ==========================================
/**
 * 繝輔Λ繝・ヨBOM繝・・繧ｿ縺ｮ蝙句ｮ夂ｾｩ
 * @property project_ID - 繝励Ο繧ｸ繧ｧ繧ｯ繝・D
 * @property Zumen_ID - 蝗ｳ髱｢ID
 * @property Zumen_Name - 蝗ｳ髱｢蜷・ * @property PART_ID - 驛ｨ蜩！D
 * @property PART_NAME - 驛ｨ蜩∝錐
 * @property QUANTITY - 謨ｰ驥・ * @property SPARE_QUANTITY - 莠亥ｙ謨ｰ驥・ * @property MANUFACTURER - 陬ｽ騾蜈・ * @property BUZAI_ID - 驛ｨ譚蝕D
 * @property BUZAI_NAME - 驛ｨ譚仙錐
 * @property BUZAI_WEIGHT - 驛ｨ譚宣㍾驥・ * @property BUZAI_QUANTITY - 驛ｨ譚先焚驥・ * @property ZAISITU_NAME - 譚占ｳｪ蜷・ * @property KONPO_TANNI_ID - 蟾･豕募腰菴巧D
 * @property PART_KO - 驛ｨ蜩∝ｷ･豕・ * @property ZENSU_KO - 蜈ｨ謨ｰ蟾･豕・ * @property KONPO_LIST_ID - 蟾･豕輔Μ繧ｹ繝・D
 * @property KONPO_LIST_WEIGHT - 蟾･豕輔Μ繧ｹ繝磯㍾驥・ * @property HASSOU_IN - 逋ｺ騾∝・
 * @property HASSOU_TO - 逋ｺ騾∝・
 */
interface FlatBomData {
  project_ID: string;
  Zumen_ID: string;
  Zumen_Name: string;
  PART_ID: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  MANUFACTURER: string;
  BUZAI_ID: string | null;
  BUZAI_NAME: string | null;
  BUZAI_WEIGHT: string | null;
  BUZAI_QUANTITY: string | null;
  ZAISITU_NAME: string | null;
  KONPO_TANNI_ID: string | null;
  PART_KO: string | null;
  ZENSU_KO: string | null;
  KONPO_LIST_ID: string | null;
  KONPO_LIST_WEIGHT: string | null;
  HASSOU_IN: string | null;
  HASSOU_TO: string | null;
}

// ==========================================
// API螳溯｣・ｱ､・・ET 繝｡繧ｽ繝・ラ・・// ==========================================
/**
 * 繝励Ο繧ｸ繧ｧ繧ｯ繝医・繝輔Λ繝・ヨBOM繝・・繧ｿ繧貞叙蠕・ * @param request - HTTP繝ｪ繧ｯ繧ｨ繧ｹ繝・ * @param params - URL繝代Λ繝｡繝ｼ繧ｿ・・roject_id・・ * @returns 繝輔Λ繝・ヨBOM繝・・繧ｿ縺ｮ驟榊・
 */
export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  let db: any = null;
  
  try {
    // 繝代Λ繝｡繝ｼ繧ｿ讀懆ｨｼ
    const projectId = params.project_id;
    if (!projectId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_PROJECT_ID',
          message: '繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺梧欠螳壹＆繧後※縺・∪縺帙ｓ',
          status: 400
        }
      }, { status: 400 });
    }

    // 繝・・繧ｿ繝吶・繧ｹ謗･邯・    db = await initializeDatabase();
    if (!db) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'DATABASE_CONNECTION_FAILED',
          message: '繝・・繧ｿ繝吶・繧ｹ縺ｮ蛻晄悄蛹悶↓螟ｱ謨励＠縺ｾ縺励◆',
          status: 500
        }
      }, { status: 500 });
    }

    // 繝輔Λ繝・ヨBOM繝・・繧ｿ蜿門ｾ励け繧ｨ繝ｪ
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
      ORDER BY z.Zumen_ID, p.PART_ID, b.BUZAI_ID
    `;

    const result = await db.all(query, [projectId]);

    // 繝・・繧ｿ蝙句､画鋤
    const flatBomData: FlatBomData[] = result.map((row: any) => ({
      project_ID: row.project_ID,
      Zumen_ID: row.Zumen_ID,
      Zumen_Name: row.Zumen_Name,
      PART_ID: row.PART_ID,
      PART_NAME: row.PART_NAME,
      QUANTITY: Number(row.QUANTITY),
      SPARE_QUANTITY: Number(row.SPARE_QUANTITY),
      MANUFACTURER: row.MANUFACTURER,
      BUZAI_ID: row.BUZAI_ID,
      BUZAI_NAME: row.BUZAI_NAME,
      BUZAI_WEIGHT: row.BUZAI_WEIGHT,
      BUZAI_QUANTITY: row.BUZAI_QUANTITY,
      ZAISITU_NAME: row.ZAISITU_NAME,
      KONPO_TANNI_ID: row.KONPO_TANNI_ID,
      PART_KO: row.PART_KO,
      ZENSU_KO: row.ZENSU_KO,
      KONPO_LIST_ID: row.KONPO_LIST_ID,
      KONPO_LIST_WEIGHT: row.KONPO_LIST_WEIGHT,
      HASSOU_IN: row.HASSOU_IN,
      HASSOU_TO: row.HASSOU_TO
    }));

    return NextResponse.json<ApiResponse<FlatBomData[]>>({
      success: true,
      data: flatBomData
    });

  } catch (error) {
    console.error('繝輔Λ繝・ヨBOM繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'FLAT_BOM_FETCH_FAILED',
        message: '繝輔Λ繝・ヨBOM繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
        status: 500
      }
    }, { status: 500 });
  } finally {
    // 繝・・繧ｿ繝吶・繧ｹ謗･邯壹・遒ｺ螳溘↑繧ｯ繝ｭ繝ｼ繧ｺ
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('繝・・繧ｿ繝吶・繧ｹ繧ｯ繝ｭ繝ｼ繧ｺ譎ゅ↓繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆:', closeErr);
      }
    }
  }
}
