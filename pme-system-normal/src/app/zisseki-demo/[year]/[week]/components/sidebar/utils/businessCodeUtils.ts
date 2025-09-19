/**
 * Business Code Utilities
 * 
 * 既存のbusiness-code-config.jsonを使用して業務コードの管理を行うユーティリティ関数群
 * 複雑なswitch文をJSONベースの動的処理に置き換えることで、保守性と可読性を大幅に向上
 */

import businessCodeConfig from '../business-code-config.json';
import type {
  BusinessCodeInfo,
  ParsedActivityCode,
  BusinessCodeConfig,
  BusinessCodeValidationResult,
  BusinessCodeStats,
  MainTab
} from '../../../types/businessCode';

// 型アサーション
const config = businessCodeConfig as BusinessCodeConfig;

/**
 * 業務コードからパス情報を解析する
 * @param code 業務コード（例: "PP01", "DP02"）
 * @returns 解析されたパス情報、またはnull（コードが見つからない場合）
 */
export function parseActivityCode(code: string): ParsedActivityCode | null {
  if (!code || typeof code !== 'string') {
    return null;
  }



  const path = config.reverseMap[code];
  if (!path) {
    return null;
  }

  const pathParts = path.split('.');
  if (pathParts.length !== 4) {
    return null;
  }

  const [mainTab, subTab, detailTab, classification] = pathParts;
  
  const result = {
    mainTab: mainTab as MainTab,
    subTab,
    detailTab,
    classification
  };
  
  return result;
}

/**
 * 指定されたパスに対応する業務コード一覧を取得する
 * @param mainTab メインタブ（例: "project", "indirect"）
 * @param subTab サブタブ（例: "計画", "設計"）
 * @param detailTab 詳細タブ（例: "計画図", "詳細図"）
 * @returns 業務コード一覧
 */
export function getCodesForPath(
  mainTab: MainTab, 
  subTab: string, 
  detailTab: string
): BusinessCodeInfo[] {
  const pathKey = `${mainTab}.${subTab}.${detailTab}`;
  const codes = config.codes[pathKey];
  
  if (!codes) {
    return [];
  }
  
  return codes;
}

/**
 * 指定されたメインタブとサブタブに対応する詳細タブ一覧を取得する
 * @param mainTab メインタブ（例: "project", "indirect"）
 * @param subTab サブタブ（例: "計画", "設計"）
 * @returns 詳細タブ一覧
 */
export function getDetailTabs(mainTab: MainTab, subTab: string): string[] {
  const detailTabs = config.structure[mainTab]?.[subTab];
  
  if (!detailTabs) {
    return [];
  }
  
  return detailTabs;
}

/**
 * メインタブ一覧を取得する
 * @returns メインタブ一覧
 */
export function getMainTabs(): string[] {
  return Object.keys(config.structure);
}

/**
 * 指定されたメインタブに対応するサブタブ一覧を取得する
 * @param mainTab メインタブ（例: "project", "indirect"）
 * @returns サブタブ一覧
 */
export function getSubTabs(mainTab: MainTab): string[] {
  const subTabs = Object.keys(config.structure[mainTab] || {});
  
  return subTabs;
}

/**
 * 業務コードの存在確認
 * @param code 業務コード
 * @returns 存在する場合はtrue、存在しない場合はfalse
 */
export function isValidBusinessCode(code: string): boolean {
  return code in config.reverseMap;
}

/**
 * 業務コードから分類名を取得する
 * @param code 業務コード
 * @returns 分類名、またはnull（コードが見つからない場合）
 */
export function getClassificationName(code: string): string | null {
  const parsed = parseActivityCode(code);
  return parsed?.classification || null;
}

/**
 * パスから業務コードを取得する（逆引き）
 * @param mainTab メインタブ
 * @param subTab サブタブ
 * @param detailTab 詳細タブ
 * @param classification 分類名
 * @returns 業務コード、またはnull（見つからない場合）
 */
export function getCodeFromPath(
  mainTab: MainTab,
  subTab: string,
  detailTab: string,
  classification: string
): string | null {
  const pathKey = `${mainTab}.${subTab}.${detailTab}`;
  const codes = config.codes[pathKey];
  
  if (!codes) {
    return null;
  }
  
  const codeInfo = codes.find(code => code.name === classification);
  return codeInfo?.code || null;
}

/**
 * 全ての業務コード一覧を取得する
 * @returns 全ての業務コード情報
 */
export function getAllBusinessCodes(): BusinessCodeInfo[] {
  const allCodes: BusinessCodeInfo[] = [];
  
  Object.values(config.codes).forEach(codeList => {
    allCodes.push(...codeList);
  });
  
  return allCodes;
}

/**
 * 業務コードの統計情報を取得する
 * @returns 統計情報
 */
export function getBusinessCodeStats(): BusinessCodeStats {
  return {
    totalCodes: config.metadata.totalCodes,
    categories: config.metadata.categories,
    version: config.metadata.version,
    lastUpdated: config.metadata.lastUpdated
  };
}

/**
 * デフォルトの業務コード状態を取得する
 * @returns デフォルト状態
 */
export function getDefaultBusinessCodeState(): ParsedActivityCode {
  return {
    mainTab: 'project',
    subTab: '計画',
    detailTab: '計画図',
    classification: '作図及び作図準備'
  };
}

/**
 * 業務コードの検証を行う
 * @param code 業務コード
 * @returns 検証結果
 */
export function validateBusinessCode(code: string): BusinessCodeValidationResult {
  if (!code) {
    return {
      isValid: false,
      error: 'Business code is required'
    };
  }

  if (!isValidBusinessCode(code)) {
    return {
      isValid: false,
      error: `Invalid business code: ${code}`
    };
  }

  const parsed = parseActivityCode(code);
  if (!parsed) {
    return {
      isValid: false,
      error: `Failed to parse business code: ${code}`
    };
  }

  return {
    isValid: true,
    parsed
  };
}

// エクスポート
export default {
  parseActivityCode,
  getCodesForPath,
  getDetailTabs,
  getMainTabs,
  getSubTabs,
  isValidBusinessCode,
  getClassificationName,
  getCodeFromPath,
  getAllBusinessCodes,
  getBusinessCodeStats,
  getDefaultBusinessCodeState,
  validateBusinessCode
};
