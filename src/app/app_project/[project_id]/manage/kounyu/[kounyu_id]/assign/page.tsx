'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from '@src/lib/trpc/client';
import { useProjectMembers } from '@src/hooks/useProjectData';
import { ArrowLeft, UserPlus, UserMinus, Users, ChevronRight } from 'lucide-react';

interface AssignPageProps {
  params: {
    project_id: string;
    kounyu_id: string;
  };
}

export default function KounyuAssignPage({ params }: AssignPageProps) {
  const router = useRouter();
  const kounyuId = parseInt(params.kounyu_id);

  const { data: kounyuDetail, isLoading: loadingKounyu } = trpc.kounyu.getDetail.useQuery(
    { kounyu_id: kounyuId },
    { enabled: !isNaN(kounyuId) }
  );

  // プロジェクトメンバーを取得
  const { members: projectMembersData, loadingMembers: isLoadingProjectMembers } = useProjectMembers(params.project_id);

  // プロジェクトメンバーのデータを整形（ユーザー情報のみを抽出）
  const projectMembers = { success: true, data: projectMembersData?.map((member: any) => member.user) || [] };
  const loadingMembers = isLoadingProjectMembers;

  const assignMutation = trpc.kounyu.assignUser.useMutation();
  const removeMutation = trpc.kounyu.removeAssignment.useMutation();

  // 表示用メンバーデータ
  const members = projectMembersData?.map((member: any) => member.user) || [];

  const handleAssignUser = async (userId: string) => {
    try {
      await assignMutation.mutateAsync({
        project_id: params.project_id,
        kounyu_id: kounyuId,
        user_id: userId,
        status: 'active'
      });
      alert('担当者を割り当てました');
      // データを再取得
      window.location.reload();
    } catch (error) {
      console.error('担当者割り当てエラー:', error);
      alert('担当者の割り当てに失敗しました');
    }
  };

  const handleRemoveUser = async (assignmentId: number) => {
    if (!window.confirm('この担当者を解除しますか？')) return;

    try {
      await removeMutation.mutateAsync({ assignment_id: assignmentId });
      alert('担当者を解除しました');
      // データを再取得
      window.location.reload();
    } catch (error) {
      console.error('担当者解除エラー:', error);
      alert('担当者の解除に失敗しました');
    }
  };

  const isUserAssigned = (userId: string) => {
    return kounyuDetail?.data?.current_assignees?.some(assignee => assignee.user_id === userId) || false;
  };

  if (loadingKounyu) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!kounyuDetail?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">購入品が見つかりません</p>
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu`)}
            className="mt-4"
          >
            一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  const kounyu = kounyuDetail.data;

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
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}`)}
              className="hover:text-blue-600 transition-colors"
            >
              プロジェクト詳細
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage`)}
              className="hover:text-blue-600 transition-colors"
            >
              管理
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu`)}
              className="hover:text-blue-600 transition-colors"
            >
              購入品管理
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu/${kounyuId}`)}
              className="hover:text-blue-600 transition-colors"
            >
              {kounyu.management_number}
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-gray-900 font-medium">担当者管理</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">担当者管理</h1>
          <p className="text-gray-600 mt-1">
            {kounyu.item_name} ({kounyu.management_number}) の担当者を管理します
          </p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu/${kounyuId}`)}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            詳細に戻る
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 現在の担当者 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              現在の担当者 ({kounyu.current_assignees?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kounyu.current_assignees && kounyu.current_assignees.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名前</TableHead>
                    <TableHead>部署</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kounyu.current_assignees.map((assignee, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{assignee.name_japanese}</TableCell>
                      <TableCell>{assignee.department || '-'}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            // assignmentIdを取得する必要がある
                            const assignment = kounyu.assignments?.find(a => a.user_id === assignee.user_id);
                            if (assignment) {
                              handleRemoveUser(assignment.id);
                            }
                          }}
                          disabled={removeMutation.isPending}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">担当者が割り当てられていません</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* プロジェクトメンバー */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              プロジェクトメンバー
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMembers ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : members.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名前</TableHead>
                    <TableHead>部署</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((user: any) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">
                        {user.name_japanese}
                      </TableCell>
                      <TableCell>
                        {user.bumon} {user.sitsu} {user.ka}
                      </TableCell>
                      <TableCell>
                        {isUserAssigned(user.user_id) ? (
                          <Badge variant="default">担当中</Badge>
                        ) : (
                          <Badge variant="secondary">未担当</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {isUserAssigned(user.user_id) ? (
                          <Button size="sm" variant="outline" disabled>
                            既に担当
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAssignUser(user.user_id)}
                            disabled={assignMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">ユーザーが見つかりません</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
