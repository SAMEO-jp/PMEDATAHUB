/**
 * ユーザー固有のサンプルデータ生成ユーティリティ
 */

import { TimeGridEvent } from '../hooks/reducer/event/types';

/**
 * ログインユーザー用のサンプル実績データを生成
 * @param userId ユーザーID
 * @param year 対象年
 * @param week 対象週
 * @returns ユーザー固有のイベント配列
 */
export function generateUserSampleData(userId: string, year: number, week: number): TimeGridEvent[] {
  // ユーザーIDに基づくシード値を生成（一意性を保つため）
  const userSeed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 週の開始日を計算
  const firstDayOfYear = new Date(year, 0, 1);
  const daysToAdd = (week - 1) * 7;
  const weekStart = new Date(firstDayOfYear.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  
  // 月曜日から始まるように調整
  const dayOfWeek = weekStart.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  weekStart.setDate(weekStart.getDate() - daysToMonday);

  const sampleEvents: TimeGridEvent[] = [];

  // ユーザー固有のプロジェクト名を生成
  const userProjects = [
    `${userId.slice(0, 3).toUpperCase()}-プロジェクトA`,
    `${userId.slice(-3).toUpperCase()}-設備更新`,
    `${userId}-定期点検`,
    `チーム${userId.slice(-1)}-改善活動`
  ];

  // 各曜日にサンプルイベントを生成
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDay = new Date(weekStart);
    currentDay.setDate(weekStart.getDate() + dayOffset);
    
    // 土日は少なめに生成
    const eventCount = (dayOffset === 0 || dayOffset === 6) ? 1 : 2 + (userSeed % 3);
    
    for (let eventIndex = 0; eventIndex < eventCount; eventIndex++) {
      const baseHour = 8 + (userSeed + dayOffset + eventIndex) % 9; // 8時〜16時の範囲
      const startHour = baseHour;
      const duration = 1 + (userSeed + eventIndex) % 3; // 1〜3時間
      
      const startDateTime = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate(), startHour, 0);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);
      
      // イベントタイプをユーザーIDベースで決定
      const eventTypes = [
        { 
          title: "会議", 
          activityCode: "MN01",
          color: "#4CAF50" 
        },
        { 
          title: "設計作業", 
          activityCode: "DP01",
          color: "#2196F3" 
        },
        { 
          title: "計画策定", 
          activityCode: "PP01",
          color: "#FF9800" 
        },
        { 
          title: "現場確認", 
          activityCode: "FW01",
          color: "#9C27B0" 
        }
      ];
      
      const eventType = eventTypes[(userSeed + dayOffset + eventIndex) % eventTypes.length];
      const selectedProject = userProjects[(userSeed + eventIndex) % userProjects.length];
      
      const event: TimeGridEvent = {
        id: `sample-${userId}-${year}${week}-${dayOffset}${eventIndex}`,
        title: `${eventType.title} - ${selectedProject}`,
        description: `${userId}の${eventType.title}作業です。`,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        project: selectedProject,
        user_id: userId,
        activityCode: eventType.activityCode,
        color: eventType.color,
        status: "進行中",
        top: startHour * 64,
        height: duration * 64,
        unsaved: false,
      };
      
      sampleEvents.push(event);
    }
  }

  return sampleEvents;
}

/**
 * ユーザーIDでイベントをフィルタリング
 * @param events 全イベント配列
 * @param userId ユーザーID（nullの場合は全て表示）
 * @returns フィルタ済みイベント配列
 */
export function filterEventsByUserId(events: TimeGridEvent[], userId: string | null): TimeGridEvent[] {
  if (!userId) {
    return events; // ログインしていない場合は全て表示（または空配列）
  }
  
  return events.filter(event => event.user_id === userId);
}

/**
 * デモ用のゲストデータを生成（ログインしていない場合）
 * @param year 対象年
 * @param week 対象週  
 * @returns ゲスト用のイベント配列
 */
export function generateGuestSampleData(year: number, week: number): TimeGridEvent[] {
  return generateUserSampleData('guest', year, week);
}