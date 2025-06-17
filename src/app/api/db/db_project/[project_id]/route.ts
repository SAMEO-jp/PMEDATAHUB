import { NextRequest, NextResponse } from 'next/server';
import { GetRecode } from '@src/lib/db/db_GetData';
import { updateDataById, deleteById } from '@src/lib/db/db_CRUD';
import { Project } from '@src/types/db_project';

/**
 * プロジェクトの取得
 * GET /api/db/db_project/[project_id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { project_id: string } }
) {
  try {
    console.log('API: プロジェクト取得開始', { projectId: params.project_id });
    const result = await GetRecode<Project>(params.project_id, {
      tableName: 'PROJECT',
      idColumn: 'PROJECT_ID'
    });

    if (!result.success) {
      console.log('API: プロジェクトが見つかりません', { projectId: params.project_id });
      return NextResponse.json(
        { error: 'プロジェクトが見つかりません' },
        { status: 404 }
      );
    }

    console.log('API: プロジェクト取得成功', { projectId: params.project_id });
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('API: プロジェクト取得エラー', error);
    return NextResponse.json(
      { error: 'プロジェクトの取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * プロジェクトの更新
 * PUT /api/db/db_project/[project_id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { project_id: string } }
) {
  try {
    console.log('API: プロジェクト更新開始', { projectId: params.project_id });
    const updates = await request.json();

    const result = await updateDataById(
      'PROJECT',
      params.project_id,
      updates as Record<string, unknown>,
      'PROJECT_ID'
    );

    if (!result.success) {
      console.log('API: プロジェクトが見つかりません', { projectId: params.project_id });
      return NextResponse.json(
        { error: 'プロジェクトが見つかりません' },
        { status: 404 }
      );
    }

    console.log('API: プロジェクト更新成功', { projectId: params.project_id });
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('API: プロジェクト更新エラー', error);
    return NextResponse.json(
      { error: 'プロジェクトの更新に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * プロジェクトの削除
 * DELETE /api/db/db_project/[project_id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { project_id: string } }
) {
  try {
    console.log('API: プロジェクト削除開始', { projectId: params.project_id });
    const result = await deleteById('PROJECT', params.project_id, 'PROJECT_ID');

    if (!result.success) {
      console.log('API: プロジェクトが見つかりません', { projectId: params.project_id });
      return NextResponse.json(
        { error: 'プロジェクトが見つかりません' },
        { status: 404 }
      );
    }

    console.log('API: プロジェクト削除成功', { projectId: params.project_id });
    return NextResponse.json({ message: 'プロジェクトを削除しました' });
  } catch (error) {
    console.error('API: プロジェクト削除エラー', error);
    return NextResponse.json(
      { error: 'プロジェクトの削除に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * プロジェクトのステータス更新
 * PATCH /api/db/db_project/[project_id]/status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { project_id: string } }
) {
  try {
    console.log('API: プロジェクトステータス更新開始', { projectId: params.project_id });
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'ステータスが指定されていません' },
        { status: 400 }
      );
    }

    const result = await updateDataById(
      'PROJECT',
      params.project_id,
      { PROJECT_STATUS: status } as Record<string, unknown>,
      'PROJECT_ID'
    );

    if (!result.success) {
      console.log('API: プロジェクトが見つかりません', { projectId: params.project_id });
      return NextResponse.json(
        { error: 'プロジェクトが見つかりません' },
        { status: 404 }
      );
    }

    console.log('API: プロジェクトステータス更新成功', { projectId: params.project_id });
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('API: プロジェクトステータス更新エラー', error);
    return NextResponse.json(
      { error: 'プロジェクトのステータス更新に失敗しました' },
      { status: 500 }
    );
  }
}
