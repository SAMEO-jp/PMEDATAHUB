// ==========================================
// テーブル一覧コンポーネント
// ==========================================

import { MoreHorizontalIcon } from './Icons';
import type { TableItem } from '../types';

interface TableListProps {
  tables: TableItem[];
  selected: string[];
  onSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
}

export const TableList = ({
  tables,
  selected,
  onSelect,
  onSelectAll,
}: TableListProps) => {
  const allSelected = tables.length > 0 && selected.length === tables.length;
  const someSelected = selected.length > 0 && selected.length < tables.length;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="p-4 w-12 text-center">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                onChange={(e) => onSelectAll(e.target.checked)}
                checked={allSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = someSelected;
                  }
                }}
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              テーブル名
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              レコード数
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              タグ
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              最終更新日
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tables.map((table) => (
            <tr key={table.id} className={`hover:bg-gray-50 ${selected.includes(table.id) ? 'bg-indigo-50' : ''}`}>
              <td className="p-4 text-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                  checked={selected.includes(table.id)}
                  onChange={() => onSelect(table.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{table.name}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">{table.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {table.records.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {table.tags.map(tag => (
                    <span key={tag} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {table.lastUpdated}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-gray-100">
                  <MoreHorizontalIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">一致するテーブルが見つかりません。</p>
        </div>
      )}
    </div>
  );
}; 