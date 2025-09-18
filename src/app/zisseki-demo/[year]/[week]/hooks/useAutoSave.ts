import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseAutoSaveOptions {
  saveFunction: () => Promise<void>;
  enabled?: boolean;
  onBeforeSave?: () => void;
  onAfterSave?: () => void;
  onSaveError?: (error: Error) => void;
}

/**
 * ページ移動時に自動保存を実行するカスタムフック（App Router用）
 */
export const useAutoSave = ({
  saveFunction,
  enabled = true,
  onBeforeSave,
  onAfterSave,
  onSaveError
}: UseAutoSaveOptions) => {
  const router = useRouter();
  const isNavigating = useRef(false);
  const saveInProgress = useRef(false);

  // 自動保存を実行する関数
  const executeAutoSave = useCallback(async () => {
    if (!enabled || saveInProgress.current) {
      return;
    }

    try {
      saveInProgress.current = true;
      
      if (onBeforeSave) {
        onBeforeSave();
      }

      await saveFunction();

      if (onAfterSave) {
        onAfterSave();
      }
    } catch (error) {
      console.error('自動保存エラー:', error);
      if (onSaveError) {
        onSaveError(error instanceof Error ? error : new Error('自動保存に失敗しました'));
      }
    } finally {
      saveInProgress.current = false;
    }
  }, [enabled, saveFunction, onBeforeSave, onAfterSave, onSaveError]);

  // ページ移動前の自動保存
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // ページを離れる前に自動保存を実行
      if (!isNavigating.current && !saveInProgress.current) {
        executeAutoSave();
      }
    };

    // ブラウザの戻る/進むボタンやページ離脱を検知
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, executeAutoSave]);

  // App Routerでは、コンポーネントのアンマウント時に自動保存を実行
  useEffect(() => {
    if (!enabled) return;

    return () => {
      // コンポーネントがアンマウントされる時に自動保存を実行
      if (!isNavigating.current && !saveInProgress.current) {
        executeAutoSave();
      }
    };
  }, [enabled, executeAutoSave]);

  // 手動で自動保存を実行する関数
  const triggerAutoSave = useCallback(() => {
    return executeAutoSave();
  }, [executeAutoSave]);

  return {
    triggerAutoSave,
    isSaving: saveInProgress.current
  };
};
