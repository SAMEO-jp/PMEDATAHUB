import React from 'react';
import { BusinessCodeInfo } from '../../../types/businessCode';
import { TimeGridEvent } from '../../../types';

interface PurchaseDropdownProps {
  currentCode: string;
  onClassificationSelect: (code: string, additionalData: Partial<TimeGridEvent>) => void;
  generateCode: (subTab: string, detailTab: string, classification: BusinessCodeInfo) => string;
  getAdditionalData: (detailTab: string, classification: BusinessCodeInfo) => Partial<TimeGridEvent>;
  purchaseClassifications: BusinessCodeInfo[];
}

/**
 * 購入品用のプルダウンコンポーネント
 */
export const PurchaseDropdown = ({
  currentCode,
  onClassificationSelect,
  generateCode,
  getAdditionalData,
  purchaseClassifications
}: PurchaseDropdownProps) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(event.target.value);
    const selectedClassification = purchaseClassifications[selectedIndex];
    
    if (selectedClassification) {
      const newCode = generateCode('購入品', '購入品', selectedClassification);
      onClassificationSelect(newCode, getAdditionalData('購入品', selectedClassification));
    }
  };

  // 現在選択されている分類のインデックスを取得
  const getCurrentIndex = () => {
    return purchaseClassifications.findIndex(classification => {
      const code = generateCode('購入品', '購入品', classification);
      return code === currentCode;
    });
  };

  return (
    <div className="sidebar-spacing">
      <div className="field-label">詳細分類</div>
      <select
        className="purchase-dropdown"
        value={getCurrentIndex()}
        onChange={handleSelectChange}
        size={Math.min(purchaseClassifications.length + 1, 8)} // 最大8項目まで表示、それ以上はスクロール
      >
        <option value={-1}>選択してください</option>
        {purchaseClassifications.map((classification, index) => (
          <option key={classification.name} value={index}>
            {classification.name}
          </option>
        ))}
      </select>
    </div>
  );
};
