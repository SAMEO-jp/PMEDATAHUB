'use client';

import React from 'react';
import { useProjectGetAll } from '@src/hooks/useProjectData';
import Link from 'next/link';

export default function ProjectListPage() {
  const { data, isLoading, error } = useProjectGetAll({});

  if (isLoading) return <div className="container mx-auto p-4">ロード中...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">エラーが発生しました: {error.message}</div>;

  const projects = data?.data || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロジェクト一覧</h1>
      <Link href="/project/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
        新規プロジェクト追加
      </Link>

      {projects.length === 0 ? (
        <p>プロジェクトがありません。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">プロジェクトID</th>
                <th className="py-2 px-4 border-b">プロジェクト名</th>
                <th className="py-2 px-4 border-b">ステータスID</th>
                <th className="py-2 px-4 border-b">クライアントID</th>
                <th className="py-2 px-4 border-b">開始日</th>
                <th className="py-2 px-4 border-b">終了日</th>
                <th className="py-2 px-4 border-b">アクション</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.ID}>
                  <td className="py-2 px-4 border-b">{project.ID}</td>
                  <td className="py-2 px-4 border-b">{project.プロジェクトID}</td>
                  <td className="py-2 px-4 border-b">{project.プロジェクト名}</td>
                  <td className="py-2 px-4 border-b">{project.プロジェクトステータスID}</td>
                  <td className="py-2 px-4 border-b">{project.クライアント名ID}</td>
                  <td className="py-2 px-4 border-b">{project.プロジェクト開始日?.toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{project.プロジェクト終了日?.toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/project/${project.ID}/detail`} className="text-blue-600 hover:underline">
                      詳細
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
