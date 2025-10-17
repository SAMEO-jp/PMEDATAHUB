// ==========================================
// ファイル名: HeaderLayoutSwitcher.tsx
// 機能: ルートヘッダー用レイアウト切り替えコンポーネント
// 技術: React, TypeScript
// 作成日: 2025-01-XX
// ==========================================

'use client'

import { ViewColumnsIcon, ListBulletIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import { usePaletLayout } from '@src/app/app_project/[project_id]/konpo/make_palet/store/paletLayoutStore'

export const HeaderLayoutSwitcher: React.FC = () => {
  const pathname = usePathname()
  const { layoutType, setLayoutType } = usePaletLayout()

  // パレットページかどうかを判定
  const isPaletPage = pathname.includes('/konpo/make_palet')

  // パレットページでない場合は何も表示しない
  if (!isPaletPage) {
    return null
  }

  const handleLayoutChange = (type: 'normal' | 'palette-list' | 'palette-table' | 'palette-list-new') => {
    console.log('レイアウト変更:', type)
    setLayoutType(type)
  }

  const getLayoutLabel = (type: string) => {
    switch (type) {
      case 'normal': return '通常'
      case 'palette-list': return 'パレットマスターリスト'
      case 'palette-table': return 'パレットテーブル'
      case 'palette-list-new': return 'パレットリスト'
      default: return '通常'
    }
  }

  return (
    <div className='flex items-center gap-4'>
      <span className='text-sm text-gray-600 font-medium'>
        レイアウト: {getLayoutLabel(layoutType)}
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
          onClick={() => handleLayoutChange('palette-list')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            layoutType === 'palette-list'
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <ListBulletIcon className='w-4 h-4' />
          パレットマスターリスト
        </button>
        <button
          onClick={() => handleLayoutChange('palette-list-new')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            layoutType === 'palette-list-new'
              ? 'bg-green-100 text-green-800 border border-green-200'
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