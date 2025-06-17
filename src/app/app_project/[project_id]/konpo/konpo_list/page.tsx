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
import { Settings, ChevronRight } from 'lucide-react';
import { Button } from '@ui/button';
import { TableSettings } from './components/TableSettings';
import { TableSettings as TableSettingsType, defaultTableSettings } from './columnWidths';

interface BuzaiInfo {
  BUZAI_NAME: string;
  BUZAI_WEIGHT: string;
  BUZAI_QUANTITY: string;
  ZAISITU_NAME: string;
}

interface KonpoListData {
  KONPO_LIST_ID: string;
  PROJECT_ID: string;
  KONPO_LIST_WEIGHT: string;
  HASSOU_IN: string;
  HASSOU_TO: string;
  IMAGE_ID: string;
  KONPO_TANNI_ID: string;
  KT_ZUMEN_ID: string;
  KT_PART_ID: string;
  PART_KO: string;
  ZENSU_KO: string;
  Zumen_Name: string;
  Zumen_Kind: string;
  Souti_ID: string;
  Souti_name: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  MANUFACTURER: string;
  TEHAI_ID: string;
  PART_PROJECT_ID: string;
  PART_TANNI_WEIGHT: string;
  BUZAI_LIST?: BuzaiInfo[];
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
      <span style={{ display: 'inline-flex', alignItems: 'baseline', justifyContent: 'flex-end', width: '100%' }}>
        <span style={{ textAlign: 'right', minWidth: '2.5em', letterSpacing: '0.05em' }}>{tons}</span>
        <sup style={{ marginLeft: '1px', marginRight: '1px' }}>t</sup>
        <span style={{ textAlign: 'right', minWidth: '1.5em', letterSpacing: '0.05em' }}>{kg}</span>
        .{decPart}
      </span>
    );
  }
  // 3桁以下はそのまま
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', justifyContent: 'flex-end', width: '100%' }}>
      <span style={{ textAlign: 'right', minWidth: '3em', letterSpacing: '0.05em' }}>{intPart}</span>.{decPart}
    </span>
  );
};

// 部材の重量を計算する関数
const calculateBuzaiWeight = (buzaiList: BuzaiInfo[]): number => {
  return buzaiList.reduce((total, buzai) => {
    const weight = parseFloat(buzai.BUZAI_WEIGHT) || 0;
    const quantity = parseInt(buzai.BUZAI_QUANTITY) || 0;
    return total + (weight * quantity);
  }, 0);
};

// スタイルの定数
const styles = {
  headerRow: 'h-[20px] bg-gray-50 border-b border-gray-200 font-medium',
  expandedRow: 'bg-gray-50/50',
  expandButton: 'h-[20px] w-[20px] p-0 hover:bg-gray-100 rounded-sm',
  expandIcon: 'h-3 w-3 transition-transform text-gray-600',
  cell: 'p-1 text-sm',
  headerCell: 'p-1 text-sm font-medium text-gray-700',
  weightCell: 'p-1 text-sm text-right tabular-nums',
  nestedTable: 'border-l-2 border-gray-200',
  nestedHeader: 'bg-gray-50/70',
  nestedExpanded: 'bg-gray-50/30',
} as const;

export default function KonpoListPage() {
  const params = useParams();
  const [data, setData] = useState<KonpoListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<TableSettingsType>(defaultTableSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bom/${params.project_id}/flat/konpo_list`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const result = await response.json();
        console.log('API Response:', result); // デバッグ用
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.project_id]);

  const handleSettingsChange = (newSettings: TableSettingsType) => {
    setSettings(newSettings);
  };

  const toggleList = (listId: string) => {
    const newExpandedLists = new Set(expandedLists);
    if (newExpandedLists.has(listId)) {
      newExpandedLists.delete(listId);
    } else {
      newExpandedLists.add(listId);
    }
    setExpandedLists(newExpandedLists);
  };

  const toggleItem = (key: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(key)) {
      newExpandedItems.delete(key);
    } else {
      newExpandedItems.add(key);
    }
    setExpandedItems(newExpandedItems);
  };

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  // 梱包リストIDでグループ化
  const listGroups = data.reduce((acc, item) => {
    if (!acc[item.KONPO_LIST_ID]) {
      acc[item.KONPO_LIST_ID] = {
        listId: item.KONPO_LIST_ID,
        weight: 0,
        hassouIn: item.HASSOU_IN,
        hassouTo: item.HASSOU_TO,
        items: {} as { [key: string]: {
          zumenId: string;
          partId: string;
          partName: string;
          quantity: string;
          weight: number;
          buzaiList: BuzaiInfo[];
        }}
      };
    }

    const itemKey = `${item.KT_ZUMEN_ID}-${item.KT_PART_ID}`;
    if (!acc[item.KONPO_LIST_ID].items[itemKey]) {
      const buzaiList = item.BUZAI_LIST || [];
      const buzaiWeight = calculateBuzaiWeight(buzaiList);
      
      acc[item.KONPO_LIST_ID].items[itemKey] = {
        zumenId: item.KT_ZUMEN_ID,
        partId: item.KT_PART_ID,
        partName: item.PART_NAME,
        quantity: `${item.PART_KO}${item.ZENSU_KO ? ` ${item.ZENSU_KO}` : ''}`,
        weight: buzaiWeight,
        buzaiList: buzaiList,
      };

      acc[item.KONPO_LIST_ID].weight += buzaiWeight;
    }

    return acc;
  }, {} as { [key: string]: {
    listId: string;
    weight: number;
    hassouIn: string;
    hassouTo: string;
    items: { [key: string]: {
      zumenId: string;
      partId: string;
      partName: string;
      quantity: string;
      weight: number;
      buzaiList: BuzaiInfo[];
    }};
  }});

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-lg">梱包リスト一覧</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className={styles.headerRow}>
                <TableHead style={{ width: settings.columnWidths.expandColumn }} className={styles.headerCell}></TableHead>
                <TableHead style={{ width: settings.columnWidths.konpoListIdColumn }} className={styles.headerCell}>梱包リストID</TableHead>
                <TableHead style={{ width: settings.columnWidths.weightColumn }} className={`${styles.headerCell} text-right`}>重量</TableHead>
                <TableHead style={{ width: settings.columnWidths.hassouInColumn }} className={styles.headerCell}>発送元</TableHead>
                <TableHead style={{ width: settings.columnWidths.hassouToColumn }} className={styles.headerCell}>発送先</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(listGroups).map(([listId, list]) => (
                <React.Fragment key={listId}>
                  <TableRow className={`h-[20px] ${expandedLists.has(listId) ? styles.expandedRow : ''}`}>
                    <TableCell className="p-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleList(listId)}
                        className={styles.expandButton}
                      >
                        <ChevronRight
                          className={`${styles.expandIcon} ${
                            expandedLists.has(listId) ? 'rotate-90' : ''
                          }`}
                        />
                      </Button>
                    </TableCell>
                    <TableCell className={styles.cell}>{list.listId}</TableCell>
                    <TableCell className={styles.weightCell}>{formatWeightJSX(list.weight)}</TableCell>
                    <TableCell className={styles.cell}>{list.hassouIn}</TableCell>
                    <TableCell className={styles.cell}>{list.hassouTo}</TableCell>
                  </TableRow>
                  {expandedLists.has(listId) && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <div className={`pl-4 ${styles.nestedTable}`}>
                          <Table>
                            <TableHeader>
                              <TableRow className={styles.nestedHeader}>
                                <TableHead style={{ width: settings.columnWidths.expandColumn }} className={styles.headerCell}></TableHead>
                                <TableHead className={styles.headerCell}>図面ID</TableHead>
                                <TableHead className={styles.headerCell}>部品ID</TableHead>
                                <TableHead className={styles.headerCell}>部品名</TableHead>
                                <TableHead className={styles.headerCell}>数量</TableHead>
                                <TableHead className={`${styles.headerCell} text-right`}>重量</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Object.entries(list.items).map(([key, item]) => (
                                <React.Fragment key={key}>
                                  <TableRow className={`h-[20px] ${expandedItems.has(key) ? styles.nestedExpanded : ''}`}>
                                    <TableCell className="p-0">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleItem(key)}
                                        className={styles.expandButton}
                                      >
                                        <ChevronRight
                                          className={`${styles.expandIcon} ${
                                            expandedItems.has(key) ? 'rotate-90' : ''
                                          }`}
                                        />
                                      </Button>
                                    </TableCell>
                                    <TableCell className={styles.cell}>{item.zumenId}</TableCell>
                                    <TableCell className={styles.cell}>{item.partId}</TableCell>
                                    <TableCell className={styles.cell}>{item.partName}</TableCell>
                                    <TableCell className={styles.cell}>{item.quantity}</TableCell>
                                    <TableCell className={styles.weightCell}>{formatWeightJSX(item.weight)}</TableCell>
                                  </TableRow>
                                  {expandedItems.has(key) && item.buzaiList.length > 0 && (
                                    <TableRow>
                                      <TableCell colSpan={6} className="p-0">
                                        <div className={`pl-8 ${styles.nestedTable}`}>
                                          <Table>
                                            <TableHeader>
                                              <TableRow className={styles.nestedHeader}>
                                                <TableHead className={styles.headerCell}>部材名</TableHead>
                                                <TableHead className={styles.headerCell}>材質</TableHead>
                                                <TableHead className={styles.headerCell}>数量</TableHead>
                                                <TableHead className={`${styles.headerCell} text-right`}>重量</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {item.buzaiList.map((buzai, index) => (
                                                <TableRow key={`${key}-${index}`} className="h-[20px]">
                                                  <TableCell className={styles.cell}>{buzai.BUZAI_NAME}</TableCell>
                                                  <TableCell className={styles.cell}>{buzai.ZAISITU_NAME}</TableCell>
                                                  <TableCell className={styles.cell}>{buzai.BUZAI_QUANTITY}個</TableCell>
                                                  <TableCell className={styles.weightCell}>{formatWeightJSX(parseFloat(buzai.BUZAI_WEIGHT))}</TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </React.Fragment>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <TableSettings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}
