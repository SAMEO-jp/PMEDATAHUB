/**
 * 業務分類コード生成ユーティリティ
 */

interface ActivityCodeParams {
  tab: string
  subTab?: string
  indirectSubTab?: string
  selectedIndirectDetailTab?: string
  subTabType?: string
  activityColumn?: string
}

/**
 * プロジェクト業務の業務分類コードを生成
 */
const generateProjectActivityCode = (params: ActivityCodeParams): string => {
  const { subTab, subTabType, activityColumn } = params
  
  let codePrefix = "P";
  if (subTab === "計画") codePrefix = "P";
  else if (subTab === "設計") codePrefix = "D";
  else if (subTab === "会議") codePrefix = "M";
  else if (subTab === "購入品") codePrefix = "P";
  else if (subTab === "その他") codePrefix = "O";
  
  let thirdChar = "0";
  if (subTab === "計画") {
    if (subTabType === "計画図") thirdChar = "P";
    else if (subTabType === "検討書") thirdChar = "C";
    else if (subTabType === "見積り") thirdChar = "T";
  }
  else if (subTab === "設計") {
    if (subTabType === "計画図") thirdChar = "P";
    else if (subTabType === "詳細図") thirdChar = "S";
    else if (subTabType === "組立図") thirdChar = "K";
    else if (subTabType === "改正図") thirdChar = "R";
  }
  else if (subTab === "会議") {
    if (subTabType === "内部定例") thirdChar = "N";
    else if (subTabType === "外部定例") thirdChar = "G";
    else if (subTabType === "プロ進行") thirdChar = "J";
    else if (subTabType === "その他") thirdChar = "O";
  }
  else if (subTab === "その他") {
    if (subTabType === "出張") thirdChar = "A";
    else if (subTabType === "〇対応") thirdChar = "U";
    else if (subTabType === "プロ管理") thirdChar = "B";
    else if (subTabType === "資料") thirdChar = "L";
    else if (subTabType === "その他") thirdChar = "O";
  }
  else if (subTab === "購入品") {
    thirdChar = "0";
  }
  
  let lastDigits = "00";
  if (subTab === "購入品" && activityColumn) {
    const columnCode =
      activityColumn === "0" ? "00" :
      activityColumn === "1" ? "01" :
      activityColumn === "2" ? "02" :
      activityColumn === "3" ? "03" :
      activityColumn === "4" ? "04" :
      activityColumn === "5" ? "05" :
      activityColumn === "6" ? "06" :
      activityColumn === "7" ? "07" :
      activityColumn === "8" ? "08" :
      activityColumn === "9" ? "09" :
      activityColumn === "A" ? "10" :
      activityColumn === "B" ? "11" :
      activityColumn === "C" ? "12" :
      activityColumn === "D" ? "13" :
      activityColumn === "E" ? "14" :
      activityColumn === "F" ? "15" :
      activityColumn === "G" ? "16" : "00";
    lastDigits = columnCode;
  }
  
  return `${codePrefix}${thirdChar}${lastDigits}`;
};

/**
 * 間接業務の業務分類コードを生成
 */
const generateIndirectActivityCode = (params: ActivityCodeParams): string => {
  const { indirectSubTab, selectedIndirectDetailTab } = params
  
  let codePrefix = "";
  let codeSuffix = "00";
  
  if (indirectSubTab === "純間接") {
    codePrefix = "ZJ";
    if (selectedIndirectDetailTab === "会議") codeSuffix = "M0";
    else if (selectedIndirectDetailTab === "日報入力") codeSuffix = "D0";
    else if (selectedIndirectDetailTab === "人事評価") codeSuffix = "H0";
    else if (selectedIndirectDetailTab === "作業") codeSuffix = "A0";
    else if (selectedIndirectDetailTab === "その他") codeSuffix = "O0";
    else codeSuffix = "00";
  } 
  else if (indirectSubTab === "目的間接") {
    codePrefix = "ZM";
    if (selectedIndirectDetailTab === "会議") codeSuffix = "M0";
    else if (selectedIndirectDetailTab === "作業") codeSuffix = "A0";
    else if (selectedIndirectDetailTab === "その他") codeSuffix = "O0";
    else codeSuffix = "00";
  } 
  else if (indirectSubTab === "控除時間") {
    codePrefix = "ZK";
    if (selectedIndirectDetailTab === "休憩／外出") codeSuffix = "ZZ";
    else if (selectedIndirectDetailTab === "組合時間") codeSuffix = "ZK";
    else if (selectedIndirectDetailTab === "その他") codeSuffix = "O0";
    else codeSuffix = "00";
  }
  else {
    codePrefix = "Z";
  }
  
  return codePrefix + codeSuffix;
};

/**
 * 業務分類コードを生成するメイン関数
 */
export const generateActivityCode = (params: ActivityCodeParams): string => {
  const { tab } = params;
  
  if (tab === "project") {
    return generateProjectActivityCode(params);
  } else if (tab === "indirect") {
    return generateIndirectActivityCode(params);
  }
  
  return "";
};

/**
 * 業務分類コードの説明を取得
 */
export const getActivityCodeDescription = (code: string): string => {
  const descriptions: Record<string, string> = {
    "P000": "プロジェクト業務（計画）",
    "D000": "プロジェクト業務（設計）",
    "M000": "プロジェクト業務（会議）",
    "O000": "プロジェクト業務（その他）",
    "ZJD0": "純間接（日報入力）",
    "ZJM0": "純間接（会議）",
    "ZJH0": "純間接（人事評価）",
    "ZJA0": "純間接（作業）",
    "ZJO0": "純間接（その他）",
    "ZMA0": "目的間接（作業）",
    "ZMM0": "目的間接（会議）",
    "ZMO0": "目的間接（その他）",
    "ZKZZ": "控除時間（休憩／外出）",
    "ZKZK": "控除時間（組合時間）",
    "ZKO0": "控除時間（その他）",
  };
  
  return descriptions[code] || `業務分類コード: ${code}`;
}; 