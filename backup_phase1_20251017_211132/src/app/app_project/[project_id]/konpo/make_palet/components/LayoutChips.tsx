// ==========================================
// ファイル名: LayoutChips.tsx
// 機能: レイアウト切り替えチップコンポーネント
// 技術: React, TypeScript
// 作成日: 2025-06-30
// ==========================================
import { ViewColumnsIcon, ListBulletIcon, TableCellsIcon, CubeIcon } from '@heroicons/react/24/outline'
import { usePaletLayout } from '@src/app/app_project/[project_id]/konpo/make_palet/store/paletLayoutStore'

export const LayoutChips: React.FC = () => {
  const { layoutType, setLayoutType } = usePaletLayout()

  const handleLayoutChange = (type: 'normal' | 'palette-master-list' | 'palette-list' | 'palette-table') => {
    console.log('レイアウト変更:', type) // デバッグ用
    setLayoutType(type)
  }

  const getLayoutLabel = (type: string) => {
    switch (type) {
      case 'normal': return '通常'
      case 'palette-master-list': return 'パレットマスターリスト'
      case 'palette-list': return 'パレットリスト'
      case 'palette-table': return 'パレットテーブル'
      default: return '通常'
    }
  }

  return (
    <div className='flex items-center gap-4'>
      <span className='text-sm text-gray-600 font-medium'>
        現在: {getLayoutLabel(layoutType)}
      </span>
      <div className='flex gap-2'>
        <button
          onClick={() => handleLayoutChange('normal')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            layoutType === 'normal'
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <ViewColumnsIcon className='w-4 h-4' />
          通常
        </button>
        <button
          onClick={() => handleLayoutChange('palette-master-list')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            layoutType === 'palette-master-list'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <CubeIcon className='w-4 h-4' />
          パレットマスターリスト
        </button>
        <button
          onClick={() => handleLayoutChange('palette-list')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            layoutType === 'palette-list'
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <ListBulletIcon className='w-4 h-4' />
          パレットリスト
        </button>
        <button
          onClick={() => handleLayoutChange('palette-table')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            layoutType === 'palette-table'
              ? 'bg-orange-100 text-orange-800 border border-orange-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <TableCellsIcon className='w-4 h-4' />
          パレットテーブル
        </button>
      </div>
    </div>
  )
} 