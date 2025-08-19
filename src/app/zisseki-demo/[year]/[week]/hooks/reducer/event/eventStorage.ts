import { TimeGridEvent } from './types';

const STORAGE_KEY = 'zisseki-events';

export const eventStorage = {
  load(): TimeGridEvent[] {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      const events = item ? JSON.parse(item) as TimeGridEvent[] : [];
      return events;
    } catch (error) {
      console.error('Failed to load events:', error);
      return [];
    }
  }
}; 