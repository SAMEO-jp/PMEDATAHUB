export interface ColumnWidths {
  expandButton: number;  // 展開/折りたたみ矢印の幅
  zumenId: number;
  zumenName: number;
  partId: number;
  partName: number;
  quantity: number;
  manufacturer: number;
  tanniId: number;
  listId: number;
  singleWeight: number;
  totalWeight: number;
}

export interface TableSettings {
  columnWidths: ColumnWidths;
  rowHeight: number;  // 行の高さ
}

export const defaultColumnWidths: ColumnWidths = {
  expandButton: 30,
  zumenId: 90,
  zumenName: 200,
  partId: 30,
  partName: 200,
  quantity: 30,
  manufacturer: 150,
  tanniId: 260,
  listId: 260,
  singleWeight: 30,
  totalWeight: 30,
};

export const defaultTableSettings: TableSettings = {
  columnWidths: defaultColumnWidths,
  rowHeight: 30,  // デフォルトの行の高さ
}; 

