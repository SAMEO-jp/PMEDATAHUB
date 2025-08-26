/**
 * プロジェクト業務の詳細分類データ
 * 
 * 計画、設計、会議、その他の各タブの詳細分類を定義
 * 業務コード整理時にこのファイルを編集することで、UIに反映される
 * 
 * ⚠️ 注意: このファイルは不完全版です
 * - 一部の分類項目が未完成
 * - コード体系の統一性が不十分
 * - 今後の業務要件に応じて継続的に更新が必要
 */

import { ProjectDetailClassifications } from './types';

export const PROJECT_DETAIL_CLASSIFICATIONS: ProjectDetailClassifications = {
  計画: {
    計画図: [
      { name: "作図及び作図準備", code: "02" },
      { name: "作図指示", code: "04" },
      { name: "検図", code: "07" },
      { name: "承認作業", code: "08" },
      { name: "出図前図面検討会", code: "03" },
      { name: "出図後図面検討会", code: "06" },
      { name: "その他", code: "09" },
    ],
    検討書: [
      { name: "検討書作成及びサイン", code: "01" }
    ],
    見積り: [
      { name: "設計費見積書", code: "01" },
      { name: "見積仕様書", code: "02" },
      { name: "テクスぺ", code: "03" },
      { name: "製作品BQ", code: "04" },
      { name: "工事BQ", code: "05" },
      { name: "購入品見積", code: "06" },
      { name: "区分見積", code: "07" },
      { name: "予備品見積", code: "08" },
    ]
  },
  設計: [
    { name: "検討書作成及びサイン", code: "01" },
    { name: "作図及び作図準備", code: "02" },
    { name: "作図前図面検討会", code: "03" },
    { name: "作図指示", code: "04" },
    { name: "作図（外注あり）", code: "05" },
    { name: "作図後図面検討会", code: "06" },
    { name: "検図", code: "07" },
    { name: "承認作業", code: "08" },
    { name: "出図確認", code: "09" },
    { name: "修正対応", code: "10" },
    { name: "その他", code: "11" },
  ],
  会議: {
    会議種類: [
      { name: "定例会", code: "01" },
      { name: "実行方針会議", code: "02" },
      { name: "全体品質会議", code: "03" },
      { name: "個別品質会議", code: "04" },
      { name: "部分品質会議", code: "05" },
      { name: "試運転計画会議", code: "06" },
      { name: "試運転安全審査", code: "07" },
      { name: "完成報告", code: "08" },
      { name: "その他", code: "09" },
    ],
    会議フェーズ: [
      { name: "会議準備", code: "C10" },
      { name: "会議", code: "C11" },
      { name: "会議後業務", code: "C12" },
    ]
  },
  その他: {
    出張: [
      { name: "現場調査", code: "O201" },
      { name: "製造外注品検査・工場試運転対応", code: "O202" },
      { name: "現地試運転立会", code: "O203" },
      { name: "現地試運転ＳＶ", code: "O204" },
      { name: "現地3Dスキャン対応", code: "O205" },
      { name: "現地工事立会", code: "O206" },
      { name: "工事設計連絡員業務", code: "O207" },
      { name: "試運転基地対応業務", code: "O208" },
      { name: "その他", code: "O209" },
    ],
    "〇対応": [
      { name: "プロ管", code: "O001" },
      { name: "工事", code: "O002" },
      { name: "製造", code: "O003" },
      { name: "制御（電計）", code: "O004" },
      { name: "製鉄所", code: "O005" },
      { name: "PFC", code: "O006" },
      { name: "土建", code: "O007" },
      { name: "NSE_構造設計", code: "O008" },
      { name: "NSE_CAESOL", code: "O009" },
      { name: "（ベンダー）", code: "O00A" },
      { name: "設計　その他", code: "O00B" },
    ],
    プロ管理: [
      { name: "プロジェクト管理", code: "M01" },
      { name: "進捗管理", code: "M02" },
      { name: "品質管理", code: "M03" },
      { name: "リスク管理", code: "M04" },
      { name: "その他", code: "M05" },
    ],
    資料: [
      { name: "資料作成", code: "D01" },
      { name: "資料整理", code: "D02" },
      { name: "資料配布", code: "D03" },
      { name: "その他", code: "D04" },
    ]
  }
};
