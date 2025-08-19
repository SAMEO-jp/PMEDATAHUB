// サブタブ設定の型定義
export interface SubTabConfig {
  name: string;
  color: string;
  subTabs?: string[];
}

// プロジェクトサブタブ設定の型
export type ProjectSubTabConfigs = Record<string, SubTabConfig>;

// 間接業務サブタブ設定の型
export type IndirectSubTabConfigs = Record<string, SubTabConfig>;
