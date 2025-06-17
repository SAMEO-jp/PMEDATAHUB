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
import { ChevronDown, ChevronUp, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@ui/button';
import { Tabs, TabsList, TabsTrigger } from '@ui/tabs';
import { ResizableTable } from './components/ResizableTable';
import { TableSettings } from './components/TableSettings';
import { TableSettings as TableSettingsType, defaultTableSettings } from './columnWidths';


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
      case 'with-tanni':
        return item.KONPO_TANNI_ID && item.KONPO_TANNI_ID.trim() !== '';
      case 'without-tanni':
        return !item.KONPO_TANNI_ID || item.KONPO_TANNI_ID.trim() === '';
      default:
        return true;
    }
  });

  const handleGenerateTanniIds = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/bom/${params.project_id}/auto_konpo_tanni`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('単位IDの生成に失敗しました');
      }
      // データを再取得
      const newResponse = await fetch(`/api/bom/${params.project_id}/flat/konpo`);
      if (!newResponse.ok) {
        throw new Error('データの再取得に失敗しました');
      }
      const result = await newResponse.json();
      setData(result);
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
              単位ID自動生成
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              テーブル設定
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">ALL</TabsTrigger>
              <TabsTrigger value="with-tanni">単位IDあり</TabsTrigger>
              <TabsTrigger value="without-tanni">単位ID無し</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="overflow-x-auto">
            <ResizableTable
              columnWidths={settings.columnWidths}
              onColumnWidthChange={(newWidths) => handleSettingsChange({ ...settings, columnWidths: newWidths })}
            >
              <Table>
                <TableHeader>
                  <TableRow style={{ height: `${settings.rowHeight}px` }}>
                    <TableHead style={{ width: `${settings.columnWidths.expandButton}px` }}></TableHead>
                    <TableHead style={{ width: `${settings.columnWidths.zumenId}px` }}>図面ID</TableHead>
                    <TableHead style={{ width: `${settings.columnWidths.zumenName}px` }}>図面名</TableHead>
                    <TableHead style={{ width: `${settings.columnWidths.partId}px` }}>部品ID</TableHead>
                    <TableHead style={{ width: `${settings.columnWidths.partName}px` }}>部品名</TableHead>
                    <TableHead style={{ width: `${settings.columnWidths.quantity}px` }}>数量</TableHead>
                    <TableHead style={{ width: `${settings.columnWidths.manufacturer}px` }}>メーカー</TableHead>
                    <TableHead style={{ width: `${settings.columnWidths.tanniId}px` }}>単位ID</TableHead>
                    <TableHead style={{ width: `${settings.columnWidths.listId}px` }}>リストID</TableHead>
                    <TableHead style={{ width: `${settings.columnWidths.singleWeight}px` }} className="text-right">単重量(kg)</TableHead>
                    <TableHead style={{ width: `${settings.columnWidths.totalWeight}px` }} className="text-right">総重量(kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(groupedData).map(([key, { items, totalWeight }]) => {
                    const mainItem = items[0];
                    const isExpanded = expandedRows.has(key);
                    const totalQuantity = mainItem.QUANTITY || 0;
                    const totalWeightWithQuantity = totalWeight * totalQuantity;

                    // フィルタリングされたデータのみを表示
                    if (!filteredData.some(item => 
                      item.Zumen_ID === mainItem.Zumen_ID && 
                      item.PART_ID === mainItem.PART_ID
                    )) {
                      return null;
                    }

                    return (
                      <React.Fragment key={key}>
                        <TableRow 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleRow(key)}
                          style={{ height: `${settings.rowHeight}px` }}
                        >
                          <TableCell>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </TableCell>
                          <TableCell>{mainItem.Zumen_ID}</TableCell>
                          <TableCell>{mainItem.Zumen_Name}</TableCell>
                          <TableCell>{mainItem.PART_ID}</TableCell>
                          <TableCell>{mainItem.PART_NAME}</TableCell>
                          <TableCell>{mainItem.QUANTITY}</TableCell>
                          <TableCell>{mainItem.MANUFACTURER}</TableCell>
                          <TableCell>{mainItem.KONPO_TANNI_ID}</TableCell>
                          <TableCell>{mainItem.KONPO_LIST_ID}</TableCell>
                          <TableCell className="text-right">{formatWeightJSX(totalWeight)}</TableCell>
                          <TableCell className="text-right">{formatWeightJSX(totalWeightWithQuantity)}</TableCell>
                        </TableRow>
                        {isExpanded && items.map((item, index) => (
                          item.BUZAI_ID && (
                            <TableRow key={`${key}-${index}`} className="bg-gray-50" style={{ height: `${settings.rowHeight}px` }}>
                              <TableCell></TableCell>
                              <TableCell colSpan={9}>
                                <div className="grid grid-cols-4 gap-4">
                                  <div>
                                    <span className="font-semibold">部材ID:</span> {item.BUZAI_ID}
                                  </div>
                                  <div>
                                    <span className="font-semibold">部材名:</span> {item.BUZAI_NAME}
                                  </div>
                                  <div className="text-right">
                                    <span className="font-semibold">重量:</span> {formatWeightJSX(Number(item.BUZAI_WEIGHT))}
                                  </div>
                                  <div>
                                    <span className="font-semibold">材質:</span> {item.ZAISITU_NAME}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        ))}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </ResizableTable>
          </div>
        </CardContent>
      </Card>

      <TableSettings
        settings={settings}
        onSettingsChange={handleSettingsChange}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
