'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@ui/dialog';
import { Checkbox } from '@ui/checkbox';
import { toast } from 'sonner';

interface TableData {
  success: boolean;
  error: string | null;
  count: number;
  data: string[] | null;
}

interface TableContent {
  columns: {
    name: string;
    type: string;
  }[];
  rows: Record<string, string | number | null>[];
}

type SortOrder = 'asc' | 'desc';

export default function AppTablePage() {
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showTableContent, setShowTableContent] = useState(false);
  const [tableContent, setTableContent] = useState<TableContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // テーブル一覧を取得
  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/db/app_table');
      const data: TableData = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'テーブル一覧の取得に失敗しました');
      }
      
      setTables(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      toast.error('テーブル一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // テーブルの内容を取得
  const fetchTableContent = async (tableName: string) => {
    try {
      setLoadingContent(true);
      const response = await fetch(`/api/db/app_table/${tableName}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'テーブルデータの取得に失敗しました');
      }
      
      setTableContent(data.data);
      setShowTableContent(true);
    } catch (error) {
      console.error('テーブルデータの取得に失敗しました:', error);
      toast.error('テーブルデータの取得に失敗しました');
    } finally {
      setLoadingContent(false);
    }
  };

  // テーブルを削除
  const handleDeleteTable = async () => {
    if (!selectedTable) return;

    try {
      const response = await fetch('/api/db/app_table', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableName: selectedTable }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'テーブルの削除に失敗しました');
      }

      toast.success('テーブルを削除しました');
      setShowDeleteDialog(false);
      setSelectedTable(null);
      fetchTables(); // 一覧を更新
    } catch (error) {
      console.error('テーブルの削除に失敗しました:', error);
      toast.error('テーブルの削除に失敗しました');
    }
  };

  // 一括削除
  const handleBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedTables).map(tableName =>
        fetch('/api/db/app_table', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tableName }),
        })
      );

      const results = await Promise.all(deletePromises);
      const allSuccess = results.every(res => res.ok);

      if (allSuccess) {
        toast.success(`${selectedTables.size}個のテーブルを削除しました`);
        setShowBulkDeleteDialog(false);
        setSelectedTables(new Set());
        fetchTables();
      } else {
        throw new Error('一部のテーブルの削除に失敗しました');
      }
    } catch (error) {
      console.error('一括削除に失敗しました:', error);
      toast.error('一括削除に失敗しました');
    }
  };

  // テーブルの選択状態を切り替え
  const toggleTableSelection = (tableName: string) => {
    setSelectedTables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tableName)) {
        newSet.delete(tableName);
      } else {
        newSet.add(tableName);
      }
      return newSet;
    });
  };

  // ソート順を切り替え
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // ソートされたテーブル一覧を取得
  const getSortedTables = () => {
    return [...tables].sort((a, b) => {
      // 大文字小文字を区別して比較
      const compareResult = a.localeCompare(b, undefined, { sensitivity: 'case' });
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">データベーステーブル管理</CardTitle>
          <CardDescription className="text-lg">
            データベース内のテーブル一覧を表示し、管理します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-lg">読み込み中...</div>
          ) : error ? (
            <div className="text-red-500 text-lg">{error}</div>
          ) : (
            <div className="space-y-4">
              {tables.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                  テーブルが存在しません
                </div>
              ) : (
                <div className="grid gap-2">
                  <div className="flex justify-between items-center mb-2">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={toggleSortOrder}
                    >
                      {sortOrder === 'asc' ? '昇順' : '降順'}
                    </Button>
                    {selectedTables.size > 0 && (
                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={() => setShowBulkDeleteDialog(true)}
                      >
                        選択した{selectedTables.size}個を削除
                      </Button>
                    )}
                  </div>
                  {getSortedTables().map((table, index) => (
                    <div
                      key={table}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        index % 3 === 0
                          ? 'bg-blue-50 hover:bg-blue-100'
                          : index % 3 === 1
                          ? 'bg-green-50 hover:bg-green-100'
                          : 'bg-purple-50 hover:bg-purple-100'
                      } transition-colors ${
                        selectedTables.has(table) ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedTables.has(table)}
                          onCheckedChange={() => toggleTableSelection(table)}
                          className="h-6 w-6"
                        />
                        <span 
                          className="font-mono text-lg cursor-pointer hover:text-primary transition-colors"
                          onClick={() => fetchTableContent(table)}
                        >
                          {table}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTable(table);
                          setShowDeleteDialog(true);
                        }}
                      >
                        削除
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">テーブルの削除</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              {selectedTable} を削除してもよろしいですか？
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-lg">キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTable}
              className="bg-red-500 hover:bg-red-600 text-lg"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">一括削除の確認</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              選択した{selectedTables.size}個のテーブルを削除してもよろしいですか？
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-lg">キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-lg"
            >
              一括削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showTableContent} onOpenChange={setShowTableContent}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedTable} のデータ
            </DialogTitle>
            <DialogDescription className="text-lg">
              テーブルの内容を表示します
            </DialogDescription>
          </DialogHeader>
          {loadingContent ? (
            <div className="text-center text-lg">データを読み込み中...</div>
          ) : tableContent ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {tableContent.columns.map((column) => (
                      <th
                        key={column.name}
                        className="border p-2 text-left font-semibold bg-gray-100"
                      >
                        {column.name}
                        <span className="text-xs text-gray-500 ml-1">
                          ({column.type})
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableContent.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      {tableContent.columns.map((column) => (
                        <td key={column.name} className="border p-2 bg-white">
                          {row[column.name]?.toString() || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-lg text-gray-500">
              データがありません
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
