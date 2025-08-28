/**
 * Business Code Type Definitions
 * 
 * 業務分類コードシステムの型定義
 * business-code-config.jsonの構造に基づいて定義
 */

// 基本型定義
export interface BusinessCodeInfo {
  code: string;
  name: string;
}

export interface ParsedActivityCode {
  mainTab: MainTab;
  subTab: string;
  detailTab: string;
  classification: string;
}

// メインタブの型定義
export type MainTab = 'project' | 'indirect';

// プロジェクト関連のサブタブ
export type ProjectSubTab = '計画' | '設計' | '会議' | '購入品' | 'その他';

// 間接業務関連のサブタブ
export type IndirectSubTab = '純間接' | '目的間接' | '控除';

// 詳細タブの型定義（動的に生成されるため、stringとして定義）
export type DetailTab = string;

// 分類名の型定義（動的に生成されるため、stringとして定義）
export type Classification = string;

// 業務コードの型定義（動的に生成されるため、stringとして定義）
export type BusinessCode = string;

// 構造定義の型
export interface BusinessCodeStructure {
  [mainTab: string]: {
    [subTab: string]: DetailTab[];
  };
}

// コード定義の型
export interface BusinessCodeCodes {
  [pathKey: string]: BusinessCodeInfo[];
}

// 逆引きマップの型
export interface BusinessCodeReverseMap {
  [code: string]: string; // code -> "mainTab.subTab.detailTab.classification"
}

// メタデータの型
export interface BusinessCodeMetadata {
  version: string;
  lastUpdated: string;
  description: string;
  totalCodes: number;
  categories: {
    [category: string]: number;
  };
}

// 設定ファイル全体の型
export interface BusinessCodeConfig {
  structure: BusinessCodeStructure;
  codes: BusinessCodeCodes;
  reverseMap: BusinessCodeReverseMap;
  metadata: BusinessCodeMetadata;
}

// 検証結果の型
export interface BusinessCodeValidationResult {
  isValid: boolean;
  error?: string;
  parsed?: ParsedActivityCode;
}

// 統計情報の型
export interface BusinessCodeStats {
  totalCodes: number;
  categories: {
    [category: string]: number;
  };
  version: string;
  lastUpdated: string;
}

// パス情報の型
export interface BusinessCodePath {
  mainTab: MainTab;
  subTab: string;
  detailTab: DetailTab;
}

// イベント関連の型（既存のEvent型との統合）
export interface BusinessCodeEvent {
  activityCode?: BusinessCode;
  mainTab?: MainTab;
  subTab?: string;
  detailTab?: DetailTab;
  classification?: Classification;
}

// UI状態管理の型
export interface BusinessCodeUIState {
  selectedMainTab: MainTab;
  selectedSubTab: string;
  selectedDetailTab: DetailTab;
  selectedClassification: Classification;
}

// フィルタリング用の型
export interface BusinessCodeFilter {
  mainTab?: MainTab;
  subTab?: string;
  detailTab?: DetailTab;
  searchTerm?: string;
}


