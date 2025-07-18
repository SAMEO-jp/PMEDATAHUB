// ==========================================
// ファイル名: FlatBomTable.tsx
// 機能: フラットBOMデータ表示テーブルコンポーネント
// 技術: React, TypeScript, Shadcn UI, Tailwind CSS
// ==========================================

'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../../../components/ui/table';
import { Button } from '../../../../../../components/ui/button';
import { Input } from '../../../../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { FlatBomData, FlatBomColumn } from '../../../../../../types/flat-bom';

// ==========================================
// 型定義層（Props型）
// ==========================================
interface FlatBomTableProps {
  data: FlatBomData[];
  loading: boolean;
}

// ==========================================
// 定数定義層（テーブル設定）
// ==========================================
const TABLE_COLUMNS: FlatBomColumn[] = [
  { key: 'Zumen_ID', label: '図面ID', sortable: true, width: 'w-32' },
  { key: 'Zumen_Name', label: '図面名', sortable: true, width: 'w-48' },
  { key: 'PART_ID', label: '部品ID', sortable: true, width: 'w-20' },
  { key: 'PART_NAME', label: '部品名', sortable: true, width: 'w-48' },
  { key: 'QUANTITY', label: '数量', sortable: true, width: 'w-20' },
  { key: 'SPARE_QUANTITY', label: '予備数量', sortable: true, width: 'w-24' },
  { key: 'MANUFACTURER', label: '製造元', sortable: true, width: 'w-32' },
  { key: 'BUZAI_ID', label: '部材ID', sortable: true, width: 'w-20' },
  { key: 'BUZAI_NAME', label: '部材名', sortable: true, width: 'w-32' },
  { key: 'BUZAI_WEIGHT', label: '部材重量', sortable: true, width: 'w-24' },
  { key: 'BUZAI_QUANTITY', label: '部材数量', sortable: true, width: 'w-24' },
  { key: 'ZAISITU_NAME', label: '材質名', sortable: true, width: 'w-32' },
  { key: 'KONPO_TANNI_ID', label: '工法単位ID', sortable: true, width: 'w-40' },
  { key: 'PART_KO', label: '部品工法', sortable: true, width: 'w-24' },
  { key: 'ZENSU_KO', label: '全数工法', sortable: true, width: 'w-24' },
  { key: 'KONPO_LIST_ID', label: '工法リストID', sortable: true, width: 'w-32' },
  { key: 'KONPO_LIST_WEIGHT', label: '工法リスト重量', sortable: true, width: 'w-32' },
  { key: 'HASSOU_IN', label: '発送元', sortable: true, width: 'w-24' },
  { key: 'HASSOU_TO', label: '発送先', sortable: true, width: 'w-24' },
];

// ==========================================
// 状態管理層（ソート・フィルター状態）
// ==========================================
export const FlatBomTable = ({ data, loading }: FlatBomTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof FlatBomData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // ==========================================
  // ビジネスロジック層（データ加工・ソート・フィルター）
  // ==========================================
  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // 検索フィルター
    if (searchTerm) {
      processedData = processedData.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // ソート
    if (sortColumn) {
      processedData.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return processedData;
  }, [data, searchTerm, sortColumn, sortDirection]);

  // ページネーション
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ==========================================
  // イベントハンドラ層（ソート・ページネーション）
  // ==========================================
  const handleSort = (column: keyof FlatBomData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ==========================================
  // 変換・フォーマット層（データ表示用変換）
  // ==========================================
  const formatCellValue = (value: unknown, column: keyof FlatBomData): string => {
    if (value === null || value === undefined) return '-';
    
    switch (column) {
      case 'BUZAI_WEIGHT':
      case 'KONPO_LIST_WEIGHT':
        return typeof value === 'string' ? `${value} kg` : `${value} kg`;
      case 'QUANTITY':
      case 'SPARE_QUANTITY':
      case 'BUZAI_QUANTITY':
      case 'PART_KO':
        return value.toString();
      default:
        return value.toString();
    }
  };

  // ==========================================
  // レンダリング層（JSX return）
  // ==========================================
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>フラットBOMデータ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-lg">データを読み込み中...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>フラットBOMデータ</CardTitle>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="検索..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="text-sm text-gray-500">
            {filteredAndSortedData.length}件中 {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}件を表示
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {TABLE_COLUMNS.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`${column.width} ${column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && sortColumn === column.key && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={`${item.Zumen_ID}-${item.PART_ID}-${item.BUZAI_ID}-${index}`}>
                  {TABLE_COLUMNS.map((column) => (
                    <TableCell key={column.key} className={column.width}>
                      {formatCellValue(item[column.key], column.key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              ページ {currentPage} / {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                前へ
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                次へ
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 