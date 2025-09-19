import React from 'react';
import { BreadcrumbItem } from '../types';

interface HeaderTitleProps {
  title?: string;
  titleSuffix?: string;
  subtitle?: string;
  breadcrumbItems?: BreadcrumbItem[];
  showBreadcrumb?: boolean;
}

/**
 * ヘッダーのタイトル部分を表示するコンポーネント
 */
export const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  titleSuffix,
  subtitle,
  breadcrumbItems = [],
  showBreadcrumb = false,
}) => {
  if (!title && !subtitle && !showBreadcrumb) {
    return null;
  }

  return (
    <div className="header-title-section">
      {/* パンくずリスト */}
      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <nav className="header-breadcrumb" aria-label="パンくずリスト">
          <ol className="breadcrumb-list">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="breadcrumb-item">
                {item.icon && (
                  <span className="material-symbols-outlined breadcrumb-icon">
                    {item.icon}
                  </span>
                )}
                {item.href ? (
                  <a href={item.href} className="breadcrumb-link">
                    {item.label}
                  </a>
                ) : (
                  <span className="breadcrumb-text">{item.label}</span>
                )}
                {index < breadcrumbItems.length - 1 && (
                  <span className="material-symbols-outlined breadcrumb-separator">
                    chevron_right
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* メインタイトル */}
      {title && (
        <h1 className="header-main-title">
          {title}
          {titleSuffix && (
            <span className="header-title-suffix">{titleSuffix}</span>
          )}
        </h1>
      )}

      {/* サブタイトル */}
      {subtitle && (
        <p className="header-subtitle">{subtitle}</p>
      )}
    </div>
  );
}; 