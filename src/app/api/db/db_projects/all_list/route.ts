import { NextResponse } from 'next/server';
import { GetAllData, GetConditionData } from '@src/lib/db/crud/db_GetData';
import { Project } from '@src/types/db_project';

// プロジェクト一覧を取得するAPI
export async function GET(request: Request) {
  console.log('API: list projects start');
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
      result = await GetAllData<Project[]>({ tableName: 'PROJECT' });
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
    return NextResponse.json({ error: 'プロジェクトの取得に失敗しました' }, { status: 500 });
  }
}