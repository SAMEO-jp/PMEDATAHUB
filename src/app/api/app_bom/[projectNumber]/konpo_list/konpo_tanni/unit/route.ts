import { NextRequest, NextResponse } from 'next/server';
import { getKonpoUnits, createKonpoUnit, updateKonpoUnit, deleteKonpoUnit } from '@app/app_bom/src/lib/db';

// GET: 梱包単位の一覧を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const units = await getKonpoUnits(params.projectNumber);
    return NextResponse.json(units);
  } catch (error) {
    console.error('梱包単位の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '梱包単位の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POST: 新しい梱包単位を作成
export async function POST(
  request: NextRequest,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const data = await request.json();
    await createKonpoUnit(params.projectNumber, data);
    return NextResponse.json({ message: '梱包単位を作成しました' });
  } catch (error) {
    console.error('梱包単位の作成に失敗しました:', error);
    return NextResponse.json(
      { error: '梱包単位の作成に失敗しました' },
      { status: 500 }
    );
  }
}

// PUT: 梱包単位を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const data = await request.json();
    await updateKonpoUnit(params.projectNumber, data);
    return NextResponse.json({ message: '梱包単位を更新しました' });
  } catch (error) {
    console.error('梱包単位の更新に失敗しました:', error);
    return NextResponse.json(
      { error: '梱包単位の更新に失敗しました' },
      { status: 500 }
    );
  }
}

// DELETE: 梱包単位を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: '梱包単位IDが指定されていません' },
        { status: 400 }
      );
    }
    await deleteKonpoUnit(params.projectNumber, id);
    return NextResponse.json({ message: '梱包単位を削除しました' });
  } catch (error) {
    console.error('梱包単位の削除に失敗しました:', error);
    return NextResponse.json(
      { error: '梱包単位の削除に失敗しました' },
      { status: 500 }
    );
  }
}
