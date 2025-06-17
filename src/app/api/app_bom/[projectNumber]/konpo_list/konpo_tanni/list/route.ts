import { NextRequest, NextResponse } from 'next/server';
import { getKonpoLists, createKonpoList } from '@app/app_bom/src/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const lists = await getKonpoLists(params.projectNumber);
    return NextResponse.json(lists);
  } catch (error) {
    console.error('梱包リストの取得に失敗しました:', error);
    return NextResponse.json(
      { error: '梱包リストの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const data = await request.json();
    await createKonpoList(params.projectNumber, data);
    return NextResponse.json({ message: '梱包リストを作成しました' });
  } catch (error) {
    console.error('梱包リストの作成に失敗しました:', error);
    return NextResponse.json(
      { error: '梱包リストの作成に失敗しました' },
      { status: 500 }
    );
  }
} 