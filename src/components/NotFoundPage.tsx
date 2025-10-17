'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';
import { Button } from '@ui/button';

interface NotFoundPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  projectId?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  tertiaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export default function NotFoundPage({
  title,
  description,
  icon,
  iconBgColor,
  iconColor,
  projectId,
  primaryAction,
  secondaryAction,
  tertiaryAction,
}: NotFoundPageProps) {
  const router = useRouter();

  const defaultGoBack = () => {
    router.back();
  };

  const defaultGoToProject = () => {
    if (projectId) {
      router.push(`/app_project/${projectId}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div 
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${iconBgColor}`}
          >
            <div className={iconColor}>
              {icon}
            </div>
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {projectId && (
            <div className="text-sm text-gray-500 text-center">
              プロジェクトID: {projectId}
            </div>
          )}
          <div className="flex flex-col space-y-2">
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                className="w-full"
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant="outline"
                className="w-full"
              >
                {secondaryAction.label}
              </Button>
            )}
            {tertiaryAction && (
              <Button
                onClick={tertiaryAction.onClick}
                variant="secondary"
                className="w-full"
              >
                {tertiaryAction.label}
              </Button>
            )}
            {!primaryAction && !secondaryAction && !tertiaryAction && (
              <>
                <Button
                  onClick={defaultGoBack}
                  variant="outline"
                  className="w-full"
                >
                  前のページに戻る
                </Button>
                {projectId && (
                  <Button
                    onClick={defaultGoToProject}
                    className="w-full"
                  >
                    プロジェクト詳細へ
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 