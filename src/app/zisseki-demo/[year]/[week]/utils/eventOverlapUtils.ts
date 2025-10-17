import { TimeGridEvent } from '../types';

/**
 * イベントの時間重複を検出し、重複グループを返す
 * @param events イベントの配列
 * @returns 重複グループの配列（各グループは重複するイベントの配列）
 */
export const detectOverlappingEvents = (events: TimeGridEvent[]): TimeGridEvent[][] => {
  if (events.length === 0) return [];

  // イベントを開始時間でソート
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(a.startDateTime).getTime();
    const timeB = new Date(b.startDateTime).getTime();
    return timeA - timeB;
  });

  const groups: TimeGridEvent[][] = [];
  let currentGroup: TimeGridEvent[] = [sortedEvents[0]];

  for (let i = 1; i < sortedEvents.length; i++) {
    const currentEvent = sortedEvents[i];
    const lastEventInGroup = currentGroup[currentGroup.length - 1];
    
    // 現在のイベントが最後のイベントと重複しているかチェック
    if (isOverlapping(lastEventInGroup, currentEvent)) {
      currentGroup.push(currentEvent);
    } else {
      // 重複していない場合、現在のグループを保存し、新しいグループを開始
      if (currentGroup.length > 1) {
        groups.push([...currentGroup]);
      }
      currentGroup = [currentEvent];
    }
  }

  // 最後のグループを追加
  if (currentGroup.length > 1) {
    groups.push([...currentGroup]);
  }

  return groups;
};

/**
 * 2つのイベントが時間的に重複しているかチェック
 * @param event1 最初のイベント
 * @param event2 2番目のイベント
 * @returns 重複している場合true
 */
const isOverlapping = (event1: TimeGridEvent, event2: TimeGridEvent): boolean => {
  const start1 = new Date(event1.startDateTime).getTime();
  const end1 = new Date(event1.endDateTime).getTime();
  const start2 = new Date(event2.startDateTime).getTime();
  const end2 = new Date(event2.endDateTime).getTime();

  // イベント1の終了時間がイベント2の開始時間より後で、
  // イベント2の終了時間がイベント1の開始時間より後の場合、重複している
  return start1 < end2 && start2 < end1;
};

/**
 * 重複イベントのレイアウト情報を計算
 * @param overlappingEvents 重複するイベントの配列
 * @returns 各イベントのレイアウト情報
 */
export const calculateOverlapLayout = (overlappingEvents: TimeGridEvent[]): Array<{
  event: TimeGridEvent;
  width: number;
  left: number;
  zIndex: number;
  canMove: boolean;
}> => {
  const count = overlappingEvents.length;
  
  if (count === 0) {
    return [];
  }

  if (count === 1) {
    // 重複なし
    return [{
      event: overlappingEvents[0],
      width: 100,
      left: 0,
      zIndex: 1,
      canMove: true
    }];
  }

  if (count === 2) {
    // 2つのイベント：半分の幅
    return overlappingEvents.map((event, index) => ({
      event,
      width: 50,
      left: index * 50,
      zIndex: index + 1,
      canMove: true
    }));
  }

  if (count === 3) {
    // 3つのイベント：3等分
    return overlappingEvents.map((event, index) => ({
      event,
      width: 33.33,
      left: index * 33.33,
      zIndex: index + 1,
      canMove: true
    }));
  }

  // 4つ以上のイベント：等分表示、移動可能
  return overlappingEvents.map((event, index) => ({
    event,
    width: 100 / count,
    left: index * (100 / count),
    zIndex: index + 1,
    canMove: true
  }));
};

/**
 * 特定の日のイベントに対して重複レイアウトを適用
 * @param dayEvents その日のイベント配列
 * @returns レイアウト情報を含むイベント配列
 */
export const applyOverlapLayoutToDayEvents = (dayEvents: TimeGridEvent[]): Array<{
  event: TimeGridEvent;
  width: number;
  left: number;
  zIndex: number;
  canMove: boolean;
}> => {
  const overlappingGroups = detectOverlappingEvents(dayEvents);
  const layoutMap = new Map<string, {
    width: number;
    left: number;
    zIndex: number;
    canMove: boolean;
  }>();

  // 各重複グループのレイアウトを計算
  overlappingGroups.forEach(group => {
    const layouts = calculateOverlapLayout(group);
    layouts.forEach(layout => {
      layoutMap.set(layout.event.id, {
        width: layout.width,
        left: layout.left,
        zIndex: layout.zIndex,
        canMove: layout.canMove
      });
    });
  });

  // 重複していないイベントはデフォルトレイアウトを適用
  dayEvents.forEach(event => {
    if (!layoutMap.has(event.id)) {
      layoutMap.set(event.id, {
        width: 100,
        left: 0,
        zIndex: 1,
        canMove: true
      });
    }
  });

  // 結果を返す
  return dayEvents.map(event => ({
    event,
    ...layoutMap.get(event.id)!
  }));
};
