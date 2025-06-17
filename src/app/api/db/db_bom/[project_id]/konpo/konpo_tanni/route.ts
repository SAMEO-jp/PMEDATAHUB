/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { GetAllData } from '@src/lib/db/db_GetData';
import { KonpoTanni } from '@src/types/db_konpo';

export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    // KONPO_TANNIテーブルの設定
    const tableConfig = {
      tableName: 'KONPO_TANNI',
      idColumn: 'KONPO_TANNI_ID'
    };

    // データを取得
    const result = await GetAllData<KonpoTanni[]>(tableConfig);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || 'データが見つかりませんでした' },
        { status: 500 }
      );
    }

    // KONPO_LIST_IDが存在するデータのみをフィルタリング
    const filteredData = result.data.filter(
      (item) => item.KONPO_LIST_ID !== null
    );

    return NextResponse.json({
      success: true,
      data: filteredData,
      count: filteredData.length
    });

  } catch (error) {
    console.error('KONPO_TANNIの取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
