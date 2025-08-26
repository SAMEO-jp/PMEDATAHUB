//実装中

import { ACTIVITY_CODE_MAPPING, ActivityCodeMapping, ActivityCode } from './activityCodeMapping';

/**
 * activityCodeからマッピング情報を取得
 * @param activityCode - 業務分類コード
 * @returns マッピング情報またはnull
 */
export const parseActivityCode = (activityCode: string): ActivityCodeMapping | null => {
  if (!activityCode) return null;
  
  return ACTIVITY_CODE_MAPPING[activityCode as ActivityCode] || null;
};

/**
 * activityCodeからタブ情報を取得
 * @param activityCode - 業務分類コード
 * @returns タブ情報またはnull
 */
export const getTabInfoFromActivityCode = (activityCode: string) => {
  const mapping = parseActivityCode(activityCode);
  if (!mapping) return null;
  
  return {
    activeTab: mapping.mainTab,
    activeSubTab: mapping.subTab,
    detailTab: mapping.detailTab,
    businessType: mapping.businessType
  };
};

/**
 * activityCodeからメインタブを取得
 * @param activityCode - 業務分類コード
 * @returns メインタブまたはnull
 */
export const getMainTabFromActivityCode = (activityCode: string): 'project' | 'indirect' | null => {
  const mapping = parseActivityCode(activityCode);
  return mapping?.mainTab || null;
};

/**
 * activityCodeからサブタブを取得
 * @param activityCode - 業務分類コード
 * @returns サブタブまたはnull
 */
export const getSubTabFromActivityCode = (activityCode: string): string | null => {
  const mapping = parseActivityCode(activityCode);
  return mapping?.subTab || null;
};

/**
 * activityCodeから詳細タブを取得
 * @param activityCode - 業務分類コード
 * @returns 詳細タブまたはnull
 */
export const getDetailTabFromActivityCode = (activityCode: string): string | null => {
  const mapping = parseActivityCode(activityCode);
  return mapping?.detailTab || null;
};

/**
 * activityCodeから業務タイプを取得
 * @param activityCode - 業務分類コード
 * @returns 業務タイプまたはnull
 */
export const getBusinessTypeFromActivityCode = (activityCode: string): string | null => {
  const mapping = parseActivityCode(activityCode);
  return mapping?.businessType || null;
};

/**
 * 有効なactivityCodeかどうかをチェック
 * @param activityCode - 業務分類コード
 * @returns 有効な場合はtrue
 */
export const isValidActivityCode = (activityCode: string): boolean => {
  return activityCode in ACTIVITY_CODE_MAPPING;
};

/**
 * メインタブから利用可能なactivityCodeのリストを取得
 * @param mainTab - メインタブ
 * @returns activityCodeの配列
 */
export const getActivityCodesByMainTab = (mainTab: 'project' | 'indirect'): ActivityCode[] => {
  return Object.entries(ACTIVITY_CODE_MAPPING)
    .filter(([_, mapping]) => mapping.mainTab === mainTab)
    .map(([code, _]) => code as ActivityCode);
};

/**
 * サブタブから利用可能なactivityCodeのリストを取得
 * @param subTab - サブタブ
 * @returns activityCodeの配列
 */
export const getActivityCodesBySubTab = (subTab: string): ActivityCode[] => {
  return Object.entries(ACTIVITY_CODE_MAPPING)
    .filter(([_, mapping]) => mapping.subTab === subTab)
    .map(([code, _]) => code as ActivityCode);
};

/**
 * 詳細タブから利用可能なactivityCodeのリストを取得
 * @param detailTab - 詳細タブ
 * @returns activityCodeの配列
 */
export const getActivityCodesByDetailTab = (detailTab: string): ActivityCode[] => {
  return Object.entries(ACTIVITY_CODE_MAPPING)
    .filter(([_, mapping]) => mapping.detailTab === detailTab)
    .map(([code, _]) => code as ActivityCode);
};

/**
 * 業務タイプから利用可能なactivityCodeのリストを取得
 * @param businessType - 業務タイプ
 * @returns activityCodeの配列
 */
export const getActivityCodesByBusinessType = (businessType: string): ActivityCode[] => {
  return Object.entries(ACTIVITY_CODE_MAPPING)
    .filter(([_, mapping]) => mapping.businessType === businessType)
    .map(([code, _]) => code as ActivityCode);
};

/**
 * 利用可能なすべてのactivityCodeを取得
 * @returns activityCodeの配列
 */
export const getAllActivityCodes = (): ActivityCode[] => {
  return Object.keys(ACTIVITY_CODE_MAPPING) as ActivityCode[];
};

/**
 * 利用可能なすべてのメインタブを取得
 * @returns メインタブの配列
 */
export const getAllMainTabs = (): ('project' | 'indirect')[] => {
  return ['project', 'indirect'];
};

/**
 * 利用可能なすべてのサブタブを取得
 * @returns サブタブの配列
 */
export const getAllSubTabs = (): string[] => {
  const subTabs = new Set<string>();
  Object.values(ACTIVITY_CODE_MAPPING).forEach(mapping => {
    subTabs.add(mapping.subTab);
  });
  return Array.from(subTabs);
};

/**
 * 利用可能なすべての詳細タブを取得
 * @returns 詳細タブの配列
 */
export const getAllDetailTabs = (): string[] => {
  const detailTabs = new Set<string>();
  Object.values(ACTIVITY_CODE_MAPPING).forEach(mapping => {
    detailTabs.add(mapping.detailTab);
  });
  return Array.from(detailTabs);
};

/**
 * 利用可能なすべての業務タイプを取得
 * @returns 業務タイプの配列
 */
export const getAllBusinessTypes = (): string[] => {
  const businessTypes = new Set<string>();
  Object.values(ACTIVITY_CODE_MAPPING).forEach(mapping => {
    businessTypes.add(mapping.businessType);
  });
  return Array.from(businessTypes);
};
