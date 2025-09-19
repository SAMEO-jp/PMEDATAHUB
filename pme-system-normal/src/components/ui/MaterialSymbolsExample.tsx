// ==========================================
// Material Symbols ローカル使用例
// ==========================================

import React from 'react';
import { MaterialSymbol } from 'react-material-symbols';

export const MaterialSymbolsExample: React.FC = () => {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Material Symbols ローカル使用例</h2>
      
      {/* 従来のCDN方式 */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">CDN方式（従来）</h3>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="material-symbols-outlined text-2xl">settings</span>
          <span className="material-symbols-outlined text-2xl">account_circle</span>
        </div>
      </div>

      {/* 新しいローカル方式 */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">ローカル方式（新規）</h3>
        <div className="flex gap-4">
          <MaterialSymbol icon="home" size={24} />
          <MaterialSymbol icon="settings" size={24} />
          <MaterialSymbol icon="account_circle" size={24} />
        </div>
      </div>

      {/* サイズバリエーション */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">サイズバリエーション</h3>
        <div className="flex items-center gap-4">
          <MaterialSymbol icon="favorite" size={16} />
          <MaterialSymbol icon="favorite" size={24} />
          <MaterialSymbol icon="favorite" size={32} />
          <MaterialSymbol icon="favorite" size={48} />
        </div>
      </div>

      {/* 色バリエーション */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">色バリエーション</h3>
        <div className="flex gap-4">
          <MaterialSymbol icon="star" size={24} className="text-blue-500" />
          <MaterialSymbol icon="star" size={24} className="text-green-500" />
          <MaterialSymbol icon="star" size={24} className="text-red-500" />
          <MaterialSymbol icon="star" size={24} className="text-purple-500" />
        </div>
      </div>

      {/* フィルバリエーション */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">フィルバリエーション</h3>
        <div className="flex gap-4">
          <MaterialSymbol icon="favorite" size={24} />
          <MaterialSymbol icon="favorite" size={24} fill />
          <MaterialSymbol icon="favorite" size={24} fill={true} />
        </div>
      </div>
    </div>
  );
}; 