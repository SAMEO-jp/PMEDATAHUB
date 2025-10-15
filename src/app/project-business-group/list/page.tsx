'use client';

import React from 'react';
import { useProjectBusinessGroupGetAll } from '@src/hooks/useProjectBusinessGroupData';
import Link from 'next/link';

export default function ProjectBusinessGroupListPage() {
  const { data, isLoading, error } = useProjectBusinessGroupGetAll({});

  if (isLoading) return <div className="container mx-auto p-4">ロード中...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">エラーが発生しました: {error.message}</div>;

  const projectBusinessGroups = data?.data || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロジェクト業務グループ一覧</h1>
      <Link href="/project-business-group/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
        新規プロジェクト業務グループ追加
      </Link>

      {projectBusinessGroups.length === 0 ? (
        <p>プロジェクト業務グループがありません。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">プロジェクト業務グループID</th>
                <th className="py-2 px-4 border-b">親グループID</th>
                <th className="py-2 px-4 border-b">業務種類ID</th>
                <th className="py-2 px-4 border-b">プロジェクトID</th>
                <th className="py-2 px-4 border-b">業務種類ID_2</th>
                <th className="py-2 px-4 border-b">使用目的</th>
                <th className="py-2 px-4 border-b">設置場所</th>
                <th className="py-2 px-4 border-b">ステータス</th>
                <th className="py-2 px-4 border-b">使用開始日</th>
                <th className="py-2 px-4 border-b">使用終了日</th>
                <th className="py-2 px-4 border-b">トランザクションID</th>
                <th className="py-2 px-4 border-b">アクション</th>
              </tr>
            </thead>
            <tbody>
              {projectBusinessGroups.map((group) => (
                <tr key={group.ID}>
                  <td className="py-2 px-4 border-b">{group.ID}</td>
                  <td className="py-2 px-4 border-b">{group.プロジェクト業務グループID}</td>
                  <td className="py-2 px-4 border-b">{group.親グループID}</td>
                  <td className="py-2 px-4 border-b">{group.業務種類ID}</td>
                  <td className="py-2 px-4 border-b">{group.プロジェクトID}</td>
                  <td className="py-2 px-4 border-b">{group.業務種類ID_2}</td>
                  <td className="py-2 px-4 border-b">{group.使用目的}</td>
                  <td className="py-2 px-4 border-b">{group.設置場所}</td>
                  <td className="py-2 px-4 border-b">{group.ステータス}</td>
                  <td className="py-2 px-4 border-b">{group.使用開始日?.toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{group.使用終了日?.toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{group.トランザクションID}</td>
                  <td className="py-2 px-4 border-b">
                    {/* 将来的に編集・削除リンクを追加 */}
                    <Link href={`/project-business-group/${group.ID}/detail`} className="text-blue-600 hover:underline">
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
