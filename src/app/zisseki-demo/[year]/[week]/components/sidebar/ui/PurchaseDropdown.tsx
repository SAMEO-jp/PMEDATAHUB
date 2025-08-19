import React from 'react';
import { ClassificationItem } from '../../../constants/activity-codes';
import { TimeGridEvent } from '../../../types';

interface PurchaseDropdownProps {
  currentCode: string;
  onClassificationSelect: (code: string, additionalData: Partial<TimeGridEvent>) => void;
  generateProjectActivityCode: (mainTab: string, detailTab: string, classification: ClassificationItem, subTabType: string) => string;
  getProjectAdditionalData: (classification: ClassificationItem) => Partial<TimeGridEvent>;
  purchaseClassifications: ClassificationItem[];
}

/**
 * 購入品用のプルダウンコンポーネント
 */
export const PurchaseDropdown = ({
  currentCode,
  onClassificationSelect,
  generateProjectActivityCode,
  getProjectAdditionalData,
  purchaseClassifications
}: PurchaseDropdownProps) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(event.target.value);
    const selectedClassification = purchaseClassifications[selectedIndex];
    
    if (selectedClassification) {
      const newCode = generateProjectActivityCode('購入品', '購入品', selectedClassification, '購入品');
      onClassificationSelect(newCode, getProjectAdditionalData(selectedClassification));
    }
  };

  // 現在選択されている分類のインデックスを取得
  const getCurrentIndex = () => {
    return purchaseClassifications.findIndex(classification => {
      const code = generateProjectActivityCode('購入品', '購入品', classification, '購入品');
      return code === currentCode;
    });
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">詳細分類</div>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
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
