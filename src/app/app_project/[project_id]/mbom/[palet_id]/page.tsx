// ==========================================
// 変更記録
// 2025-01-XX パレット個別ページ作成
// 2025-01-XX レイアウト改善：BODY左寄せ、戻るボタン移設、構成部品一覧チップ追加
// ==========================================

'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useMemo } from 'react'
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@src/components/ui/button'
import { useKonpoPaletAll, useKonpoPaletMutations, usePaletMasterAll } from '@src/hooks/usePaletData'
import { useBomBuhinByProjectId } from '@src/hooks/useBomBuhinData'
import type { KonpoPalet } from '@src/types/palet'

// ==========================================
// 型定義層
// ==========================================

interface BuhinWithZumen {
  buhin_id: string;
  palet_buhin_quantity: number;
  zumen_id: string;
  buhin_name: string;
}

// ==========================================
// メインコンポーネント層
// ==========================================

export default function PaletDetailPage() {
  // ==========================================
  // パラメータとルーティング層
  // ==========================================
  const params = useParams()
  const router = useRouter()
  const projectId = params.project_id as string
  const paletId = params.palet_id as string
  

  
  // ==========================================
  // データ取得層
  // ==========================================
  const konpoPaletQuery = useKonpoPaletAll()
  const konpoPaletMutations = useKonpoPaletMutations()
  const paletMasterQuery = usePaletMasterAll()
  const bomBuhinQuery = useBomBuhinByProjectId(projectId)

  // ==========================================
  // データ処理層
  // ==========================================
  // 指定されたパレットマスターIDのデータを取得
  const paletData = useMemo(() => {
    if (!konpoPaletQuery.data?.data) return null;
    
    console.log('検索対象パレットマスターID:', paletId);
    console.log('利用可能なパレットデータ:', konpoPaletQuery.data.data);
    
    // パレットマスターIDを数値に変換（小数点を除去）
    const numericPaletMasterId = Math.floor(parseFloat(paletId));
    
    // パレットマスターIDに一致するパレットを検索（数値比較）
    let paletItems = konpoPaletQuery.data.data.filter(
      (item: KonpoPalet) => Number(item.palet_master_id) === numericPaletMasterId
    );
    
    // 見つからない場合は、.0を追加したテキストでも検索（仮置き処置）
    if (paletItems.length === 0) {
      const paletIdWithDot = `${paletId}.0`;
      console.log('数値検索で見つからないため、.0を追加して検索:', paletIdWithDot);
      
      paletItems = konpoPaletQuery.data.data.filter(
        (item: KonpoPalet) => String(item.palet_master_id) === paletIdWithDot
      );
      
      console.log('.0追加検索結果:', paletItems);
    }
    
    console.log('最終的に見つかったパレット:', paletItems);
    
    return paletItems.length > 0 ? paletItems[0] : null;
  }, [konpoPaletQuery.data?.data, paletId]);

  // パレットマスターデータを取得
  const paletMasterData = useMemo(() => {
    if (!paletData || !paletMasterQuery.data?.data) return null;
    
    return paletMasterQuery.data.data.find(
      master => master.palet_master_id === paletData.palet_master_id
    );
  }, [paletData, paletMasterQuery.data?.data]);

  // 構成部品データを取得（図面番号付き）
  const buhinWithZumenData = useMemo(() => {
    if (!paletData || !bomBuhinQuery.data?.data) return [];
    
    const numericPaletMasterId = Math.floor(parseFloat(paletId));
    
    // パレットマスターIDに一致するパレットを検索（数値比較）
    let paletItems = konpoPaletQuery.data?.data?.filter(
      (item: KonpoPalet) => Number(item.palet_master_id) === numericPaletMasterId
    ) || [];
    
    // 見つからない場合は、.0を追加したテキストでも検索（仮置き処置）
    if (paletItems.length === 0) {
      const paletIdWithDot = `${paletId}.0`;
      paletItems = konpoPaletQuery.data?.data?.filter(
        (item: KonpoPalet) => String(item.palet_master_id) === paletIdWithDot
      ) || [];
    }
    
    return paletItems.map(paletItem => {
      const buhinData = bomBuhinQuery.data.data.find(
        buhin => buhin.BUHIN_ID === paletItem.buhin_id
      );
      
      return {
        buhin_id: paletItem.buhin_id,
        palet_buhin_quantity: paletItem.palet_buhin_quantity,
        zumen_id: buhinData?.ZUMEN_ID || '',
        buhin_name: buhinData?.BUHIN_NAME || paletItem.buhin_id,
      } as BuhinWithZumen;
    });
  }, [paletData, bomBuhinQuery.data?.data, konpoPaletQuery.data?.data, paletId]);

  // ==========================================
  // イベントハンドラ層
  // ==========================================
  const handleBack = () => {
    router.push(`/app_project/${projectId}/mbom`);
  };

  const handleEdit = () => {
    console.log('パレット編集:', paletId);
    // TODO: 編集モードの実装
  };

  const handleDelete = async () => {
    if (confirm('このパレットマスターを削除しますか？\n\nこの操作により、パレットマスターID「' + paletId + '」に関連するすべてのデータが削除されます。')) {
      try {
        // パレットマスターIDに一致するすべてのパレットを削除
        const numericPaletMasterId = Math.floor(parseFloat(paletId));
        
        // パレットマスターIDに一致するパレットを検索（数値比較）
        let paletItemsToDelete = konpoPaletQuery.data?.data?.filter(
          (item: KonpoPalet) => Number(item.palet_master_id) === numericPaletMasterId
        ) || [];
        
        // 見つからない場合は、.0を追加したテキストでも検索（仮置き処置）
        if (paletItemsToDelete.length === 0) {
          const paletIdWithDot = `${paletId}.0`;
          paletItemsToDelete = konpoPaletQuery.data?.data?.filter(
            (item: KonpoPalet) => String(item.palet_master_id) === paletIdWithDot
          ) || [];
        }
        
        console.log('削除対象パレット:', paletItemsToDelete);
        
        // 各パレットを削除
        for (const paletItem of paletItemsToDelete) {
          const success = await konpoPaletMutations.deleteMutation.mutateAsync({ id: paletItem.konpo_palet_id });
          if (!success) {
            console.error('パレット削除失敗:', paletItem.konpo_palet_id);
            alert('パレットの削除に失敗しました');
            return;
          }
        }
        
        console.log('パレットマスター削除成功:', paletId);
        alert('パレットマスターの削除が完了しました');
        router.push(`/app_project/${projectId}/mbom`);
      } catch (error) {
        console.error('パレット削除エラー:', error);
        alert('パレットの削除中にエラーが発生しました');
      }
    }
  };



  const handleZumenClick = (zumenId: string) => {
    if (zumenId) {
      router.push(`/app_project/${projectId}/zumen/${zumenId}`);
    }
  };

  // ==========================================
  // ユーティリティ関数層
  // ==========================================
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // ==========================================
  // レンダリング層
  // ==========================================
  // ローディング状態の表示
  if (konpoPaletQuery.isLoading || paletMasterQuery.isLoading || bomBuhinQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態の表示
  if (konpoPaletQuery.error || paletMasterQuery.error || bomBuhinQuery.error) {
    const error = konpoPaletQuery.error || paletMasterQuery.error || bomBuhinQuery.error;
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">{error?.message}</p>
          <Button onClick={handleBack} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            戻る
          </Button>
        </div>
      </div>
    );
  }

  // パレットが見つからない場合
  if (!paletData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">パレットマスターが見つかりません</h2>
          <p className="text-gray-600 mb-4">指定されたパレットマスターID「{paletId}」のデータが存在しません。</p>
          <p className="text-gray-500 text-sm mb-4">利用可能なパレットマスターIDを確認してください。</p>
          <Button onClick={handleBack} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={handleBack} variant="outline" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">
              個別パレット管理
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {paletMasterData?.palet_master_display_name || 'パレットマスター詳細'}
            </p>
          </div>

        </div>
        <div className="flex gap-2">
          <Button onClick={handleEdit} variant="outline" size="sm">
            <PencilIcon className="w-4 h-4 mr-2" />
            編集
          </Button>
          <Button 
            onClick={() => {
              void handleDelete();
            }} 
            variant="outline" 
            size="sm" 
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            削除
          </Button>
        </div>
      </div>

      {/* パレット情報 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">パレット情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">パレットID</label>
            <p className="text-slate-900 font-mono">{paletData.konpo_palet_id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">パレットマスターID</label>
            <p className="text-slate-900 font-mono">{paletData.palet_master_id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">部品ID</label>
            <p className="text-slate-900 font-medium">{paletData.buhin_id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">部品数量</label>
            <p className="text-slate-900 font-medium">{paletData.palet_buhin_quantity}個</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">作成日時</label>
            <p className="text-slate-600 text-sm">{formatDate(paletData.created_at)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">更新日時</label>
            <p className="text-slate-600 text-sm">{formatDate(paletData.updated_at)}</p>
          </div>
        </div>
      </div>
      {/* 構成部品一覧 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-700">構成部品一覧</h2>
          <div className="text-sm text-gray-500">
            パレットマスター: {paletMasterData?.palet_master_display_name || 'マスター情報なし'}
          </div>
        </div>

      {/* パレットマスター情報 */}
      {paletMasterData && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">パレットマスター情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">マスターID</label>
              <p className="text-slate-900 font-mono">{paletMasterData.palet_master_id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">表示名</label>
              <p className="text-slate-900 font-medium">{paletMasterData.palet_master_display_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">作成日時</label>
              <p className="text-slate-600 text-sm">{formatDate(paletMasterData.created_at)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">更新日時</label>
              <p className="text-slate-600 text-sm">{formatDate(paletMasterData.updated_at)}</p>
            </div>
          </div>
        </div>
      )}




        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-2 text-left text-sm font-semibold text-gray-900">部品ID</th>
                <th className="py-2 text-left text-sm font-semibold text-gray-900">部品名</th>
                <th className="py-2 text-left text-sm font-semibold text-gray-900">図面番号</th>
                <th className="py-2 text-center text-sm font-semibold text-gray-900">数量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {buhinWithZumenData.map((item) => (
                <tr key={item.buhin_id}>
                  <td className="py-2 text-sm font-mono">{item.buhin_id}</td>
                  <td className="py-2 text-sm">{item.buhin_name}</td>
                  <td className="py-2 text-sm">
                    {item.zumen_id ? (
                      <button
                        onClick={() => handleZumenClick(item.zumen_id)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-mono"
                      >
                        {item.zumen_id}
                      </button>
                    ) : (
                      <span className="text-gray-400">図面番号なし</span>
                    )}
                  </td>
                  <td className="py-2 text-sm text-center">{item.palet_buhin_quantity}個</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 