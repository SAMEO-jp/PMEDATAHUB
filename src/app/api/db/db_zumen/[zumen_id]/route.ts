import { NextRequest, NextResponse } from 'next/server';
import { GetRecode, GetConditionData } from '@src/lib/db/crud/db_GetData';
import { updateDataById, deleteById } from '@src/lib/db/crud/db_CRUD';
import type { BomFlatRow } from '@src/types/db_bom';
import type { ApiResponse } from '@src/types/api';

/**
 * 図面の取得
 * GET /api/db/db_zumen/[zumen_id]
 */
export async function GET(
  request: Request,
  { params }: { params: { zumen_id: string } }
) {
  try {
    console.log('図面データ取得リクエスト:', params.zumen_id); // デバッグ用

    const zumenResult = await GetRecode<BomFlatRow>(params.zumen_id, {
      tableName: 'BOM_ZUMEN',
      idColumn: 'Zumen_ID'
    });

    console.log('図面データ取得結果:', zumenResult); // デバッグ用

    if (!zumenResult.success || !zumenResult.data) {
      console.log('図面データが見つかりません:', params.zumen_id); // デバッグ用
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: { code: 'ZUMEN_NOT_FOUND', message: '図面データが見つかりません', status: 404 }
        },
        { status: 404 }
      );
    }

    const partsResult = await GetConditionData<BomFlatRow[]>(
      'ZUMEN_ID = ?',
      [params.zumen_id],
      { tableName: 'BOM_PART', idColumn: 'ROWID' }
    );

    const buzaisResult = await GetConditionData<BomFlatRow[]>(
      'ZUMEN_ID = ?',
      [params.zumen_id],
      { tableName: 'BOM_BUZAI', idColumn: 'ROWID' }
    );

    const response = {
      zumen: zumenResult.data,
      parts: partsResult.success ? partsResult.data : [],
      buzais: buzaisResult.success ? buzaisResult.data : []
    };

    console.log('図面データ取得成功:', response.zumen.Zumen_ID); // デバッグ用
    return NextResponse.json<ApiResponse<typeof response>>({ success: true, data: response });
  } catch (error) {
    console.error('BOMデータ取得エラー:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: { code: 'ZUMEN_FETCH_FAILED', message: 'データの取得に失敗しました', status: 500 }
      },
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
    const updates: Record<string, unknown> = await request.json();

    const result = await updateDataById(
      'BOM_ZUMEN',
      params.zumen_id,
      updates,
      'ZUMEN_ID'
    );

    if (!result.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: { code: 'ZUMEN_NOT_FOUND', message: '図面が見つかりません', status: 404 }
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof result.data>>({ success: true, data: result.data });
  } catch (error) {
    console.error('API: 図面更新エラー', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: { code: 'ZUMEN_UPDATE_FAILED', message: '図面の更新に失敗しました', status: 500 }
      },
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
    const result = await deleteById('BOM_ZUMEN', params.zumen_id, 'ZUMEN_ID');

    if (!result.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: { code: 'ZUMEN_NOT_FOUND', message: '図面が見つかりません', status: 404 }
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<{ message: string }>>({
      success: true,
      data: { message: '図面を削除しました' }
    });
  } catch (error) {
    console.error('API: 図面削除エラー', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: { code: 'ZUMEN_DELETE_FAILED', message: '図面の削除に失敗しました', status: 500 }
      },
      { status: 500 }
    );
  }
}
