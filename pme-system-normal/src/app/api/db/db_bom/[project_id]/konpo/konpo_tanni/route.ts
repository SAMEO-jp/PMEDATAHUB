/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { GetAllData } from '@src/lib/db/crud/db_GetData';
import { KonpoTanni } from '@src/types/db_konpo';

export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    // KONPO_TANNI table configuration
    const tableConfig = {
      tableName: 'KONPO_TANNI',
      idColumn: 'KONPO_TANNI_ID'
    };

    // Get data
    const result = await GetAllData<KonpoTanni[]>(tableConfig);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || '繝・・繧ｿ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆' },
        { status: 500 }
      );
    }

    // KONPO_LIST_ID縺悟ｭ伜惠縺吶ｋ繝・・繧ｿ縺ｮ縺ｿ繧偵ヵ繧｣繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
    const filteredData = result.data.filter(
      (item) => item.KONPO_LIST_ID !== null
    );

    return NextResponse.json({
      success: true,
      data: filteredData,
      count: filteredData.length
    });

  } catch (error) {
    console.error('KONPO_TANNI縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:', error);
    return NextResponse.json(
      { error: '繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆' },
      { status: 500 }
    );
  }
}
