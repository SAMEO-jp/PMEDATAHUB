// ==========================================
// テーブル管理テストページ
// ==========================================

'use client';
import React from 'react';
import { OperationBar } from './components/OperationBar';
import { TableList } from './components/TableList';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { useTableData } from '@src/hooks/useTableManagementData';
import { useTableDelete } from './hooks/useTableDelete';
import type { TableItem } from './types';

export default function TestTableManagementPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  // tRPC APIからテーブルデータを取得
  const { tables, isLoading, error } = useTableData();
  const { deleteTables, isDeleting } = useTableDelete();

  // 検索機能
  const filteredTables = React.useMemo(() => {
    return tables.filter(table =>
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tables, searchTerm]);

  // チェックボックスのハンドラ
  const handleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 全選択のハンドラ
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(filteredTables.map(t => t.id));
    } else {
      setSelected([]);
    }
  };

  // 削除処理
  const handleDelete = (idsToDelete: string[]) => {
    setShowDeleteDialog(true);
  };

  // 削除確認処理
  const handleConfirmDelete = async () => {
    const tableNames = selected.map(id => {
      const table = tables.find(t => t.id === id);
      return table?.name || id;
    });

    const result = await deleteTables(tableNames);
    
    if (result.success) {
      alert(result.message);
      setSelected([]);
    } else {
      alert(`削除に失敗しました: ${result.message}`);
    }
    
    setShowDeleteDialog(false);
  };

  // 削除キャンセル処理
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">テーブル情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態の表示
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* メインコンテンツ */}
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">ホーム &gt; プロジェクト一覧</p>
              <h2 className="text-3xl font-bold text-gray-900">テーブル管理</h2>
              <p className="mt-1 text-gray-600">データベース内のテーブル一覧を表示・管理します</p>
              <p className="mt-1 text-sm text-blue-600">※ 実際のデータベースから取得した {tables.length} 個のテーブル（削除機能実装済み）</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                新規テーブル作成
              </button>
            </div>
          </header>
          {/* 操作バー */}
          <OperationBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selected={selected}
            onDelete={handleDelete}
          />
          {/* テーブル一覧 */}
          <TableList 
            tables={filteredTables}
            selected={selected}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
          />
        </div>
      </div>
      
      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        tableNames={selected.map(id => {
          const table = tables.find(t => t.id === id);
          return table?.name || id;
        })}
        isLoading={isDeleting}
      />
    </div>
  );
} 