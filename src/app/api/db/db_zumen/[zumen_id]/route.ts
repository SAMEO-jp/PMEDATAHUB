import { NextRequest, NextResponse } from 'next/server';
import { GetRecode, GetConditionData } from '@src/lib/db/db_GetData';
import { updateDataById, deleteById } from '@src/lib/db/db_CRUD';
import type { BomFlatRow } from '@src/types/db_bom';

/**
 * 図面の取得
 * GET /api/db/db_zumen/[zumen_id]
 */
export async function GET(
  request: Request,
  { params }: { params: { zumen_id: string } }
) {
  try {
    // 図面データの取得
    const zumenResult = await GetRecode<BomFlatRow>(params.zumen_id, {
      tableName: 'BOM_ZUMEN',
      idColumn: 'Zumen_ID'
    });

    if (!zumenResult.success || !zumenResult.data) {
      return NextResponse.json(
        { error: '図面データが見つかりません' },
        { status: 404 }
      );
    }

    // 部品データの取得
    const partsResult = await GetConditionData<BomFlatRow[]>(
      'ZUMEN_ID = ?',
      [params.zumen_id],
      {
        tableName: 'BOM_PART',
        idColumn: 'ROWID'
      }
    );

    // 部材データの取得
    const buzaisResult = await GetConditionData<BomFlatRow[]>(
      'ZUMEN_ID = ?',
      [params.zumen_id],
      {
        tableName: 'BOM_BUZAI',
        idColumn: 'ROWID'
      }
    );

    // レスポンスデータの構築
    const response = {
      zumen: zumenResult.data,
      parts: partsResult.success ? partsResult.data : [],
      buzais: buzaisResult.success ? buzaisResult.data : []
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('BOMデータ取得エラー:', error);
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * 図面の更新
 * PUT /api/db/db_zumen/[zumen_id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { zumen_id: string } }
) {
  try {
    console.log('API: 図面更新開始', { zumenId: params.zumen_id });
    const updates = await request.json();

    const result = await updateDataById(
      'BOM_ZUMEN',
      params.zumen_id,
      updates as Record<string, unknown>,
      'ZUMEN_ID'
    );

    if (!result.success) {
      console.log('API: 図面が見つかりません', { zumenId: params.zumen_id });
      return NextResponse.json(
        { error: '図面が見つかりません' },
        { status: 404 }
      );
    }

    console.log('API: 図面更新成功', { zumenId: params.zumen_id });
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('API: 図面更新エラー', error);
    return NextResponse.json(
      { error: '図面の更新に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * 図面の削除
 * DELETE /api/db/db_zumen/[zumen_id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { zumen_id: string } }
) {
  try {
    console.log('API: 図面削除開始', { zumenId: params.zumen_id });
    const result = await deleteById('BOM_ZUMEN', params.zumen_id, 'ZUMEN_ID');

    if (!result.success) {
      console.log('API: 図面が見つかりません', { zumenId: params.zumen_id });
      return NextResponse.json(
        { error: '図面が見つかりません' },
        { status: 404 }
      );
    }

    console.log('API: 図面削除成功', { zumenId: params.zumen_id });
    return NextResponse.json({ message: '図面を削除しました' });
  } catch (error) {
    console.error('API: 図面削除エラー', error);
    return NextResponse.json(
      { error: '図面の削除に失敗しました' },
      { status: 500 }
    );
  }
}



