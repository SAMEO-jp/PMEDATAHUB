import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@src/components/ui/button';
import { useKonpoPaletRegistration } from '../hooks';
import type { PaletteItem } from '../types/index';

interface RegisterPaletButtonProps {
  palette: PaletteItem[];
  displayName: string;
  paletteQuantity: number;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const RegisterPaletButton: React.FC<RegisterPaletButtonProps> = ({
  palette,
  displayName,
  paletteQuantity,
  disabled,
  onSuccess,
  onError,
}) => {
  const {
    registerMultipleKonpoPalet,
    isLoading,
  } = useKonpoPaletRegistration();

  // 登録ボタン押下時の処理
  const handleRegister = async () => {
    console.log('RegisterPaletButton: 新しい仕様による登録開始');
    console.log('RegisterPaletButton: パレット内容:', palette);
    
    if (palette.length === 0) {
      const errorMsg = 'パレットに部品が追加されていません';
      console.log('RegisterPaletButton: エラー -', errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    try {
      // 新しい仕様に基づくデータ構造
      const items = palette.map(item => ({
        BUHIN_ID: item.partNumber,
        PALET_BUHIN_QUANTITY: item.selectedQty,
      }));
      
      const input = {
        konpo_palet_master_id: `PALET_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        palet_display_name: displayName || `パレット_${Date.now()}`,
        palet_quantity: paletteQuantity || 1,
        items: items,
      };
      
      // デバッグ用ログ
      console.log('RegisterPaletButton: 新しい仕様による送信データ:', input);
      console.log('RegisterPaletButton: データ型:', {
        konpo_palet_master_id: typeof input.konpo_palet_master_id,
        palet_display_name: typeof input.palet_display_name,
        palet_quantity: typeof input.palet_quantity,
        items: Array.isArray(input.items) ? input.items.length : 'not array',
      });
      
      console.log('RegisterPaletButton: API呼び出し開始');
      const result = await registerMultipleKonpoPalet(input);
      console.log('RegisterPaletButton: API呼び出し完了, 結果:', result);
      
      if (result.success) {
        console.log('RegisterPaletButton: 新しい仕様による登録成功:', result.palet_master_id);
        if (onSuccess) onSuccess();
      } else {
        console.error('RegisterPaletButton: 新しい仕様による登録失敗:', result.error);
        if (onError) onError(result.error || '登録に失敗しました');
      }
    } catch (e: unknown) {
      console.error('RegisterPaletButton: エラー詳細:', e);
      const errorMessage = e instanceof Error ? e.message : '登録に失敗しました';
      if (onError) onError(errorMessage);
    }
  };

  return (
    <Button
      className='flex gap-2'
      onClick={() => void handleRegister()}
      disabled={disabled || isLoading || palette.length === 0}
    >
      <CheckIcon className='w-5 h-5' />
      {isLoading ? '登録中...' : '登録'}
    </Button>
  );
}; 