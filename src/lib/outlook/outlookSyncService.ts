/**
 * Outlook 同期サービス
 * 実績入力ページでのOutlook連携機能を提供
 */

import { OutlookDataExtractor, createOutlookExtractor, convertOutlookEventToWorkItem } from './outlookDataExtractor';
import type { OutlookEvent } from './outlookDataExtractor';

export interface OutlookSyncResult {
  success: boolean;
  events: any[];
  error?: string;
}

export class OutlookSyncService {
  private extractor: OutlookDataExtractor;

  constructor(year: number, week: number) {
    this.extractor = createOutlookExtractor(year, week);
  }

  /**
   * Outlook カレンダーからイベントを同期
   */
  async syncFromOutlook(): Promise<OutlookSyncResult> {
    try {
      console.log('Outlook同期サービス: 同期開始');
      
      // Outlook からイベントを取得
      const outlookEvents = await this.extractor.getWorkWeekEvents();
      console.log('取得したOutlookイベント:', outlookEvents);
      
      // 実績アイテムに変換
      const workItems = outlookEvents.map(convertOutlookEventToWorkItem);
      console.log('変換された実績アイテム:', workItems);
      
      return {
        success: true,
        events: workItems
      };
    } catch (error) {
      console.error('Outlook 同期エラー:', error);
      return {
        success: false,
        events: [],
        error: error instanceof Error ? error.message : '不明なエラーが発生しました'
      };
    }
  }

  /**
   * 手動でイベントを追加
   */
  async addManualEvent(eventData: {
    subject: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    description?: string;
  }): Promise<OutlookSyncResult> {
    try {
      const newEvent = await this.extractor.addManualEvent(eventData);
      const workItem = convertOutlookEventToWorkItem(newEvent);
      
      return {
        success: true,
        events: [workItem]
      };
    } catch (error) {
      console.error('手動イベント追加エラー:', error);
      return {
        success: false,
        events: [],
        error: error instanceof Error ? error.message : 'イベントの追加に失敗しました'
      };
    }
  }

  /**
   * 既存のイベントを取得
   */
  async getExistingEvents(): Promise<OutlookEvent[]> {
    try {
      return await this.extractor.getWorkWeekEvents();
    } catch (error) {
      console.error('イベント取得エラー:', error);
      return [];
    }
  }

  /**
   * イベントをクリア
   */
  async clearEvents(): Promise<void> {
    const storageKey = `outlook_events_${this.extractor['options'].year}_${this.extractor['options'].week}`;
    localStorage.removeItem(storageKey);
  }
}

/**
 * Outlook 同期サービスのファクトリー関数
 */
export const createOutlookSyncService = (year: number, week: number) => {
  return new OutlookSyncService(year, week);
};
