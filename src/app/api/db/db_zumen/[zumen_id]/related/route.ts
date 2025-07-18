import { NextResponse } from 'next/server';
import { GetRecode, GetConditionData } from '@src/lib/db/db_GetData';
import type { BomFlatRow } from '@src/types/db_bom';
import type { ApiResponse } from '@src/types/api'; // ←型ファイルからインポート

type RelatedZumenResult = {
  relatedZumen: BomFlatRow[];
  detailZumen: BomFlatRow | null;
};

export async function GET(
  request: Request,
  { params }: { params: { zumen_id: string } }
): Promise<NextResponse<ApiResponse<RelatedZumenResult>>> {
  try {
    const zumenResult = await GetRecode<BomFlatRow>(params.zumen_id, {
      tableName: 'BOM_ZUMEN',
      idColumn: 'Zumen_ID'
    });

    if (!zumenResult.success || !zumenResult.data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '図面データが見つかりません',
            status: 404
          }
        },
        { status: 404 }
      );
    }

    const zumen = zumenResult.data;
    let relatedZumen: BomFlatRow[] = [];
    let detailZumen: BomFlatRow | null = null;

    if (zumen.Zumen_Kind === '組立図') {
      const relatedResult = await GetConditionData<BomFlatRow[]>(
        'Kumitate_Zumen = ? AND Zumen_Kind != ?',
        [params.zumen_id, '組立図'],
        {
          tableName: 'BOM_ZUMEN',
          idColumn: 'ROWID'
        }
      );
      if (relatedResult.success) {
        relatedZumen = relatedResult.data || [];
      }

      const detailResult = await GetConditionData<BomFlatRow[]>(
        'Kumitate_Zumen = ? AND Zumen_Kind = ?',
        [zumen.Zumen_ID, '詳細図'],
        {
          tableName: 'BOM_ZUMEN',
          idColumn: 'ROWID'
        }
      );
      if (detailResult.success && detailResult.data && detailResult.data.length > 0) {
        detailZumen = detailResult.data[0];
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        relatedZumen,
        detailZumen
      }
    });
  } catch (error) {
    console.error('関連図面データ取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '関連図面データの取得に失敗しました',
          status: 500
        }
      },
      { status: 500 }
    );
  }
}
