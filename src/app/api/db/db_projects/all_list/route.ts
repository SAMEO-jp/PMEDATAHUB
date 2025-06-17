import { NextResponse } from 'next/server';
import { GetAllData, GetConditionData } from '@src/lib/db/db_GetData';
import { Project } from '@src/types/db_project';

/** * プロジェクト一覧を取得するAPI  */
export async function GET(request: Request) {
  console.log('API: プロジェクト一覧取得開始');
  
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    console.log('API: パラメータ', {
      search,
      status,
      page,
      pageSize
    });

    let result;
    if (search) {
      console.log('API: 検索実行', { search });
      result = await GetConditionData<Project[]>(
        'PROJECT_NAME LIKE ?',
        [`%${search}%`],
        { tableName: 'PROJECT', idColumn: 'PROJECT_ID' }
      );
    } else {
      console.log('API: 全件取得');
      result = await GetAllData<Project[]>({
        tableName: 'PROJECT'
      });
    }

    if (!result.success) {
      console.error('API: データ取得エラー', result.error);
      throw new Error(result.error || 'データの取得に失敗しました');
    }

    let projects = result.data || [];

    // ステータスでフィルタリング
    if (status) {
      console.log('API: ステータスフィルター適用', { status });
      projects = projects.filter(project => project.PROJECT_STATUS === status);
    }

    // ページネーション
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProjects = projects.slice(start, end);

    const response = {
      projects: paginatedProjects,
      total: projects.length,
      search,
      page,
      pageSize
    };

    console.log('API: レスポンス作成完了', {
      projectCount: paginatedProjects.length,
      total: projects.length
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('API: エラー発生', error);
    return NextResponse.json(
      { error: 'プロジェクトの取得に失敗しました' },
      { status: 500 }
    );
  }
}
