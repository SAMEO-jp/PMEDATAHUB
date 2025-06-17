import { NextResponse } from 'next/server';
import { GetConditionData } from '@src/lib/db/db_GetData';
import type { BomBuzai } from '@src/types/db_bom';

export async function GET(
  request: Request,
  { params }: { params: { zumen_id: string } }
) {
  try {
    const zumenId = params.zumen_id;

    // 部材情報の取得
    const buzaiResult = await GetConditionData<BomBuzai[]>(
      'ZUMEN_ID = ?',
      [zumenId],
      {
        tableName: 'BOM_BUZAI',
        idColumn: 'BUZAI_ID'
      }
    );

    if (!buzaiResult.success) {
      return NextResponse.json(
        { success: false, error: buzaiResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: buzaiResult.data
    });
  } catch (error) {
    console.error('Error fetching buzai data:', error);
    return NextResponse.json(
      { success: false, error: '部材データの取得に失敗しました' },
      { status: 500 }
    );
  }
} 