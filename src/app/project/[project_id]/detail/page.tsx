'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useProjectGetById } from '@src/hooks/useProjectData';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.project_id ? parseInt(params.project_id as string, 10) : undefined;

  const { data, isLoading, error } = useProjectGetById(projectId as number);

  if (isLoading) return <div className="container mx-auto p-4">ロード中...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">エラーが発生しました: {error.message}</div>;
  if (!data?.data) return <div className="container mx-auto p-4">プロジェクトが見つかりません。</div>;

  const project = data.data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロジェクト詳細: {project.プロジェクト名}</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">プロジェクト情報</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.ID}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">プロジェクトID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.プロジェクトID}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">プロジェクト名</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.プロジェクト名}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">プロジェクト説明</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.プロジェクト説明 || 'N/A'}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">プロジェクト開始日</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.プロジェクト開始日?.toLocaleDateString() || 'N/A'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">プロジェクト終了日</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.プロジェクト終了日?.toLocaleDateString() || 'N/A'}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">プロジェクトステータスID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.プロジェクトステータスID || 'N/A'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">クライアント名ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.クライアント名ID || 'N/A'}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">プロジェクト分類ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.プロジェクト分類ID || 'N/A'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">予算グレードID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.予算グレードID || 'N/A'}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">設備カテゴリID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.設備カテゴリID || 'N/A'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">商品カテゴリID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.商品カテゴリID || 'N/A'}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">備考</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.備考 || 'N/A'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">プロジェクトフラグ</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.プロジェクトフラグ || 'N/A'}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">関連リンク</h3>
        <div className="space-y-2">
          <Link href={`/project/${project.ID}/business-group/list`} className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit">
            業務グループ一覧を見る
          </Link>
          <Link href={`/project/${project.ID}/business-group/create`} className="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-fit">
            新しい業務グループを追加
          </Link>
          <Link href="/project/list" className="block text-blue-600 hover:underline">
            プロジェクト一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
