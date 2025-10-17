'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from '@src/lib/trpc/client';
import { ArrowLeft, Edit, Users, History, Trash2, ChevronRight } from 'lucide-react';

interface SetsubiDetailPageProps {
  params: {
    project_id: string;
    setsubi_id: string;
  };
}

export default function SetsubiDetailPage({ params }: SetsubiDetailPageProps) {
  const router = useRouter();
  const setsubiId = parseInt(params.setsubi_id);

  const { data: setsubiDetail, isLoading } = trpc.setsubi.getDetail.useQuery(
    { setsubi_id: setsubiId },
    { enabled: !isNaN(setsubiId) }
  );

  const { data: historyData } = trpc.setsubi.getHistory.useQuery(
    { seiban: setsubiDetail?.data?.seiban || '' },
    { enabled: !!setsubiDetail?.data?.seiban }
  );

  const deleteMutation = trpc.setsubi.deleteMaster.useMutation();

  const handleDelete = async () => {
    if (!setsubiDetail?.data) return;

    const confirmMessage = (setsubiDetail.data.current_assignees?.length || 0) > 0
      ? `この製番には${setsubiDetail.data.current_assignees?.length || 0}人の担当者がいます。本当に削除しますか？この操作は取り消せません。`
      : 'この製番を削除しますか？この操作は取り消せません。';

    if (!window.confirm(confirmMessage)) return;

    try {
      await deleteMutation.mutateAsync({ id: setsubiId });
      alert('製番を削除しました');
      router.push(`/app_project/${params.project_id}/manage/setsubi`);
    } catch (error) {
      console.error('製番削除エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '製番の削除に失敗しました';
      alert(`製番の削除に失敗しました: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!setsubiDetail?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">製番が見つかりません</p>
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage/setsubi`)}
            className="mt-4"
          >
            一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  const setsubi = setsubiDetail.data;

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
              onClick={() => router.push(`/app_project/${params.project_id}/manage/setsubi`)}
              className="hover:text-blue-600 transition-colors"
            >
              設備製番管理
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-gray-900 font-medium">{setsubi.seiban}</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{setsubi.setsubi_name}</h1>
          <p className="text-gray-600 mt-1">製番: {setsubi.seiban}</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage/setsubi/${setsubiId}/assign`)}
            variant="outline"
          >
            <Users className="mr-2 h-4 w-4" />
            担当管理
          </Button>
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage/setsubi`)}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 基本情報 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">製番</Label>
                  <p className="text-lg font-semibold">{setsubi.seiban}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">設備名</Label>
                  <p className="text-lg">{setsubi.setsubi_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">商品区分</Label>
                  <div>
                    {setsubi.shohin_category ? (
                      <Badge variant="secondary">{setsubi.shohin_category}</Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">場所番号</Label>
                  <p>{setsubi.location_code || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">親製番</Label>
                  <p>{setsubi.parent_seiban || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">作成日時</Label>
                  <p>{new Date(setsubi.created_at).toLocaleString('ja-JP')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 担当者情報 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                担当者 ({setsubi.current_assignees?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {setsubi.current_assignees && setsubi.current_assignees.length > 0 ? (
                <div className="space-y-3">
                  {setsubi.current_assignees.map((assignee, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{assignee.name_japanese}</p>
                        {assignee.role && (
                          <p className="text-sm text-gray-600">{assignee.role}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">担当者が割り当てられていません</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 使用履歴 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            使用履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historyData?.data && historyData.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>プロジェクト</TableHead>
                  <TableHead>登録日時</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.data.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>{history.project_id}</TableCell>
                    <TableCell>{new Date(history.created_at).toLocaleString('ja-JP')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <History className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">使用履歴がありません</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 操作ボタン */}
      <div className="mt-6 flex justify-end space-x-4">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? '削除中...' : '製番を削除'}
        </Button>
      </div>
    </div>
  );
}

// Labelコンポーネントがインポートされていないので追加
function Label({ children, className = '', ...props }: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
}
