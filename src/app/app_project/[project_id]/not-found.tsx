'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';
import { Button } from '@ui/button';

interface NotFoundProps {
  params: {
    project_id: string;
  };
}

export default function ProjectNotFound({ params }: NotFoundProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToProject = () => {
    router.push(`/app_project/${params.project_id}`);
  };

  const handleGoToProjectList = () => {
    router.push('/app_project');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            実装準備中
          </CardTitle>
          <CardDescription className="text-gray-600">
            このページは現在開発中です。しばらくお待ちください。
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
              onClick={handleGoToProjectList}
              variant="secondary"
              className="w-full"
            >
              プロジェクト一覧へ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 