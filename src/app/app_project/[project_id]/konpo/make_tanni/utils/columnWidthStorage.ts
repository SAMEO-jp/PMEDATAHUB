import { ColumnWidths, TableSettings, defaultTableSettings } from '../columnWidths';

const STORAGE_KEY = 'konpo_table_settings';

export const saveColumnWidths = (settings: TableSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('テーブル設定を保存できませんでした:', error);
  }
};

export const loadColumnWidths = (): TableSettings => {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error('テーブル設定を読み込めませんでした:', error);
  }
  return defaultTableSettings;
};

export const exportColumnWidths = (): string => {
  try {
    const settings = localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultTableSettings);
    return `export const customTableSettings: TableSettings = ${settings};`;
  } catch (error) {
    console.error('テーブル設定をエクスポートできませんでした:', error);
    return `export const customTableSettings: TableSettings = ${JSON.stringify(defaultTableSettings)};`;
  }
}; 