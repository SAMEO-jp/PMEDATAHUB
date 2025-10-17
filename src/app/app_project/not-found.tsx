'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';
import { Button } from '@ui/button';

export default function AppProjectNotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  const handleGoToProjectList = () => {
    router.push('/app_project');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <svg
              className="h-8 w-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            プロジェクト機能 - 実装準備中
          </CardTitle>
          <CardDescription className="text-gray-600">
            このプロジェクト機能は現在開発中です。しばらくお待ちください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
            >
              前のページに戻る
            </Button>
            <Button
              onClick={handleGoToProjectList}
              className="w-full"
            >
              プロジェクト一覧へ
            </Button>
            <Button
              onClick={handleGoToHome}
              variant="secondary"
              className="w-full"
            >
              ホームへ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 