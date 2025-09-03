/**
 * @file box itemのtRPCテストページ
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { Badge } from '@src/components/ui/badge';
import { 
  useBoxAll, 
  useBoxSearch, 
  useBoxStats, 
  useBoxMutations 
} from '@src/hooks/box/useBoxData';
import type { BoxItemSearchFilters, PaginationParams } from '@src/hooks/box/useBoxData';

export default function BoxTRPCTestPage() {
  const [searchFilters, setSearchFilters] = useState<BoxItemSearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 });

  // データ取得
  const { data: allData, isLoading: allLoading, error: allError } = useBoxAll(pagination);
  const { data: searchData, isLoading: searchLoading } = useBoxSearch(searchFilters, pagination);
  const { data: statsData, isLoading: statsLoading } = useBoxStats();
  const { createMutation, updateMutation, deleteMutation } = useBoxMutations();

  // 表示するデータを決定
  const displayData = isSearching ? searchData : allData;
  const isLoading = isSearching ? searchLoading : allLoading;
  const error = allError;

  // 検索フィルターの更新
  const updateSearchFilter = (key: keyof BoxItemSearchFilters, value: string | number | undefined) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 検索実行
  const handleSearch = () => {
    setIsSearching(true);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 検索リセット
  const handleResetSearch = () => {
    setSearchFilters({});
    setIsSearching(false);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // ページネーション処理
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination({ page: 1, limit: newLimit });
  };

  // ページネーション情報の計算
  const totalPages = displayData?.count 
    ? Math.ceil(displayData.count / pagination.limit) 
    : 0;

  // テストデータ作成
  const handleCreateTestData = () => {
    const testData = {
      box_id: `test_${Date.now()}`,
      item_type: 1,
      name: 'テストアイテム',
      owner_id: '123456789',
      size: 1024,
      content_created_at: Math.floor(Date.now() / 1000),
      content_updated_at: Math.floor(Date.now() / 1000),
    };
    createMutation.mutate(testData);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">tRPCエラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error.message}</p>
            <pre className="mt-2 text-xs bg-red-100 p-2 rounded">
              {JSON.stringify(error, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-3xl font-bold">Box Item tRPC テスト</h1>
        <p className="text-muted-foreground">
          box itemのtRPC APIをテストします
        </p>
      </div>

      {/* テスト操作 */}
      <Card>
        <CardHeader>
          <CardTitle>テスト操作</CardTitle>
          <CardDescription>
            tRPC APIの動作をテストできます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={handleCreateTestData} disabled={createMutation.isPending}>
              {createMutation.isPending ? '作成中...' : 'テストデータ作成'}
            </Button>
            <Button onClick={handleResetSearch} variant="outline">
              検索リセット
            </Button>
          </div>
          
          {/* ミューテーション状態 */}
          <div className="mt-4 space-y-2">
            {createMutation.isPending && (
              <Badge variant="secondary">作成中...</Badge>
            )}
            {createMutation.isSuccess && (
              <Badge variant="default" className="bg-green-500">
                作成成功
              </Badge>
            )}
            {createMutation.isError && (
              <Badge variant="destructive">
                作成エラー: {createMutation.error.message}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 統計情報 */}
      {!statsLoading && statsData?.data && (
        <Card>
          <CardHeader>
            <CardTitle>統計情報 (tRPC)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{statsData.data.totalCount}</div>
                <div className="text-sm text-muted-foreground">総アイテム数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {statsData.data.averageSize.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">平均サイズ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Object.keys(statsData.data.itemTypeCounts).length}
                </div>
                <div className="text-sm text-muted-foreground">アイテムタイプ数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Object.keys(statsData.data.ownerCounts).length}
                </div>
                <div className="text-sm text-muted-foreground">所有者数</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 検索フィルター */}
      <Card>
        <CardHeader>
          <CardTitle>検索フィルター (tRPC)</CardTitle>
          <CardDescription>
            条件を指定してbox itemを検索できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="box_id">Box ID</Label>
              <Input
                id="box_id"
                value={searchFilters.box_id || ''}
                onChange={(e) => updateSearchFilter('box_id', e.target.value)}
                placeholder="Box IDを入力"
              />
            </div>
            <div>
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                value={searchFilters.name || ''}
                onChange={(e) => updateSearchFilter('name', e.target.value)}
                placeholder="名前を入力"
              />
            </div>
            <div>
              <Label htmlFor="owner_id">所有者ID</Label>
              <Input
                id="owner_id"
                value={searchFilters.owner_id || ''}
                onChange={(e) => updateSearchFilter('owner_id', e.target.value)}
                placeholder="所有者IDを入力"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSearch} disabled={isLoading}>
              検索実行
            </Button>
            <Button onClick={handleResetSearch} variant="outline">
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ページネーション設定 */}
      <Card>
        <CardHeader>
          <CardTitle>表示設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <Label htmlFor="limit">1ページあたりの表示件数</Label>
              <select
                id="limit"
                value={pagination.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="ml-2 px-2 py-1 border rounded"
              >
                <option value={5}>5件</option>
                <option value={10}>10件</option>
                <option value={20}>20件</option>
                <option value={50}>50件</option>
              </select>
            </div>
            {displayData?.count && (
              <div className="text-sm text-muted-foreground">
                総件数: {displayData.count}件
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* データ表示 */}
      <Card>
        <CardHeader>
          <CardTitle>
            データ表示 (tRPC)
            {displayData?.count && (
              <Badge variant="secondary" className="ml-2">
                {displayData.count}件
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isSearching ? '検索結果' : '全データ'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">データを読み込み中...</div>
            </div>
          ) : displayData?.data && displayData.data.length > 0 ? (
            <>
              <div className="space-y-4">
                {displayData.data.map((item) => (
                  <div key={`${item.box_id}-${item.item_type}`} className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">
                          {item.name || '無名アイテム'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Box ID: {item.box_id} | Type: {item.item_type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          所有者: {item.owner_id} | サイズ: {item.size || 0} bytes
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">Type {item.item_type}</Badge>
                        {item.size && <Badge variant="secondary">{item.size} bytes</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    ページ {pagination.page} / {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.page === 1}
                    >
                      最初
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      前へ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                    >
                      次へ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={pagination.page === totalPages}
                    >
                      最後
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                {isSearching ? '検索条件に一致するデータが見つかりませんでした' : 'データがありません'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* レスポンス詳細 */}
      <Card>
        <CardHeader>
          <CardTitle>tRPC レスポンス詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>全データレスポンス</Label>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(allData, null, 2)}
              </pre>
            </div>
            
            {isSearching && (
              <div>
                <Label>検索レスポンス</Label>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(searchData, null, 2)}
                </pre>
              </div>
            )}
            
            <div>
              <Label>統計レスポンス</Label>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(statsData, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
