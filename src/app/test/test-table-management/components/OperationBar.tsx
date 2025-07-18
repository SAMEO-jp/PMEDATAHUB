// ==========================================
// 操作バーコンポーネント
// ==========================================

import { SearchIcon, ChevronDownIcon, TrashIcon } from './Icons';

interface OperationBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selected: string[];
  onDelete: (idsToDelete: string[]) => void;
}

export const OperationBar = ({
  searchTerm,
  onSearchChange,
  selected,
  onDelete,
}: OperationBarProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="テーブル名、説明で検索..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="flex items-center px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
              ソート: 更新日順 <ChevronDownIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
              フィルタ: 全て <ChevronDownIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
      {/* 選択項目削除ボタン用の固定高さエリア */}
      <div className="mt-4 h-12 flex items-center justify-between bg-indigo-50 p-3 rounded-lg transition-opacity duration-200" 
           style={{ opacity: selected.length > 0 ? 1 : 0, visibility: selected.length > 0 ? 'visible' : 'hidden' }}>
        <p className="text-sm font-medium text-indigo-700">
          {selected.length > 0 ? `${selected.length}件選択中` : '0件選択中'}
        </p>
        <button 
          onClick={() => onDelete(selected)}
          className="flex items-center text-sm font-semibold text-red-600 hover:text-red-800"
          disabled={selected.length === 0}
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          選択した項目を削除
        </button>
      </div>
    </div>
  );
}; 