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
  Package,
  Save,
  Loader2,
  User,
  ChevronRight,
  Calendar,
  Trash2
} from 'lucide-react';

interface UserKounyuEditPageProps {
  params: {
    user_id: string;
    assignment_id: string;
  };
}

export default function UserKounyuEditPage({ params }: UserKounyuEditPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // フォームデータ
  const [formData, setFormData] = useState({
    assigned_at: '',
    status: 'active'
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  // tRPC hooks
  const { data: userDetail, isLoading: userLoading } = trpc.user.getDetail.useQuery({
    user_id: params.user_id
  });

  const { mutate: updateKounyuAssignment } = trpc.kounyuAssignment.update.useMutation({
    onSuccess: () => {
      router.push(`/page/user/${params.user_id}`);
    },
    onError: (error) => {
      console.error('購入品担当更新エラー:', error);
      setErrors({ general: '購入品担当の更新に失敗しました' });
      setIsSubmitting(false);
    }
  });

  const { mutate: removeKounyuAssignment } = trpc.kounyuAssignment.remove.useMutation({
    onSuccess: () => {
      router.push(`/page/user/${params.user_id}`);
    },
    onError: (error) => {
      console.error('購入品担当削除エラー:', error);
      setErrors({ general: '購入品担当の削除に失敗しました' });
      setIsSubmitting(false);
    }
  });

  // ユーザーの購入品担当情報を読み込み
  useEffect(() => {
    if (userDetail?.data && !userLoading) {
      const assignment = userDetail.data.kounyu_assignments?.find(a => a.id === parseInt(params.assignment_id));
      if (assignment) {
        setFormData({
          assigned_at: assignment.assigned_at.split('T')[0], // 日付部分のみ
          status: assignment.status
        });
        setIsLoading(false);
      } else {
        // 購入品担当情報が見つからない場合
        router.push(`/page/user/${params.user_id}`);
      }
    }
  }, [userDetail, userLoading, params.assignment_id, params.user_id, router]);

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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    updateKounyuAssignment({
      assignment_id: parseInt(params.assignment_id),
      assigned_at: formData.assigned_at,
      status: formData.status
    });
  };

  const handleRemove = async () => {
    if (!confirm('この購入品の担当者を解除しますか？\nこの操作は元に戻すことができません。')) {
      return;
    }

    setIsSubmitting(true);
    removeKounyuAssignment({
      assignment_id: parseInt(params.assignment_id)
    });
  };

  const handleCancel = () => {
    router.push(`/page/user/${params.user_id}`);
  };

  // ローディング中
  if (isLoading || userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
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
  const assignment = user.kounyu_assignments?.find(a => a.id === parseInt(params.assignment_id));

  if (!assignment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-500">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">購入品担当情報が見つかりません</p>
          <Button
            onClick={() => router.push(`/page/user/${params.user_id}`)}
            className="mt-4"
          >
            詳細に戻る
          </Button>
        </div>
      </div>
    );
  }

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
          <li className="text-gray-900 font-medium">購入品担当編集</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.name_japanese} の購入品担当編集</h1>
          <p className="text-gray-600 mt-1">
            購入品: {assignment.item_name} (管理番号: {assignment.management_number})
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
              <Package className="mr-2 h-5 w-5" />
              購入品担当情報編集
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {/* 購入品情報（読み取り専用） */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">購入品情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">購入品名</Label>
                  <p className="text-sm font-medium">{assignment.item_name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">管理番号</Label>
                  <p className="text-sm font-medium">{assignment.management_number}</p>
                </div>
              </div>
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
                担当者を解除
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
                  className="bg-orange-600 hover:bg-orange-700"
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
