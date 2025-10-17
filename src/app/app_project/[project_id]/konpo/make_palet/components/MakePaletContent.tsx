// ==========================================
// 変更記録
// 2025-06-30 新しいテーブル構造（KONPO_PALET + KONPO_PALET_MASTER）対応
// 2025-06-30 ページコンポーネントからJSXを分離（ファイルサイズ削減）
// 2025-01-XX チップスをページ先頭に移動（PaletListChip表示部分削除）
// ==========================================

'use client'

import type { Part, PaletteItem, PaletListItem } from '@src/app/app_project/[project_id]/konpo/make_palet/types/index'
import { useState } from 'react'
import { Squares2X2Icon } from '@heroicons/react/24/outline'

import { PaletteCard } from '@src/app/app_project/[project_id]/konpo/make_palet/components/PaletteCard'
import { PaletteInfo } from '@src/app/app_project/[project_id]/konpo/make_palet/components/PaletteInfo'
import { PaletteList } from '@src/app/app_project/[project_id]/konpo/make_palet/components/PaletteList'
import { PaletteTable } from '@src/app/app_project/[project_id]/konpo/make_palet/components/PaletteTable'
import { PartsTableWithFilter } from '@src/app/app_project/[project_id]/konpo/make_palet/components/PartsTableWithFilter'
import { RegisterPaletButton } from './RegisterPaletButton'

// ==========================================
// 型定義層
// ==========================================
interface MakePaletContentProps {
  palette: PaletteItem[]
  parts: Part[]
  totalCount: number
  totalWeight: number
  createdAt: Date | null
  updatedAt: Date | null
  draggingId: string | null
  _previewImg: string | null
  layoutType: string
  paletListData: PaletListItem[]
  paletListLoading: boolean
  paletListError: string | null
  konpoPaletData: any[]
  onRemove: (id: string) => void
  onQtyChange: (id: string, qty: number) => void
  onQtyInputChange: (id: string, newQty: number) => void
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDeletePalet: (paletId: string) => Promise<boolean>
  onEditPalet: (paletId: string) => void
  onPreview: (img: string | null) => void
  onRefreshPaletList: () => void
  onClearPalette: () => void
  onRefreshData: () => void
}

export function MakePaletContent({
  palette,
  parts,
  totalCount,
  totalWeight,
  createdAt,
  updatedAt,
  draggingId,
  _previewImg,
  layoutType,
  paletListData,
  paletListLoading,
  paletListError,
  konpoPaletData,
  onRemove,
  onQtyChange,
  onQtyInputChange,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragOver,
  onDeletePalet,
  onEditPalet,
  onPreview,
  onRefreshPaletList,
  onClearPalette,
  onRefreshData,
}: MakePaletContentProps) {
  // ==========================================
  // 状態管理層
  // ==========================================
  const [displayName, setDisplayName] = useState('')
  const [paletteQuantity, setPaletteQuantity] = useState(1)
  const [localError, setLocalError] = useState<string | null>(null);

  // 登録成功時の処理
  const handleRegisterSuccess = () => {
    setDisplayName('');
    setPaletteQuantity(1);
    setLocalError(null);
    // パレットをクリア
    onClearPalette();
    // データを再読み込み
    onRefreshData();
    // パレットリストも更新
    onRefreshPaletList();
    // ページ全体を再読み込み（部品表の更新のため）
    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1秒後に再読み込み（成功メッセージを表示するため）
  };

  // 登録失敗時の処理
  const handleRegisterError = (err: string) => {
    setLocalError(err);
  };

  // ==========================================
  // 変換・フォーマット層
  // ==========================================
  // 日付フォーマット関数
  function formatDate(date: Date | null) {
    if (!date) return '---'
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  // ==========================================
  // レンダリング層
  // ==========================================
  return (
    <div className='bg-slate-100 h-screen flex flex-col'>
      {/* ヘッダー */}
      <header className='bg-white shadow-sm z-10 flex-shrink-0 flex justify-between items-center p-4'>
        <div />
      </header>

      {/* メイン */}
      <main className='flex-grow flex flex-col p-4 overflow-y-auto'>
        {layoutType === 'normal' ? (
          // 通常レイアウト
          <div className='w-full h-full flex gap-4'>
            {/* 左側：部品表 */}
            <section className='w-2/3 bg-white rounded-xl p-4 flex flex-col'>
              <div className='flex justify-between items-center mb-3'>
                <h2 className='text-lg font-semibold text-slate-700 flex items-center gap-2'>
                  <Squares2X2Icon className='w-5 h-5 text-slate-500' />部品表
                </h2>
              </div>
              <div className='border rounded-lg overflow-auto' style={{ height: 'calc(18 * 2.5rem + 2rem)' }}>
                <PartsTableWithFilter
                  parts={parts}
                  palette={palette}
                  draggingId={draggingId}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onPreview={onPreview}
                />
              </div>
            </section>

            {/* 右側：部品パレット */}
            <section
              className={`w-1/3 bg-white rounded-xl border-2 border-dashed border-slate-300 flex flex-col p-4 transition-all duration-300 ${draggingId ? 'ring-2 ring-blue-400' : ''}`}
              style={{ height: 'calc(18 * 2.5rem + 8rem)' }}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <div className='flex justify-between items-center mb-2'>
                <h2 className='text-lg font-semibold text-slate-700 flex items-center gap-2'>
                  <Squares2X2Icon className='w-5 h-5 text-slate-500' />
                  部品パレット
                </h2>
                <div>
                  <RegisterPaletButton
                    palette={palette}
                    displayName={displayName}
                    paletteQuantity={paletteQuantity}
                    disabled={false}
                    onSuccess={handleRegisterSuccess}
                    onError={handleRegisterError}
                  />
                </div>
              </div>
              {/* エラー表示 */}
              {localError && (
                <div className='mb-3 p-3 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-red-600 text-sm'>{localError}</p>
                </div>
              )}
              {/* パレット情報 */}
              <PaletteInfo
                status={palette.length ? '編集中' : '空'}
                partCount={totalCount}
                totalWeight={totalWeight}
                createdAt={formatDate(createdAt)}
                updatedAt={formatDate(updatedAt)}
                displayName={displayName}
                paletteQuantity={paletteQuantity}
                onDisplayNameChange={setDisplayName}
                onPaletteQuantityChange={setPaletteQuantity}
              />
              {/* パレット内容 */}
              <div className='flex-grow rounded-lg bg-slate-50 p-3 flex flex-col gap-3 overflow-y-auto min-h-[80px]'>
                {palette.length === 0 ? (
                  <p className='text-slate-500 w-full text-center self-center'>左の部品表から行をドラッグ＆ドロップしてください</p>
                ) : (
                  palette.map(item => (
                    <PaletteCard
                      key={item.id}
                      item={item}
                      onRemove={onRemove}
                      onQtyChange={onQtyChange}
                      onQtyInputChange={onQtyInputChange}
                    />
                  ))
                )}
              </div>
            </section>
          </div>

        ) : layoutType === 'palette-list' ? (
          // パレットリストレイアウト
          <div className='w-full h-full'>
            <PaletteList
              data={paletListData}
              loading={paletListLoading}
              error={paletListError}
              onRefresh={onRefreshPaletList}
              onDelete={onDeletePalet}
              onEdit={onEditPalet}
            />
          </div>
        ) : layoutType === 'palette-table' ? (
          // パレットテーブルレイアウト
          <div className='w-full h-full'>
            <PaletteTable
              data={konpoPaletData}
              loading={paletListLoading}
              error={paletListError}
              onRefresh={onRefreshPaletList}
            />
          </div>
        ) : null}
      </main>


    </div>
  )
} 