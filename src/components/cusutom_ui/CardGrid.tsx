import React from 'react';

// グリッドパターンの型定義
export type GridPattern = 'default' | 'compact' | 'wide' | 'centered' | 'sidebar' | 'dashboard' | 'custom';

// カラム設定の型定義
export interface ColumnConfig {
  default?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

// CardGridコンポーネントの型定義
export interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  gridClassName?: string;
  // パターン指定
  gridPattern?: GridPattern;
  // カスタム設定（gridPatternが'custom'の場合に使用）
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  columns?: ColumnConfig;
  gap?: number;
  padding?: number;
  paddingTop?: number;
}

// カードグリッドコンポーネント
export const CardGrid: React.FC<CardGridProps> = ({
  children,
  className = '',
  containerClassName = '',
  gridClassName = '',
  gridPattern = 'default',
  maxWidth = '7xl',
  columns = { default: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap = 6,
  padding = 4,
  paddingTop = 28
}) => {
  // グリッドパターン定義
  const gridPatterns = {
    default: {
      maxWidth: '7xl',
      columns: { default: 1, sm: 2, lg: 4 },
      gap: 6,
      padding: 4,
      paddingTop: 28,
      containerClass: 'min-h-screen flex items-start justify-center',
      gridClass: 'card-container w-full grid'
    },
    compact: {
      maxWidth: '5xl',
      columns: { default: 1, sm: 2, md: 3, lg: 4, xl: 5 },
      gap: 4,
      padding: 2,
      paddingTop: 16,
      containerClass: 'min-h-screen flex items-start justify-center',
      gridClass: 'card-container w-full grid'
    },
    wide: {
      maxWidth: 'full',
      columns: { default: 1, sm: 2, md: 3, lg: 4, xl: 6 },
      gap: 8,
      padding: 6,
      paddingTop: 20,
      containerClass: 'min-h-screen flex items-start justify-center',
      gridClass: 'card-container w-full grid'
    },
    centered: {
      maxWidth: '4xl',
      columns: { default: 1, sm: 2, lg: 3 },
      gap: 6,
      padding: 4,
      paddingTop: 32,
      containerClass: 'min-h-screen flex items-center justify-center',
      gridClass: 'card-container w-full grid'
    },
    sidebar: {
      maxWidth: '6xl',
      columns: { default: 1, sm: 1, md: 2, lg: 3 },
      gap: 4,
      padding: 2,
      paddingTop: 16,
      containerClass: 'min-h-screen flex items-start justify-start p-4',
      gridClass: 'card-container w-full grid'
    },
    dashboard: {
      maxWidth: 'full',
      columns: { default: 1, sm: 2, md: 3, lg: 4, xl: 5 },
      gap: 6,
      padding: 4,
      paddingTop: 20,
      containerClass: 'min-h-screen flex items-start justify-center',
      gridClass: 'card-container w-full grid'
    }
  };

  // パターンまたはカスタム設定の適用
  const appliedPattern = gridPattern === 'custom' ? null : (gridPatterns[gridPattern] || gridPatterns.default);
  const appliedMaxWidth = appliedPattern ? appliedPattern.maxWidth : maxWidth;
  const appliedColumns = appliedPattern ? appliedPattern.columns : columns;
  const appliedGap = appliedPattern ? appliedPattern.gap : gap;
  const appliedPadding = appliedPattern ? appliedPattern.padding : padding;
  const appliedPaddingTop = appliedPattern ? appliedPattern.paddingTop : paddingTop;
  const appliedContainerClass = appliedPattern ? appliedPattern.containerClass : 'min-h-screen flex items-start justify-center';
  const appliedGridClass = appliedPattern ? appliedPattern.gridClass : 'card-container w-full grid';

  // グリッドクラスの構築
  const gridCols = [
    appliedColumns.default && `grid-cols-${appliedColumns.default}`,
    appliedColumns.sm && `sm:grid-cols-${appliedColumns.sm}`,
    appliedColumns.md && `md:grid-cols-${appliedColumns.md}`,
    appliedColumns.lg && `lg:grid-cols-${appliedColumns.lg}`,
    appliedColumns.xl && `xl:grid-cols-${appliedColumns.xl}`
  ].filter(Boolean).join(' ');

  const containerClass = `${appliedContainerClass} pt-${appliedPaddingTop} p-${appliedPadding} ${containerClassName}`;
  const gridClass = `${appliedGridClass} max-w-${appliedMaxWidth} ${gridCols} gap-${appliedGap} ${gridClassName}`;

  return (
    <div className={`${containerClass} ${className}`}>
      <div className={gridClass}>
        {children}
      </div>
    </div>
  );
};

export default CardGrid; 