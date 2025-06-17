'use client';

import React, { useState } from 'react';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ui/dialog';
import { useLogin } from './useLogin';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [userId, setUserId] = useState('');
  const { handleLogin, error } = useLogin();

  const onSubmit = async () => {
    const success = await handleLogin(userId);
    if (success) {
      onClose();
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              placeholder="ユーザーIDを入力してください"
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          <Button onClick={onSubmit}>ログイン</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 