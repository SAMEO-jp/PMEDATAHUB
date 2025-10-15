export interface KonpoList {
  ROWID: number;
  KONPO_LIST_ID: string;
  PROJECT_ID: string;
  KONPO_LIST_WEIGHT: string;
  HASSOU_IN: string;
  HASSOU_TO: string;
  IMAGE_ID: string;
}

export interface KonpoTanni {
  ROWID: number;
  KONPO_TANNI_ID: string;
  ZUMEN_ID: string;
  PART_ID: string;
  PART_KO: string;
  ZENSU_KO: string;
  KONPO_LIST_ID: string | null;
}
