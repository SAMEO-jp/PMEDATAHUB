import { NextResponse } from 'next/server';
import { GetAllData, GetConditionData } from '@src/lib/db/crud/db_GetData';
import { Project } from '@src/types/db_project';

// プロジェクト一覧を取得するAPI
export async function GET(request: Request) {
  console.log('API: list projects start');
  console.log('API: request URL:', request.url);
  try {
    const { searchParams } = new URL(request.url || '', 'http://localhost');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    console.log('API: params', { search, status, page, pageSize });

    let result;
    if (search) {
      console.log('API: do search', { search });
      result = await GetConditionData<Project[]>(
        'PROJECT_NAME LIKE ? OR PROJECT_CLIENT_NAME LIKE ?',
        [`%${search}%`, `%${search}%`],
        { tableName: 'PROJECT', idColumn: 'PROJECT_ID' }
      );
    } else {
      console.log('API: fetch all');
      console.log('API: calling GetAllData...');
      result = await GetAllData<Project[]>({ tableName: 'PROJECT' });
      console.log('API: GetAllData result:', result);
    }

    if (!result.success) {
      console.error('API: fetch error', result.error);
      throw new Error(result.error || 'failed to fetch');
    }

    let projects = result.data || [];

    if (status) {
      console.log('API: filter by status', { status });
      projects = projects.filter(project => project.PROJECT_STATUS === status);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProjects = projects.slice(start, end);

    const response = {
      projects: paginatedProjects,
      total: projects.length,
      search,
      page,
      pageSize,
    };

    console.log('API: response ready', { projectCount: paginatedProjects.length, total: projects.length });
    return NextResponse.json(response);
  } catch (error) {
    console.error('API: error', error);
    console.error('API: error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json({ 
      error: 'プロジェクトの取得に失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}