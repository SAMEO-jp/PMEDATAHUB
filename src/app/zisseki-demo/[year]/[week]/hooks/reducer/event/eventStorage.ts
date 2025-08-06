import { TimeGridEvent } from './types';

const STORAGE_KEY = 'zisseki-events';

export const eventStorage = {
  load(): TimeGridEvent[] {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      const events = item ? JSON.parse(item) as TimeGridEvent[] : [];
      console.log('localStorageから読み込んだイベント:', events.length);
      return events;
    } catch (error) {
      console.error('Failed to load events:', error);
      return [];
    }
  },

  save(events: TimeGridEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      console.log('localStorageに保存したイベント:', events.length);
    } catch (error) {
      console.error('Failed to save events:', error);
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('localStorageをクリアしました');
    } catch (error) {
      console.error('Failed to clear events:', error);
    }
  }
}; 