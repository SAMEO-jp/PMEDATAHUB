/**
 * @file 実績データ（Zisseki）用のカスタムフック
 * tRPCのクエリとミューテーションを統合して、コンポーネントから使いやすいAPIを提供します。
 */

import { trpc } from '@src/lib/trpc/client';
import type { TimeGridEvent, WorkTimeData } from '@src/app/zisseki-demo/[year]/[week]/types';

/**
 * 週単位の実績データを取得するフック
 */
export const useZissekiWeekData = (year: number, week: number, userId: string) => {
  const queryParams = { year, week, userId };

  return trpc.zisseki.getWeekData.useQuery(
    queryParams,
    {
      staleTime: Infinity, // キャッシュを無期限に設定（手動で無効化するまで再取得しない）
      gcTime: Infinity, // キャッシュ保持も無期限
      refetchOnWindowFocus: false,
      refetchOnMount: false, // マウント時の再取得を無効化
      refetchOnReconnect: false, // 再接続時の再取得を無効化
      enabled: !!userId, // userIdが存在する場合のみ実行
      retry: false, // 失敗時に再試行しない
    }
  );
};

/**
 * 月単位の実績データを取得するフック
 */
export const useZissekiMonthData = (year: number, month: number, userId: string) => {
  const queryParams = { year, month, userId };

  return trpc.zisseki.getMonthData.useQuery(
    queryParams,
    {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: !!userId, // userIdが存在する場合のみ実行
      retry: false, // 失敗時に再試行しない
    }
  );
};

/**
 * ワークタイムデータを取得するフック
 */
export const useZissekiWorkTimes = (year: number, week: number, userId: string) => {
  const queryParams = { year, week, userId };

  return trpc.zisseki.getWorkTimes.useQuery(
    queryParams,
    {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: !!userId, // userIdが存在する場合のみ実行
      retry: false, // 失敗時に再試行しない
    }
  );
};

/**
 * 実績データのミューテーション（作成・更新・削除）を管理するフック
 */
export const useZissekiMutations = () => {
  const utils = trpc.useUtils();

  // 週単位データ保存ミューテーション
  const saveWeekDataMutation = trpc.zisseki.saveWeekData.useMutation();

  // userIdを受け取る関数を返すミューテーション

  // 個別イベント更新ミューテーション
  const updateEventMutation = trpc.zisseki.updateEvent.useMutation();

  // 個別イベント削除ミューテーション
  const deleteEventMutation = trpc.zisseki.deleteEvent.useMutation();

  return {
    saveWeekDataMutation,
    updateEventMutation,
    deleteEventMutation,
  };
};

/**
 * 実績データの操作を統合したフック
 */
export const useZissekiOperations = (year: number, week: number, userId: string) => {
  const { data: weekData, isLoading, error, refetch } = useZissekiWeekData(year, week, userId);
  const { saveWeekDataMutation, updateEventMutation, deleteEventMutation } = useZissekiMutations();

  // 週データ保存
  const saveWeekData = async (events: TimeGridEvent[], workTimes: WorkTimeData[], userId: string) => {
    const params = {
      year,
      week,
      userId,
      data: { events, workTimes },
    };

    try {
      const result = await saveWeekDataMutation.mutateAsync(params);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // 個別イベント更新
  const updateEvent = async (eventId: string, event: Partial<TimeGridEvent>, userId: string) => {
    const params = {
      eventId,
      userId,
      event,
    };

    try {
      const result = await updateEventMutation.mutateAsync(params);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // 個別イベント削除
  const deleteEvent = async (eventId: string, userId: string) => {
    const params = {
      eventId,
      userId,
    };

    try {
      const result = await deleteEventMutation.mutateAsync(params);
      return result;
    } catch (error) {
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
