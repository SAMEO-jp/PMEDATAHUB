import React from 'react';
import { SubTabButton } from './SubTabButton';
import { PurchaseDropdown } from './PurchaseDropdown';
import { ClassificationItem } from '../../../constants/activity-codes';
import { TimeGridEvent } from '../../../types';
import { DetailClassificationsProps, TAB } from './types';

// 既存の型定義を削除し、新しい型を使用

/**
 * 詳細分類ボタンをレンダリング
 */
export const DetailClassifications = ({
  state,
  actions
}: DetailClassificationsProps) => {
  // stateやactionsがundefinedの場合は早期リターン
  if (!state || !actions) {
    return null;
  }

  const { selectedTab, mainSubTab: currentMainSubTab, detailSubTab: currentDetailSubTab, currentCode } = state;
  const { 
    onSelect: onClassificationSelect,
    getProjectClassifications,
    getIndirectClassifications,
    generateProjectCode: generateProjectActivityCode,
    generateIndirectCode: generateIndirectActivityCode,
    getProjectData: getProjectAdditionalData,
    getIndirectData: getIndirectAdditionalData,
    getPurchaseClassifications
  } = actions;
  if (selectedTab === 'project') {
    // 購入品タブの場合は特別なプルダウンコンポーネントを使用
    if (currentMainSubTab === '購入品') {
      return (
        <PurchaseDropdown
          currentCode={currentCode}
          onClassificationSelect={onClassificationSelect}
          generateProjectActivityCode={generateProjectActivityCode}
          getProjectAdditionalData={getProjectAdditionalData}
          purchaseClassifications={getPurchaseClassifications()}
        />
      );
    }
    
    return <ProjectDetailClassifications
      currentMainSubTab={currentMainSubTab}
      currentDetailSubTab={currentDetailSubTab}
      currentCode={currentCode}
      onClassificationSelect={onClassificationSelect}
      getProjectClassifications={getProjectClassifications}
      generateProjectActivityCode={generateProjectActivityCode}
      getProjectAdditionalData={getProjectAdditionalData}
    />;
  } else {
    return <IndirectDetailClassifications
      currentMainSubTab={currentMainSubTab}
      currentCode={currentCode}
      onClassificationSelect={onClassificationSelect}
      getIndirectClassifications={getIndirectClassifications}
      generateIndirectActivityCode={generateIndirectActivityCode}
      getIndirectAdditionalData={getIndirectAdditionalData}
    />;
  }
};

/**
 * プロジェクト詳細分類をレンダリング
 */
const ProjectDetailClassifications = ({
  currentMainSubTab,
  currentDetailSubTab,
  currentCode,
  onClassificationSelect,
  getProjectClassifications,
  generateProjectActivityCode,
  getProjectAdditionalData
}: {
  currentMainSubTab: string;
  currentDetailSubTab: string;
  currentCode: string;
  onClassificationSelect: (code: string, additionalData: any) => void;
  getProjectClassifications: () => ClassificationItem[] | null;
  generateProjectActivityCode: (mainTab: string, detailTab: string, classification: ClassificationItem, subTabType: string) => string;
  getProjectAdditionalData: (classification: ClassificationItem) => any;
}) => {
  const classifications = getProjectClassifications();
  if (!classifications) return null;

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">詳細分類</div>
      <div className="flex flex-wrap gap-2">
        {classifications.map((classification: ClassificationItem) => {
          const newCode = generateProjectActivityCode(
            currentMainSubTab, 
            currentDetailSubTab, 
            classification, 
            currentDetailSubTab
          );
          const isSelected = currentCode === newCode;

          return (
            <SubTabButton
              key={classification.name}
              tab={classification.name}
              isSelected={isSelected}
              onClick={() => {
                onClassificationSelect(newCode, getProjectAdditionalData(classification));
              }}
              color="green"
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * 間接業務詳細分類をレンダリング
 */
const IndirectDetailClassifications = ({
  currentMainSubTab,
  currentCode,
  onClassificationSelect,
  getIndirectClassifications,
  generateIndirectActivityCode,
  getIndirectAdditionalData
}: {
  currentMainSubTab: string;
  currentCode: string;
  onClassificationSelect: (code: string, additionalData: any) => void;
  getIndirectClassifications: () => Record<string, ClassificationItem[]> | null;
  generateIndirectActivityCode: (mainTab: string, detailTab: string, classification: ClassificationItem) => string;
  getIndirectAdditionalData: (detailTab: string, classification: ClassificationItem) => any;
}) => {
  const classifications = getIndirectClassifications();
  if (!classifications) return null;

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">詳細分類</div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(classifications).map(([detailTab, detailClassifications]) => (
          <div key={detailTab} className="w-full">
            <div className="text-xs font-medium text-gray-600 mb-2">{detailTab}</div>
            <div className="flex flex-wrap gap-2">
              {detailClassifications.map((classification: ClassificationItem) => {
                const newCode = generateIndirectActivityCode(currentMainSubTab, detailTab, classification);
                const isSelected = currentCode === newCode;

                return (
                  <SubTabButton
                    key={classification.name}
                    tab={classification.name}
                    isSelected={isSelected}
                    onClick={() => {
                      onClassificationSelect(newCode, getIndirectAdditionalData(detailTab, classification));
                    }}
                    color="green"
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
