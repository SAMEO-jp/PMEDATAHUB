/**
 * イベントの位置情報とDateTime情報を同期させるフック
 */

import { useEffect } from 'react';
import { TimeGridEvent } from '../types';
import { calculateEventPosition } from '../utils/eventPositionCalculator';

/**
 * イベント選択時に位置情報を同期
 */
export const useEventPositionSync = (
  event: TimeGridEvent | null,
  onEventUpdate: (eventId: string, updates: Partial<TimeGridEvent>) => void
) => {
  useEffect(() => {
    if (!event || !onEventUpdate) return;
    
    // startDateTime/endDateTimeが存在するが、top/heightが不整合の場合に同期
    if (event.startDateTime && event.endDateTime) {
      const { top: calculatedTop, height: calculatedHeight } = calculateEventPosition(
        event.startDateTime,
        event.endDateTime
      );
      
      // 現在のtop/heightと計算値に差がある場合（誤差10px以内は許容）
      const topDiff = Math.abs(calculatedTop - (event.top || 0));
      const heightDiff = Math.abs(calculatedHeight - (event.height || 0));
      
      if (topDiff > 10 || heightDiff > 10) {

        
        onEventUpdate(event.id, {
          top: calculatedTop,
          height: calculatedHeight
        });
      }
    }
  }, [event?.id, event?.startDateTime, event?.endDateTime, event?.top, event?.height, onEventUpdate]);
};