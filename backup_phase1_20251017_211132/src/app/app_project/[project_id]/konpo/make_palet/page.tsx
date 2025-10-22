// ==========================================
// 変更記録
// 20250630 新しいテーブル構造（KONPO_PALET + KONPO_PALET_MASTER）対応
// 2250630 型定義分離・セクション構造整理（1.2age-record.mdc準拠）
// 20250630 ダミーデータ削除・データベース連携実装
//22506-30 パレット登録機能追加
// 2025-06-30フィルタリング機能・登録済みパレット表示追加
// 2025-0630フィルタチップ重複呼び出し修正
// 2025630 Zustandストアによるフィルタ状態管理実装
// 202530 パレットテーブル統合hooks実装
// 2025-01 セクション構造整理（1.2age-record.mdc準拠）
// 2025-1-XX イベントハンドラ分離（カスタムフック化）
// 202501-XX 不要セクション削除・構造簡素化
// 22501XX BOM_PARTからBOM_BUHINに変更
// 2025-01-XX レイアウト切り替えチップをページ先頭に移動
// ==========================================

'use client'
import { useParams } from 'next/navigation'
import React, { useState, useMemo } from 'react'
import { useBomBuhinData } from '@src/hooks/useBomBuhinData'
import { useKonpoPaletAll, useKonpoPaletMutations, usePaletMasterAll } from '@src/hooks/usePaletData'
import type { Part, PaletteItem } from '@src/app/app_project/[project_id]/konpo/make_palet/types/index'
import type { KonpoPalet } from '@src/types/palet'
import { usePaletLayout } from '@src/app/app_project/[project_id]/konpo/make_palet/store/paletLayoutStore'

import { useRegisteredQuantity, usePaletEventHandlers } from './hooks'
import { MakePaletContent } from '@src/app/app_project/[project_id]/konpo/make_palet/components/MakePaletContent'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { PaletMasterList } from '@src/app/app_project/[project_id]/konpo/make_palet/components/PaletMasterList'
import { PaletteTable } from '@src/app/app_project/[project_id]/konpo/make_palet/components/PaletteTable'
import { LayoutChips } from '@src/app/app_project/[project_id]/konpo/make_palet/components/LayoutChips'

// ==========================================
// 型定義層
// ==========================================

export default function MakePaletPage() {
  // ==========================================
  // パラメータとルーティング層
  // ==========================================
  const params = useParams()
  const projectId = params.project_id as string
  
  // ==========================================
  // 状態管理層
  // ==========================================
  const [palette, setPalette] = useState<PaletteItem[]>([])
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [createdAt, setCreatedAt] = useState<Date | null>(null)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  // ==========================================
  // データ取得層
  // ==========================================
  const { data: bomBuhinData, refetch: refetchBomBuhin } = useBomBuhinData(projectId)
  
  // 新しいパレットAPI対応のカスタムフックを使用
  const konpoPaletQuery = useKonpoPaletAll()
  const konpoPaletMutations = useKonpoPaletMutations()
  
  // パレットマスターデータを取得
  const paletMasterQuery = usePaletMasterAll()

  // ==========================================
  // 副作用層
  // ==========================================
  // 登録数量を取得するカスタムフック（新しいテーブル構造対応）
  const { bomBuhinWithRegisteredQty } = useRegisteredQuantity(
    bomBuhinData, 
    konpoPaletQuery.data?.data || [], 
    [] // パレットマスターデータは使用しないため空配列を渡す
  );

  // パレットリストデータを構築（新しいテーブル構造対応）
  const paletListData = useMemo(() => {
    if (!paletMasterQuery.data?.data || !konpoPaletQuery.data?.data) {
      return [];
    }

    const masterData = paletMasterQuery.data.data;
    const konpoData = konpoPaletQuery.data.data;

    // パレットマスターごとにグループ化してリストデータを構築
    return masterData.map(master => {
      // このマスターに属する構成パレットを取得
      const relatedKonpo = konpoData.filter(konpo => konpo.palet_master_id === master.palet_master_id);
      
      return {
        konpo_palet_master_id: master.palet_master_id,
        palet_display_name: master.palet_master_display_name,
        palet_quantity: relatedKonpo.length, // 構成パレット数
        created_at: master.created_at,
        updated_at: master.updated_at,
      };
    });
  }, [paletMasterQuery.data?.data, konpoPaletQuery.data?.data]);

  // BOM_BUHINデータをPart型に変換（登録済みパレットデータを含む）
  const parts: Part[] = useMemo(() => {
    return bomBuhinWithRegisteredQty.map(dbBuhin => {
      return {
        id: dbBuhin.BUHIN_ID, // 部品IDをIDとして使用
        icon: <Squares2X2Icon className='w-5 h-5 text-blue-500' />,
        name: dbBuhin.BUHIN_NAME || '部品名未設定',
        desc: dbBuhin.BUHIN_MANUFACTURER || '製造元未設定',
        qty: dbBuhin.BUHIN_QUANTITY,
        note: dbBuhin.BUHIN_REMARKS || '',
        weight: dbBuhin.BUHIN_PART_TANNI_WEIGHT || 0,
        img: `https://placehold.co/400x300/e0f2fe/3b82f6?text=${encodeURIComponent(dbBuhin.BUHIN_NAME || '部品')}`,
        zumenId: dbBuhin.ZUMEN_ID || '図面番号未設定',
        registeredQty: dbBuhin.registeredQty || 0,
        partNumber: dbBuhin.BUHIN_ID, // 部品ID
      }
    })
  }, [bomBuhinWithRegisteredQty])

  // パレット統計情報の計算
  const totalCount = useMemo(() => 
    palette.reduce((sum, p) => sum + p.selectedQty, 0), 
    [palette]
  )
  
  const totalWeight = useMemo(() => 
    palette.reduce((sum, p) => sum + p.selectedQty * p.weight, 0), 
    [palette]
  )

  // レイアウト状態の取得
  const { layoutType } = usePaletLayout()

  // ==========================================
  // イベントハンドラ層
  // ==========================================
  const {
    handleRemove,
    handleQtyChange,
    handleQtyInputChange,
    onDragStart,
    onDragEnd,
    onDrop
  } = usePaletEventHandlers({
    palette,
    setPalette,
    createdAt,
    setCreatedAt,
    setUpdatedAt,
    setDraggingId,
    parts,
    registerPalet: async () => {
      return Promise.resolve(null);
    }, // ダミー関数（RegisterPaletButtonで処理するため）
    refetchPaletData: () => void konpoPaletQuery.refetch()
  })

  // パレット削除ハンドラー（新しいテーブル構造対応）
  const handleDeletePalet = async (paletId: string): Promise<boolean> => {
    if (confirm('このパレットを削除しますか？\n\nこの操作により、パレットID「' + paletId + '」に関連するすべてのデータが削除されます。')) {
      try {
        // 削除対象のIDを事前に取得
        const paletItems = konpoPaletQuery.data?.data?.filter((item: KonpoPalet) => item.konpo_palet_id === paletId) || [];
        
        const itemIds = paletItems.map((item: KonpoPalet) => item.konpo_palet_id).filter((id): id is string => id !== undefined);
        
        console.log('削除対象アイテムID:', itemIds);
        
        // 新しいAPIを使用して削除
        const success = await konpoPaletMutations.deleteMutation.mutateAsync({ id: paletId })
        if (success) {
          console.log('パレット削除成功:', paletId)
          alert('パレットの削除が完了しました')
          // データを再取得
          await konpoPaletQuery.refetch()
          return true
        } else {
          console.error('パレット削除失敗:', paletId)
          alert('パレットの削除に失敗しました')
          return false
        }
      } catch (error) {
        console.error('パレット削除エラー:', error)
        alert('パレットの削除中にエラーが発生しました')
        return false
      }
    }
    return false
  }

  // パレット編集ハンドラー
  const handleEditPalet = (paletId: string) => {
    console.log('パレット編集:', paletId)
    // TODO: 編集モードの実装
  }

  // ドラッグオーバーハンドラー
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  // ==========================================
  // レンダリング層
  // ==========================================
  // ローディング状態の表示
  const isLoading = konpoPaletQuery.isLoading || paletMasterQuery.isLoading;
  
  // エラー状態の表示
  if (konpoPaletQuery.error || paletMasterQuery.error) {
    const error = konpoPaletQuery.error || paletMasterQuery.error;
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">{error?.message}</p>
          <button
            onClick={() => {
              void konpoPaletQuery.refetch();
              void paletMasterQuery.refetch();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  // パレットマスターリスト用のエラー
  const paletMasterListError = null;

  return (
    <div className="container mx-auto">
      {/* レイアウト切り替えチップ（ページ先頭） */}
      <div className="mb-2 p-2 bg-white rounded-lg shadow-sm">
        <LayoutChips />
      </div>
      
      {/* レイアウト分岐 */}
      {layoutType === 'palette-master-list' ? (
        <PaletMasterList
          masterData={paletMasterQuery.data?.data || []}
          konpoData={konpoPaletQuery.data?.data || []}
          loading={paletMasterQuery.isLoading || konpoPaletQuery.isLoading}
          error={paletMasterListError}
          onRefresh={() => {
            void konpoPaletQuery.refetch();
            void paletMasterQuery.refetch();
          }}
        />
      ) : layoutType === 'palette-table' ? (
        // パレットテーブルレイアウト
        <div className='w-full h-full'>
          <PaletteTable
            data={konpoPaletQuery.data?.data || []}
            loading={konpoPaletQuery.isLoading}
            error={null}
            onRefresh={() => void konpoPaletQuery.refetch()}
          />
        </div>
      ) : (
        <MakePaletContent
          palette={palette}
          parts={parts}
          totalCount={totalCount}
          totalWeight={totalWeight}
          createdAt={createdAt}
          updatedAt={updatedAt}
          draggingId={draggingId}
          _previewImg={previewImg}
          layoutType={layoutType}
          paletListData={paletListData}
          paletListLoading={paletMasterQuery.isLoading}
          paletListError={null}
          konpoPaletData={konpoPaletQuery.data?.data || []}
          onRemove={handleRemove}
          onQtyChange={handleQtyChange}
          onQtyInputChange={handleQtyInputChange}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
          onDragOver={handleDragOver}
          onDeletePalet={handleDeletePalet}
          onEditPalet={handleEditPalet}
          onPreview={setPreviewImg}
          onRefreshPaletList={() => {
            void konpoPaletQuery.refetch();
            void paletMasterQuery.refetch();
          }}
          onClearPalette={() => {
            setPalette([]);
            setCreatedAt(null);
            setUpdatedAt(null);
          }}
          onRefreshData={() => {
            void konpoPaletQuery.refetch();
            void paletMasterQuery.refetch();
            void refetchBomBuhin();
          }}
        />
      )}
    </div>
  )
} 