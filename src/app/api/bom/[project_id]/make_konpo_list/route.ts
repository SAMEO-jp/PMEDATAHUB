import { NextResponse } from 'next/server';
import { initializeDatabase } from '../../../../../lib/db/db_connection';

/**
 * 選択された単位IDのリストIDを更新するAPI
 * リストIDは選択された中で最も若い単位IDを基に生成
 * リストIDが空の場合のみ更新可能
 * 同時にKONPO_LISTテーブルに新規レコードを作成
 */
export async function POST(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    const { selectedIds } = await request.json();
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
      return NextResponse.json(
        { error: '選択された単位IDがありません' },
        { status: 400 }
      );
    }

    const db = await initializeDatabase();

    // 選択された単位IDの中で最も若いものを取得
    const youngestId = selectedIds.sort()[0];
    // リストIDを生成（KT-をKL-に変更）
    const newListId = youngestId.replace('KT-', 'KL-');

    // 選択された単位IDのリストIDが空かどうかを確認
    const checkResult = await db.all(`
      SELECT KONPO_TANNI_ID, KONPO_LIST_ID
      FROM KONPO_TANNI
      WHERE KONPO_TANNI_ID IN (${selectedIds.map(() => '?').join(',')})
    `, selectedIds);

    // リストIDが既に設定されているレコードがないか確認
    const hasExistingListId = checkResult.some(record => 
      record.KONPO_LIST_ID && record.KONPO_LIST_ID.trim() !== ''
    );

    if (hasExistingListId) {
      return NextResponse.json(
        { error: '一部のレコードに既にリストIDが設定されています' },
        { status: 400 }
      );
    }

    // トランザクション開始
    await db.run('BEGIN TRANSACTION');

    try {
      // リストIDを更新
      const updateResult = await db.run(`
        UPDATE KONPO_TANNI
        SET KONPO_LIST_ID = ?
        WHERE KONPO_TANNI_ID IN (${selectedIds.map(() => '?').join(',')})
      `, [newListId, ...selectedIds]);

      // KONPO_LISTテーブルに新規レコードを作成
      await db.run(`
        INSERT INTO KONPO_LIST (
          KONPO_LIST_ID,
          PROJECT_ID
        ) VALUES (?, ?)
      `, [newListId, params.project_id]);

      // トランザクションをコミット
      await db.run('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'リストIDの更新と新規リストの作成が完了しました',
        data: {
          newListId,
          updatedCount: updateResult.changes
        }
      });

    } catch (error) {
      // エラーが発生した場合はロールバック
      await db.run('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error in make_konpo_list route:', error);
    return NextResponse.json(
      { error: 'リストIDの更新に失敗しました' },
      { status: 500 }
    );
  }
}
