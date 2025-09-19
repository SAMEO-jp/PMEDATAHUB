"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useZissekiOperations } from '@src/hooks/useZissekiData';
import { trpc } from '@src/lib/trpc/client';
import { useAuthContext } from '@src/contexts/AuthContext';
import type { TimeGridEvent, WorkTimeData } from '../types';

/**
 * DatabaseContext - 週次実績管理のデータ管理コンテキスト
 *
 * このコンテキストは以下のデータを管理します：
 * - 週次実績イベントデータ
 * - 作業時間データ
 * - 現在のユーザー情報（プロジェクト参加情報、担当設備・購入品）
 * - データベース操作（保存、更新、削除）
 *
 * 主な用途：
 * - ユーザーの参加プロジェクトを表示
 * - プロジェクトごとの担当設備・購入品を表示
 * - 実績データの永続化
 */

/**
 * DatabaseContextで提供されるデータの型定義
 */
type DatabaseContextType = {
  // ========================================
  // 実績データ（週次）
  // ========================================
  /** 週次実績イベント一覧 */
  events: TimeGridEvent[];
  /** 作業時間データ */
  workTimes: WorkTimeData[];
  /** メタデータ（年、週、更新日時など） */
  metadata: {
    year: number;
    week: number;
    lastModified: string;
    totalEvents: number;
  } | undefined;

  // ========================================
  // ユーザー情報（参加プロジェクト、担当設備・購入品）
  // ========================================
  /** 現在のユーザー情報と担当情報 */
  userInfo: {
    user_id: string;
    name_japanese: string;
    /** 参加しているプロジェクト一覧 */
    projects: Array<{
      project_id: string;
      project_name: string;
      role: string;
    }>;
    /** 担当設備一覧 */
    setsubi_assignments: Array<{
      id: number;
      project_id: string;
      setsubi_id: number;
      seiban: string;
      setsubi_name: string;
    }>;
    /** 担当購入品一覧 */
    kounyu_assignments: Array<{
      id: number;
      project_id: string;
      kounyu_id: number;
      management_number: string;
      item_name: string;
    }>;
  } | null;

  // ========================================
  // システム状態
  // ========================================
  /** データ読み込み中かどうか */
  isLoading: boolean;
  /** エラー情報 */
  error: unknown;
  /** データ保存中かどうか */
  isSaving: boolean;
  /** データ更新中かどうか */
  isUpdating: boolean;
  /** データ削除中かどうか */
  isDeleting: boolean;
  /** 初期化完了かどうか */
  isInitialized: boolean;

  // ========================================
  // データベース操作関数
  // ========================================
  /** 週次データを保存 */
  saveWeekData: (events: TimeGridEvent[], workTimes: WorkTimeData[]) => Promise<unknown>;
  /** イベントを更新 */
  updateEvent: (eventId: string, event: Partial<TimeGridEvent>) => Promise<unknown>;
  /** イベントを削除 */
  deleteEvent: (eventId: string) => Promise<unknown>;
  /** データを再取得 */
  refetch: () => void;
  /** 手動初期化 */
  initialize: () => void;
};

// Contextの作成
const DatabaseContext = createContext<DatabaseContextType | null>(null);

/**
 * DatabaseProvider - データベースコンテキストのプロバイダーコンポーネント
 *
 * データの流れ:
 * 1. ユーザーID取得 → 2. tRPCでユーザー詳細取得 → 3. プロジェクト/設備/購入品情報設定
 * 4. 週次実績データ管理 → 5. UIコンポーネントにデータ提供
 */
export const DatabaseProvider = ({
  children,
  year,
  week
}: {
  children: ReactNode;
  year: number;
  week: number;
}) => {
  // ========================================
  // ローカル状態管理
  // ========================================
  /** 初期化完了フラグ */
  const [isInitialized, setIsInitialized] = useState(false);
  /** ユーザー情報（プロジェクト参加、担当設備・購入品） */
  const [userInfo, setUserInfo] = useState<DatabaseContextType['userInfo']>(null);

  // ========================================
  // 認証状態取得
  // ========================================
  /** AuthProviderから認証状態を取得 */
  const { user: authUser, isAuthenticated } = useAuthContext();

  // ========================================
  // データ取得
  // ========================================

  /**
   * 現在のユーザーIDを取得する関数
   *
   * 優先順位:
   * 1. AuthProvider (認証済みユーザーの場合)
   * 2. URLパラメータ (?user_id=xxx)
   * 3. localStorage (current_user)
   */
  const getCurrentUserId = (): string => {
    // 1. AuthProviderから取得（認証済みの場合）
    if (isAuthenticated && authUser?.user_id) {
      return authUser.user_id;
    }

    // ブラウザ環境でのみ実行（フォールバック）
    if (typeof window !== 'undefined') {
      // 2. URLパラメータから取得（例: ?user_id=338782）
      const urlParams = new URLSearchParams(window.location.search);
      const userIdFromUrl = urlParams.get('user_id');
      if (userIdFromUrl) {
        return userIdFromUrl;
      }

      // 3. localStorageから取得
      try {
        const userData = localStorage.getItem('current_user');
        if (userData) {
          const user = JSON.parse(userData) as { user_id?: string; id?: string };
          return user.user_id || user.id || '';
        }
      } catch (error) {
        // localStorage取得失敗時は空文字を返す
      }
    }

    // ユーザー情報が見つからない場合は空文字
    return '';
  };

  // ========================================
  // ユーザーID取得とデータフェッチ
  // ========================================
  /** 現在のユーザーIDを取得 */
  const currentUserId = getCurrentUserId();

  /** 週次実績データの操作関数群を取得 */
  const operations = useZissekiOperations(year, week, currentUserId);

  /**
   * ユーザーID変更時のデータ再取得処理
   * ページ遷移時にユーザーIDが一時的に空になる場合があるため、
   * ユーザーIDが有効になった際にデータを再取得する
   */
  useEffect(() => {
    if (currentUserId && currentUserId.trim() !== '') {
      // operationsが存在する場合のみデータを再取得
      if (operations?.refetch) {
        operations.refetch();
      }
    }
  }, [currentUserId, operations?.refetch]);

  /**
   * ユーザー詳細情報を取得（tRPCクエリ）
   *
   * 取得する情報:
   * - 基本情報（名前、部署など）
   * - 参加プロジェクト一覧
   * - 担当設備一覧
   * - 担当購入品一覧
   */
  const { data: userDetail, isLoading: userLoading, error: userError } = trpc.user.getDetail.useQuery(
    { user_id: currentUserId as string },
    { enabled: isInitialized && !!currentUserId }
  );

  /**
   * ユーザー情報をローカル状態に設定
   * クエリ結果が取得できたらuserInfoステートを更新
   */
  useEffect(() => {
    if (userDetail?.data && !userLoading) {
      setUserInfo(userDetail.data);
    }
  }, [userDetail, userLoading]);

  /**
   * 自動初期化処理
   * コンポーネントマウント時に初期化を実行
   */
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  /**
   * 手動初期化関数
   * 必要に応じて外部から初期化をトリガー可能
   */
  const initialize = () => {
    setIsInitialized(true);
  };

  // ========================================
  // コンテキスト値の作成
  // ========================================
  /**
   * 子コンポーネントに提供するコンテキスト値
   * 初期化状態に応じて実際のデータまたは空のデータを返す
   */
  const contextValue: DatabaseContextType = {
    // ========================================
    // データ提供
    // ========================================
    /** 週次実績イベント一覧 */
    events: isInitialized && operations ? operations.events : [],
    /** 作業時間データ */
    workTimes: isInitialized && operations ? operations.workTimes : [],
    /** メタデータ */
    metadata: isInitialized && operations ? operations.metadata : undefined,
    /** ユーザー情報（プロジェクト、設備、購入品） */
    userInfo: userInfo,

    // ========================================
    // システム状態
    // ========================================
    /** データ読み込み中かどうか */
    isLoading: isInitialized && operations ? operations.isLoading : false,
    /** エラー情報 */
    error: isInitialized && operations ? operations.error : null,
    /** データ保存中かどうか */
    isSaving: isInitialized && operations ? operations.isSaving : false,
    /** データ更新中かどうか */
    isUpdating: isInitialized && operations ? operations.isUpdating : false,
    /** データ削除中かどうか */
    isDeleting: isInitialized && operations ? operations.isDeleting : false,
    /** 初期化完了かどうか */
    isInitialized,

    // ========================================
    // 操作関数
    // ========================================
    /** 週次データを保存 */
    saveWeekData: isInitialized && operations ? (events: TimeGridEvent[], workTimes: WorkTimeData[]) => operations.saveWeekData(events, workTimes, currentUserId) : async () => {
      await Promise.reject(new Error('Database not initialized or user not authenticated'));
      return undefined as unknown;
    },
    /** イベントを更新 */
    updateEvent: isInitialized && operations ? (eventId: string, event: Partial<TimeGridEvent>) => operations.updateEvent(eventId, event, currentUserId) : async () => {
      await Promise.reject(new Error('Database not initialized or user not authenticated'));
      return undefined as unknown;
    },
    /** イベントを削除 */
    deleteEvent: isInitialized && operations ? (eventId: string) => operations.deleteEvent(eventId, currentUserId) : async () => {
      await Promise.reject(new Error('Database not initialized or user not authenticated'));
      return undefined as unknown;
    },
    /** データを再取得 */
    refetch: isInitialized && operations ? operations.refetch : () => {
      return undefined;
    },
    /** 手動初期化 */
    initialize,
  };


  /**
   * コンテキストプロバイダーのレンダリング
   * 子コンポーネントにDatabaseContextを提供
   */
  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

/**
 * DatabaseContextを使用するためのカスタムフック
 *
 * 使用例:
 * ```typescript
 * const {
 *   events,           // 週次実績イベント
 *   workTimes,        // 作業時間データ
 *   userInfo,         // ユーザー情報（プロジェクト、設備、購入品）
 *   isLoading,        // 読み込み状態
 *   saveWeekData,     // データ保存関数
 *   updateEvent,      // イベント更新関数
 * } = useDatabase();
 * ```
 *
 * @returns DatabaseContextの値
 * @throws DatabaseProvider内で使用されていない場合エラー
 */
export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};