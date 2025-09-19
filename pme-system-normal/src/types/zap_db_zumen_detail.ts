export interface ZumenDetail {
  PART_ID: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  MANUFACTURER: string;
  REMARKS: string;
  UNIT_WEIGHT: number;  // 単重量
  TOTAL_WEIGHT: number; // 総重量
}

export interface Part {
  PART_ID: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  MANUFACTURER: string;
  REMARKS: string;
}

export interface Buzai {
  PART_ID: string;
  BUZAI_ID: string;
  BUZAI_NAME: string;
  BUZAI_WEIGHT: string;
  BUZAI_QUANTITY: string;
  ZAISITU_NAME: string;
}
