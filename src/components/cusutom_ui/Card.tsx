import React from 'react';
import Link from 'next/link';

// スタイルパターンの型定義
export type StylePattern = 'default' | 'project' | 'table' | 'test' | 'demo' | 'custom';

// Cardコンポーネントの型定義
export interface CardProps {
  title: string;
  description: string;
  linkText: string;
  href: string;
  // スタイルパターン指定
  stylePattern?: StylePattern;
  // スタイリングプロパティ（stylePatternが'custom'の場合に使用）
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  linkClassName?: string;
  backgroundColor?: string;
  textColor?: string;
  titleSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  descriptionSize?: 'sm' | 'md' | 'lg' | 'xl';
  linkSize?: 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  // px単位での数値指定
  padding?: number; // px
  margin?: number; // px
  borderRadius?: number; // px
  fontSize?: number; // px
  lineHeight?: number; // px
  fontWeight?: number; // 100-900
  width?: number; // px
  height?: number; // px
  maxWidth?: number; // px
  minHeight?: number; // px
  // 各要素の文字サイズ指定（px）
  titleFontSize?: number; // px
  titleLineHeight?: number; // 数値
  titleFontWeight?: number; // 100-900
  descriptionFontSize?: number; // px
  descriptionLineHeight?: number; // 数値
  descriptionFontWeight?: number; // 100-900
  linkFontSize?: number; // px
  linkLineHeight?: number; // 数値
  linkFontWeight?: number; // 100-900
}

// カードコンポーネント
export const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  linkText, 
  href,
  stylePattern = 'default',
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  linkClassName = '',
  backgroundColor = '',
  textColor = '',
  titleSize = 'lg',
  descriptionSize = 'md',
  linkSize = 'md',
  hoverEffect = true,
  // px単位のプロパティ
  padding,
  margin,
  borderRadius,
  fontSize,
  lineHeight,
  fontWeight,
  width,
  height,
  maxWidth,
  minHeight,
  // 各要素の文字サイズプロパティ
  titleFontSize,
  titleLineHeight,
  titleFontWeight,
  descriptionFontSize,
  descriptionLineHeight,
  descriptionFontWeight,
  linkFontSize,
  linkLineHeight,
  linkFontWeight
}) => {
  // スタイルパターン定義
  const stylePatterns = {
    default: {
      backgroundColor: 'bg-gray-50',
      textColor: 'text-gray-900',
      titleSize: 'lg' as const,
      descriptionSize: 'md' as const,
      linkSize: 'md' as const,
      hoverEffect: true
    },
    project: {
      backgroundColor: 'bg-blue-50',
      textColor: 'text-blue-900',
      titleSize: 'xl' as const,
      descriptionSize: 'md' as const,
      linkSize: 'md' as const,
      hoverEffect: true
    },
    table: {
      backgroundColor: 'bg-green-50',
      textColor: 'text-green-900',
      titleSize: 'lg' as const,
      descriptionSize: 'sm' as const,
      linkSize: 'md' as const,
      hoverEffect: true
    },
    test: {
      backgroundColor: 'bg-purple-50',
      textColor: 'text-purple-900',
      titleSize: 'lg' as const,
      descriptionSize: 'md' as const,
      linkSize: 'lg' as const,
      hoverEffect: true
    }
  };

  // サイズクラスのマッピング
  const titleSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const descriptionSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const linkSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // スタイルパターンまたはカスタムスタイルの適用
  const appliedStyle = stylePattern === 'custom' 
    ? { backgroundColor, textColor, titleSize, descriptionSize, linkSize, hoverEffect }
    : (stylePatterns[stylePattern as keyof typeof stylePatterns] || stylePatterns.default);

  // インラインスタイルの構築
  const inlineStyles: React.CSSProperties = {};
  if (padding !== undefined) inlineStyles.padding = `${padding}px`;
  if (margin !== undefined) inlineStyles.margin = `${margin}px`;
  if (borderRadius !== undefined) inlineStyles.borderRadius = `${borderRadius}px`;
  if (fontSize !== undefined) inlineStyles.fontSize = `${fontSize}px`;
  if (lineHeight !== undefined) inlineStyles.lineHeight = lineHeight;
  if (fontWeight !== undefined) inlineStyles.fontWeight = fontWeight;
  if (width !== undefined) inlineStyles.width = `${width}px`;
  if (height !== undefined) inlineStyles.height = `${height}px`;
  if (maxWidth !== undefined) inlineStyles.maxWidth = `${maxWidth}px`;
  if (minHeight !== undefined) inlineStyles.minHeight = `${minHeight}px`;

  // 各要素のインラインスタイル構築
  const titleInlineStyles: React.CSSProperties = {};
  if (titleFontSize !== undefined) titleInlineStyles.fontSize = `${titleFontSize}px`;
  if (titleLineHeight !== undefined) titleInlineStyles.lineHeight = titleLineHeight;
  if (titleFontWeight !== undefined) titleInlineStyles.fontWeight = titleFontWeight;

  const descriptionInlineStyles: React.CSSProperties = {};
  if (descriptionFontSize !== undefined) descriptionInlineStyles.fontSize = `${descriptionFontSize}px`;
  if (descriptionLineHeight !== undefined) descriptionInlineStyles.lineHeight = descriptionLineHeight;
  if (descriptionFontWeight !== undefined) descriptionInlineStyles.fontWeight = descriptionFontWeight;

  const linkInlineStyles: React.CSSProperties = {};
  if (linkFontSize !== undefined) linkInlineStyles.fontSize = `${linkFontSize}px`;
  if (linkLineHeight !== undefined) linkInlineStyles.lineHeight = linkLineHeight;
  if (linkFontWeight !== undefined) linkInlineStyles.fontWeight = linkFontWeight;

  // ベースクラスの構築
  const baseCardClass = `card ${appliedStyle.backgroundColor} ${appliedStyle.textColor} ${className}`;
  const titleClass = `card-title ${titleSizeClasses[appliedStyle.titleSize as keyof typeof titleSizeClasses]} ${titleClassName}`;
  const descriptionClass = `card-description ${descriptionSizeClasses[appliedStyle.descriptionSize as keyof typeof descriptionSizeClasses]} ${descriptionClassName}`;
  const linkClass = `card-link ${linkSizeClasses[appliedStyle.linkSize as keyof typeof linkSizeClasses]} ${linkClassName} ${appliedStyle.hoverEffect ? 'hover:opacity-80 transition-opacity' : ''}`;

  return (
    <div className={baseCardClass} style={inlineStyles}>
      <h3 className={titleClass} style={titleInlineStyles}>{title}</h3>
      <p className={descriptionClass} style={descriptionInlineStyles}>{description}</p>
      <Link href={href} className={linkClass} style={linkInlineStyles}>
        <span>{linkText}</span>
        <span className="material-symbols-outlined">arrow_forward</span>
      </Link>
    </div>
  );
};

export default Card; 