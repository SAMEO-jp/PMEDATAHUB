'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from '@src/lib/trpc/client';
import {
  ArrowLeft,
  Package,
  Save,
  Loader2,
  User,
  ChevronRight,
  Calendar
} from 'lucide-react';

interface UserKounyuAssignPageProps {
  params: {
    user_id: string;
    project_id: string;
  };
}

export default function UserKounyuAssignPage({ params }: UserKounyuAssignPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kounyuId = searchParams.get('kounyu_id');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    assigned_at: new Date().toISOString().split('T')[0] // 今日の日付をデフォルト
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  // tRPC hooks
  const { data: userDetail, isLoading: userLoading } = trpc.user.getDetail.useQuery({
    user_id: params.user_id
  });

  // TODO: プロジェクト情報取得の実装が必要
  // const { data: projectDetail, isLoading: projectLoading } = trpc.sql.executeQuery.useQuery({
  //   query: 'SELECT * FROM projects WHERE project_id = ?',
  //   params: [params.project_id]
  // });
  const projectDetail = null;
  const projectLoading = false;

  const { data: kounyuDetail, isLoading: kounyuLoading } = trpc.kounyu.getDetail.useQuery(
    { kounyu_id: parseInt(kounyuId || '0') },
    { enabled: !!kounyuId }
  );

  const { mutate: addKounyuAssignment } = trpc.kounyuAssignment.add.useMutation({
    onSuccess: () => {
      router.push(`/page/user/${params.user_id}`);
    },
    onError: (error) => {
      console.error('購入品担当割り当てエラー:', error);
      setErrors({ general: '購入品担当の割り当てに失敗しました' });
      setIsSubmitting(false);
    }
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.assigned_at) {
      newErrors.assigned_at = '担当開始日を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !kounyuId) {
      return;
    }

    setIsSubmitting(true);

    addKounyuAssignment({
      project_id: params.project_id,
      kounyu_id: parseInt(kounyuId),
      user_id: params.user_id,
      assigned_at: formData.assigned_at
    });
  };

  const handleCancel = () => {
    router.push(`/page/user/${params.user_id}/kounyu/add/${params.project_id}`);
  };

  // kounyuIdがない場合はエラー
  useEffect(() => {
    if (!kounyuId) {
      router.push(`/page/user/${params.user_id}/kounyu/add/${params.project_id}`);
    }
  }, [kounyuId, router, params.user_id, params.project_id]);

  // ローディング中
  if (userLoading || projectLoading || kounyuLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  // データが見つからない場合
  if (!userDetail?.data || !kounyuDetail?.data) {
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
  const kounyu = kounyuDetail.data;

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
          <li>
            <button
              onClick={() => router.push(`/page/user/${params.user_id}/kounyu/add`)}
              className="hover:text-blue-600 transition-colors"
            >
              購入品担当追加
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push(`/page/user/${params.user_id}/kounyu/add/${params.project_id}`)}
              className="hover:text-blue-600 transition-colors"
            >
              {project.project_name}
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-gray-900 font-medium">{kounyu.item_name}</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.name_japanese} の購入品担当割り当て</h1>
          <p className="text-gray-600 mt-1">
             プロジェクト「{project.project_name}」の購入品「{kounyu.item_name}」を担当者に設定します
          </p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={handleCancel}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            購入品選択に戻る
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              担当割り当て情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* プロジェクト情報表示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
              <div>
                <label className="text-sm font-medium text-gray-600">プロジェクト</label>
                <p className="text-sm">{project.project_name} ({project.project_id})</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">購入品</label>
                <p className="text-sm">{kounyu.item_name} (管理番号: {kounyu.management_number})</p>
              </div>
            </div>

            {/* 担当開始日 */}
            <div className="space-y-2">
              <Label htmlFor="assigned_at" className="text-sm font-medium">
                担当開始日 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assigned_at"
                type="date"
                value={formData.assigned_at}
                onChange={(e) => handleInputChange('assigned_at', e.target.value)}
                className={errors.assigned_at ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.assigned_at && (
                <p className="text-sm text-red-500">{errors.assigned_at}</p>
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
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    割り当て中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    担当者に設定
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
