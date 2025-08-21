/**
 * @file 実績データ（Zisseki）用のカスタムフック
 * tRPCのクエリとミューテーションを統合して、コンポーネントから使いやすいAPIを提供します。
 */

import { trpc } from '@src/lib/trpc/client';
import type { TimeGridEvent, WorkTimeData } from '@src/app/zisseki-demo/[year]/[week]/types';

/**
 * 週単位の実績データを取得するフック
 */
export const useZissekiWeekData = (year: number, week: number) => {
  return trpc.zisseki.getWeekData.useQuery(
    { year, week },
    {
      staleTime: Infinity, // キャッシュを無期限に設定（手動で無効化するまで再取得しない）
      cacheTime: Infinity, // キャッシュ保持も無期限
      refetchOnWindowFocus: false,
      refetchOnMount: false, // マウント時の再取得を無効化
      refetchOnReconnect: false, // 再接続時の再取得を無効化
    }
  );
};

/**
 * ワークタイムデータを取得するフック
 */
export const useZissekiWorkTimes = (year: number, week: number) => {
  return trpc.zisseki.getWorkTimes.useQuery(
    { year, week },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );
};

/**
 * 実績データのミューテーション（作成・更新・削除）を管理するフック
 */
export const useZissekiMutations = () => {
  const utils = trpc.useUtils();

  // 週単位データ保存ミューテーション
  const saveWeekDataMutation = trpc.zisseki.saveWeekData.useMutation({
    onSuccess: (data, variables) => {
      // 成功時にキャッシュを無効化しない（手動で制御）
      console.log('週データ保存成功:', data);
    },
    onError: (error) => {
      console.error('週データ保存エラー:', error);
    },
  });

  // 個別イベント更新ミューテーション
  const updateEventMutation = trpc.zisseki.updateEvent.useMutation({
    onSuccess: () => {
      // 成功時にキャッシュを無効化しない（手動で制御）
      console.log('イベント更新成功');
    },
    onError: (error) => {
      console.error('イベント更新エラー:', error);
    },
  });

  // 個別イベント削除ミューテーション
  const deleteEventMutation = trpc.zisseki.deleteEvent.useMutation({
    onSuccess: () => {
      // 成功時にキャッシュを無効化しない（手動で制御）
      console.log('イベント削除成功');
    },
    onError: (error) => {
      console.error('イベント削除エラー:', error);
    },
  });

  return {
    saveWeekDataMutation,
    updateEventMutation,
    deleteEventMutation,
  };
};

/**
 * 実績データの操作を統合したフック
 */
export const useZissekiOperations = (year: number, week: number) => {
  const { data: weekData, isLoading, error, refetch } = useZissekiWeekData(year, week);
  const { saveWeekDataMutation, updateEventMutation, deleteEventMutation } = useZissekiMutations();

  // 週データ保存
  const saveWeekData = async (events: TimeGridEvent[], workTimes: WorkTimeData[]) => {
    try {
      const result = await saveWeekDataMutation.mutateAsync({
        year,
        week,
        data: { events, workTimes },
      });
      return result;
    } catch (error) {
      console.error('週データ保存エラー:', error);
      throw error;
    }
  };

  // 個別イベント更新
  const updateEvent = async (eventId: string, event: Partial<TimeGridEvent>) => {
    try {
      const result = await updateEventMutation.mutateAsync({
        eventId,
        event,
      });
      return result;
    } catch (error) {
      console.error('イベント更新エラー:', error);
      throw error;
    }
  };

  // 個別イベント削除
  const deleteEvent = async (eventId: string) => {
    try {
      const result = await deleteEventMutation.mutateAsync({
        eventId,
      });
      return result;
    } catch (error) {
      console.error('イベント削除エラー:', error);
      throw error;
    }
  };

  return {
    // データ
    data: weekData?.data,
    events: weekData?.data?.events || [],
    workTimes: weekData?.data?.workTimes || [],
    metadata: weekData?.data?.metadata,
    
    // 状態
    isLoading,
    error,
    isSaving: saveWeekDataMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    
    // 操作
    saveWeekData,
    updateEvent,
    deleteEvent,
    refetch,
  };
};
