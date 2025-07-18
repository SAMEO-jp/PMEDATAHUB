// ==========================================
// テーブル削除処理用カスタムフック
// ==========================================

import { useState } from 'react';
import { trpc } from '@src/lib/trpc/client';

export const useTableDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const utils = trpc.useUtils();

  const deleteTableMutation = trpc.tableManagement.deleteTable.useMutation({
    onSuccess: () => {
      // テーブル一覧を再取得
      void utils.tableManagement.getAllTables.invalidate();
    },
  });

  const deleteTables = async (tableNames: string[]): Promise<{ success: boolean; message: string }> => {
    setIsDeleting(true);
    
    try {
      const results = await Promise.allSettled(
        tableNames.map(tableName => 
          deleteTableMutation.mutateAsync({ tableName })
        )
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      if (failed === 0) {
        return {
          success: true,
          message: `${successful}件のテーブルを削除しました`
        };
      } else if (successful === 0) {
        return {
          success: false,
          message: 'すべてのテーブルの削除に失敗しました'
        };
      } else {
        return {
          success: true,
          message: `${successful}件のテーブルを削除しました（${failed}件失敗）`
        };
      }
    } catch (error) {
      console.error('テーブル削除エラー:', error);
      return {
        success: false,
        message: 'テーブルの削除中にエラーが発生しました'
      };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteTables,
    isDeleting,
  };
}; 