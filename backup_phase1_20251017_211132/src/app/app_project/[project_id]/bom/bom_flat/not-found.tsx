'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import NotFoundPage from '@src/components/NotFoundPage';

interface BomFlatNotFoundProps {
  params: {
    project_id: string;
  };
}

export default function BomFlatNotFound({ params }: BomFlatNotFoundProps) {
  const router = useRouter();

  const handleGoToBom = () => {
    router.push(`/app_project/${params.project_id}/bom`);
  };

  const handleGoToProject = () => {
    router.push(`/app_project/${params.project_id}`);
  };

  const handleGoBack = () => {
    router.back();
  };

  const icon = (
    <svg
      className="h-8 w-8"
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
  );

  return (
    <NotFoundPage
      title="BOMフラット機能 - 実装準備中"
      description="このBOMフラット機能は現在開発中です。しばらくお待ちください。"
      icon={icon}
      iconBgColor="bg-blue-100"
      iconColor="text-blue-600"
      projectId={params.project_id}
      primaryAction={{
        label: "BOM一覧へ",
        onClick: handleGoToBom
      }}
      secondaryAction={{
        label: "前のページに戻る",
        onClick: handleGoBack
      }}
      tertiaryAction={{
        label: "プロジェクト詳細へ",
        onClick: handleGoToProject
      }}
    />
  );
} 