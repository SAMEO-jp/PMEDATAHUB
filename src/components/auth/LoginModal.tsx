'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAuthMutations, useUserSearch, useAuthInitialize } from '@/hooks/useAuthData';
import type { UserSearchResult } from '@/types/auth';

/**
 * ログインモーダルコンポーネント
 * tRPCベースの認証システムを使用
 * UserIDの直接入力または名前検索によるログイン機能を提供
 */
export function LoginModal() {
  const { 
    isLoginModalOpen, 
    closeLoginModal,
    setUser,
    clearError,
    error: contextError
  } = useAuthContext();
  
  // tRPCの認証フック
  const { login, logout, isLoggingIn } = useAuthMutations();
  const { initialize } = useAuthInitialize();
  
  // フォーム状態
  const [loginMethod, setLoginMethod] = useState<'userid' | 'name'>('userid');
  const [userIdInput, setUserIdInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // 名前検索
  const { data: searchResults, isLoading: isSearching, error: searchError } = useUserSearch(nameInput);
  
  // 表示するエラー（コンテキストエラーまたはローカルエラー）
  const displayError = contextError || localError;
  
  /**
   * UserIDでのログイン処理
   */
  const handleUserIdLogin = useCallback(async () => {
    if (!userIdInput.trim()) {
      setLocalError('ユーザーIDを入力してください');
      return;
    }
    
    setLocalError(null);
    clearError();
    
    try {
      login(userIdInput.trim());
    } catch (error) {
      setLocalError('ログイン処理に失敗しました');
    }
  }, [userIdInput, login, clearError]);
  
  /**
   * 選択されたユーザーでのログイン処理
   */
  const handleSelectedUserLogin = useCallback(async () => {
    if (!selectedUser) {
      setLocalError('ユーザーを選択してください');
      return;
    }
    
    setLocalError(null);
    clearError();
    
    try {
      login(selectedUser.user_id);
    } catch (error) {
      setLocalError('ログイン処理に失敗しました');
    }
  }, [selectedUser, login, clearError]);
  
  /**
   * ユーザー選択処理
   */
  const handleUserSelect = useCallback((user: UserSearchResult) => {
    setSelectedUser(user);
    setLocalError(null);
  }, []);
  
  /**
   * モーダルを閉じる際の処理
   */
  const handleClose = useCallback(() => {
    setUserIdInput('');
    setNameInput('');
    setSelectedUser(null);
    setLocalError(null);
    clearError();
    closeLoginModal();
  }, [closeLoginModal, clearError]);
  
  /**
   * タブ切り替え処理
   */
  const handleTabChange = useCallback((value: string) => {
    setLoginMethod(value as 'userid' | 'name');
    setLocalError(null);
    clearError();
  }, [clearError]);
  
  /**
   * Enterキーでの送信処理
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoggingIn) {
      if (loginMethod === 'userid') {
        void handleUserIdLogin();
      } else if (selectedUser) {
        void handleSelectedUserLogin();
      }
    }
  }, [loginMethod, isLoggingIn, handleUserIdLogin, handleSelectedUserLogin, selectedUser]);

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>ログイン</DialogTitle>
        </DialogHeader>
        
        <Tabs value={loginMethod} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="userid">ユーザーID入力</TabsTrigger>
            <TabsTrigger value="name">名前検索</TabsTrigger>
          </TabsList>
          
          {/* UserID入力タブ */}
          <TabsContent value="userid" className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="userId" className="text-sm font-medium">
                ユーザーID
              </label>
              <Input
                id="userId"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ユーザーIDを入力してください"
                disabled={isLoggingIn}
                autoFocus
              />
            </div>
            
            <Button 
              onClick={handleUserIdLogin}
              disabled={isLoggingIn || !userIdInput.trim()}
              className="w-full"
            >
              {isLoggingIn ? 'ログイン中...' : 'ログイン'}
            </Button>
          </TabsContent>
          
          {/* 名前検索タブ */}
          <TabsContent value="name" className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nameSearch" className="text-sm font-medium">
                名前検索
              </label>
              <Input
                id="nameSearch"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="名前を入力してください（2文字以上）"
                disabled={isLoggingIn}
              />
            </div>
            
            {/* 検索結果表示 */}
            {nameInput.length >= 2 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">検索結果</label>
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      検索中...
                    </div>
                  ) : searchResults?.data && Array.isArray(searchResults.data) && searchResults.data.length > 0 ? (
                    <div className="space-y-1 p-2">
                      {searchResults.data.map((user: UserSearchResult) => (
                        <button
                          key={user.user_id}
                          onClick={() => handleUserSelect(user)}
                          className={`w-full p-2 text-left rounded hover:bg-gray-100 transition-colors ${
                            selectedUser?.user_id === user.user_id 
                              ? 'bg-blue-100 border border-blue-300' 
                              : 'border border-transparent'
                          }`}
                          disabled={isLoggingIn}
                        >
                          <div className="text-sm font-medium">{user.name_japanese}</div>
                          <div className="text-xs text-gray-500">
                            {user.user_id} - {user.bumon} {user.syokui}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : nameInput.length >= 2 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      該当するユーザーが見つかりませんでした
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            
            {/* 選択されたユーザーでログイン */}
            <Button 
              onClick={handleSelectedUserLogin}
              disabled={isLoggingIn || !selectedUser}
              className="w-full"
            >
              {isLoggingIn ? 'ログイン中...' : selectedUser ? `${selectedUser.name_japanese}でログイン` : 'ユーザーを選択してください'}
            </Button>
          </TabsContent>
        </Tabs>
        
        {/* エラーメッセージ表示 */}
        {displayError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {displayError}
          </div>
        )}
        
        {/* 検索エラー表示 */}
        {searchError && (
          <div className="p-3 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-md">
            検索中にエラーが発生しました
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
