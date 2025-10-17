'use client';

import { useRouter } from 'next/navigation';

interface ManagePageProps {
  params: {
    project_id: string;
  };
}

export default function ManagePage({ params }: ManagePageProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">プロジェクト管理</h1>
        <button
          onClick={() => router.push(`/app_project/${params.project_id}`)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          戻る
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* メンバー管理 */}
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">メンバー管理</h2>
              <p className="mt-2 text-gray-600">プロジェクトメンバーの追加・削除・管理を行います</p>
            </div>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage/member`)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              メンバー管理へ
            </button>
          </div>
        </div>

        {/* 権限管理 */}
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">権限管理</h2>
              <p className="mt-2 text-gray-600">メンバーの権限設定とロール管理を行います</p>
            </div>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage/permissions`)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              権限管理へ
            </button>
          </div>
        </div>

        {/* 設備製番管理 */}
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">設備製番管理</h2>
              <p className="mt-2 text-gray-600">プロジェクトで使用する設備製番と担当者の管理を行います</p>
            </div>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage/setsubi`)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300"
            >
              設備管理へ
            </button>
          </div>
        </div>

        {/* 購入品管理 */}
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">購入品管理</h2>
              <p className="mt-2 text-gray-600">プロジェクトで使用する購入品と担当者の管理を行います</p>
            </div>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu`)}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-300"
            >
              購入品管理へ
            </button>
          </div>
        </div>

        {/* 関連プロジェクト管理 */}
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">関連プロジェクト</h2>
              <p className="mt-2 text-gray-600">関連するプロジェクトの管理を行います</p>
            </div>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage/related`)}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-300"
            >
              関連プロジェクトへ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
