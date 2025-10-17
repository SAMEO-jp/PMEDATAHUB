'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from '@src/lib/trpc/client';
import { Plus, Package, Users, Settings, AlertCircle, ChevronRight } from 'lucide-react';

interface KounyuManagePageProps {
  params: {
    project_id: string;
  };
}

export default function KounyuManagePage({ params }: KounyuManagePageProps) {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // tRPC hooks
  const { data: tableCheck, isLoading: checkingTables } = trpc.kounyu.checkTables.useQuery();
  const initializeMutation = trpc.kounyu.initializeTables.useMutation();
  const { data: kounyuList, isLoading: loadingKounyu } = trpc.kounyu.getAllByProject.useQuery(
    { project_id: params.project_id },
    { enabled: isInitialized }
  );

  // テーブル初期化
  const handleInitialize = async () => {
    if (!window.confirm('購入品管理テーブルを初期化しますか？この操作には時間がかかる場合があります。')) {
      return;
    }

    try {
      await initializeMutation.mutateAsync();
      setIsInitialized(true);
      alert('購入品管理テーブルを初期化しました');
    } catch (error) {
      console.error('テーブル初期化エラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'テーブル初期化に失敗しました';
      alert(`テーブル初期化に失敗しました: ${errorMessage}`);
    }
  };

  // 初期化状態チェック
  useEffect(() => {
    if (tableCheck?.exists) {
      setIsInitialized(true);
    }
  }, [tableCheck]);

  if (checkingTables) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // テーブル未初期化の場合
  if (!isInitialized) {
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
            <li className="text-gray-900 font-medium">購入品管理</li>
          </ol>
        </nav>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">購入品管理</h1>
            <p className="text-gray-600 mt-1">プロジェクトで使用する購入品と担当者の管理を行います</p>
          </div>
          <div className="space-x-2">
            <Button
              onClick={() => router.push(`/app_project/${params.project_id}/manage`)}
              variant="outline"
            >
              管理トップに戻る
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">購入品管理テーブルが未初期化です</h2>
            <p className="text-gray-600 mb-6 text-center">
              購入品管理機能を使用するには、データベーステーブルを初期化する必要があります。
            </p>
            <Button
              onClick={handleInitialize}
              disabled={initializeMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {initializeMutation.isPending ? '初期化中...' : 'テーブルを初期化'}
            </Button>
          </CardContent>
        </Card>
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
          <li className="text-gray-900 font-medium">購入品管理</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">購入品管理</h1>
          <p className="text-gray-600 mt-1">プロジェクトで使用する購入品と担当者の管理を行います</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu/new`)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            新規購入品登録
          </Button>
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage`)}
            variant="outline"
          >
            管理トップに戻る
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            プロジェクト購入品一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingKounyu ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : kounyuList?.data && kounyuList.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>管理番号</TableHead>
                  <TableHead>購入品名</TableHead>
                  <TableHead>種別</TableHead>
                  <TableHead>契約番号</TableHead>
                  <TableHead>設備製番</TableHead>
                  <TableHead>担当者数</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kounyuList.data.map((kounyu) => (
                  <TableRow key={kounyu.id}>
                    <TableCell className="font-medium">{kounyu.management_number}</TableCell>
                    <TableCell>{kounyu.item_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{kounyu.item_category}</Badge>
                    </TableCell>
                    <TableCell>{kounyu.contract_number || '-'}</TableCell>
                    <TableCell>{kounyu.setsubi_seiban || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-gray-500" />
                        {kounyu.assignee_count || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu/${kounyu.id}`)}
                        >
                          詳細
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu/${kounyu.id}/assign`)}
                        >
                          担当管理
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">購入品がまだ登録されていません</p>
              <p className="text-sm mb-4">プロジェクトで使用する購入品を登録して、担当者を管理しましょう</p>
              <Button
                onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu/new`)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                最初の購入品を登録
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
