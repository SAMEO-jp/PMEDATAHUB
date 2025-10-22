'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useProjectHeader } from './hooks/useProjectHeader';
import { useProjectById, useProjectOperations } from '@src/hooks/useProjectData';

interface PageProps {
  params: {
    project_id: string;
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Record<string, any>>({});

  // tRPCを使用してプロジェクトデータを取得
  const { data: project, isLoading, error } = useProjectById(params.project_id);
  const { handleUpdate, handleDelete, refreshData } = useProjectOperations();

  // プロジェクト情報をヘッダーストアに設定（データ取得後に実行）
  useProjectHeader(project?.data || null);

  // プロジェクトの更新処理
  const handleUpdateProject = async () => {
    if (!project?.data) return;
    
    try {
      await handleUpdate(params.project_id, editedProject);
      setIsEditing(false);
      setEditedProject({});
    } catch (err) {
      console.error('プロジェクトの更新に失敗しました:', err);
    }
  };

  // プロジェクトの削除処理
  const handleDeleteProject = async () => {
    if (!confirm('このプロジェクトを削除してもよろしいですか？')) {
      return;
    }

    try {
      await handleDelete(params.project_id);
      router.push('/app_project');
    } catch (err) {
      console.error('プロジェクトの削除に失敗しました:', err);
    }
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error.message}</p>
          <button
            onClick={() => router.push('/app_project')}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            プロジェクト一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  if (!project?.data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>プロジェクトが見つかりません</p>
          <button
            onClick={() => router.push('/app_project')}
            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            プロジェクト一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const projectData = project.data;

  return (
    <div className="project-page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">プロジェクト詳細</h1>
          <div className="space-x-2">
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage`)}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              管理
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEditing ? 'キャンセル' : '編集'}
            </button>
            <button
              onClick={() => void handleDeleteProject()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              削除
            </button>
          </div>
        </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">基本情報</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">プロジェクトID</label>
                <div className="mt-1">{projectData.PROJECT_ID}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">プロジェクト名</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProject.PROJECT_NAME || projectData.PROJECT_NAME || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, PROJECT_NAME: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-1">{projectData.PROJECT_NAME}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ステータス</label>
                {isEditing ? (
                  <select
                    value={editedProject.PROJECT_STATUS || projectData.PROJECT_STATUS || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, PROJECT_STATUS: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="active">進行中</option>
                    <option value="completed">完了</option>
                    <option value="archived">アーカイブ</option>
                  </select>
                ) : (
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        projectData.PROJECT_STATUS === 'active'
                          ? 'bg-green-100 text-green-800'
                          : projectData.PROJECT_STATUS === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {projectData.PROJECT_STATUS === 'active'
                        ? '進行中'
                        : projectData.PROJECT_STATUS === 'completed'
                        ? '完了'
                        : 'アーカイブ'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">詳細情報</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">クライアント名</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProject.PROJECT_CLIENT_NAME || projectData.PROJECT_CLIENT_NAME || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, PROJECT_CLIENT_NAME: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-1">{projectData.PROJECT_CLIENT_NAME}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">開始日</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedProject.PROJECT_START_DATE || projectData.PROJECT_START_DATE || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, PROJECT_START_DATE: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-1">{projectData.PROJECT_START_DATE}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">終了予定日</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedProject.PROJECT_START_ENDDATE || projectData.PROJECT_START_ENDDATE || ''}
                    onChange={(e) => setEditedProject({ ...editedProject, PROJECT_START_ENDDATE: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="mt-1">{projectData.PROJECT_START_ENDDATE}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">説明</h2>
          {isEditing ? (
            <textarea
              value={editedProject.PROJECT_DESCRIPTION || projectData.PROJECT_DESCRIPTION || ''}
              onChange={(e) => setEditedProject({ ...editedProject, PROJECT_DESCRIPTION: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          ) : (
            <div className="mt-1 whitespace-pre-wrap">{projectData.PROJECT_DESCRIPTION}</div>
          )}
        </div>



        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => void handleUpdateProject()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        )}
      </div>

      {/* 図面一覧へのリンクカード */}
      <div className="mt-8">
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">図面一覧</h2>
              <p className="mt-2 text-gray-600">このプロジェクトに関連する図面を管理します</p>
            </div>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/zumen/all_list`)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              図面一覧へ
            </button>
          </div>
        </div>
      </div>

      {/* 梱包パレット作成へのリンクカード */}
      <div className="mt-8">
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">梱包パレット作成</h2>
              <p className="mt-2 text-gray-600">梱包パレットの作成と管理を行います</p>
            </div>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/konpo/make_palet`)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              パレット作成へ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
