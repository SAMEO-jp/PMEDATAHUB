// ==========================================
// ファイル名: FlatBomPartTable.tsx
// 機能: 部品単一重量付きフラットBOMテーブルコンポーネント
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
import { Input } from '../../../../../../components/ui/input';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { FlatBomPartData } from '../../../../../../types/flat-bom';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// ==========================================
// 型定義層（Props型、ソート型）
// ==========================================
interface FlatBomPartTableProps {
  data: FlatBomPartData[];
  loading: boolean;
}

type SortField = keyof FlatBomPartData;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// ==========================================
// 定数定義層（テーブル設定）
// ==========================================
const COLUMNS = [
  { key: 'Zumen_ID' as keyof FlatBomPartData, label: '図面ID', sortable: true },
  { key: 'Zumen_Name' as keyof FlatBomPartData, label: '図面名', sortable: true },
  { key: 'PART_ID' as keyof FlatBomPartData, label: '部品ID', sortable: true },
  { key: 'PART_NAME' as keyof FlatBomPartData, label: '部品名', sortable: true },
  { key: 'QUANTITY' as keyof FlatBomPartData, label: '数量', sortable: true },
  { key: 'SPARE_QUANTITY' as keyof FlatBomPartData, label: '予備数量', sortable: true },
  { key: 'MANUFACTURER' as keyof FlatBomPartData, label: '製造元', sortable: true },
  { key: 'part_weight' as keyof FlatBomPartData, label: '部品単一重量(kg)', sortable: true },
  { key: 'PART_KO' as keyof FlatBomPartData, label: '部品工法', sortable: true },
  { key: 'ZENSU_KO' as keyof FlatBomPartData, label: '全数工法', sortable: true },
  { key: 'HASSOU_IN' as keyof FlatBomPartData, label: '発送元', sortable: true },
  { key: 'HASSOU_TO' as keyof FlatBomPartData, label: '発送先', sortable: true },
];

// ==========================================
// レンダリング層（JSX return）
// ==========================================
export const FlatBomPartTable = ({ data, loading }: FlatBomPartTableProps) => {
  // ==========================================
  // 状態管理層（検索、ソート、ページネーション）
  // ==========================================
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'Zumen_ID',
    direction: 'asc'
  });

  // ==========================================
  // データ処理層（フィルタリング、ソート）
  // ==========================================
  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // ソート処理
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [data, searchTerm, sortConfig]);

  // ==========================================
  // イベントハンドラ層（ソート、検索）
  // ==========================================
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  // ==========================================
  // ローディング状態の表示
  // ==========================================
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>部品単一重量付きフラットBOM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">データを読み込み中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ==========================================
  // データなし状態の表示
  // ==========================================
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>部品単一重量付きフラットBOM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            データが見つかりません
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>部品単一重量付きフラットBOM</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedData.length} 件のレコード
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableHead key={column.key}>
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(column.key)}
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                      >
                        {column.label}
                        <span className="ml-1">
                          {getSortIcon(column.key)}
                        </span>
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((item, index) => (
                <TableRow key={`${item.Zumen_ID}-${item.PART_ID}-${index}`}>
                  <TableCell className="font-mono text-sm">{item.Zumen_ID}</TableCell>
                  <TableCell>{item.Zumen_Name}</TableCell>
                  <TableCell className="font-mono text-sm">{item.PART_ID}</TableCell>
                  <TableCell>{item.PART_NAME}</TableCell>
                  <TableCell className="text-right">{item.QUANTITY}</TableCell>
                  <TableCell className="text-right">{item.SPARE_QUANTITY}</TableCell>
                  <TableCell>{item.MANUFACTURER}</TableCell>
                  <TableCell className="text-right font-medium">
                    {item.part_weight.toFixed(2)}
                  </TableCell>
                  <TableCell>{item.PART_KO}</TableCell>
                  <TableCell>{item.ZENSU_KO}</TableCell>
                  <TableCell>{item.HASSOU_IN}</TableCell>
                  <TableCell>{item.HASSOU_TO}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}; 