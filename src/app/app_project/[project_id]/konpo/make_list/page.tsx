'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Settings, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@ui/button';
import { Tabs, TabsList, TabsTrigger } from '@ui/tabs';
import { TableSettings } from './components/TableSettings';
import { TableSettings as TableSettingsType, defaultTableSettings } from './columnWidths';
import { Checkbox } from '@ui/checkbox';

interface KonpoData {
  project_ID: string;
  Zumen_ID: string;
  Zumen_Name: string;
  PART_ID: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  MANUFACTURER: string;
  BUZAI_ID: string;
  BUZAI_NAME: string;
  BUZAI_WEIGHT: number;
  BUZAI_QUANTITY: number;
  ZAISITU_NAME: string;
  KONPO_TANNI_ID: string;
  PART_KO: number;
  ZENSU_KO: number;
  KONPO_LIST_ID: string;
  KONPO_LIST_WEIGHT: number;
  HASSOU_IN: string;
  HASSOU_TO: string;
}

interface GroupedData {
  [key: string]: {
    items: KonpoData[];
    totalWeight: number;
  };
}

// 重量をフォーマットしてJSXで返す関数
const formatWeightJSX = (weight: number): JSX.Element => {
  // 小数点第一位で切り上げ
  const roundedWeight = Math.ceil(weight * 10) / 10;
  // 整数部と小数部に分割
  const [intPart, decPart] = roundedWeight.toFixed(1).split('.');
  // 4桁以上の場合はトン表示
  if (intPart.length >= 4) {
    const tons = intPart.slice(0, intPart.length - 3);
    const kg = intPart.slice(-3);
    return (
      <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
        <span style={{ textAlign: 'right', minWidth: '2.5em', letterSpacing: '0.05em' }}>{tons}</span>
        <sup style={{ marginLeft: '1px', marginRight: '1px' }}>t</sup>
        <span style={{ textAlign: 'right', minWidth: '1.5em', letterSpacing: '0.05em' }}>{kg}</span>
        .{decPart}
      </span>
    );
  }
  // 3桁以下はそのまま
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      <span style={{ textAlign: 'right', minWidth: '3em', letterSpacing: '0.05em' }}>{intPart}</span>.{decPart}
    </span>
  );
};

export default function MakeTanniPage() {
  const params = useParams();
  const [data, setData] = useState<KonpoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState<TableSettingsType>(defaultTableSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bom/${params.project_id}/flat/konpo`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.project_id]);

  const groupedData = data.reduce((acc: GroupedData, item) => {
    const key = `${item.Zumen_ID}-${item.PART_ID}`;
    if (!acc[key]) {
      acc[key] = {
        items: [],
        totalWeight: 0
      };
    }
    acc[key].items.push(item);
    
    // 部材の単重量を集計
    if (item.BUZAI_WEIGHT) {
      const weight = parseFloat(item.BUZAI_WEIGHT.toString());
      if (!isNaN(weight)) {
        acc[key].totalWeight += weight;
      }
    }
    
    return acc;
  }, {});

  const toggleRow = (key: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(key)) {
      newSelectedRows.delete(key);
    } else {
      newSelectedRows.add(key);
    }
    setSelectedRows(newSelectedRows);
  };

  const toggleExpand = (key: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(key)) {
      newExpandedRows.delete(key);
    } else {
      newExpandedRows.add(key);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSettingsChange = (newSettings: TableSettingsType) => {
    setSettings(newSettings);
  };

  const filteredData = data.filter(item => {
    switch (activeTab) {
      case 'with-list':
        return item.KONPO_LIST_ID && item.KONPO_LIST_ID.trim() !== '';
      case 'without-list':
        return !item.KONPO_LIST_ID || item.KONPO_LIST_ID.trim() === '';
      default:
        return true;
    }
  });

  const handleGenerateTanniIds = async () => {
    // 選択された行の単位IDを取得
    const selectedTanniIds = Array.from(selectedRows).map(key => {
      const group = groupedData[key];
      return group.items[0].KONPO_TANNI_ID;
    });

    if (selectedTanniIds.length === 0) {
      alert('リストIDを作成するデータを選択してください');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/bom/${params.project_id}/make_konpo_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedIds: selectedTanniIds }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'リストIDの作成に失敗しました');
      }

      // データを再取得
      const newResponse = await fetch(`/api/bom/${params.project_id}/flat/konpo`);
      if (!newResponse.ok) {
        throw new Error('データの再取得に失敗しました');
      }
      const result = await newResponse.json();
      setData(result);
      setSelectedRows(new Set()); // 選択をクリア
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>部品単位管理</CardTitle>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateTanniIds}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              選択リストID作成
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              設定
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="with-list">リストIDあり</TabsTrigger>
              <TabsTrigger value="without-list">リストIDなし</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>図面名</TableHead>
                  <TableHead>部品名</TableHead>
                  <TableHead>単位ID</TableHead>
                  <TableHead>リストID</TableHead>
                  <TableHead>全重量</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedData)
                  .filter(([key, group]) => {
                    const firstItem = group.items[0];
                    switch (activeTab) {
                      case 'with-list':
                        return firstItem.KONPO_LIST_ID && firstItem.KONPO_LIST_ID.trim() !== '';
                      case 'without-list':
                        return !firstItem.KONPO_LIST_ID || firstItem.KONPO_LIST_ID.trim() === '';
                      default:
                        return true;
                    }
                  })
                  .map(([key, group]) => {
                    const isSelected = selectedRows.has(key);
                    const isExpanded = expandedRows.has(key);
                    const firstItem = group.items[0];
                    const totalWeight = group.totalWeight;
                    const totalWeightWithQuantity = totalWeight * (firstItem.QUANTITY || 0);
                    return (
                      <React.Fragment key={key}>
                        <TableRow>
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleRow(key)}
                              className="h-4 w-4"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpand(key)}
                              className="p-0 h-6 w-6"
                            >
                              <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </Button>
                          </TableCell>
                          <TableCell>{firstItem.Zumen_Name}</TableCell>
                          <TableCell>{firstItem.PART_NAME}</TableCell>
                          <TableCell>{firstItem.KONPO_TANNI_ID}</TableCell>
                          <TableCell>{firstItem.KONPO_LIST_ID}</TableCell>
                          <TableCell>{formatWeightJSX(totalWeightWithQuantity)}</TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={7}>
                              <div className="grid grid-cols-4 gap-4 p-2">
                                <div>
                                  <span className="font-semibold">図面ID:</span> {firstItem.Zumen_ID}
                                </div>
                                <div>
                                  <span className="font-semibold">部品ID:</span> {firstItem.PART_ID}
                                </div>
                                <div>
                                  <span className="font-semibold">数量:</span> {firstItem.QUANTITY}
                                </div>
                                <div>
                                  <span className="font-semibold">部品口:</span> {firstItem.PART_KO}
                                </div>
                                <div>
                                  <span className="font-semibold">全数口:</span> {firstItem.ZENSU_KO}
                                </div>
                                <div>
                                  <span className="font-semibold">単重量:</span> {formatWeightJSX(totalWeight)}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <TableSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}
