export interface KonpoData {
  project_ID: string;
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
  ZAISITU_NAME: string;
  KONPO_TANNI_ID: string;
  PART_KO: number;
  ZENSU_KO: number;
  KONPO_LIST_ID: string;
  KONPO_LIST_WEIGHT: number;
  HASSOU_IN: string;
  HASSOU_TO: string;
}

export interface GroupedData {
  [key: string]: {
    items: KonpoData[];
    totalWeight: number;
  };
} 