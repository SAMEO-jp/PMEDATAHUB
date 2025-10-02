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
  Calendar,
  Trash2
} from 'lucide-react';

interface UserProjectEditPageProps {
  params: {
    user_id: string;
    project_id: string;
  };
}

export default function UserProjectEditPage({ params }: UserProjectEditPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // フォームデータ
  const [formData, setFormData] = useState({
    role: '',
    joined_at: '',
    left_at: '',
    status: 'active'
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  // tRPC hooks
  const { data: userDetail, isLoading: userLoading } = trpc.user.getDetail.useQuery({
    user_id: params.user_id
  });

  // プロジェクト詳細取得
  const { data: projectDetail, isLoading: projectLoading } = trpc.project.getById.useQuery({
    project_id: params.project_id
  });

  const { mutate: updateProjectMember } = trpc.projectMember.update.useMutation({
    onSuccess: () => {
      router.push(`/page/user/${params.user_id}`);
    },
    onError: (error) => {
      console.error('プロジェクトメンバー更新エラー:', error);
      setErrors({ general: 'プロジェクトメンバーの更新に失敗しました' });
      setIsSubmitting(false);
    }
  });

  const { mutate: removeProjectMember } = trpc.projectMember.remove.useMutation({
    onSuccess: () => {
      router.push(`/page/user/${params.user_id}`);
    },
    onError: (error) => {
      console.error('プロジェクトメンバー削除エラー:', error);
      setErrors({ general: 'プロジェクトメンバーの削除に失敗しました' });
      setIsSubmitting(false);
    }
  });

  // ユーザーのプロジェクト情報を読み込み
  useEffect(() => {
    if (userDetail?.data && !userLoading) {
      const userProject = userDetail.data.projects?.find(p => p.project_id === params.project_id);
      if (userProject) {
        setFormData({
          role: userProject.role,
          joined_at: userProject.joined_at.split('T')[0], // 日付部分のみ
          left_at: (userProject as any).left_at ? (userProject as any).left_at.split('T')[0] : '',
          status: userProject.status === 'active' ? 'active' : 'inactive'
        });
        setIsLoading(false);
      } else {
        // プロジェクト参加情報が見つからない場合
        router.push(`/page/user/${params.user_id}`);
      }
    }
  }, [userDetail, userLoading, params.project_id, params.user_id, router]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.role.trim()) {
      newErrors.role = '役割を選択してください';
    }
    if (!formData.joined_at) {
      newErrors.joined_at = '参加日を入力してください';
    }

    // 離脱日が参加日より前でないかチェック
    if (formData.left_at && formData.joined_at && formData.left_at < formData.joined_at) {
      newErrors.left_at = '離脱日は参加日より後の日付を入力してください';
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

    updateProjectMember({
      project_id: params.project_id,
      user_id: params.user_id,
      data: {
        role: formData.role as "設計" | "製造" | "工事" | "プロマネ",
        joined_at: formData.joined_at,
        left_at: formData.left_at || undefined,
        status: formData.status
      }
    });
  };

  const handleRemove = async () => {
    if (!confirm('このユーザーをプロジェクトから削除しますか？\nこの操作は元に戻すことができません。')) {
      return;
    }

    setIsSubmitting(true);
    removeProjectMember({
      project_id: params.project_id,
      user_id: params.user_id
    });
  };

  const handleCancel = () => {
    router.push(`/page/user/${params.user_id}`);
  };

  // ローディング中
  if (isLoading || userLoading || projectLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // データが見つからない場合
  if (!userDetail?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-500">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">データが見つかりません</p>
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
  const project = { project_id: params.project_id, project_name: 'プロジェクト名' }; // ダミーデータ

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
          <li className="text-gray-900 font-medium">プロジェクト編集</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.name_japanese} のプロジェクト参加編集</h1>
          <p className="text-gray-600 mt-1">
             プロジェクト: {project.project_name} ({project.project_id})
          </p>
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
              プロジェクト参加情報編集
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  <SelectItem value="member">メンバー</SelectItem>
                  <SelectItem value="leader">リーダー</SelectItem>
                  <SelectItem value="manager">マネージャー</SelectItem>
                  <SelectItem value="viewer">閲覧者</SelectItem>
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

            {/* 離脱日 */}
            <div className="space-y-2">
              <Label htmlFor="left_at" className="text-sm font-medium">
                離脱日（任意）
              </Label>
              <Input
                id="left_at"
                type="date"
                value={formData.left_at}
                onChange={(e) => handleInputChange('left_at', e.target.value)}
                className={errors.left_at ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.left_at && (
                <p className="text-sm text-red-500">{errors.left_at}</p>
              )}
              <p className="text-xs text-gray-500">
                離脱日を設定すると、プロジェクトから離脱した扱いになります
              </p>
            </div>

            {/* ステータス */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                ステータス
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">アクティブ</SelectItem>
                  <SelectItem value="inactive">非アクティブ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemove}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                プロジェクトから削除
              </Button>

              <div className="space-x-4">
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      更新中...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      更新
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
