import React from 'react';

/**
 * 重量を適切な単位でフォーマットしてJSX要素として返す
 * @param weight - 重量（グラム単位）
 * @returns フォーマットされた重量のJSX要素
 */
export const formatWeightJSX = (weight: number): React.ReactElement => {
  if (weight === 0) {
    return <span>0g</span>;
  }

  if (weight >= 1000) {
    const kg = weight / 1000;
    return (
      <span>
        {kg.toFixed(2)}kg
      </span>
    );
  }

  return (
    <span>
      {weight.toFixed(1)}g
    </span>
  );
};

/**
 * 重量を文字列としてフォーマットする
 * @param weight - 重量（グラム単位）
 * @returns フォーマットされた重量の文字列
 */
export const formatWeightString = (weight: number): string => {
  if (weight === 0) {
    return '0g';
  }

  if (weight >= 1000) {
    const kg = weight / 1000;
    return `${kg.toFixed(2)}kg`;
  }

  return `${weight.toFixed(1)}g`;
}; 