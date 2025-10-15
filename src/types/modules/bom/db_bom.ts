// 基本的なデータベース側の図面情報の型定義
export interface BomZumen {
  ROWID: number;
  Zumen_ID: string;
  project_ID: string;
  Zumen_Name: string;
  Zumen_Kind: string;
  Kumitate_Zumen: string;
  Souti_ID: string;
  Souti_name: string;
  rev_number: string;
  Tantou_a1: string;
  Tantou_a2: string;
  Tantou_b1: string;
  Tantou_b2: string;
  Tantou_c1: string;
  Tantou_c2: string;
  status: string;
  Syutuzubi_Date: string;
  Sakuzu_a: string;
  Sakuzu_b: string;
  Sakuzu_date: string;
  Scale: string;
  Size: string;
  Sicret_code: string;
  WRITEver: string;
  KANREN_ZUMEN: string;
}

// 部品情報の型定義
export interface BomPart {
  ROWID: number;
  PART_ID: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  PART_NAME: string;
  REMARKS: string;
  TEHAI_DIVISION: string;
  TEHAI_ID: string;
  MANUFACTURER: string;
  PART_PROJECT_ID: string;
  ZUMEN_ID: string;
  PART_TANNI_WEIGHT: string | null;
}

// 部材情報の型定義
export interface BomBuzai {
  ROWID: number;
  BUZAI_ID: string;
  ZUMEN_ID: string;
  PART_ID: string;
  BUZAI_NAME: string;
  BUZAI_WEIGHT: string;
  BUZAI_QUANTITY: string;
  ZAISITU_NAME: string;
}

// BOMの状態を表す型
export type BomStatus = 'draft' | 'review' | 'approved' | 'rejected';

// 図面の種類を表す型
export type ZumenKind = 'assembly' | 'detail' | 'layout' | 'other';

// 部品の手配区分を表す型
export type TehaiDivision = 'internal' | 'external' | 'purchased' | 'other';

// BOMの完全な情報を含む型（図面、部品、部材を含む）
export interface BomDetail {
  zumen: BomZumen;
  parts: BomPart[];
  buzais: BomBuzai[];
}

// BOMの一覧表示用の型
export interface BomSummary {
  zumen: BomZumen;
  partCount: number;
  buzaiCount: number;
  totalQuantity: number;
  lastUpdated: string;
}

export interface BomFlatRow {
  // --- 図面情報 ---
  Zumen_ROWID: number;
  Zumen_ID: string;
  project_ID: string;
  Zumen_Name: string;
  Zumen_Kind: string;
  Kumitate_Zumen: string;
  Souti_ID: string;
  Souti_name: string;
  rev_number: string;
  Tantou_a1: string;
  Tantou_a2: string;
  Tantou_b1: string;
  Tantou_b2: string;
  Tantou_c1: string;
  Tantou_c2: string;
  status: string;
  Syutuzubi_Date: string;
  Sakuzu_a: string;
  Sakuzu_b: string;
  Sakuzu_date: string;
  Scale: string;
  Size: string;
  Sicret_code: string;
  WRITEver: string;
  KANREN_ZUMEN: string;

  // --- 部品情報 ---
  Part_ROWID: number;
  PART_ID: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  PART_NAME: string;
  REMARKS: string;
  TEHAI_DIVISION: string;
  TEHAI_ID: string;
  MANUFACTURER: string;
  PART_PROJECT_ID: string;
  PART_ZUMEN_ID: string;
  PART_TANNI_WEIGHT: string | null;

  // --- 部材情報 ---
  Buzai_ROWID: number;
  BUZAI_ID: string;
  BUZAI_ZUMEN_ID: string;
  BUZAI_PART_ID: string;
  BUZAI_NAME: string;
  BUZAI_WEIGHT: string;
  BUZAI_QUANTITY: string;
  ZAISITU_NAME: string;
}