/* eslint-disable @typescript-eslint/no-explicit-any */
//projedt make konnpo繝壹・繧ｸ逕ｨ
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
      WITH PartBuzai AS (
        SELECT 
          p.ZUMEN_ID,
          p.PART_ID,
          GROUP_CONCAT(b.BUZAI_NAME || ' (' || b.BUZAI_QUANTITY || '蛟・') as BUZAI_INFO,
          GROUP_CONCAT(b.BUZAI_WEIGHT) as BUZAI_WEIGHTS,
          GROUP_CONCAT(b.ZAISITU_NAME) as ZAISITU_NAMES
        FROM BOM_PART p
        LEFT JOIN BOM_BUZAI b ON p.ZUMEN_ID = b.Zumen_ID 
          AND p.PART_ID = b.PART_ID
        GROUP BY p.ZUMEN_ID, p.PART_ID
      )
      SELECT
        kl.KONPO_LIST_ID,
        kl.PROJECT_ID,
        kl.KONPO_LIST_WEIGHT,
        kl.HASSOU_IN,
        kl.HASSOU_TO,
        kl.IMAGE_ID,

        kt.KONPO_TANNI_ID,
        kt.ZUMEN_ID AS KT_ZUMEN_ID,
        kt.PART_ID AS KT_PART_ID,
        kt.PART_KO,
        kt.ZENSU_KO,

        z.Zumen_Name,
        z.Zumen_Kind,
        z.Souti_ID,
        z.Souti_name,

        p.PART_NAME,
        p.QUANTITY,
        p.SPARE_QUANTITY,
        p.MANUFACTURER,
        p.TEHAI_ID,
        p.PART_PROJECT_ID,
        p.PART_TANNI_WEIGHT,

        pb.BUZAI_INFO,
        pb.BUZAI_WEIGHTS,
        pb.ZAISITU_NAMES

      FROM KONPO_LIST kl
      LEFT JOIN KONPO_TANNI kt ON kl.KONPO_LIST_ID = kt.KONPO_LIST_ID
      LEFT JOIN BOM_ZUMEN z ON kt.ZUMEN_ID = z.Zumen_ID
      LEFT JOIN BOM_PART p ON kt.ZUMEN_ID = p.ZUMEN_ID AND kt.PART_ID = p.PART_ID
      LEFT JOIN PartBuzai pb ON p.ZUMEN_ID = pb.ZUMEN_ID AND p.PART_ID = pb.PART_ID
      WHERE kl.PROJECT_ID = ?
      ORDER BY kl.KONPO_LIST_ID, kt.KONPO_TANNI_ID
    `;

    const result = await db.all(query, [projectId]);

    // 驛ｨ譚先ュ蝣ｱ繧偵ヱ繝ｼ繧ｹ縺励※謨ｴ蠖｢
    const formattedResult = result.map((row: any) => {
      if (row.BUZAI_INFO) {
        const buzaiInfo = row.BUZAI_INFO.split(',');
        const buzaiWeights = row.BUZAI_WEIGHTS.split(',');
        const zaisituNames = row.ZAISITU_NAMES.split(',');
        
        const buzaiList = buzaiInfo.map((info: string, index: number) => {
          const [name, quantity] = info.split(' (');
          return {
            BUZAI_NAME: name,
            BUZAI_WEIGHT: buzaiWeights[index],
            BUZAI_QUANTITY: quantity.replace('蛟・', ''),
            ZAISITU_NAME: zaisituNames[index]
          };
        });

        return {
          ...row,
          BUZAI_LIST: buzaiList
        };
      }
      return row;
    });

    return NextResponse.json(formattedResult);
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
