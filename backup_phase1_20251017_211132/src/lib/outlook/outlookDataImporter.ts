/**
 * Outlook Web App からデータをインポートするユーティリティ
 * ユーザーが手動でOutlookデータを入力できるインターフェースを提供
 */

export interface OutlookImportData {
  subject: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string;
  description?: string;
  isAllDay?: boolean;
}

export class OutlookDataImporter {
  /**
   * Outlook Web Appからデータをインポート
   * ユーザーがOutlook Web Appを開いて、データをコピー&ペーストできる
   */
  static async importFromOutlookWebApp(): Promise<OutlookImportData[]> {
    console.log('Outlook Web Appからのデータインポートを開始');
    
    // ユーザーにOutlook Web Appを開いてもらう
    const outlookUrl = 'https://outlook.office.com/calendar/view/workweek';
    
    // 新しいタブでOutlook Web Appを開く
    const newWindow = window.open(outlookUrl, '_blank');
    
    if (!newWindow) {
      throw new Error('ポップアップがブロックされました。Outlook Web Appを手動で開いてください。');
    }
    
    // ユーザーにデータを入力してもらうためのプロンプト
    const importData = await this.promptForDataInput();
    
    return importData;
  }
  
  /**
   * ユーザーにデータ入力を促す
   */
  private static async promptForDataInput(): Promise<OutlookImportData[]> {
    return new Promise((resolve) => {
      // モーダルダイアログを表示してデータ入力を促す
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
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
      `;
      
      dialog.innerHTML = `
        <h3>Outlook カレンダーデータのインポート</h3>
        <p>Outlook Web Appから以下の形式でデータを入力してください：</p>
        <div style="background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px;">
          <strong>入力形式：</strong><br>
          件名 | 開始時間 | 終了時間 | 場所 | 参加者 | 説明<br>
          例：チームミーティング | 09:00 | 10:00 | 会議室A | 田中,佐藤 | 週次ミーティング
        </div>
        <textarea id="outlook-data" placeholder="Outlookデータをここに貼り付けてください..." 
                  style="width: 100%; height: 200px; margin: 10px 0;"></textarea>
        <div style="text-align: right; margin-top: 10px;">
          <button id="cancel-import" style="margin-right: 10px; padding: 8px 16px;">キャンセル</button>
          <button id="import-data" style="padding: 8px 16px; background: #0078d4; color: white; border: none; border-radius: 4px;">インポート</button>
        </div>
      `;
      
      modal.appendChild(dialog);
      document.body.appendChild(modal);
      
      const textarea = dialog.querySelector('#outlook-data') as HTMLTextAreaElement;
      const cancelBtn = dialog.querySelector('#cancel-import') as HTMLButtonElement;
      const importBtn = dialog.querySelector('#import-data') as HTMLButtonElement;
      
      cancelBtn.onclick = () => {
        document.body.removeChild(modal);
        resolve([]);
      };
      
      importBtn.onclick = () => {
        const data = textarea.value.trim();
        if (data) {
          const parsedData = this.parseOutlookData(data);
          document.body.removeChild(modal);
          resolve(parsedData);
        } else {
          alert('データを入力してください。');
        }
      };
    });
  }
  
  /**
   * 入力されたデータをパース
   */
  private static parseOutlookData(data: string): OutlookImportData[] {
    const lines = data.split('\n').filter(line => line.trim());
    const events: OutlookImportData[] = [];
    
    for (const line of lines) {
      const parts = line.split('|').map(part => part.trim());
      
      if (parts.length >= 3) {
        events.push({
          subject: parts[0] || '無題のイベント',
          startTime: parts[1] || '09:00',
          endTime: parts[2] || '10:00',
          location: parts[3] || '',
          attendees: parts[4] || '',
          description: parts[5] || '',
          isAllDay: false
        });
      }
    }
    
    console.log('パースされたOutlookデータ:', events);
    return events;
  }
  
  /**
   * OutlookデータをOutlookEvent形式に変換
   */
  static convertToOutlookEvents(importData: OutlookImportData[], year: number, week: number): any[] {
    const events = importData.map((data, index) => {
      // 日付を計算（週の開始日を基準に）
      const weekStart = this.getWeekStartDate(year, week);
      const eventDate = new Date(weekStart);
      eventDate.setDate(weekStart.getDate() + index % 7); // 週内の日付を設定
      
      // 時間を解析
      const startTime = this.parseTime(data.startTime);
      const endTime = this.parseTime(data.endTime);
      
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(startTime.hours, startTime.minutes, 0, 0);
      
      const endDateTime = new Date(eventDate);
      endDateTime.setHours(endTime.hours, endTime.minutes, 0, 0);
      
      return {
        id: `outlook_${Date.now()}_${index}`,
        subject: data.subject,
        startTime: startDateTime,
        endTime: endDateTime,
        location: data.location || '',
        attendees: data.attendees ? data.attendees.split(',').map(a => a.trim()) : [],
        description: data.description || '',
        isAllDay: data.isAllDay || false
      };
    });
    
    return events;
  }
  
  /**
   * 週の開始日を取得
   */
  private static getWeekStartDate(year: number, week: number): Date {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const firstMonday = new Date(firstDayOfYear);
    firstMonday.setDate(firstDayOfYear.getDate() - dayOfWeek + 1);
    
    const weekStart = new Date(firstMonday);
    weekStart.setDate(firstMonday.getDate() + (week - 1) * 7);
    
    return weekStart;
  }
  
  /**
   * 時間文字列を解析
   */
  private static parseTime(timeStr: string): { hours: number; minutes: number } {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      return {
        hours: parseInt(match[1], 10),
        minutes: parseInt(match[2], 10)
      };
    }
    return { hours: 9, minutes: 0 }; // デフォルト値
  }
}
