'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';
import { Button } from '@ui/button';

interface KonpoNotFoundProps {
  params: {
    project_id: string;
  };
}

export default function KonpoNotFound({ params }: KonpoNotFoundProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToProject = () => {
    router.push(`/app_project/${params.project_id}`);
  };

  const handleGoToKonpoList = () => {
    router.push(`/app_project/${params.project_id}/konpo`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            構部機能 - 実装準備中
          </CardTitle>
          <CardDescription className="text-gray-600">
            この構部機能は現在開発中です。しばらくお待ちください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-500 text-center">
            プロジェクトID: {params.project_id}
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
            >
              前のページに戻る
            </Button>
            <Button
              onClick={handleGoToProject}
              className="w-full"
            >
              プロジェクト詳細へ
            </Button>
            <Button
              onClick={handleGoToKonpoList}
              variant="secondary"
              className="w-full"
            >
              構部一覧へ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 