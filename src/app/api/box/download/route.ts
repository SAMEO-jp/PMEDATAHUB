import { NextRequest, NextResponse } from 'next/server';
import { getFileDownloadUrl } from '../../../test/test_test/test';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('fileId');
  if (!fileId) {
    return new NextResponse('fileId is required', { status: 400 });
  }
  try {
    const url = await getFileDownloadUrl(fileId);
    return new NextResponse(url);
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 500 });
  }
} 