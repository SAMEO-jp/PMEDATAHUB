/**
 * 業務コード生成ロジック
 * 
 * プロジェクト業務と間接業務の業務分類コードを生成する関数群
 * コード生成ルールが変更された場合は、このファイルを編集する
 */

import { ClassificationItem } from './types';

/**
 * プロジェクトタブ用の業務分類コード生成
 * 
 * @param subTab - サブタブ名（計画、設計、会議、その他、購入品）
 * @param detailTab - 詳細タブ名
 * @param classification - 分類アイテム
 * @param designSubTab - 設計タブの場合の図面タイプ
 * @returns 生成された業務分類コード
 */
export const generateProjectActivityCode = (
  subTab: string, 
  detailTab: string, 
  classification: ClassificationItem,
  designSubTab?: string
): string => {
  const prefixes: Record<string, string> = {
    計画: "P",
    設計: "D", 
    会議: "M",
    その他: "O",
    購入品: "P"
  };
  
  if (subTab === "計画") {
    // 計画タブの場合は、サブタブタイプに基づいて3桁目を決定
    let thirdChar = "0";
    if (detailTab === "計画図") thirdChar = "P";
    else if (detailTab === "検討書") thirdChar = "C";
    else if (detailTab === "見積り") thirdChar = "T";
    
    return `P${thirdChar}${classification.code}`;
  } else if (subTab === "設計") {
    // 設計タブの場合は、図面タイプに基づいて3桁目を決定
    let thirdChar = "0";
    if (designSubTab === "計画図") thirdChar = "P";
    else if (designSubTab === "詳細図") thirdChar = "S";
    else if (designSubTab === "組立図") thirdChar = "K";
    else if (designSubTab === "改正図") thirdChar = "R";
    
    return `D${thirdChar}${classification.code}`;
  } else if (subTab === "会議") {
    // 会議タブの場合は、サブタブタイプに基づいて3桁目を決定
    let thirdChar = "0";
    if (detailTab === "内部定例") thirdChar = "N";
    else if (detailTab === "外部定例") thirdChar = "G";
    else if (detailTab === "プロ進行") thirdChar = "J";
    else if (detailTab === "その他") thirdChar = "O";
    
    return `M${thirdChar}${classification.code}`;
  } else if (subTab === "その他") {
    // その他タブの場合は、直接コードを使用
    return classification.code;
  } else if (subTab === "購入品") {
    // 購入品タブの場合は、インデックスベース
    // 注意: この部分は購入品の詳細タブ配列が必要
    return `P${classification.code.padStart(4, '0')}`;
  }
  
  return `${prefixes[subTab] || "P"}${classification.code}00`;
};

/**
 * 間接業務タブ用の業務分類コード生成
 * 
 * @param subTab - サブタブ名（純間接、目的間接、控除）
 * @param detailTab - 詳細タブ名
 * @param classification - 分類アイテム
 * @returns 生成された業務分類コード
 */
export const generateIndirectActivityCode = (
  subTab: string, 
  detailTab: string, 
  classification: ClassificationItem
): string => {
  if (subTab === "純間接") {
    return `ZP${classification.code}`;
  } else if (subTab === "目的間接") {
    return `ZM${classification.code}`;
  } else if (subTab === "控除") {
    return `ZD${classification.code}`;
  }
  
  return `ZM${classification.code}`;
};

/**
 * デフォルトコード生成
 * 
 * @param tabType - タブタイプ（project/indirect）
 * @param subTab - サブタブ名
 * @param designSubTab - 設計タブの場合の図面タイプ
 * @returns デフォルトの業務分類コード
 */
export const generateDefaultCode = (
  tabType: 'project' | 'indirect',
  subTab: string,
  designSubTab?: string
): string => {
  if (tabType === 'project') {
    if (subTab === '計画') {
      return 'PP01';
    } else if (subTab === '設計') {
      let thirdChar = "P"; // デフォルトは計画図
      if (designSubTab === "詳細図") thirdChar = "S";
      else if (designSubTab === "組立図") thirdChar = "K";
      else if (designSubTab === "改正図") thirdChar = "R";
      return `D${thirdChar}01`;
    } else if (subTab === '会議') {
      return 'MN01';
    } else if (subTab === 'その他') {
      return 'O001';
    } else if (subTab === '購入品') {
      return 'P0000';
    }
  } else if (tabType === 'indirect') {
    if (subTab === '目的間接') {
      return 'ZMW01';
    } else if (subTab === '純間接') {
      return 'ZPW01';
    } else if (subTab === '控除') {
      return 'ZDR01';
    }
  }
  
  // 空文字列を避けるため、デフォルト値を返す
  return 'P001';
};
