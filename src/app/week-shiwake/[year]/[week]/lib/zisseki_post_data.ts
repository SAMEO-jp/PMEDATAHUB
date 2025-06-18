import { ClientEvent } from '../types/event';
import { formatEventForServer } from './zisseki_get_data';

/**
 * 週データを一括保存する関数
 * @param year 年
 * @param week 週番号
 * @param events 保存するイベントの配列
 * @returns 保存結果
 */
export async function saveWeekAchievements(year: number, week: number, events: ClientEvent[]) {
  try {
    const response = await fetch('/api/zisseki/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year,
        week,
        events: events.map(formatEventForServer),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '保存に失敗しました');
    }

    return result;
  } catch (error) {
    console.error('週データの保存中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * 実績データを削除する関数
 * @param keyID 削除する実績データのID
 * @returns 削除結果
 */
export async function deleteAchievement(keyID: string) {
  try {
    const response = await fetch(`/api/zisseki/delete/${keyID}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '削除に失敗しました');
    }

    return result;
  } catch (error) {
    console.error('実績データの削除中にエラーが発生しました:', error);
    throw error;
  }
}
