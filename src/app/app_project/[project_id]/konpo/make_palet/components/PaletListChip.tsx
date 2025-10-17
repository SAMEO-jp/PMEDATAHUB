/**
 * @file PaletListChip.tsx
 * パレットリスト表示専用のコンポーネント
 */

'use client';

import { usePaletListAll } from '@src/hooks/usePaletData';
import type { PaletList } from '@src/types/palet';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';
import { Badge } from '@src/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";

export function PaletListChip() {
  const { data: listAll, isLoading: listAllLoading } = usePaletListAll();

  if (listAllLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>パレットリスト</CardTitle>
        </CardHeader>
        <CardContent>
          <p>読み込み中...</p>
        </CardContent>
      </Card>
    );
  }

  if (!listAll || !listAll.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>パレットリスト</CardTitle>
        </CardHeader>
        <CardContent>
          <p>データを取得できませんでした。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          パレットリスト
          <Badge variant="secondary">{listAll.data.length || 0}件</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>パレットリストID</TableHead>
              <TableHead>マスターID</TableHead>
              <TableHead>表示名</TableHead>
              <TableHead>数量</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listAll.data.map((item: PaletList) => (
              <TableRow key={item.palet_list_id}>
                <TableCell>{item.palet_list_id}</TableCell>
                <TableCell>{item.palet_master_id}</TableCell>
                <TableCell>{item.palet_list_display_name}</TableCell>
                <TableCell>{item.palet_quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
