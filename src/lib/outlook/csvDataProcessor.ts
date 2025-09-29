/**
 * CSVデータからOutlookイベントを抽出・処理するユーティリティ
 */

export interface CSVEventData {
  subject: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  content: string;
}

export interface ProcessedEvent {
  id: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  location: string;
  attendees: string[];
  description: string;
  isAllDay: boolean;
  // ユーザー情報
  employeeNumber?: string;
  // 構造化データの追加
  project?: string;
  color?: string;
  status?: string;
  categoryCode?: string;
  priority?: string;
  activityCode?: string;
  // 装置関連情報
  equipmentNumber?: string;
  equipmentName?: string;
  equipment_id?: string;
  equipment_Name?: string;
  // 購入品関連情報
  itemName?: string;
}

export class CSVDataProcessor {
  /**
   * 設備番号から装置情報を自動解決するマッピング（静的）
   */
  private static equipmentMapping: Record<string, { equipment_id: string; equipment_Name: string; equipmentName: string }> = {
    '1700': { equipment_id: '25', equipment_Name: '鋳床設備', equipmentName: '鋳床設備' },
    '1100': { equipment_id: '5', equipment_Name: '本体', equipmentName: '本体' },
    '0000': { equipment_id: '9', equipment_Name: 'テスト', equipmentName: 'テスト' },
    '1500': { equipment_id: '15', equipment_Name: 'DX業務', equipmentName: 'DX業務' },
    '2300': { equipment_id: '23', equipment_Name: 'っっっっっｓ', equipmentName: 'っっっっっｓ' }
  };

  /**
   * 設備番号から装置情報を自動解決
   * 将来的にはデータベースから動的に取得することも可能
   */
  private static resolveEquipmentInfo(equipmentNumber: string): { equipment_id: string; equipment_Name: string; equipmentName: string } {
    const mapping = this.equipmentMapping[equipmentNumber];
    if (mapping) {
      console.log(`🔍 設備番号 ${equipmentNumber} から装置情報を解決:`, mapping);
      return mapping;
    }
    
    // マッピングが見つからない場合は空の値を返す
    console.log(`⚠️ 設備番号 ${equipmentNumber} のマッピングが見つかりません`);
    return { equipment_id: '', equipment_Name: '', equipmentName: '' };
  }

  /**
   * 設備番号マッピングを動的に更新（将来的な拡張用）
   */
  static updateEquipmentMapping(mapping: Record<string, { equipment_id: string; equipment_Name: string; equipmentName: string }>): void {
    this.equipmentMapping = { ...this.equipmentMapping, ...mapping };
    console.log('🔄 設備番号マッピングを更新:', this.equipmentMapping);
  }

  /**
   * CSVデータをパースしてイベント配列に変換（改行対応）
   */
  static parseCSVData(csvText: string): CSVEventData[] {
    console.log('CSVデータをパース中...');
    
    // 改行を含むCSVデータを正しく解析
    const events = this.parseCSVWithNewlines(csvText);
    
    console.log('パースされたイベント数:', events.length);
    return events;
  }
  
  /**
   * 改行を含むCSVデータを解析
   */
  private static parseCSVWithNewlines(csvText: string): CSVEventData[] {
    const events: CSVEventData[] = [];
    const lines = csvText.split('\n');
    let currentRecord = '';
    let inQuotes = false;
    let isFirstRecord = true; // ヘッダー行をスキップするため
    
    console.log('📄 CSVファイルの総行数:', lines.length);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // クォートの状態を追跡
      let quoteCount = 0;
      for (let j = 0; j < line.length; j++) {
        if (line[j] === '"') {
          quoteCount++;
        }
      }
      
      // クォートが奇数個の場合は、次の行まで続く
      if (quoteCount % 2 === 1) {
        inQuotes = !inQuotes;
      }
      
      if (currentRecord === '') {
        currentRecord = line;
      } else {
        currentRecord += '\n' + line;
      }
      
      // クォートが閉じられた場合、レコードの解析を試行
      if (!inQuotes && currentRecord.trim()) {
        // ヘッダー行をスキップ
        if (isFirstRecord) {
          isFirstRecord = false;
          currentRecord = '';
          continue;
        }
        
        console.log('📝 レコードを解析中:', currentRecord.substring(0, 200) + '...');
        const parsed = this.parseCSVLine(currentRecord);
        if (parsed) {
          events.push(parsed);
          console.log('✅ レコード解析成功:', parsed.subject);
        } else {
          console.log('❌ レコード解析失敗');
        }
        currentRecord = '';
      }
    }
    
    // 最後のレコードを処理
    if (currentRecord.trim() && !isFirstRecord) {
      console.log('📝 最後のレコードを解析中:', currentRecord.substring(0, 200) + '...');
      const parsed = this.parseCSVLine(currentRecord);
      if (parsed) {
        events.push(parsed);
        console.log('✅ 最後のレコード解析成功:', parsed.subject);
      } else {
        console.log('❌ 最後のレコード解析失敗');
      }
    }
    
    console.log('📊 解析されたイベント数:', events.length);
    return events;
  }

  /**
   * CSV行をパース
   */
  private static parseCSVLine(line: string): CSVEventData | null {
    try {
      // CSVの各フィールドを抽出（ダブルクォートで囲まれたフィールド）
      const fields = this.parseCSVFields(line);
      
      if (fields.length >= 6) {
        return {
          subject: fields[0] || '',
          startDate: fields[1] || '',
          startTime: fields[2] || '',
          endDate: fields[3] || '',
          endTime: fields[4] || '',
          content: fields[5] || ''
        };
      }
    } catch (error) {
      console.error('CSV行のパースエラー:', error, line);
    }
    
    return null;
  }
  
  /**
   * CSVフィールドを抽出（ダブルクォート対応）
   */
  private static parseCSVFields(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // エスケープされたダブルクォート
          current += '"';
          i += 2;
        } else {
          // クォートの開始/終了
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // フィールドの区切り
        fields.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    // 最後のフィールドを追加
    fields.push(current.trim());
    
    return fields;
  }
  
  /**
   * 指定された週のイベントをフィルタリング
   */
  static filterEventsByWeek(events: CSVEventData[], year: number, week: number): CSVEventData[] {
    console.log(`週 ${year}年 第${week}週 のイベントをフィルタリング中...`);
    
    const weekStart = this.getWeekStartDate(year, week);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    console.log('週の範囲:', { weekStart, weekEnd });
    
    const filteredEvents = events.filter(event => {
      try {
        const eventDate = this.parseDate(event.startDate);
        return eventDate >= weekStart && eventDate <= weekEnd;
      } catch (error) {
        console.error('日付パースエラー:', error, event.startDate);
        return false;
      }
    });
    
    console.log('フィルタリング結果:', filteredEvents.length, '件');
    return filteredEvents;
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
   * 日付文字列をパース
   */
  private static parseDate(dateStr: string): Date {
    // "2025/8/6" 形式をパース
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0ベース
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    
    throw new Error(`無効な日付形式: ${dateStr}`);
  }
  
  /**
   * 時間文字列をパース
   */
  private static parseTime(timeStr: string): { hours: number; minutes: number } {
    // "13:00:00" 形式をパース
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      return {
        hours: parseInt(parts[0], 10),
        minutes: parseInt(parts[1], 10)
      };
    }
    
    return { hours: 9, minutes: 0 }; // デフォルト値
  }
  
  /**
   * CSVイベントをProcessedEventに変換
   */
  static convertToProcessedEvents(csvEvents: CSVEventData[], currentUserId?: string): ProcessedEvent[] {
    console.log('CSVイベントをProcessedEventに変換中...');
    
    const processedEvents = csvEvents.map((event, index) => {
      const startDate = this.parseDate(event.startDate);
      const endDate = this.parseDate(event.endDate);
      const startTime = this.parseTime(event.startTime);
      const endTime = this.parseTime(event.endTime);
      
      const startDateTime = new Date(startDate);
      startDateTime.setHours(startTime.hours, startTime.minutes, 0, 0);
      
      const endDateTime = new Date(endDate);
      endDateTime.setHours(endTime.hours, endTime.minutes, 0, 0);
      
      // 内容から会議室情報を抽出
      const location = this.extractLocation(event.content);
      
      // 内容から参加者情報を抽出
      const attendees = this.extractAttendees(event.content);
      
      // 構造化データを解析
      console.log('📄 イベント内容:', event.content.substring(0, 200) + '...');
      const structuredData = this.parseStructuredData(event.content);
      
      // 設備番号から装置情報を自動解決
      const equipmentNumber = structuredData.設備番号 || structuredData.equipmentNumber || '';
      const resolvedEquipment = equipmentNumber ? this.resolveEquipmentInfo(equipmentNumber) : { equipment_id: '', equipment_Name: '', equipmentName: '' };
      
      const processedEvent = {
        id: `csv_${Date.now()}_${index}`,
        subject: structuredData.件名 || event.subject,
        startTime: startDateTime,
        endTime: endDateTime,
        location: location,
        attendees: attendees,
        description: structuredData.内容 || this.cleanDescription(event.content),
        isAllDay: false,
        // ユーザー情報の追加
        employeeNumber: currentUserId || '',
        // 構造化データの追加
        project: structuredData.project,
        color: structuredData.color,
        status: structuredData.進捗 === '完了' ? '終了' : structuredData.進捗,
        categoryCode: structuredData.分類コード,
        priority: structuredData.優先度,
        // 業務コード（activityCodeとして統一）
        activityCode: structuredData.分類コード || '',
        // 装置関連情報の追加（設備番号から自動解決）
        equipmentNumber: equipmentNumber,
        equipmentName: structuredData.設備名 || structuredData.equipmentName || resolvedEquipment.equipmentName,
        equipment_id: structuredData.装置ID || structuredData.equipment_id || resolvedEquipment.equipment_id,
        equipment_Name: structuredData.装置名 || structuredData.equipment_Name || resolvedEquipment.equipment_Name,
        // 購入品関連情報の追加
        itemName: structuredData.購入品名 || structuredData.itemName || ''
      };
      
      console.log('🔄 変換されたProcessedEvent:', processedEvent);
      console.log('🎨 ProcessedEventの色:', processedEvent.color);
      console.log('📊 ProcessedEventの進捗:', processedEvent.status);
      console.log('🏷️ ProcessedEventの分類コード:', processedEvent.categoryCode);
      console.log('🔧 ProcessedEventのactivityCode:', processedEvent.activityCode);
      console.log('🏭 設備番号:', processedEvent.equipmentNumber);
      console.log('🔧 装置ID:', processedEvent.equipment_id);
      console.log('🏭 装置名:', processedEvent.equipment_Name);
      console.log('🛒 購入品名:', processedEvent.itemName);
      console.log('🛒 構造化データの購入品名:', structuredData.購入品名);
      console.log('🛒 構造化データのitemName:', structuredData.itemName);
      
      return processedEvent;
    });
    
    console.log('変換完了:', processedEvents.length, '件');
    return processedEvents;
  }
  
  /**
   * 構造化データを解析（[[str]]と[[end]]で囲まれた部分）
   */
  private static parseStructuredData(content: string): any {
    const startPattern = /\[\[str\]\]/;
    const endPattern = /\[\[end\]\]/;
    
    const startIndex = content.search(startPattern);
    const endIndex = content.search(endPattern);
    
    if (startIndex === -1 || endIndex === -1) {
      console.log('⚠️ 構造化データのマーカーが見つかりません');
      return {}; // 構造化データが見つからない場合
    }
    
    // [[str]]の後から[[end]]の前までの内容を抽出
    const metadataContent = content.substring(
      startIndex + 8, // "[[str]]"の長さ
      endIndex
    ).trim();
    
    // 各行を解析
    const lines = metadataContent.split('\n').filter(line => line.trim());
    const result: any = {};
    
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        result[key] = value;
        
        // 購入品情報のデバッグログ
        if (key === '購入品名') {
          console.log('🛒 購入品名を検出:', { key, value });
        }
      }
    });
    
    console.log('🔍 構造化データを解析:', result);
    console.log('📋 解析されたプロパティ:', Object.keys(result));
    return result;
  }

  /**
   * 内容から会議室情報を抽出
   */
  private static extractLocation(content: string): string {
    // 会議室情報を抽出
    const roomMatch = content.match(/会議室[：:]\s*([^\s\n]+)/);
    if (roomMatch) {
      return roomMatch[1];
    }
    
    // Teams関連の情報を抽出
    if (content.includes('Teams') || content.includes('Microsoft Teams')) {
      return 'オンライン';
    }
    
    return '';
  }
  
  /**
   * 内容から参加者情報を抽出
   */
  private static extractAttendees(content: string): string[] {
    const attendees: string[] = [];
    
    // "各位" が含まれている場合は参加者として追加
    if (content.includes('各位')) {
      attendees.push('各位');
    }
    
    // 特定の名前を抽出（例：北川）
    const nameMatch = content.match(/[北川|田中|佐藤|山田]/g);
    if (nameMatch) {
      attendees.push(...nameMatch);
    }
    
    return [...new Set(attendees)]; // 重複を除去
  }
  
  /**
   * 説明文をクリーンアップ
   */
  private static cleanDescription(content: string): string {
    // 不要な文字列を除去
    let cleaned = content
      .replace(/@@EH________0000000::O::O_000::O_Z0@@/g, '')
      .replace(/<[^>]+>/g, '') // HTMLタグを除去
      .replace(/https?:\/\/[^\s]+/g, '') // URLを除去
      .replace(/\s+/g, ' ') // 複数の空白を1つに
      .trim();
    
    // 最初の数行のみを取得（長すぎる場合）
    const lines = cleaned.split('\n');
    if (lines.length > 5) {
      cleaned = lines.slice(0, 5).join('\n') + '...';
    }
    
    return cleaned;
  }
}
