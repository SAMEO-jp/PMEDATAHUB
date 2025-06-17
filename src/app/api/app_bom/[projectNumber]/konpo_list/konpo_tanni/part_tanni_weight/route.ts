import { NextRequest, NextResponse } from 'next/server';
import { updateKonpoUnitWeights } from '@app/app_bom/src/lib/db';

// POST: 梱包単位の重量を更新
export async function POST(
  request: NextRequest,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const result = await updateKonpoUnitWeights(params.projectNumber);
    return NextResponse.json({ 
      message: '梱包単位の重量を更新しました',
      updatedCount: result.changes
    });
  } catch (error) {
    console.error('梱包単位の重量更新に失敗しました:', error);
    return NextResponse.json(
      { error: '梱包単位の重量更新に失敗しました' },
      { status: 500 }
    );
  }
} 