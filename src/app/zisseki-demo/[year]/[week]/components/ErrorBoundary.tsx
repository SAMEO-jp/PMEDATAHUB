/**
 * エラーバウンダリーコンポーネント
 * エラー状態とローディング状態を管理
 */

import React from 'react';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * エラーバウンダリーのProps型定義
 */
interface ErrorBoundaryProps {
  hasError: boolean;
  errorMessage: string | null;
  isLoading: boolean;
  onClearErrors: () => void;
  children: React.ReactNode;
}

/**
 * エラーバウンダリーコンポーネント
 */
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  hasError,
  errorMessage,
  isLoading,
  onClearErrors,
  children
}) => {
  // エラー表示
  if (hasError) {
    return (
      <ErrorDisplay 
        error={errorMessage} 
        onClear={onClearErrors}
      />
    );
  }

  // ローディング表示
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 正常表示
  return <>{children}</>;
};
