//projedt make konnpoページ用

import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/db_connection';

export async function POST(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    const projectId = params.project_id;
    const db = await initializeDatabase();

    // デバッグ用: projectIdチェック
    if (!projectId) {
      return NextResponse.json({ error: 'プロジェクトIDがありません' }, { status: 400 });
    }

    // 登録対象の部品を取得
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

    // KONPO_TANNI に挿入
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
      message: 'コンポーネント単位の登録が完了しました',
      data: {
        selected: selectResult,
        inserted: insertResult.changes
      }
    });

  } catch (error) {
    console.error('Error in konpo route:', error);
    return NextResponse.json(
      { error: 'コンポーネント単位の登録に失敗しました' },
      { status: 500 }
    );
  }
}
