import { NextResponse } from 'next/server';
import { GetRecode, GetConditionData } from '@src/lib/db/crud/db_GetData';
import type { BomFlatRow } from '@src/types/db_bom';
import type { ApiResponse } from '@src/types/api'; // 竊仙梛繝輔ぃ繧､繝ｫ縺九ｉ繧､繝ｳ繝昴・繝・
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
            message: '蝗ｳ髱｢繝・・繧ｿ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ',
            status: 404
          }
        },
        { status: 404 }
      );
    }

    const zumen = zumenResult.data;
    let relatedZumen: BomFlatRow[] = [];
    let detailZumen: BomFlatRow | null = null;

    if (zumen.Zumen_Kind === '邨・ｫ句峙') {
      const relatedResult = await GetConditionData<BomFlatRow[]>(
        'Kumitate_Zumen = ? AND Zumen_Kind != ?',
        [params.zumen_id, '邨・ｫ句峙'],
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
        [zumen.Zumen_ID, '隧ｳ邏ｰ蝗ｳ'],
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
    console.error('髢｢騾｣蝗ｳ髱｢繝・・繧ｿ蜿門ｾ励お繝ｩ繝ｼ:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '髢｢騾｣蝗ｳ髱｢繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
          status: 500
        }
      },
      { status: 500 }
    );
  }
}
