//実装中
// activityCodeとサブタブ情報のマッピング定義
// SidebarActiveCodeEditor.tsxの実際のロジックに基づく
// 形式: activityCode -> { mainTab, subTab, detailTab, businessType }

export interface ActivityCodeMapping {
  mainTab: 'project' | 'indirect';
  subTab: string;
  detailTab: string;
  businessType: string;
}

// 実際のactivityCode構造に基づくマッピング
// 1文字目: メインタブ識別子
// 3文字目: 詳細タブ識別子
export const ACTIVITY_CODE_MAPPING: Record<string, ActivityCodeMapping> = {
  // プロジェクト業務 - 計画 (P + 3文字目で詳細タブ判定)
  'PP01': { mainTab: 'project', subTab: '計画', detailTab: '計画図', businessType: 'planning' },
  'PP02': { mainTab: 'project', subTab: '計画', detailTab: '計画図', businessType: 'planning' },
  'PP03': { mainTab: 'project', subTab: '計画', detailTab: '計画図', businessType: 'planning' },
  'PP04': { mainTab: 'project', subTab: '計画', detailTab: '計画図', businessType: 'planning' },
  'PP05': { mainTab: 'project', subTab: '計画', detailTab: '計画図', businessType: 'planning' },
  'PP06': { mainTab: 'project', subTab: '計画', detailTab: '計画図', businessType: 'planning' },
  'PP07': { mainTab: 'project', subTab: '計画', detailTab: '計画図', businessType: 'planning' },
  'PP08': { mainTab: 'project', subTab: '計画', detailTab: '計画図', businessType: 'planning' },
  'PP09': { mainTab: 'project', subTab: '計画', detailTab: '計画図', businessType: 'planning' },
  
  'PC01': { mainTab: 'project', subTab: '計画', detailTab: '検討書', businessType: 'planning' },
  
  'PT01': { mainTab: 'project', subTab: '計画', detailTab: '見積り', businessType: 'planning' },
  'PT02': { mainTab: 'project', subTab: '計画', detailTab: '見積り', businessType: 'planning' },
  'PT03': { mainTab: 'project', subTab: '計画', detailTab: '見積り', businessType: 'planning' },
  'PT04': { mainTab: 'project', subTab: '計画', detailTab: '見積り', businessType: 'planning' },
  'PT05': { mainTab: 'project', subTab: '計画', detailTab: '見積り', businessType: 'planning' },
  'PT06': { mainTab: 'project', subTab: '計画', detailTab: '見積り', businessType: 'planning' },
  'PT07': { mainTab: 'project', subTab: '計画', detailTab: '見積り', businessType: 'planning' },
  'PT08': { mainTab: 'project', subTab: '計画', detailTab: '見積り', businessType: 'planning' },
  
  // プロジェクト業務 - 設計 (D + 3文字目で詳細タブ判定)
  'DP01': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  'DP02': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  'DP03': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  'DP04': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  'DP05': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  'DP06': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  'DP07': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  'DP08': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  'DP09': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  'DP10': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  'DP11': { mainTab: 'project', subTab: '設計', detailTab: '計画図', businessType: 'design' },
  
  'DS01': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  'DS02': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  'DS03': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  'DS04': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  'DS05': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  'DS06': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  'DS07': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  'DS08': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  'DS09': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  'DS10': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  'DS11': { mainTab: 'project', subTab: '設計', detailTab: '詳細図', businessType: 'design' },
  
  'DK01': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  'DK02': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  'DK03': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  'DK04': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  'DK05': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  'DK06': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  'DK07': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  'DK08': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  'DK09': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  'DK10': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  'DK11': { mainTab: 'project', subTab: '設計', detailTab: '組立図', businessType: 'design' },
  
  'DR01': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  'DR02': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  'DR03': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  'DR04': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  'DR05': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  'DR06': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  'DR07': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  'DR08': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  'DR09': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  'DR10': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  'DR11': { mainTab: 'project', subTab: '設計', detailTab: '改正図', businessType: 'design' },
  
  // プロジェクト業務 - 会議 (M + 3文字目で詳細タブ判定)
  'MN01': { mainTab: 'project', subTab: '会議', detailTab: '内部定例', businessType: 'meeting' },
  'MN02': { mainTab: 'project', subTab: '会議', detailTab: '内部定例', businessType: 'meeting' },
  'MN03': { mainTab: 'project', subTab: '会議', detailTab: '内部定例', businessType: 'meeting' },
  'MN04': { mainTab: 'project', subTab: '会議', detailTab: '内部定例', businessType: 'meeting' },
  'MN05': { mainTab: 'project', subTab: '会議', detailTab: '内部定例', businessType: 'meeting' },
  'MN06': { mainTab: 'project', subTab: '会議', detailTab: '内部定例', businessType: 'meeting' },
  'MN07': { mainTab: 'project', subTab: '会議', detailTab: '内部定例', businessType: 'meeting' },
  'MN08': { mainTab: 'project', subTab: '会議', detailTab: '内部定例', businessType: 'meeting' },
  'MN09': { mainTab: 'project', subTab: '会議', detailTab: '内部定例', businessType: 'meeting' },
  
  'MG01': { mainTab: 'project', subTab: '会議', detailTab: '外部定例', businessType: 'meeting' },
  'MG02': { mainTab: 'project', subTab: '会議', detailTab: '外部定例', businessType: 'meeting' },
  'MG03': { mainTab: 'project', subTab: '会議', detailTab: '外部定例', businessType: 'meeting' },
  'MG04': { mainTab: 'project', subTab: '会議', detailTab: '外部定例', businessType: 'meeting' },
  'MG05': { mainTab: 'project', subTab: '会議', detailTab: '外部定例', businessType: 'meeting' },
  'MG06': { mainTab: 'project', subTab: '会議', detailTab: '外部定例', businessType: 'meeting' },
  'MG07': { mainTab: 'project', subTab: '会議', detailTab: '外部定例', businessType: 'meeting' },
  'MG08': { mainTab: 'project', subTab: '会議', detailTab: '外部定例', businessType: 'meeting' },
  'MG09': { mainTab: 'project', subTab: '会議', detailTab: '外部定例', businessType: 'meeting' },
  
  'MJ01': { mainTab: 'project', subTab: '会議', detailTab: 'プロ進行', businessType: 'meeting' },
  'MJ02': { mainTab: 'project', subTab: '会議', detailTab: 'プロ進行', businessType: 'meeting' },
  'MJ03': { mainTab: 'project', subTab: '会議', detailTab: 'プロ進行', businessType: 'meeting' },
  'MJ04': { mainTab: 'project', subTab: '会議', detailTab: 'プロ進行', businessType: 'meeting' },
  'MJ05': { mainTab: 'project', subTab: '会議', detailTab: 'プロ進行', businessType: 'meeting' },
  'MJ06': { mainTab: 'project', subTab: '会議', detailTab: 'プロ進行', businessType: 'meeting' },
  'MJ07': { mainTab: 'project', subTab: '会議', detailTab: 'プロ進行', businessType: 'meeting' },
  'MJ08': { mainTab: 'project', subTab: '会議', detailTab: 'プロ進行', businessType: 'meeting' },
  'MJ09': { mainTab: 'project', subTab: '会議', detailTab: 'プロ進行', businessType: 'meeting' },
  
  'MO01': { mainTab: 'project', subTab: '会議', detailTab: 'その他', businessType: 'meeting' },
  'MO02': { mainTab: 'project', subTab: '会議', detailTab: 'その他', businessType: 'meeting' },
  'MO03': { mainTab: 'project', subTab: '会議', detailTab: 'その他', businessType: 'meeting' },
  'MO04': { mainTab: 'project', subTab: '会議', detailTab: 'その他', businessType: 'meeting' },
  'MO05': { mainTab: 'project', subTab: '会議', detailTab: 'その他', businessType: 'meeting' },
  'MO06': { mainTab: 'project', subTab: '会議', detailTab: 'その他', businessType: 'meeting' },
  'MO07': { mainTab: 'project', subTab: '会議', detailTab: 'その他', businessType: 'meeting' },
  'MO08': { mainTab: 'project', subTab: '会議', detailTab: 'その他', businessType: 'meeting' },
  'MO09': { mainTab: 'project', subTab: '会議', detailTab: 'その他', businessType: 'meeting' },
  
  // プロジェクト業務 - 購入品 (P1で始まる特別な処理)
  'P100': { mainTab: 'project', subTab: '購入品', detailTab: '計画図作成', businessType: 'purchase' },
  'P101': { mainTab: 'project', subTab: '購入品', detailTab: '仕様書作成準備', businessType: 'purchase' },
  'P102': { mainTab: 'project', subTab: '購入品', detailTab: '仕様書作成・発行', businessType: 'purchase' },
  'P103': { mainTab: 'project', subTab: '購入品', detailTab: '見積仕様比較検討', businessType: 'purchase' },
  'P104': { mainTab: 'project', subTab: '購入品', detailTab: '契約確定確認', businessType: 'purchase' },
  'P105': { mainTab: 'project', subTab: '購入品', detailTab: 'KOM', businessType: 'purchase' },
  'P106': { mainTab: 'project', subTab: '購入品', detailTab: '確定仕様対応', businessType: 'purchase' },
  'P107': { mainTab: 'project', subTab: '購入品', detailTab: '納入図対応', businessType: 'purchase' },
  'P108': { mainTab: 'project', subTab: '購入品', detailTab: '工事用資料整備', businessType: 'purchase' },
  'P109': { mainTab: 'project', subTab: '購入品', detailTab: '図面化及び出図対応', businessType: 'purchase' },
  'P110': { mainTab: 'project', subTab: '購入品', detailTab: '試運転要領', businessType: 'purchase' },
  'P111': { mainTab: 'project', subTab: '購入品', detailTab: '取説', businessType: 'purchase' },
  'P112': { mainTab: 'project', subTab: '購入品', detailTab: '検査要領対応', businessType: 'purchase' },
  'P113': { mainTab: 'project', subTab: '購入品', detailTab: '検査対応', businessType: 'purchase' },
  'P114': { mainTab: 'project', subTab: '購入品', detailTab: '出荷調整対応', businessType: 'purchase' },
  'P115': { mainTab: 'project', subTab: '購入品', detailTab: '検定対応', businessType: 'purchase' },
  'P116': { mainTab: 'project', subTab: '購入品', detailTab: 'その他', businessType: 'purchase' },
  
  // プロジェクト業務 - その他 (O + 3文字目で詳細タブ判定)
  'OT01': { mainTab: 'project', subTab: 'その他', detailTab: '出張', businessType: 'other' },
  'OT02': { mainTab: 'project', subTab: 'その他', detailTab: '出張', businessType: 'other' },
  'OT03': { mainTab: 'project', subTab: 'その他', detailTab: '出張', businessType: 'other' },
  'OT04': { mainTab: 'project', subTab: 'その他', detailTab: '出張', businessType: 'other' },
  'OT05': { mainTab: 'project', subTab: 'その他', detailTab: '出張', businessType: 'other' },
  'OT06': { mainTab: 'project', subTab: 'その他', detailTab: '出張', businessType: 'other' },
  'OT07': { mainTab: 'project', subTab: 'その他', detailTab: '出張', businessType: 'other' },
  'OT08': { mainTab: 'project', subTab: 'その他', detailTab: '出張', businessType: 'other' },
  'OT09': { mainTab: 'project', subTab: 'その他', detailTab: '出張', businessType: 'other' },
  
  'OC01': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  'OC02': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  'OC03': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  'OC04': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  'OC05': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  'OC06': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  'OC07': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  'OC08': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  'OC09': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  'OC10': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  'OC11': { mainTab: 'project', subTab: 'その他', detailTab: '〇対応', businessType: 'other' },
  
  'OM01': { mainTab: 'project', subTab: 'その他', detailTab: 'プロ管理', businessType: 'other' },
  'OM02': { mainTab: 'project', subTab: 'その他', detailTab: 'プロ管理', businessType: 'other' },
  'OM03': { mainTab: 'project', subTab: 'その他', detailTab: 'プロ管理', businessType: 'other' },
  'OM04': { mainTab: 'project', subTab: 'その他', detailTab: 'プロ管理', businessType: 'other' },
  'OM05': { mainTab: 'project', subTab: 'その他', detailTab: 'プロ管理', businessType: 'other' },
  
  'OD01': { mainTab: 'project', subTab: 'その他', detailTab: '資料', businessType: 'other' },
  'OD02': { mainTab: 'project', subTab: 'その他', detailTab: '資料', businessType: 'other' },
  'OD03': { mainTab: 'project', subTab: 'その他', detailTab: '資料', businessType: 'other' },
  'OD04': { mainTab: 'project', subTab: 'その他', detailTab: '資料', businessType: 'other' },
  
  // 間接業務 - 純間接 (Iで始まる)
  'IM01': { mainTab: 'indirect', subTab: '純間接', detailTab: '会議', businessType: 'indirect' },
  'IM02': { mainTab: 'indirect', subTab: '純間接', detailTab: '会議', businessType: 'indirect' },
  'IM03': { mainTab: 'indirect', subTab: '純間接', detailTab: '会議', businessType: 'indirect' },
  'IM04': { mainTab: 'indirect', subTab: '純間接', detailTab: '会議', businessType: 'indirect' },
  'IM05': { mainTab: 'indirect', subTab: '純間接', detailTab: '会議', businessType: 'indirect' },
  
  'IE01': { mainTab: 'indirect', subTab: '純間接', detailTab: '人事評価', businessType: 'indirect' },
  'IE02': { mainTab: 'indirect', subTab: '純間接', detailTab: '人事評価', businessType: 'indirect' },
  'IE03': { mainTab: 'indirect', subTab: '純間接', detailTab: '人事評価', businessType: 'indirect' },
  'IE04': { mainTab: 'indirect', subTab: '純間接', detailTab: '人事評価', businessType: 'indirect' },
  'IE05': { mainTab: 'indirect', subTab: '純間接', detailTab: '人事評価', businessType: 'indirect' },
  
  'IW01': { mainTab: 'indirect', subTab: '純間接', detailTab: '作業', businessType: 'indirect' },
  'IW02': { mainTab: 'indirect', subTab: '純間接', detailTab: '作業', businessType: 'indirect' },
  'IW03': { mainTab: 'indirect', subTab: '純間接', detailTab: '作業', businessType: 'indirect' },
  'IW04': { mainTab: 'indirect', subTab: '純間接', detailTab: '作業', businessType: 'indirect' },
  
  // 間接業務 - 目的間接 (Oで始まる、プロジェクト業務と重複するため注意)
  'OM01': { mainTab: 'indirect', subTab: '目的間接', detailTab: '会議', businessType: 'indirect' },
  'OM02': { mainTab: 'indirect', subTab: '目的間接', detailTab: '会議', businessType: 'indirect' },
  'OM03': { mainTab: 'indirect', subTab: '目的間接', detailTab: '会議', businessType: 'indirect' },
  'OM04': { mainTab: 'indirect', subTab: '目的間接', detailTab: '会議', businessType: 'indirect' },
  'OM05': { mainTab: 'indirect', subTab: '目的間接', detailTab: '会議', businessType: 'indirect' },
  
  'OW01': { mainTab: 'indirect', subTab: '目的間接', detailTab: '作業', businessType: 'indirect' },
  'OW02': { mainTab: 'indirect', subTab: '目的間接', detailTab: '作業', businessType: 'indirect' },
  'OW03': { mainTab: 'indirect', subTab: '目的間接', detailTab: '作業', businessType: 'indirect' },
  'OW04': { mainTab: 'indirect', subTab: '目的間接', detailTab: '作業', businessType: 'indirect' },
  
  // 間接業務 - 控除時間 (Rで始まる)
  'RR01': { mainTab: 'indirect', subTab: '控除時間', detailTab: '休憩／外出', businessType: 'indirect' },
  'RR02': { mainTab: 'indirect', subTab: '控除時間', detailTab: '休憩／外出', businessType: 'indirect' },
  'RR03': { mainTab: 'indirect', subTab: '控除時間', detailTab: '休憩／外出', businessType: 'indirect' },
  
  'RC01': { mainTab: 'indirect', subTab: '控除時間', detailTab: '組合時間', businessType: 'indirect' },
  'RC02': { mainTab: 'indirect', subTab: '控除時間', detailTab: '組合時間', businessType: 'indirect' },
  'RC03': { mainTab: 'indirect', subTab: '控除時間', detailTab: '組合時間', businessType: 'indirect' },
  
  'RO01': { mainTab: 'indirect', subTab: '控除時間', detailTab: 'その他', businessType: 'indirect' },
  'RO02': { mainTab: 'indirect', subTab: '控除時間', detailTab: 'その他', businessType: 'indirect' },
  'RO03': { mainTab: 'indirect', subTab: '控除時間', detailTab: 'その他', businessType: 'indirect' },
} as const;

// activityCodeの型定義
export type ActivityCode = keyof typeof ACTIVITY_CODE_MAPPING;

// 逆引きマッピング（サブタブ情報からactivityCodeを取得）
export const REVERSE_ACTIVITY_CODE_MAPPING: Record<string, ActivityCode[]> = {
  // メインタブ別
  'project': ['PP01', 'PP02', 'PP03', 'PP04', 'PP05', 'PP06', 'PP07', 'PP08', 'PP09', 'PC01', 'PT01', 'PT02', 'PT03', 'PT04', 'PT05', 'PT06', 'PT07', 'PT08', 'DP01', 'DP02', 'DP03', 'DP04', 'DP05', 'DP06', 'DP07', 'DP08', 'DP09', 'DP10', 'DP11', 'DS01', 'DS02', 'DS03', 'DS04', 'DS05', 'DS06', 'DS07', 'DS08', 'DS09', 'DS10', 'DS11', 'DK01', 'DK02', 'DK03', 'DK04', 'DK05', 'DK06', 'DK07', 'DK08', 'DK09', 'DK10', 'DK11', 'DR01', 'DR02', 'DR03', 'DR04', 'DR05', 'DR06', 'DR07', 'DR08', 'DR09', 'DR10', 'DR11', 'MN01', 'MN02', 'MN03', 'MN04', 'MN05', 'MN06', 'MN07', 'MN08', 'MN09', 'MG01', 'MG02', 'MG03', 'MG04', 'MG05', 'MG06', 'MG07', 'MG08', 'MG09', 'MJ01', 'MJ02', 'MJ03', 'MJ04', 'MJ05', 'MJ06', 'MJ07', 'MJ08', 'MJ09', 'MO01', 'MO02', 'MO03', 'MO04', 'MO05', 'MO06', 'MO07', 'MO08', 'MO09', 'P100', 'P101', 'P102', 'P103', 'P104', 'P105', 'P106', 'P107', 'P108', 'P109', 'P110', 'P111', 'P112', 'P113', 'P114', 'P115', 'P116', 'OT01', 'OT02', 'OT03', 'OT04', 'OT05', 'OT06', 'OT07', 'OT08', 'OT09', 'OC01', 'OC02', 'OC03', 'OC04', 'OC05', 'OC06', 'OC07', 'OC08', 'OC09', 'OC10', 'OC11', 'OM01', 'OM02', 'OM03', 'OM04', 'OM05', 'OD01', 'OD02', 'OD03', 'OD04'],
  'indirect': ['IM01', 'IM02', 'IM03', 'IM04', 'IM05', 'IE01', 'IE02', 'IE03', 'IE04', 'IE05', 'IW01', 'IW02', 'IW03', 'IW04', 'OM01', 'OM02', 'OM03', 'OM04', 'OM05', 'OW01', 'OW02', 'OW03', 'OW04', 'RR01', 'RR02', 'RR03', 'RC01', 'RC02', 'RC03', 'RO01', 'RO02', 'RO03'],
  
  // サブタブ別
  '計画': ['PP01', 'PP02', 'PP03', 'PP04', 'PP05', 'PP06', 'PP07', 'PP08', 'PP09', 'PC01', 'PT01', 'PT02', 'PT03', 'PT04', 'PT05', 'PT06', 'PT07', 'PT08'],
  '設計': ['DP01', 'DP02', 'DP03', 'DP04', 'DP05', 'DP06', 'DP07', 'DP08', 'DP09', 'DP10', 'DP11', 'DS01', 'DS02', 'DS03', 'DS04', 'DS05', 'DS06', 'DS07', 'DS08', 'DS09', 'DS10', 'DS11', 'DK01', 'DK02', 'DK03', 'DK04', 'DK05', 'DK06', 'DK07', 'DK08', 'DK09', 'DK10', 'DK11', 'DR01', 'DR02', 'DR03', 'DR04', 'DR05', 'DR06', 'DR07', 'DR08', 'DR09', 'DR10', 'DR11'],
  '会議': ['MN01', 'MN02', 'MN03', 'MN04', 'MN05', 'MN06', 'MN07', 'MN08', 'MN09', 'MG01', 'MG02', 'MG03', 'MG04', 'MG05', 'MG06', 'MG07', 'MG08', 'MG09', 'MJ01', 'MJ02', 'MJ03', 'MJ04', 'MJ05', 'MJ06', 'MJ07', 'MJ08', 'MJ09', 'MO01', 'MO02', 'MO03', 'MO04', 'MO05', 'MO06', 'MO07', 'MO08', 'MO09'],
  '購入品': ['P100', 'P101', 'P102', 'P103', 'P104', 'P105', 'P106', 'P107', 'P108', 'P109', 'P110', 'P111', 'P112', 'P113', 'P114', 'P115', 'P116'],
  'その他': ['OT01', 'OT02', 'OT03', 'OT04', 'OT05', 'OT06', 'OT07', 'OT08', 'OT09', 'OC01', 'OC02', 'OC03', 'OC04', 'OC05', 'OC06', 'OC07', 'OC08', 'OC09', 'OC10', 'OC11', 'OM01', 'OM02', 'OM03', 'OM04', 'OM05', 'OD01', 'OD02', 'OD03', 'OD04'],
  '純間接': ['IM01', 'IM02', 'IM03', 'IM04', 'IM05', 'IE01', 'IE02', 'IE03', 'IE04', 'IE05', 'IW01', 'IW02', 'IW03', 'IW04'],
  '目的間接': ['OM01', 'OM02', 'OM03', 'OM04', 'OM05', 'OW01', 'OW02', 'OW03', 'OW04'],
  '控除時間': ['RR01', 'RR02', 'RR03', 'RC01', 'RC02', 'RC03', 'RO01', 'RO02', 'RO03'],
} as const;
