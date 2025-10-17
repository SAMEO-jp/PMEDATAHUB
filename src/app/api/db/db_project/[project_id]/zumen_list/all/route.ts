import { NextRequest, NextResponse } from 'next/server';
import { GetConditionData } from '@src/lib/db/crud/db_GetData';
import { BomZumen } from '@src/types/db_bom';

interface ZumenResponse {
  projectId: string;
  total: number;
  zumenList: BomZumen[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { project_id: string } }
) {
  try {
    console.log('蝗ｳ髱｢荳隕ｧ縺ｮ蜿門ｾ励ｒ髢句ｧ・', params.project_id);

    // 繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｮ讀懆ｨｼ
    if (!params.project_id) {
      console.error('繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺梧欠螳壹＆繧後※縺・∪縺帙ｓ');
      return NextResponse.json(
        { error: '繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺梧欠螳壹＆繧後※縺・∪縺帙ｓ' },
        { status: 400 }
      );
    }

    // 図面一覧を取得
    const result = await GetConditionData<BomZumen[]>(
      'PROJECT_ID = ?',
      [params.project_id],
      {
        tableName: 'BOM_ZUMEN',
        idColumn: 'ZUMEN_ID'
      }
    );

    if (!result.success) {
      console.error('蝗ｳ髱｢荳隕ｧ縺ｮ蜿門ｾ励↓螟ｱ謨・', result.error);
      return NextResponse.json(
        { error: result.error || '蝗ｳ髱｢荳隕ｧ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆' },
        { status: 500 }
      );
    }

    // 繝ｬ繧ｹ繝昴Φ繧ｹ縺ｮ菴懈・
    const response: ZumenResponse = {
      projectId: params.project_id,
      total: result.count || 0,
      zumenList: result.data || []
    };

    console.log('蝗ｳ髱｢荳隕ｧ縺ｮ蜿門ｾ励′螳御ｺ・', response.total, '莉ｶ');
    return NextResponse.json(response);
  } catch (error) {
    console.error('蝗ｳ髱｢荳隕ｧ縺ｮ蜿門ｾ嶺ｸｭ縺ｫ繧ｨ繝ｩ繝ｼ縺檎匱逕・', error);
    return NextResponse.json(
      { error: '蝗ｳ髱｢荳隕ｧ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆' },
      { status: 500 }
    );
  }
}
