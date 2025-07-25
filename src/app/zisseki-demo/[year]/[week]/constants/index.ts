// サブタブの定義（各タブごとに用意）
export const SUBTABS: Record<string, string[]> = {
  その他: ["出張", "〇対応", "プロ管理", "資料", "その他"],
  計画: ["計画図", "検討書", "見積り"],
  設計: ["計画図", "詳細図", "組立図", "改正図"],
  会議: ["内部定例", "外部定例", "プロ進行", "その他"],
  購入品: [],
  // 間接業務用のサブタブを追加
  純間接: ["日報入力", "会議", "人事評価", "作業", "その他"],
  目的間接: ["作業", "会議", "その他"],
  控除時間: ["休憩／外出", "組合時間", "その他"],
};

// 最近使用した購入品の初期データ
export const INITIAL_RECENT_ITEMS = [
  { id: "item1", name: "水素供給バルブ", description: "高圧水素用バルブ 300A" },
  { id: "item2", name: "水素流量計", description: "マスフローメーター 0-100Nm3/h" },
  { id: "item3", name: "制御盤", description: "水素吹き込み制御盤" },
];

// モック検索結果データ
export const MOCK_SEARCH_RESULTS = [
  { id: "item1", name: "水素供給バルブ", description: "高圧水素用バルブ 300A" },
  { id: "item2", name: "水素流量計", description: "マスフローメーター 0-100Nm3/h" },
  { id: "item3", name: "制御盤", description: "水素吹き込み制御盤" },
  { id: "item4", name: "高圧電源装置", description: "DC 100kV 10mA" },
  { id: "item5", name: "集塵極板", description: "特殊合金製 2m×3m" },
]; 