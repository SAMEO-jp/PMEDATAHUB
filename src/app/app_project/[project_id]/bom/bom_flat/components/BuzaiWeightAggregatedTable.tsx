// ==========================================
// ファイル名: BuzaiWeightAggregatedTable.tsx
// 機能: 部材重量集約データ表示テーブルコンポーネント
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
import { FlatBomData, BuzaiWeightAggregatedData, BuzaiWeightColumn } from '../../../../../../types/flat-bom';

// ==========================================
// 型定義層（Props型）
// ==========================================
interface BuzaiWeightAggregatedTableProps {
  data: FlatBomData[];
  loading: boolean;
}

// ==========================================
// 定数定義層（テーブル設定）
// ==========================================
const AGGREGATED_COLUMNS: BuzaiWeightColumn[] = [
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
  { key: 'TOTAL_WEIGHT', label: '総重量', sortable: true, width: 'w-24' },
  { key: 'UNIT_WEIGHT', label: '単重量', sortable: true, width: 'w-24' },
  { key: 'ZAISITU_NAME', label: '材質名', sortable: true, width: 'w-32' },
  { key: 'HASSOU_IN', label: '発送元', sortable: true, width: 'w-24' },
  { key: 'HASSOU_TO', label: '発送先', sortable: true, width: 'w-24' },
];

// ==========================================
// 状態管理層（ソート・フィルター状態）
// ==========================================
export const BuzaiWeightAggregatedTable = ({ data, loading }: BuzaiWeightAggregatedTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof BuzaiWeightAggregatedData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // ==========================================
  // ビジネスロジック層（データ加工・集約計算・ソート・フィルター）
  // ==========================================
  const aggregatedData = useMemo(() => {
    // 部材IDが存在するデータのみをフィルター
    const validData = data.filter(item => 
      item.BUZAI_ID && 
      item.BUZAI_WEIGHT && 
      item.BUZAI_QUANTITY
    );

    // 図面ID、図面名、部品IDをキーとして集約
    const aggregatedMap = new Map<string, BuzaiWeightAggregatedData>();

    validData.forEach(item => {
      // 図面ID、図面名、部品IDでキーを作成
      const key = `${item.Zumen_ID}-${item.Zumen_Name}-${item.PART_ID}`;
      
      // 部材重量と数量を数値に変換
      const buzaiWeight = parseFloat(item.BUZAI_WEIGHT!) || 0;
      const buzaiQuantity = parseFloat(item.BUZAI_QUANTITY!) || 0;
      const totalWeight = item.QUANTITY * buzaiWeight * buzaiQuantity;

      if (aggregatedMap.has(key)) {
        // 既存のエントリがある場合は重量を加算
        const existing = aggregatedMap.get(key)!;
        existing.TOTAL_WEIGHT += totalWeight;
        existing.BUZAI_QUANTITY += buzaiQuantity;
        // 単重量を再計算（総重量 ÷ 数量）
        existing.UNIT_WEIGHT = existing.TOTAL_WEIGHT / existing.QUANTITY;
      } else {
        // 新しいエントリを作成
        const unitWeight = item.QUANTITY > 0 ? totalWeight / item.QUANTITY : 0;
        aggregatedMap.set(key, {
          Zumen_ID: item.Zumen_ID,
          Zumen_Name: item.Zumen_Name,
          PART_ID: item.PART_ID,
          PART_NAME: item.PART_NAME,
          QUANTITY: item.QUANTITY,
          SPARE_QUANTITY: item.SPARE_QUANTITY,
          MANUFACTURER: item.MANUFACTURER,
          BUZAI_ID: item.BUZAI_ID!,
          BUZAI_NAME: item.BUZAI_NAME || '',
          BUZAI_WEIGHT: buzaiWeight,
          BUZAI_QUANTITY: buzaiQuantity,
          TOTAL_WEIGHT: totalWeight,
          UNIT_WEIGHT: unitWeight,
          ZAISITU_NAME: item.ZAISITU_NAME || '',
          HASSOU_IN: item.HASSOU_IN || '',
          HASSOU_TO: item.HASSOU_TO || '',
        });
      }
    });

    return Array.from(aggregatedMap.values());
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let processedData = [...aggregatedData];

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
  }, [aggregatedData, searchTerm, sortColumn, sortDirection]);

  // ページネーション
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 総重量の合計を計算
  const totalWeightSum = useMemo(() => {
    return filteredAndSortedData.reduce((sum, item) => sum + item.TOTAL_WEIGHT, 0);
  }, [filteredAndSortedData]);

  // ==========================================
  // イベントハンドラ層（ソート・ページネーション）
  // ==========================================
  const handleSort = (column: keyof BuzaiWeightAggregatedData) => {
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
  const formatCellValue = (value: unknown, column: keyof BuzaiWeightAggregatedData): string => {
    if (value === null || value === undefined) return '-';
    
    switch (column) {
      case 'BUZAI_WEIGHT':
      case 'TOTAL_WEIGHT':
      case 'UNIT_WEIGHT':
        return typeof value === 'number' ? `${value.toFixed(2)} kg` : `${value} kg`;
      case 'QUANTITY':
      case 'SPARE_QUANTITY':
      case 'BUZAI_QUANTITY':
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
          <CardTitle>部材重量集約データ</CardTitle>
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
        <CardTitle>部材重量集約データ</CardTitle>
        <div className="flex items-center justify-between">
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
          <div className="text-sm font-medium text-blue-600">
            総重量合計: {totalWeightSum.toFixed(2)} kg
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {AGGREGATED_COLUMNS.map((column) => (
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
                <TableRow key={`${item.Zumen_ID}-${item.Zumen_Name}-${item.PART_ID}-${index}`}>
                  {AGGREGATED_COLUMNS.map((column) => (
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