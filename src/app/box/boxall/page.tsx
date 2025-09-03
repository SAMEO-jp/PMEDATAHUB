/**
 * @file box itemの確認ページ
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { Badge } from '@src/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@src/components/ui/table';
import { 
  useBoxAll, 
  useBoxSearch, 
  useBoxStats, 
  useBoxOperations 
} from '@src/hooks/box/useBoxData';
import type { BoxItemSearchFilters, PaginationParams } from '@src/hooks/box/useBoxData';

export default function BoxAllPage() {
  const [searchFilters, setSearchFilters] = useState<BoxItemSearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 20 });

  // データ取得
  const { data: allData, isLoading: allLoading, error: allError } = useBoxAll(pagination);
  const { data: searchData, isLoading: searchLoading } = useBoxSearch(searchFilters, pagination);
  const { data: statsData, isLoading: statsLoading } = useBoxStats();
  const { handleCreate, handleUpdate, handleDelete, refreshData } = useBoxOperations();

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
    // 検索時はページを1にリセット
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
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, displayData?.count || 0);

  // 日時フォーマット
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '-';
    return new Date(timestamp * 1000).toLocaleString('ja-JP');
  };

  // ファイルサイズフォーマット
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">エラーが発生しました</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error.message}</p>
            <Button onClick={refreshData} className="mt-4">
              再試行
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ページタイトル */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">全BOXITEM表示</h1>
          <p className="text-muted-foreground">
            sync.dbのbox_itemテーブルの全データを表示・検索・管理します
          </p>
        </div>
        <Button onClick={refreshData} variant="outline">
          データ更新
        </Button>
      </div>

      {/* 統計情報 */}
      {!statsLoading && statsData?.data && (
        <Card>
          <CardHeader>
            <CardTitle>統計情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{statsData.data.totalCount}</div>
                <div className="text-sm text-muted-foreground">総アイテム数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatFileSize(statsData.data.averageSize)}
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
          <CardTitle>検索フィルター</CardTitle>
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
                <option value={10}>10件</option>
                <option value={20}>20件</option>
                <option value={50}>50件</option>
                <option value={100}>100件</option>
              </select>
            </div>
            {displayData?.count && (
              <div className="text-sm text-muted-foreground">
                {startItem} - {endItem} / {displayData.count}件
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* データテーブル */}
      <Card>
        <CardHeader>
          <CardTitle>
            Box Item 一覧
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Box ID</TableHead>
                      <TableHead>Item Type</TableHead>
                      <TableHead>名前</TableHead>
                      <TableHead>所有者ID</TableHead>
                      <TableHead>サイズ</TableHead>
                      <TableHead>作成日時</TableHead>
                      <TableHead>更新日時</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.data.map((item) => (
                      <TableRow key={`${item.box_id}-${item.item_type}`}>
                        <TableCell className="font-mono text-sm">
                          {item.box_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.item_type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {item.name || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.owner_id}
                        </TableCell>
                        <TableCell>
                          {formatFileSize(item.size)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatTimestamp(item.content_created_at)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatTimestamp(item.content_updated_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // 詳細表示の実装
                                console.log('詳細表示:', item);
                              }}
                            >
                              詳細
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(item.box_id, item.item_type)}
                            >
                              削除
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

      {/* アイテムタイプ別統計 */}
      {!statsLoading && statsData?.data && (
        <Card>
          <CardHeader>
            <CardTitle>アイテムタイプ別統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(statsData.data.itemTypeCounts).map(([type, count]) => (
                <div key={type} className="text-center">
                  <div className="text-lg font-semibold">Type {type}</div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">アイテム</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

