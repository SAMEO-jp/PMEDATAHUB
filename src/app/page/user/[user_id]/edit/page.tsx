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
  Settings,
  Save,
  Loader2,
  User,
  ChevronRight
} from 'lucide-react';
import { User as UserType } from '@src/types/user';

interface UserEditPageProps {
  params: {
    user_id: string;
  };
}

export default function UserEditPage({ params }: UserEditPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // フォームデータ
  const [formData, setFormData] = useState({
    user_id: '',
    name_japanese: '',
    TEL: '',
    mail: '',
    bumon: '',
    sitsu: '',
    ka: '',
    in_year: '',
    Kengen: ''
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  // tRPC hooks
  const { data: userDetail, isLoading: userLoading } = trpc.user.getDetail.useQuery({
    user_id: params.user_id
  });

  const { mutate: updateUser } = trpc.user.update.useMutation({
    onSuccess: () => {
      router.push(`/page/user/${params.user_id}`);
    },
    onError: (error) => {
      console.error('ユーザー更新エラー:', error);
      setErrors({ general: 'ユーザーの更新に失敗しました' });
      setIsSubmitting(false);
    }
  });

  // ユーザーデータの読み込み
  useEffect(() => {
    if (userDetail?.data && !userLoading) {
      const user = userDetail.data;
      setFormData({
        user_id: user.user_id,
        name_japanese: user.name_japanese,
        TEL: user.TEL || '',
        mail: user.mail || '',
        bumon: user.bumon || '',
        sitsu: user.sitsu || '',
        ka: user.ka || '',
        in_year: user.in_year || '',
        Kengen: user.Kengen || ''
      });
      setIsLoading(false);
    }
  }, [userDetail, userLoading]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id.trim()) {
      newErrors.user_id = '社員番号は必須です';
    }
    if (!formData.name_japanese.trim()) {
      newErrors.name_japanese = '名前は必須です';
    }
    if (formData.mail && !formData.mail.includes('@')) {
      newErrors.mail = '有効なメールアドレスを入力してください';
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

    // フォームデータをAPIに適した形式に変換
    const submitData = {
      user_id: formData.user_id,
      name_japanese: formData.name_japanese,
      TEL: formData.TEL || undefined,
      mail: formData.mail || undefined,
      bumon: formData.bumon || undefined,
      sitsu: formData.sitsu || undefined,
      ka: formData.ka || undefined,
      in_year: formData.in_year || undefined,
      Kengen: formData.Kengen || undefined
    };

    updateUser({
      user_id: params.user_id,
      data: submitData
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
              {formData.name_japanese}
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-gray-900 font-medium">編集</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{formData.name_japanese} の編集</h1>
          <p className="text-gray-600 mt-1">社員番号: {formData.user_id}</p>
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
              <Settings className="mr-2 h-5 w-5" />
              ユーザー情報編集
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 必須フィールド */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="user_id" className="text-sm font-medium">
                  社員番号 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="user_id"
                  type="text"
                  value={formData.user_id}
                  onChange={(e) => handleInputChange('user_id', e.target.value)}
                  placeholder="例: EMP001"
                  className={errors.user_id ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.user_id && (
                  <p className="text-sm text-red-500">{errors.user_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_japanese" className="text-sm font-medium">
                  名前 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name_japanese"
                  type="text"
                  value={formData.name_japanese}
                  onChange={(e) => handleInputChange('name_japanese', e.target.value)}
                  placeholder="例: 山田太郎"
                  className={errors.name_japanese ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.name_japanese && (
                  <p className="text-sm text-red-500">{errors.name_japanese}</p>
                )}
              </div>
            </div>

            {/* 連絡先情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="TEL" className="text-sm font-medium">
                  電話番号
                </Label>
                <Input
                  id="TEL"
                  type="tel"
                  value={formData.TEL}
                  onChange={(e) => handleInputChange('TEL', e.target.value)}
                  placeholder="例: 03-1234-5678"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mail" className="text-sm font-medium">
                  メールアドレス
                </Label>
                <Input
                  id="mail"
                  type="email"
                  value={formData.mail}
                  onChange={(e) => handleInputChange('mail', e.target.value)}
                  placeholder="例: user@company.com"
                  className={errors.mail ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.mail && (
                  <p className="text-sm text-red-500">{errors.mail}</p>
                )}
              </div>
            </div>

            {/* 組織情報 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bumon" className="text-sm font-medium">
                  部署
                </Label>
                <Input
                  id="bumon"
                  type="text"
                  value={formData.bumon}
                  onChange={(e) => handleInputChange('bumon', e.target.value)}
                  placeholder="例: 技術部"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sitsu" className="text-sm font-medium">
                  室
                </Label>
                <Input
                  id="sitsu"
                  type="text"
                  value={formData.sitsu}
                  onChange={(e) => handleInputChange('sitsu', e.target.value)}
                  placeholder="例: 開発室"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ka" className="text-sm font-medium">
                  課
                </Label>
                <Input
                  id="ka"
                  type="text"
                  value={formData.ka}
                  onChange={(e) => handleInputChange('ka', e.target.value)}
                  placeholder="例: 第一課"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* その他の情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="in_year" className="text-sm font-medium">
                  入社年
                </Label>
                <Input
                  id="in_year"
                  type="text"
                  value={formData.in_year}
                  onChange={(e) => handleInputChange('in_year', e.target.value)}
                  placeholder="例: 2023"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Kengen" className="text-sm font-medium">
                  役職
                </Label>
                <Select
                  value={formData.Kengen}
                  onValueChange={(value) => handleInputChange('Kengen', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="役職を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="部長">部長</SelectItem>
                    <SelectItem value="課長">課長</SelectItem>
                    <SelectItem value="主任">主任</SelectItem>
                    <SelectItem value="一般">一般</SelectItem>
                    <SelectItem value="アルバイト">アルバイト</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
