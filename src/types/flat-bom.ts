// ==========================================
// ファイル名: flat-bom.ts
// 機能: フラットBOMデータの型定義
// ==========================================

/**
 * フラットBOMデータの型定義
 * @property project_ID - プロジェクトID
 * @property Zumen_ID - 図面ID
 * @property Zumen_Name - 図面名
 * @property PART_ID - 部品ID
 * @property PART_NAME - 部品名
 * @property QUANTITY - 数量
 * @property SPARE_QUANTITY - 予備数量
 * @property MANUFACTURER - 製造元
 * @property BUZAI_ID - 部材ID
 * @property BUZAI_NAME - 部材名
 * @property BUZAI_WEIGHT - 部材重量
 * @property BUZAI_QUANTITY - 部材数量
 * @property ZAISITU_NAME - 材質名
 * @property KONPO_TANNI_ID - 工法単位ID
 * @property PART_KO - 部品工法
 * @property ZENSU_KO - 全数工法
 * @property KONPO_LIST_ID - 工法リストID
 * @property KONPO_LIST_WEIGHT - 工法リスト重量
 * @property HASSOU_IN - 発送元
 * @property HASSOU_TO - 発送先
 */
export interface FlatBomData {
  project_ID: string;
  Zumen_ID: string;
  Zumen_Name: string;
  PART_ID: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  MANUFACTURER: string;
  BUZAI_ID: string | null;
  BUZAI_NAME: string | null;
  BUZAI_WEIGHT: string | null;
  BUZAI_QUANTITY: string | null;
  ZAISITU_NAME: string | null;
  KONPO_TANNI_ID: string | null;
  PART_KO: string | null;
  ZENSU_KO: string | null;
  KONPO_LIST_ID: string | null;
  KONPO_LIST_WEIGHT: string | null;
  HASSOU_IN: string | null;
  HASSOU_TO: string | null;
}

/**
 * 部品単一重量付きフラットBOMデータの型定義
 * @property project_ID - プロジェクトID
 * @property Zumen_ID - 図面ID
 * @property Zumen_Name - 図面名
 * @property PART_ID - 部品ID
 * @property PART_NAME - 部品名
 * @property QUANTITY - 数量
 * @property SPARE_QUANTITY - 予備数量
 * @property MANUFACTURER - 製造元
 * @property part_weight - 部品単一重量（BUZAI_WEIGHTの合計）
 * @property KONPO_TANNI_ID - 工法単位ID
 * @property PART_KO - 部品工法
 * @property ZENSU_KO - 全数工法
 * @property KONPO_LIST_ID - 工法リストID
 * @property KONPO_LIST_WEIGHT - 工法リスト重量
 * @property HASSOU_IN - 発送元
 * @property HASSOU_TO - 発送先
 */
export interface FlatBomPartData {
  project_ID: string;
  Zumen_ID: string;
  Zumen_Name: string;
  PART_ID: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  MANUFACTURER: string;
  part_weight: number;
  KONPO_TANNI_ID: string | null;
  PART_KO: string | null;
  ZENSU_KO: string | null;
  KONPO_LIST_ID: string | null;
  KONPO_LIST_WEIGHT: string | null;
  HASSOU_IN: string | null;
  HASSOU_TO: string | null;
}

/**
 * 部材重量集約データの型定義
 * @property Zumen_ID - 図面ID
 * @property Zumen_Name - 図面名
 * @property PART_ID - 部品ID
 * @property PART_NAME - 部品名
 * @property QUANTITY - 数量
 * @property SPARE_QUANTITY - 予備数量
 * @property MANUFACTURER - 製造元
 * @property BUZAI_ID - 部材ID
 * @property BUZAI_NAME - 部材名
 * @property BUZAI_WEIGHT - 部材重量
 * @property BUZAI_QUANTITY - 部材数量
 * @property TOTAL_WEIGHT - 総重量（数量 × 部材重量）
 * @property UNIT_WEIGHT - 単重量（総重量 ÷ 数量）
 * @property ZAISITU_NAME - 材質名
 * @property HASSOU_IN - 発送元
 * @property HASSOU_TO - 発送先
 */
export interface BuzaiWeightAggregatedData {
  Zumen_ID: string;
  Zumen_Name: string;
  PART_ID: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  MANUFACTURER: string;
  BUZAI_ID: string;
  BUZAI_NAME: string;
  BUZAI_WEIGHT: number;
  BUZAI_QUANTITY: number;
  TOTAL_WEIGHT: number;
  UNIT_WEIGHT: number;
  ZAISITU_NAME: string;
  HASSOU_IN: string;
  HASSOU_TO: string;
}

/**
 * フラットBOMテーブルのカラム定義
 */
export interface FlatBomColumn {
  key: keyof FlatBomData;
  label: string;
  sortable?: boolean;
  width?: string;
}

/**
 * 部品単一重量付きフラットBOMテーブルのカラム定義
 */
export interface FlatBomPartColumn {
  key: keyof FlatBomPartData;
  label: string;
  sortable?: boolean;
  width?: string;
}

/**
 * 部材重量集約テーブルのカラム定義
 */
export interface BuzaiWeightColumn {
  key: keyof BuzaiWeightAggregatedData;
  label: string;
  sortable?: boolean;
  width?: string;
}

/**
 * フラットBOMテーブルの設定
 */
export interface FlatBomTableConfig {
  columns: FlatBomColumn[];
  pageSize: number;
  sortable: boolean;
  filterable: boolean;
}

/**
 * テーブル表示モード
 */
export type TableViewMode = 'flat' | 'aggregated' | 'part'; 