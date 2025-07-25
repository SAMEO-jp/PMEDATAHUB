import React from 'react';

// Spacerコンポーネントの型定義
export interface SpacerProps {
  height?: number; // px
  width?: number; // px
  className?: string;
  backgroundColor?: string; // Tailwindクラスまたはカラーコード
  backgroundColorHex?: string; // カラーコード（#f3f4f6など）
  borderTop?: boolean;
  borderBottom?: boolean;
}

// 空白コンポーネント
export const Spacer: React.FC<SpacerProps> = ({
  height = 20,
  width,
  className = '',
  backgroundColor = '',
  backgroundColorHex,
  borderTop = false,
  borderBottom = false
}) => {
  // インラインスタイルの構築
  const inlineStyles: React.CSSProperties = {};
  if (height !== undefined) inlineStyles.height = `${height}px`;
  if (width !== undefined) inlineStyles.width = `${width}px`;
  if (backgroundColorHex) inlineStyles.backgroundColor = backgroundColorHex;

  const spacerClass = `${backgroundColor} ${borderTop ? 'border-t' : ''} ${borderBottom ? 'border-b' : ''} ${className}`;

  return (
    <div className={spacerClass} style={inlineStyles} />
  );
};

export default Spacer; 