/**
 * 間接業務の詳細分類データ
 * 
 * 純間接、目的間接、控除の各タブの詳細分類を定義
 * 業務コード整理時にこのファイルを編集することで、UIに反映される
 */

import { IndirectDetailClassifications } from './types';

export const INDIRECT_DETAIL_CLASSIFICATIONS: IndirectDetailClassifications = {
  純間接: {
    会議: [
      { name: "定例会議", code: "M01" },
      { name: "臨時会議", code: "M02" },
      { name: "報告会", code: "M03" },
      { name: "オンライン会議", code: "M04" },
      { name: "その他", code: "M05" },
    ],
    人事評価: [
      { name: "目標設定", code: "E01" },
      { name: "中間レビュー", code: "E02" },
      { name: "年度評価", code: "E03" },
      { name: "部下面談", code: "E04" },
      { name: "その他", code: "E05" },
    ],
    作業: [
      { name: "書類作成", code: "W01" },
      { name: "資料調査", code: "W02" },
      { name: "データ整理", code: "W03" },
      { name: "その他", code: "W04" },
    ]
  },
  目的間接: {
    会議: [
      { name: "定例会議", code: "M01" },
      { name: "臨時会議", code: "M02" },
      { name: "報告会", code: "M03" },
      { name: "オンライン会議", code: "M04" },
      { name: "その他", code: "M05" },
    ],
    作業: [
      { name: "書類作成", code: "W01" },
      { name: "資料調査", code: "W02" },
      { name: "データ整理", code: "W03" },
      { name: "その他", code: "W04" },
    ]
  },
  控除: {
    休憩: [
      { name: "休憩", code: "R01" },
      { name: "昼食", code: "R02" },
      { name: "その他", code: "R03" },
    ]
  }
};
