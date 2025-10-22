'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useProjectMembers } from '@src/hooks/useProjectData';

interface ManagePageProps {
  params: {
    project_id: string;
  };
}

// プロジェクトメンバーの型定義（tRPCから取得されるデータ構造に基づく）

export default function MemberManagePage({ params }: ManagePageProps) {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);

  // tRPCを使用してメンバー管理
  const {
    members,
    isLoading: loadingMembers,
    handleRemoveMember,
    isRemovingMember
  } = useProjectMembers(params.project_id);

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleAddMemberClick = () => {
    router.push(`/app_project/${params.project_id}/manage/member/new`);
  };

  // メンバー退出処理
  const handleRemoveMemberClick = async (userId: string) => {
    if (!window.confirm('本当にこのメンバーを退出させますか？')) return;

    try {
      await handleRemoveMember(userId);
      alert('メンバーを退出させました');
    } catch (error) {
      console.error('メンバー退出エラー:', error);
      alert('退出処理に失敗しました');
    }
  };

  if (loadingMembers) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <button
              onClick={() => router.push('/app_project')}
              className="hover:text-blue-600 transition-colors"
            >
              プロジェクト一覧
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}`)}
              className="hover:text-blue-600 transition-colors"
            >
              プロジェクト詳細
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage`)}
              className="hover:text-blue-600 transition-colors"
            >
              管理
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">メンバー管理</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">メンバー管理</h1>
          <p className="text-gray-600 mt-1">プロジェクトメンバーの追加・削除・管理を行います</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => router.push(`/app_project/${params.project_id}/manage`)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            管理トップに戻る
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>プロジェクトメンバー</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleEditClick} variant="outline">
                {isEditMode ? '編集終了' : '編集'}
              </Button>
              <Button
                onClick={handleAddMemberClick}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <span className="mr-2">➕</span>
                メンバー追加
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <span className="text-4xl">👥</span>
              </div>
              <p className="text-lg mb-2">メンバーがまだ登録されていません</p>
              <p className="text-sm mb-4">プロジェクトのメンバーを追加して、チームを構築しましょう</p>
              <Button
                onClick={handleAddMemberClick}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <span className="mr-2">➕</span>
                最初のメンバーを追加
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>社員番号</TableHead>
                  <TableHead>名前</TableHead>
                  <TableHead>電話番号</TableHead>
                  <TableHead>部署</TableHead>
                  <TableHead>室</TableHead>
                  <TableHead>課</TableHead>
                  <TableHead>役割</TableHead>
                  <TableHead>参加日</TableHead>
                  {isEditMode && <TableHead>操作</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member: any) => (
                  <TableRow key={member.member_id}>
                    <TableCell>{member.user.user_id}</TableCell>
                    <TableCell>{member.user.name_japanese}</TableCell>
                    <TableCell>{member.user.TEL}</TableCell>
                    <TableCell>{member.user.bumon}</TableCell>
                    <TableCell>{member.user.sitsu}</TableCell>
                    <TableCell>{member.user.ka}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{new Date(member.joined_at).toLocaleDateString('ja-JP')}</TableCell>
                    {isEditMode && (
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => void handleRemoveMemberClick(member.user.user_id)}
                          disabled={isRemovingMember}
                        >
                          {isRemovingMember ? '処理中...' : '退出させる'}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
