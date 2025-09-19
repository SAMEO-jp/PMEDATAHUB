import { NextResponse } from 'next/server';
import { GetConditionData } from '@src/lib/db/crud/db_GetData';
import type { KonpoTanni } from '@src/types/db_konpo';

export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    const projectId = params.project_id;
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: '繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺梧欠螳壹＆繧後※縺・∪縺帙ｓ' },
        { status: 400 }
      );
    }

    // Get konpo tanni list
    const result = await GetConditionData<KonpoTanni[]>(
      'PROJECT_ID = ?',
      [projectId],
      {
        tableName: 'KONPO_TANNI',
        idColumn: 'KONPO_TANNI_ID'
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.count
    });

  } catch (error) {
    console.error('譴ｱ蛹・腰菴阪Μ繧ｹ繝医・蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:', error);
    return NextResponse.json(
      { success: false, error: '繧ｵ繝ｼ繝舌・繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆' },
      { status: 500 }
    );
  }
}
