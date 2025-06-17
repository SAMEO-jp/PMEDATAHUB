import { NextRequest, NextResponse } from 'next/server';
import { getFileMetadata } from '../../../test/test_test/test';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('fileId');
  if (!fileId) {
    return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
  }
  try {
    const metadata = await getFileMetadata(fileId);
    return NextResponse.json(metadata);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 