'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { useAuthContext } from '@/src/contexts/AuthContext';

/**
 * ログインモーダルコンポーネント
 * 認証コンテキストを使用してログイン機能を提供
 * 
 * @example
 * ```tsx
 * // 親コンポーネントで使用
 * const { isLoginModalOpen, closeLoginModal } = useAuthContext();
 * 
 * return (
 *   <LoginModal 
 *     isOpen={isLoginModalOpen} 
 *     onClose={closeLoginModal} 
 *   />
 * );
 * ```
 */
export function LoginModal() {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    login, 
    isLoading, 
    error 
  } = useAuthContext();
  
  const [userId, setUserId] = useState('');

  /**
   * ログイン処理
   */
  const handleSubmit = async () => {
    if (!userId.trim()) {
      return;
    }

    const success = await login(userId);
    if (success) {
      setUserId(''); // 成功時は入力フィールドをクリア
    }
  };

  /**
   * モーダルを閉じる際の処理
   */
  const handleClose = () => {
    setUserId(''); // 入力フィールドをクリア
    closeLoginModal();
  };

  /**
   * Enterキーでの送信処理
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleSubmit();
    }
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>ログイン</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="userId" className="text-sm font-medium">
              ユーザーID
            </label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ユーザーIDを入力してください"
              disabled={isLoading}
              autoFocus
            />
            
            {/* エラーメッセージ表示 */}
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          
          {/* ログインボタン */}
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !userId.trim()}
            className="w-full"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
