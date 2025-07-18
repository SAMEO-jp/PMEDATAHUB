'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';
import { Button } from '@ui/button';

interface BomNotFoundProps {
  params: {
    project_id: string;
  };
}

export default function BomNotFound({ params }: BomNotFoundProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToProject = () => {
    router.push(`/app_project/${params.project_id}`);
  };

  const handleGoToBomList = () => {
    router.push(`/app_project/${params.project_id}/bom`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            BOM機能 - 実装準備中
          </CardTitle>
          <CardDescription className="text-gray-600">
            このBOM機能は現在開発中です。しばらくお待ちください。
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
              onClick={handleGoToBomList}
              variant="secondary"
              className="w-full"
            >
              BOM一覧へ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 