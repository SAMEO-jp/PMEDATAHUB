/**
 * 業務分類コード関連の型定義
 * 
 * 実績管理システムにおける業務分類コードの型定義を集約
 * プロジェクト業務と間接業務の両方に対応
 */

// 基本の分類アイテム型
export interface ClassificationItem {
  name: string;
  code: string;
  description?: string;
}

// プロジェクト業務の詳細分類型
export interface ProjectDetailClassifications {
  計画: {
    計画図: ClassificationItem[];
    検討書: ClassificationItem[];
    見積り: ClassificationItem[];
  };
  設計: ClassificationItem[];
  会議: {
    会議種類: ClassificationItem[];
    会議フェーズ: ClassificationItem[];
  };
  その他: {
    出張: ClassificationItem[];
    "〇対応": ClassificationItem[];
    プロ管理: ClassificationItem[];
    資料: ClassificationItem[];
  };
}

// 間接業務の詳細分類型
export interface IndirectDetailClassifications {
  純間接: {
    会議: ClassificationItem[];
    人事評価: ClassificationItem[];
    作業: ClassificationItem[];
  };
  目的間接: {
    会議: ClassificationItem[];
    作業: ClassificationItem[];
  };
  控除: {
    休憩: ClassificationItem[];
  };
} 