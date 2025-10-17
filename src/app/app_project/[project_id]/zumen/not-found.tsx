'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';
import { Button } from '@ui/button';

interface ZumenNotFoundProps {
  params: {
    project_id: string;
  };
}

export default function ZumenNotFound({ params }: ZumenNotFoundProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToProject = () => {
    router.push(`/app_project/${params.project_id}`);
  };

  const handleGoToZumenList = () => {
    router.push(`/app_project/${params.project_id}/zumen`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <svg
              className="h-8 w-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            図面機能 - 実装準備中
          </CardTitle>
          <CardDescription className="text-gray-600">
            この図面機能は現在開発中です。しばらくお待ちください。
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
              onClick={handleGoToZumenList}
              variant="secondary"
              className="w-full"
            >
              図面一覧へ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 