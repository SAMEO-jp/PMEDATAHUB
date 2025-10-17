// ================================
// 層／用途: 部品表テーブル部品
// 役割/目的: 部品リスト表示・ドラッグ・プレビュー選択
// 補足メモ: page.tsxから分割、型・UI・イベントをpropsで受け取る
// ================================

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@src/components/ui/table'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import type { Part } from '@src/app/app_project/[project_id]/konpo/make_palet/types/parts'

type Props = {
  parts: Part[]
  draggingId: string | null
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onPreview: (img: string) => void
}

export const PartsTable: React.FC<Props> = ({ parts, draggingId, onDragStart, onDragEnd, onPreview }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className='w-10'></TableHead>
        <TableHead>図面番号</TableHead>
        <TableHead>部品番号</TableHead>
        <TableHead>品名</TableHead>
        <TableHead className='text-center'>登録数量</TableHead>
        <TableHead className='text-center'>初期数量</TableHead>
        <TableHead className='text-right'>重量(kg)</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {parts.map(part => (
        <TableRow
          key={part.id}
          draggable
          onDragStart={() => onDragStart(part.id)}
          onDragEnd={onDragEnd}
          onClick={() => onPreview(part.img)}
          className={`bg-white border-b cursor-grab transition-colors duration-200 hover:bg-slate-100 ${draggingId === part.id ? 'opacity-50' : ''}`}
        >
          <TableCell className='text-center text-slate-400'><Squares2X2Icon className='w-4 h-4' /></TableCell>
          <TableCell className='font-medium text-slate-900'>{part.zumenId}</TableCell>
          <TableCell className='font-medium text-slate-900'>{part.partNumber}</TableCell>
          <TableCell className='font-medium text-slate-900'>
            {part.name}
            <p className='font-normal text-xs text-slate-500'>{part.desc}</p>
          </TableCell>
          <TableCell className='text-center font-medium text-blue-600'>{part.registeredQty}</TableCell>
          <TableCell className='text-center'>{part.qty}</TableCell>
          <TableCell className='text-right'>{part.weight.toFixed(2)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
// ================================ 