/* eslint-disable @typescript-eslint/no-explicit-any */
//projedt make konnpoページ用
import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/db_connection';

export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  let db: any = null;
  try {
    const projectId = params.project_id;
    db = await initializeDatabase();

    if (!db) {
      throw new Error('データベースの初期化に失敗しました');
    }

    const query = `
      WITH PartBuzai AS (
        SELECT 
          p.ZUMEN_ID,
          p.PART_ID,
          GROUP_CONCAT(b.BUZAI_NAME || ' (' || b.BUZAI_QUANTITY || '個)') as BUZAI_INFO,
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

    // 部材情報をパースして整形
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
            BUZAI_QUANTITY: quantity.replace('個)', ''),
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
    console.error('データの取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'データベースエラーが発生しました' },
      { status: 500 }
    );
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
