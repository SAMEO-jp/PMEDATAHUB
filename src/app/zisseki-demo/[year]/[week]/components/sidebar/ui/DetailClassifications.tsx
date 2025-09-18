import React from 'react';
import { SubTabButton } from './SubTabButton';
import { PurchaseDropdown } from './PurchaseDropdown';
import { BusinessCodeInfo } from '../../../types/businessCode';
import { DetailClassificationsProps } from './types';

/**
 * 詳細分類ボタンをレンダリング（動的生成版）
 * 新しいbusinessCodeUtilsを使用してJSONベースの動的処理に変更
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
    getClassifications,
    generateCode,
    getAdditionalData,
    getPurchaseClassifications
  } = actions;

  // 購入品タブの場合は特別なプルダウンコンポーネントを使用
  if (currentMainSubTab === '購入品') {
    return (
      <PurchaseDropdown
        currentCode={currentCode}
        onClassificationSelect={onClassificationSelect}
        generateCode={generateCode}
        getAdditionalData={getAdditionalData}
        purchaseClassifications={getPurchaseClassifications()}
      />
    );
  }
  
  // 間接業務の場合は3段階目と4段階目の両方を表示
  if (selectedTab === 'indirect') {
    return <IndirectDetailClassifications
      currentMainSubTab={currentMainSubTab}
      currentDetailSubTab={currentDetailSubTab}
      currentCode={currentCode}
      onClassificationSelect={onClassificationSelect}
      getClassifications={getClassifications}
      generateCode={generateCode}
      getAdditionalData={getAdditionalData}
    />;
  }
  
  // プロジェクトの場合は統一された詳細分類コンポーネント
  return <UnifiedDetailClassifications
    currentMainSubTab={currentMainSubTab}
    currentDetailSubTab={currentDetailSubTab}
    currentCode={currentCode}
    onClassificationSelect={onClassificationSelect}
    getClassifications={getClassifications}
    generateCode={generateCode}
    getAdditionalData={getAdditionalData}
  />;
};

/**
 * 間接業務詳細分類をレンダリング（3段階目と4段階目の両方を表示）
 */
const IndirectDetailClassifications = ({
  currentMainSubTab,
  currentDetailSubTab,
  currentCode,
  onClassificationSelect,
  getClassifications,
  generateCode,
  getAdditionalData
}: {
  currentMainSubTab: string;
  currentDetailSubTab: string;
  currentCode: string;
  onClassificationSelect: (code: string, additionalData: any) => void;
  getClassifications: () => BusinessCodeInfo[];
  generateCode: (subTab: string, detailTab: string, classification: BusinessCodeInfo) => string;
  getAdditionalData: (detailTab: string, classification: BusinessCodeInfo) => any;
}) => {
  const classifications = getClassifications();
  if (!classifications || classifications.length === 0) return null;

  return (
    <div className="zisseki-demo detail-classifications">
      {/* 3段階目（詳細タブ）の表示 */}
      <div className="zisseki-demo classification-label">詳細分類（{currentDetailSubTab}）</div>
      <div className="zisseki-demo flex flex-wrap gap-1">
        {classifications.map((classification: BusinessCodeInfo) => {
          const newCode = generateCode(currentMainSubTab, currentDetailSubTab, classification);
          const isSelected = currentCode === newCode;

          return (
            <SubTabButton
              key={classification.name}
              tab={classification.name}
              isSelected={isSelected}
              onClick={() => {
                const additionalData = getAdditionalData(currentDetailSubTab, classification);
                onClassificationSelect(newCode, additionalData);
              }}
              color="blue"
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * 統一された詳細分類をレンダリング（動的生成版）
 */
const UnifiedDetailClassifications = ({
  currentMainSubTab,
  currentDetailSubTab,
  currentCode,
  onClassificationSelect,
  getClassifications,
  generateCode,
  getAdditionalData
}: {
  currentMainSubTab: string;
  currentDetailSubTab: string;
  currentCode: string;
  onClassificationSelect: (code: string, additionalData: any) => void;
  getClassifications: () => BusinessCodeInfo[];
  generateCode: (subTab: string, detailTab: string, classification: BusinessCodeInfo) => string;
  getAdditionalData: (detailTab: string, classification: BusinessCodeInfo) => any;
}) => {
  const classifications = getClassifications();
  if (!classifications || classifications.length === 0) return null;

  return (
    <div className="zisseki-demo detail-classifications">
      <div className="zisseki-demo classification-label">詳細分類</div>
      <div className="zisseki-demo flex flex-wrap gap-1">
        {classifications.map((classification: BusinessCodeInfo) => {
          const newCode = generateCode(currentMainSubTab, currentDetailSubTab, classification);
          const isSelected = currentCode === newCode;

          return (
            <SubTabButton
              key={classification.name}
              tab={classification.name}
              isSelected={isSelected}
              onClick={() => {
                const additionalData = getAdditionalData(currentDetailSubTab, classification);
                onClassificationSelect(newCode, additionalData);
              }}
              color="green"
            />
          );
        })}
      </div>
    </div>
  );
};
