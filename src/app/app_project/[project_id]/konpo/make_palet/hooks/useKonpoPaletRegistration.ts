import { useCallback } from 'react';
import { trpc } from '@src/lib/trpc/client';
import type { KonpoPaletCreate, PaletListCreate } from '../types/index';

// 型エイリアス
export type KonpoPaletRegistrationInput = KonpoPaletCreate;
export type KonpoPaletRegistrationResponse = { success: boolean; data?: any; error?: string };
export type KonpoPaletMultipleRegistrationInput = PaletListCreate;
export type KonpoPaletMultipleRegistrationResponse = { success: boolean; data?: any; error?: string };

// 新しい仕様に基づく型定義
export interface PaletRegistrationData {
  palet_master_display_name: string;
  palet_quantity: number;
  buhin_list: {
    buhin_id: string;
    palet_buhin_quantity: number;
  }[];
}

export interface PaletRegistrationResponse {
  success: boolean;
  palet_master_id: string;
  message?: string;
  error?: string;
  data?: any;
}

/**
 * タイムスタンプベースのID生成（文字列）
 */
const generatePaletId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `PALET_${timestamp}_${random}`;
};

/**
 * 新しいパレットAPI構造を使用した登録用カスタムフック
 * 仕様書に基づく3つのテーブル（PALET_MASTER、KONPO_PALET、PALET_LIST）への同時登録
 */
export function useKonpoPaletRegistration() {
  const paletMasterMutation = trpc.palet.master.create.useMutation();
  const konpoPaletMutation = trpc.palet.konpo.create.useMutation();
  const paletListMutation = trpc.palet.list.create.useMutation();

  // 単一部品登録関数
  const registerKonpoPalet = useCallback(
    async (input: KonpoPaletRegistrationInput) => {
      try {
        const result = await konpoPaletMutation.mutateAsync(input);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    [konpoPaletMutation]
  );

  // 新しい仕様に基づく複数部品登録関数
  const registerMultipleKonpoPalet = useCallback(
    async (input: {
      konpo_palet_master_id: string;
      palet_display_name: string;
      palet_quantity: number;
      items: Array<{
        BUHIN_ID: string;
        PALET_BUHIN_QUANTITY: number;
      }>;
    }): Promise<PaletRegistrationResponse> => {
      try {
        console.log('registerMultipleKonpoPalet: 新しい仕様による登録開始');
        
        // 1. タイムスタンプベースのID生成
        const paletMasterId = generatePaletId();
        console.log('registerMultipleKonpoPalet: 生成されたID:', paletMasterId);
        
        // 2. PALET_MASTER登録（生成したIDを送信）
        console.log('registerMultipleKonpoPalet: PALET_MASTER登録開始');
        const masterResult = await paletMasterMutation.mutateAsync({
          palet_master_id: paletMasterId,
          palet_master_display_name: input.palet_display_name,
        });

        console.log('registerMultipleKonpoPalet: PALET_MASTER登録結果:', masterResult);

        if (!masterResult || !masterResult.success) {
          throw new Error('PALET_MASTERの登録に失敗しました');
        }

        // 3. KONPO_PALET登録（部品一つ一つにレコード作成）
        console.log('registerMultipleKonpoPalet: KONPO_PALET登録開始');
        
        const konpoPaletPromises = input.items.map(item => 
          konpoPaletMutation.mutateAsync({
            palet_master_id: paletMasterId,
            buhin_id: item.BUHIN_ID,
            palet_buhin_quantity: item.PALET_BUHIN_QUANTITY,
          })
        );

        const konpoPaletResults = await Promise.all(konpoPaletPromises);

        console.log('registerMultipleKonpoPalet: KONPO_PALET登録結果:', konpoPaletResults);

        // エラーチェック
        const hasKonpoErrors = konpoPaletResults.some(result => !result.success);
        if (hasKonpoErrors) {
          throw new Error('KONPO_PALETの登録に失敗しました');
        }

        // 4. PALET_LIST登録
        console.log('registerMultipleKonpoPalet: PALET_LIST登録開始');
        const listResult = await paletListMutation.mutateAsync({
          palet_master_id: paletMasterId,
          palet_list_display_name: input.palet_display_name, // PALET_MASTERと同じ表示名
          palet_quantity: input.palet_quantity,
        });

        console.log('registerMultipleKonpoPalet: PALET_LIST登録結果:', listResult);

        if (!listResult || !listResult.success) {
          throw new Error('PALET_LISTの登録に失敗しました');
        }

        console.log('registerMultipleKonpoPalet: 全テーブル登録完了');

        return { 
          success: true, 
          palet_master_id: paletMasterId.toString(),
          message: 'パレット登録が完了しました',
          data: {
            palet_master_id: paletMasterId,
            konpo_palets: konpoPaletResults.map(r => r.data),
            palet_list: listResult.data
          }
        };
      } catch (error) {
        console.error('registerMultipleKonpoPalet error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { 
          success: false, 
          palet_master_id: '',
          error: errorMessage
        };
      }
    },
    [paletMasterMutation, konpoPaletMutation, paletListMutation]
  );

  return {
    registerKonpoPalet,
    registerMultipleKonpoPalet,
    isLoading: paletMasterMutation.isPending || konpoPaletMutation.isPending || paletListMutation.isPending,
    isSuccess: paletMasterMutation.isSuccess || konpoPaletMutation.isSuccess || paletListMutation.isSuccess,
    isError: paletMasterMutation.isError || konpoPaletMutation.isError || paletListMutation.isError,
    error: paletMasterMutation.error?.message || konpoPaletMutation.error?.message || paletListMutation.error?.message,
    data: paletMasterMutation.data || konpoPaletMutation.data || paletListMutation.data,
  };
} 