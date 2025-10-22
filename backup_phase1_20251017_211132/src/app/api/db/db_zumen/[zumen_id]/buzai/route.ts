import { NextResponse } from 'next/server';
import { GetConditionData } from '@src/lib/db/crud/db_GetData';
import type { BomBuzai } from '@src/types/db_bom';

export async function GET(
  request: Request,
  { params }: { params: { zumen_id: string } }
) {
  try {
    const zumenId = params.zumen_id;

    // 驛ｨ譚先ュ蝣ｱ縺ｮ蜿門ｾ・
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
      { success: false, error: '驛ｨ譚舌ョ繝ｼ繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆' },
      { status: 500 }
    );
  }
} 