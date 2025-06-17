import { NextResponse } from 'next/server';
import { getAllProjects } from '@bom/src/lib/db_utils';

//プロジェクト情報を取得するためのAPI
export async function GET() {
  try {
    const projects = getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('プロジェクトの取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'プロジェクトの取得に失敗しました' },
      { status: 500 }
    );
  }
} 