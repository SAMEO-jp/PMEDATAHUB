/**
 * イベントストレージユーティリティ
 * localStorageを使用してイベントデータの永続化を管理
 */

import { TimeGridEvent } from './types';

// localStorageのキー名
const STORAGE_KEY = 'zisseki-events';

/**
 * イベントストレージオブジェクト
 * イベントデータの読み込み・保存機能を提供
 */
export const eventStorage = {
  /**
   * localStorageからイベントデータを読み込み
   * @returns 保存されているイベントの配列、エラー時は空配列
   */
  load(): TimeGridEvent[] {
    try {
      // localStorageからデータを取得
      const item = localStorage.getItem(STORAGE_KEY);
      
      // データが存在する場合はJSONパース、存在しない場合は空配列を返す
      const events = item ? JSON.parse(item) as TimeGridEvent[] : [];
      return events;
    } catch (error) {
      // エラーが発生した場合はコンソールにログを出力し、空配列を返す
      console.error('Failed to load events:', error);
      return [];
    }
  }
}; 