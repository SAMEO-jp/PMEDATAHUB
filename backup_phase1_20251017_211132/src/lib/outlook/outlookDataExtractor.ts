/**
 * Outlook Web App からカレンダーデータを取得するユーティリティ
 * Azure設定なしでブラウザの機能を活用
 */

export interface OutlookEvent {
  id: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  description?: string;
  isAllDay: boolean;
  // ユーザー情報
  employeeNumber?: string;
  // 構造化データ
  project?: string;
  color?: string;
  status?: string;
  categoryCode?: string;
  priority?: string;
  activityCode?: string;
}

export interface OutlookDataExtractorOptions {
  year: number;
  week: number;
  timezone?: string;
}

/**
 * Outlook Web App からカレンダーデータを取得
 */
export class OutlookDataExtractor {
  private options: OutlookDataExtractorOptions;

  constructor(options: OutlookDataExtractorOptions) {
    this.options = options;
  }

  /**
   * 週間カレンダーデータを取得
   */
  async getWorkWeekEvents(): Promise<OutlookEvent[]> {
    try {
      console.log('OutlookDataExtractor: 週間カレンダーデータを取得中...');
      
      // ブラウザのカレンダーAPIを使用してデータを取得
      const events = await this.extractFromBrowserCalendar();
      console.log('取得したカレンダーイベント:', events);
      return events;
    } catch (error) {
      console.error('Outlook データ取得エラー:', error);
      throw new Error('カレンダーデータの取得に失敗しました');
    }
  }

  /**
   * ブラウザのカレンダー機能からデータを抽出
   */
  private async extractFromBrowserCalendar(): Promise<OutlookEvent[]> {
    console.log('ブラウザカレンダーからデータを抽出中...');
    
    // 週の日付範囲を計算
    const { startDate, endDate } = this.getWeekDateRange();
    console.log('週の日付範囲:', { startDate, endDate });
    
    // ブラウザのカレンダーAPIを使用してデータを取得
    const events = await this.queryCalendarEvents(startDate, endDate);
    console.log('クエリ結果:', events);
    
    return events;
  }

  /**
   * 週の日付範囲を計算
   */
  private getWeekDateRange(): { startDate: Date; endDate: Date } {
    const { year, week } = this.options;
    
    // 年の最初の日を取得
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    
    // 第1週の月曜日を計算
    const firstMonday = new Date(firstDayOfYear);
    firstMonday.setDate(firstDayOfYear.getDate() - dayOfWeek + 1);
    
    // 指定された週の開始日を計算
    const weekStart = new Date(firstMonday);
    weekStart.setDate(firstMonday.getDate() + (week - 1) * 7);
    
    // 週の終了日を計算
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return {
      startDate: weekStart,
      endDate: weekEnd
    };
  }

  /**
   * カレンダーイベントをクエリ
   */
  private async queryCalendarEvents(startDate: Date, endDate: Date): Promise<OutlookEvent[]> {
    console.log('カレンダーイベントをクエリ中...', { startDate, endDate });
    
    // まずローカルストレージから既存のデータを確認
    const existingEvents = await this.getFromLocalStorage(startDate, endDate);
    if (existingEvents.length > 0) {
      console.log('ローカルストレージから既存データを取得:', existingEvents.length, '件');
      return existingEvents;
    }
    
    // ブラウザのカレンダー機能を使用
    if ('calendar' in navigator) {
      console.log('ブラウザカレンダーAPIを使用');
      return await this.queryWithBrowserCalendar(startDate, endDate);
    } else {
      console.log('ブラウザカレンダーAPIが利用できないため、手動入力モードに切り替え');
      return await this.promptForManualInput();
    }
  }

  /**
   * ブラウザのカレンダー機能を使用
   */
  private async queryWithBrowserCalendar(startDate: Date, endDate: Date): Promise<OutlookEvent[]> {
    try {
      // ブラウザのカレンダーAPIを使用
      const events = await (navigator as any).calendar.query({
        start: startDate,
        end: endDate
      });
      
      return events.map((event: any) => this.convertToOutlookEvent(event));
    } catch (error) {
      console.warn('ブラウザカレンダーAPIが利用できません:', error);
      return await this.getFromLocalStorage(startDate, endDate);
    }
  }

  /**
   * ローカルストレージから取得
   */
  private async getFromLocalStorage(startDate: Date, endDate: Date): Promise<OutlookEvent[]> {
    const storageKey = `outlook_events_${this.options.year}_${this.options.week}`;
    const storedEvents = localStorage.getItem(storageKey);
    
    if (storedEvents) {
      const events = JSON.parse(storedEvents);
      return events.map((event: any) => ({
        ...event,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime)
      }));
    }
    
    return [];
  }

  /**
   * ブラウザイベントをOutlookEventに変換
   */
  private convertToOutlookEvent(event: any): OutlookEvent {
    return {
      id: event.id || `event_${Date.now()}`,
      subject: event.title || event.summary || '無題のイベント',
      startTime: new Date(event.start || event.startTime),
      endTime: new Date(event.end || event.endTime),
      location: event.location || '',
      attendees: event.attendees || [],
      description: event.description || '',
      isAllDay: event.isAllDay || false
    };
  }

  /**
   * イベントをローカルストレージに保存
   */
  async saveEventsToLocalStorage(events: OutlookEvent[]): Promise<void> {
    const storageKey = `outlook_events_${this.options.year}_${this.options.week}`;
    localStorage.setItem(storageKey, JSON.stringify(events));
  }

  /**
   * CSVデータ入力プロンプトを表示
   */
  private async promptForManualInput(): Promise<OutlookEvent[]> {
    console.log('CSVデータ入力モードを開始');
    
    try {
      // CSVDataProcessorを使用してデータをインポート
      const { CSVDataProcessor } = await import('./csvDataProcessor');
      
      // CSVデータを入力してもらう
      const csvData = await this.promptForCSVInput();
      
      if (!csvData) {
        console.log('CSVデータが入力されませんでした');
        return [];
      }
      
      // CSVデータをパース
      const csvEvents = CSVDataProcessor.parseCSVData(csvData);
      console.log('パースされたCSVイベント:', csvEvents.length, '件');
      
      // 指定された週のイベントをフィルタリング
      const filteredEvents = CSVDataProcessor.filterEventsByWeek(
        csvEvents, 
        this.options.year, 
        this.options.week
      );
      console.log('フィルタリングされたイベント:', filteredEvents.length, '件');
      
      // 現在のユーザーIDを取得
      const currentUserId = this.getCurrentUserId();
      
      // ProcessedEventに変換（ユーザーIDを渡す）
      const processedEvents = CSVDataProcessor.convertToProcessedEvents(filteredEvents, currentUserId);
      console.log('変換されたイベント:', processedEvents);
      
      // OutlookEvent形式に変換（構造化データも含める）
      const outlookEvents = processedEvents.map(event => {
        const outlookEvent = {
          id: event.id,
          subject: event.subject,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          attendees: event.attendees,
          description: event.description,
          isAllDay: event.isAllDay,
          // ユーザー情報の追加
          employeeNumber: event.employeeNumber,
          // 構造化データの追加
          project: event.project,
          color: event.color,
          status: event.status,
          categoryCode: event.categoryCode,
          priority: event.priority,
          activityCode: event.activityCode,
          // 装置関連情報の追加
          equipmentNumber: event.equipmentNumber,
          equipmentName: event.equipmentName,
          equipment_id: event.equipment_id,
          equipment_Name: event.equipment_Name,
          // 購入品関連情報の追加
          itemName: event.itemName
        };
        
        console.log('🔄 OutlookEvent変換:', outlookEvent);
        console.log('🎨 OutlookEventの色:', outlookEvent.color);
        console.log('📊 OutlookEventの進捗:', outlookEvent.status);
        console.log('🏷️ OutlookEventの分類コード:', outlookEvent.categoryCode);
        
        return outlookEvent;
      });
      
      // ローカルストレージに保存
      await this.saveEventsToLocalStorage(outlookEvents);
      
      return outlookEvents;
    } catch (error) {
      console.error('CSVデータ処理エラー:', error);
      
      // エラーの場合は空の配列を返す
      return [];
    }
  }
  
  /**
   * CSVデータ入力を促すプロンプト
   */
  private async promptForCSVInput(): Promise<string | null> {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      `;
      
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
      `;
      
      dialog.innerHTML = `
        <h3>Outlook CSVデータのインポート</h3>
        <p>OutlookからエクスポートしたCSVデータを貼り付けてください：</p>
        <div style="background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px;">
          <strong>CSV形式：</strong><br>
          "件名","開始日","開始時刻","終了日","終了時刻","内容"
        </div>
        <textarea id="csv-data" placeholder="CSVデータをここに貼り付けてください..." 
                  style="width: 100%; height: 300px; margin: 10px 0; font-family: monospace; font-size: 12px;"></textarea>
        <div style="text-align: right; margin-top: 10px;">
          <button id="cancel-csv" style="margin-right: 10px; padding: 8px 16px;">キャンセル</button>
          <button id="import-csv" style="padding: 8px 16px; background: #0078d4; color: white; border: none; border-radius: 4px;">インポート</button>
        </div>
      `;
      
      modal.appendChild(dialog);
      document.body.appendChild(modal);
      
      const textarea = dialog.querySelector('#csv-data') as HTMLTextAreaElement;
      const cancelBtn = dialog.querySelector('#cancel-csv') as HTMLButtonElement;
      const importBtn = dialog.querySelector('#import-csv') as HTMLButtonElement;
      
      cancelBtn.onclick = () => {
        document.body.removeChild(modal);
        resolve(null);
      };
      
      importBtn.onclick = () => {
        const data = textarea.value.trim();
        if (data) {
          document.body.removeChild(modal);
          resolve(data);
        } else {
          alert('CSVデータを入力してください。');
        }
      };
    });
  }

  /**
   * 現在のユーザーIDを取得
   */
  private getCurrentUserId(): string {
    // ブラウザ環境でのみ実行
    if (typeof window !== 'undefined') {
      try {
        // 1. localStorageから取得
        const userData = localStorage.getItem('current_user');
        if (userData) {
          const user = JSON.parse(userData) as { user_id?: string; id?: string };
          return user.user_id || user.id || '';
        }

        // 2. URLパラメータから取得（例: ?user_id=338782）
        const urlParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = urlParams.get('user_id');
        if (userIdFromUrl) {
          return userIdFromUrl;
        }
      } catch (error) {
        console.warn('ユーザーID取得エラー:', error);
      }
    }

    return '';
  }

  /**
   * 手動でイベントを追加
   */
  async addManualEvent(event: Partial<OutlookEvent>): Promise<OutlookEvent> {
    const currentUserId = this.getCurrentUserId();
    
    const newEvent: OutlookEvent = {
      id: `manual_${Date.now()}`,
      subject: event.subject || '手動追加イベント',
      startTime: event.startTime || new Date(),
      endTime: event.endTime || new Date(),
      location: event.location || '',
      attendees: event.attendees || [],
      description: event.description || '',
      isAllDay: event.isAllDay || false,
      // ユーザー情報を設定
      employeeNumber: currentUserId
    };

    // 既存のイベントを取得
    const existingEvents = await this.getWorkWeekEvents();
    const updatedEvents = [...existingEvents, newEvent];
    
    // ローカルストレージに保存
    await this.saveEventsToLocalStorage(updatedEvents);
    
    return newEvent;
  }
}

/**
 * Outlook データ抽出のヘルパー関数
 */
export const createOutlookExtractor = (year: number, week: number) => {
  return new OutlookDataExtractor({ year, week });
};

/**
 * イベントを実績アイテムに変換
 */
export const convertOutlookEventToWorkItem = (event: OutlookEvent) => {
  return {
    id: `outlook-${event.id}`,
    title: event.subject,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location || '',
    attendees: event.attendees || [],
    description: event.description || '',
    source: 'outlook',
    isAllDay: event.isAllDay,
    // ユーザー情報を追加
    employeeNumber: event.employeeNumber || '',
    // 構造化データを追加
    project: event.project || '',
    color: event.color || '#3B82F6',
    status: event.status || '未分類',
    categoryCode: event.categoryCode || 'PP01',
    priority: event.priority || '',
    activityCode: event.activityCode || ''
  };
};
