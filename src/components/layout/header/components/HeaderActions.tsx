import React from 'react';
import { HeaderAction } from '../types';

interface HeaderActionsProps {
  actions?: HeaderAction[];
  onActionClick: (action: HeaderAction) => void;
}

/**
 * ヘッダーのアクションボタンを表示するコンポーネント
 */
export const HeaderActions: React.FC<HeaderActionsProps> = ({
  actions = [],
  onActionClick,
}) => {
  if (actions.length === 0) {
    return null;
  }

  const getButtonClasses = (action: HeaderAction): string => {
    const baseClasses = 'header-action-button';
    const variantClasses = {
      primary: 'header-action-primary',
      secondary: 'header-action-secondary',
      outline: 'header-action-outline',
      ghost: 'header-action-ghost',
    };
    const sizeClasses = {
      sm: 'header-action-sm',
      md: 'header-action-md',
      lg: 'header-action-lg',
    };

    return [
      baseClasses,
      variantClasses[action.variant || 'primary'],
      sizeClasses[action.size || 'md'],
      action.disabled ? 'header-action-disabled' : '',
      action.loading ? 'header-action-loading' : '',
    ].filter(Boolean).join(' ');
  };

  return (
    <div className="header-actions">
      {actions.map((action) => (
        <button
          key={action.id}
          className={getButtonClasses(action)}
          onClick={() => onActionClick(action)}
          disabled={action.disabled || action.loading}
          aria-label={action.label}
        >
          {action.loading && (
            <span className="material-symbols-outlined header-action-loading-icon">
              sync
            </span>
          )}
          {action.icon && !action.loading && (
            <span className="material-symbols-outlined header-action-icon">
              {action.icon}
            </span>
          )}
          <span className="header-action-label">{action.label}</span>
        </button>
      ))}
    </div>
  );
}; 