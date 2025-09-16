'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from '@src/lib/trpc/client';
import { ArrowLeft, Edit, Users, Trash2, ChevronRight, Package } from 'lucide-react';

interface KounyuDetailPageProps {
  params: {
    project_id: string;
    kounyu_id: string;
  };
}

export default function KounyuDetailPage({ params }: KounyuDetailPageProps) {
  const router = useRouter();
  const kounyuId = parseInt(params.kounyu_id);

  const { data: kounyuDetail, isLoading } = trpc.kounyu.getDetail.useQuery(
    { kounyu_id: kounyuId },
    { enabled: !isNaN(kounyuId) }
  );

  const deleteMutation = trpc.kounyu.deleteMaster.useMutation();

  const handleDelete = async () => {
    if (!kounyuDetail?.data) return;

    const confirmMessage = (kounyuDetail.data.current_assignees?.length || 0) > 0
      ? `この購入品には${kounyuDetail.data.current_assignees?.length || 0}人の担当者がいます。本当に削除しますか？この操作は取り消せません。`
      : 'この購入品を削除しますか？この操作は取り消せません。';

    if (!window.confirm(confirmMessage)) return;

    try {
      await deleteMutation.mutateAsync({ id: kounyuId });
      alert('購入品を削除しました');
      router.push(`/app_project/${params.project_id}/manage/kounyu`);
    } catch (error) {
      console.error('購入品削除エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '購入品の削除に失敗しました';
      alert(`購入品の削除に失敗しました: ${errorMessage}`);
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
          <li className="text-gray-900 font-medium">{kounyu.management_number}</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{kounyu.item_name}</h1>
          <p className="text-gray-600 mt-1">管理番号: {kounyu.management_number}</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu/${kounyuId}/assign`)}
            variant="outline"
          >
            <Users className="mr-2 h-4 w-4" />
            担当管理
          </Button>
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu`)}
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
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                基本情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">管理番号</Label>
                  <p className="text-lg font-semibold">{kounyu.management_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">購入品名</Label>
                  <p className="text-lg">{kounyu.item_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">購入品種別</Label>
                  <div>
                    <Badge variant="secondary">{kounyu.item_category}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">契約番号</Label>
                  <p>{kounyu.contract_number || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">設備製番</Label>
                  <p>{kounyu.setsubi_seiban || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">購入担当部門</Label>
                  <p>{kounyu.responsible_department || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">図面番号</Label>
                  <p>{kounyu.drawing_number || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">表示順</Label>
                  <p>{kounyu.display_order}</p>
                </div>
              </div>
              {kounyu.remarks && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">備考</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">{kounyu.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 担当者情報 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                担当者 ({kounyu.current_assignees?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {kounyu.current_assignees && kounyu.current_assignees.length > 0 ? (
                <div className="space-y-3">
                  {kounyu.current_assignees.map((assignee, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{assignee.name_japanese}</p>
                        {assignee.department && (
                          <p className="text-sm text-gray-600">{assignee.department}</p>
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

      {/* 操作ボタン */}
      <div className="mt-6 flex justify-end space-x-4">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? '削除中...' : '購入品を削除'}
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
