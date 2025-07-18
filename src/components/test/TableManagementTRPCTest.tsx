'use client';

import React, { useState } from 'react';
import { Button } from '@src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { Badge } from '@src/components/ui/badge';
import { Alert, AlertDescription } from '@src/components/ui/alert';
import { Checkbox } from '@src/components/ui/checkbox';
import { Loader2, Trash2, Database, AlertTriangle } from 'lucide-react';

import { useTableManagementData } from '@src/hooks/useTableManagementData';
import type { TableInfo } from '@src/types/tableManagement';

export function TableManagementTRPCTest() {
  const {
    getAllTables,
    deleteTableMutation,
    deleteMultipleTablesMutation,
  } = useTableManagementData();

  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 選択状態の切り替え
  const toggleTableSelection = (tableName: string) => {
    const newSelected = new Set(selectedTables);
    if (newSelected.has(tableName)) {
      newSelected.delete(tableName);
    } else {
      newSelected.add(tableName);
    }
    setSelectedTables(newSelected);
  };

  // 全選択/全解除
  const toggleAllTables = () => {
    if (selectedTables.size === getAllTables.data?.data?.length) {
      setSelectedTables(new Set());
    } else {
      const allTableNames = getAllTables.data?.data?.map((table: TableInfo) => table.name) || [];
      setSelectedTables(new Set(allTableNames));
    }
  };

  // 単一テーブル削除
  const handleDeleteTable = async (tableName: string) => {
    if (!confirm(`テーブル "${tableName}" を削除しますか？\nこの操作は取り消せません。`)) {
      return;
    }

    try {
      setErrorMessage('');
      await deleteTableMutation.mutateAsync({ tableName });
    } catch (error) {
      setErrorMessage(`テーブル "${tableName}" の削除に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  };

  // 複数テーブル一括削除
  const handleDeleteMultipleTables = async () => {
    if (selectedTables.size === 0) {
      setErrorMessage('削除するテーブルを選択してください');
      return;
    }

    const tableNames = Array.from(selectedTables);
    if (!confirm(`選択された ${tableNames.length} 個のテーブルを削除しますか？\nこの操作は取り消せません。\n\n削除対象: ${tableNames.join(', ')}`)) {
      return;
    }

    try {
      setErrorMessage('');
      // 各テーブルを順次削除
      for (const tableName of tableNames) {
        await deleteTableMutation.mutateAsync({ tableName });
      }
      setSelectedTables(new Set()); // 選択をクリア
    } catch (error) {
      setErrorMessage(`複数テーブルの削除に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  };

  // ローディング状態
  if (getAllTables.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">テーブル一覧を読み込み中...</span>
      </div>
    );
  }

  // エラー状態
  if (getAllTables.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          テーブル一覧の取得に失敗しました: {getAllTables.error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const tables = getAllTables.data?.data || [];

  return (
    <div className="space-y-6 max-h-full overflow-y-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between sticky top-0 bg-white z-10 py-2">
        <div>
          <h1 className="text-2xl font-bold">テーブル管理</h1>
          <p className="text-muted-foreground">
            データベース内のテーブル一覧を表示・管理します
          </p>
        </div>
        <Badge variant="secondary">
          {tables.length} 個のテーブル
        </Badge>
      </div>

      {/* エラーメッセージ */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* 操作ボタン */}
      <div className="flex gap-2 sticky top-20 bg-white z-10 py-2">
        <Button
          onClick={toggleAllTables}
          variant="outline"
          disabled={tables.length === 0}
        >
          {selectedTables.size === tables.length ? '全選択解除' : '全選択'}
        </Button>
        
        <Button
          onClick={handleDeleteMultipleTables}
          variant="destructive"
          disabled={selectedTables.size === 0 || deleteTableMutation.isPending}
        >
          {deleteTableMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              削除中...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              選択したテーブルを削除 ({selectedTables.size})
            </>
          )}
        </Button>

        <Button
          onClick={() => getAllTables.refetch()}
          variant="outline"
          disabled={getAllTables.isRefetching}
        >
          {getAllTables.isRefetching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              更新中...
            </>
          ) : (
            '更新'
          )}
        </Button>
      </div>

      {/* テーブル一覧 */}
      {tables.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Database className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">テーブルが見つかりません</h3>
              <p className="text-muted-foreground">
                データベースにテーブルが存在しないか、アクセス権限がありません。
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 max-h-[60vh] overflow-y-auto">
          {tables.map((table: TableInfo) => (
            <Card key={table.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedTables.has(table.name)}
                      onCheckedChange={() => toggleTableSelection(table.name)}
                    />
                    <div>
                      <h3 className="font-medium">{table.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {table.id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {table.created_at ? new Date(table.created_at).toLocaleDateString() : 'N/A'}
                    </Badge>
                    
                    <Button
                      onClick={() => handleDeleteTable(table.name)}
                      variant="destructive"
                      size="sm"
                      disabled={deleteTableMutation.isPending}
                    >
                      {deleteTableMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 統計情報 */}
      <Card className="sticky bottom-0 bg-white z-10">
        <CardHeader>
          <CardTitle>統計情報</CardTitle>
          <CardDescription>テーブル管理の操作状況</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">総テーブル数:</span> {tables.length}
            </div>
            <div>
              <span className="font-medium">選択中:</span> {selectedTables.size}
            </div>
            <div>
              <span className="font-medium">削除操作中:</span> {deleteTableMutation.isPending || deleteMultipleTablesMutation.isPending ? 'はい' : 'いいえ'}
            </div>
            <div>
              <span className="font-medium">最終更新:</span> {getAllTables.dataUpdatedAt ? new Date(getAllTables.dataUpdatedAt).toLocaleString() : 'N/A'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 