'use client';

import React from 'react';
import { FileText, Hash } from 'lucide-react';
import type { BomFlatRow } from '@src/types/db_bom';

interface ZumenHeaderInfoProps {
  zumen: BomFlatRow;
}

export const ZumenHeaderInfo: React.FC<ZumenHeaderInfoProps> = ({ zumen }) => {
  const isKumitateZumen = zumen.Zumen_Kind === '組立図';

  return (
    <div className="flex items-center justify-center space-x-6">
      {/* 図面アイコンと種別チップ */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
          isKumitateZumen 
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {zumen.Zumen_Kind}
        </span>
        <span className="text-xl font-bold text-gray-900">：{zumen.Zumen_Name}</span>
      </div>

      {/* 図面ID */}
      <div className="flex items-center space-x-2">
        <Hash className="w-4 h-4 text-gray-500" />
        <span className="text-xl font-bold text-gray-900">ID：{zumen.Zumen_ID}</span>
      </div>
    </div>
  );
}; 