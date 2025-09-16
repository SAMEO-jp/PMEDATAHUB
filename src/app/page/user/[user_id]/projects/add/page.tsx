'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from '@src/lib/trpc/client';
import {
  ArrowLeft,
  Users,
  Save,
  Loader2,
  User,
  ChevronRight,
  Calendar
} from 'lucide-react';

interface UserProjectAddPageProps {
  params: {
    user_id: string;
  };
}

export default function UserProjectAddPage({ params }: UserProjectAddPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォームデータ
  const [formData, setFormData] = useState({
    project_id: '',
    role: '閲覧者',
    joined_at: new Date().toISOString().split('T')[0] // 今日の日付をデフォルト
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  // tRPC hooks
  const { data: userDetail, isLoading: userLoading } = trpc.user.getDetail.useQuery({
    user_id: params.user_id
  });

  const { data: projectList, isLoading: projectLoading } = trpc.project.getAll.useQuery();

  const { mutate: addProjectMember } = trpc.projectMember.add.useMutation({
    onSuccess: () => {
      router.push(`/page/user/${params.user_id}`);
    },
    onError: (error) => {
      console.error('プロジェクトメンバー追加エラー:', error);
      setErrors({ general: 'プロジェクトメンバーの追加に失敗しました' });
      setIsSubmitting(false);
    }
  });

  // プロジェクト一覧から選択可能なプロジェクトをフィルタリング（未参加のもののみ）
  const availableProjects = projectList?.data?.filter(project =>
    !userDetail?.data?.projects?.some(userProject => userProject.project_id === project.PROJECT_ID)
  ) || [];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.project_id.trim()) {
      newErrors.project_id = 'プロジェクトを選択してください';
    }
    if (!formData.role.trim()) {
      newErrors.role = '役割を選択してください';
    }
    if (!formData.joined_at) {
      newErrors.joined_at = '参加日を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    addProjectMember({
      project_id: formData.project_id,
      user_id: params.user_id,
      role: formData.role,
      joined_at: formData.joined_at
    });
  };

  const handleCancel = () => {
    router.push(`/page/user/${params.user_id}`);
  };

  // ローディング中
  if (userLoading || projectLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // ユーザーが見つからない場合
  if (!userDetail?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-500">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">ユーザーが見つかりません</p>
          <Button
            onClick={() => router.push('/page/user')}
            className="mt-4"
          >
            一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  const user = userDetail.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <button
              onClick={() => router.push('/')}
              className="hover:text-blue-600 transition-colors"
            >
              ホーム
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push('/page/user')}
              className="hover:text-blue-600 transition-colors"
            >
              ユーザー一覧
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push(`/page/user/${params.user_id}`)}
              className="hover:text-blue-600 transition-colors"
            >
              {user.name_japanese}
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-gray-900 font-medium">プロジェクト参加追加</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.name_japanese} のプロジェクト参加</h1>
          <p className="text-gray-600 mt-1">ユーザーをプロジェクトのメンバーに追加します</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            詳細に戻る
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              プロジェクト参加情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* プロジェクト選択 */}
            <div className="space-y-2">
              <Label htmlFor="project_id" className="text-sm font-medium">
                プロジェクト <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) => handleInputChange('project_id', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.project_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="プロジェクトを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.map((project) => (
                    <SelectItem key={project.PROJECT_ID} value={project.PROJECT_ID}>
                      {project.PROJECT_NAME} ({project.PROJECT_ID})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project_id && (
                <p className="text-sm text-red-500">{errors.project_id}</p>
              )}
              {availableProjects.length === 0 && (
                <p className="text-sm text-orange-600">参加可能なプロジェクトがありません</p>
              )}
            </div>

            {/* 役割選択 */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                役割 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                  <SelectValue placeholder="役割を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PM">PM</SelectItem>
                  <SelectItem value="開発者">開発者</SelectItem>
                  <SelectItem value="設計者">設計者</SelectItem>
                  <SelectItem value="テスター">テスター</SelectItem>
                  <SelectItem value="閲覧者">閲覧者</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* 参加日 */}
            <div className="space-y-2">
              <Label htmlFor="joined_at" className="text-sm font-medium">
                参加日 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="joined_at"
                type="date"
                value={formData.joined_at}
                onChange={(e) => handleInputChange('joined_at', e.target.value)}
                className={errors.joined_at ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.joined_at && (
                <p className="text-sm text-red-500">{errors.joined_at}</p>
              )}
            </div>

            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || availableProjects.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    追加中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    参加させる
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
