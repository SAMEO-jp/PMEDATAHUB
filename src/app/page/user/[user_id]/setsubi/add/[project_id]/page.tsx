'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from '@src/lib/trpc/client';
import {
  ArrowLeft,
  Settings,
  Save,
  Loader2,
  User,
  ChevronRight,
  Calendar,
  Plus,
  FolderPlus
} from 'lucide-react';

interface UserSetsubiSelectPageProps {
  params: {
    user_id: string;
    project_id: string;
  };
}

export default function UserSetsubiSelectPage({ params }: UserSetsubiSelectPageProps) {
  const router = useRouter();
  const [selectedSetsubi, setSelectedSetsubi] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 新規設備作成フォーム
  const [newSetsubiData, setNewSetsubiData] = useState({
    seiban: '',
    setsubi_name: '',
    shohin_category: '',
    parent_seiban: '',
    location_code: ''
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  // tRPC hooks
  const { data: userDetail, isLoading: userLoading } = trpc.user.getDetail.useQuery({
    user_id: params.user_id
  });

  const { data: projectDetail, isLoading: projectLoading } = trpc.project.getDetail.useQuery({
    project_id: params.project_id
  });

  const { data: setsubiList, isLoading: setsubiLoading } = trpc.setsubi.getAll.useQuery();

  const { mutate: addSetsubiAssignment } = trpc.setsubiAssignment.add.useMutation({
    onSuccess: () => {
      router.push(`/page/user/${params.user_id}`);
    },
    onError: (error) => {
      console.error('設備担当割り当てエラー:', error);
      setErrors({ general: '設備担当の割り当てに失敗しました' });
      setIsSubmitting(false);
    }
  });

  const { mutate: createSetsubi } = trpc.setsubi.createMaster.useMutation({
    onSuccess: (data) => {
      // 新規作成した設備を自動選択
      setSelectedSetsubi(data.data.id.toString());
      setIsDialogOpen(false);
      // 設備リストを再取得
      // TODO: キャッシュを無効化して最新データを取得
    },
    onError: (error) => {
      console.error('設備作成エラー:', error);
      setErrors({ general: '設備の作成に失敗しました' });
    }
  });

  // プロジェクトの設備一覧を取得（プロジェクト履歴を通じて関連付け）
  const { data: projectSetsubiList, isLoading: projectSetsubiLoading } = trpc.setsubi.getAllByProject.useQuery(
    { project_id: params.project_id },
    { enabled: !!params.project_id }
  );

  // プロジェクトの設備一覧から選択可能な設備をフィルタリング（未担当のもののみ）
  const availableSetsubi = projectSetsubiList?.data?.filter(setsubi =>
    !userDetail?.data?.setsubi_assignments?.some(assignment => assignment.setsubi_id === setsubi.id)
  ) || [];

  const handleSetsubiSelect = (setsubiId: string) => {
    setSelectedSetsubi(setsubiId);
  };

  const handleNext = () => {
    if (selectedSetsubi) {
      router.push(`/page/user/${params.user_id}/setsubi/add/${params.project_id}/assign?setsubi_id=${selectedSetsubi}`);
    }
  };

  const handleCancel = () => {
    router.push(`/page/user/${params.user_id}/setsubi/add`);
  };

  const handleNewSetsubiInputChange = (field: keyof typeof newSetsubiData, value: string) => {
    setNewSetsubiData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateNewSetsubiForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newSetsubiData.seiban.trim()) {
      newErrors.seiban = '製番は必須です';
    }
    if (!newSetsubiData.setsubi_name.trim()) {
      newErrors.setsubi_name = '設備名は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSetsubi = () => {
    if (!validateNewSetsubiForm()) {
      return;
    }

    createSetsubi({
      seiban: newSetsubiData.seiban,
      setsubi_name: newSetsubiData.setsubi_name,
      shohin_category: newSetsubiData.shohin_category || undefined,
      parent_seiban: newSetsubiData.parent_seiban || undefined,
      location_code: newSetsubiData.location_code || undefined
    });
  };

  // ローディング中
  if (userLoading || projectLoading || setsubiLoading || projectSetsubiLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  // データが見つからない場合
  if (!userDetail?.data || !projectDetail?.data) {
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
  const project = projectDetail.data;

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
              onClick={() => router.push(`/page/user/${params.user_id}/setsubi/add`)}
              className="hover:text-blue-600 transition-colors"
            >
              設備担当追加
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-gray-900 font-medium">{project.PROJECT_NAME}</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.name_japanese} の設備担当割り当て</h1>
          <p className="text-gray-600 mt-1">プロジェクト「{project.PROJECT_NAME}」の設備を選択してください</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={handleCancel}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            プロジェクト選択に戻る
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              設備選択
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  新規設備作成
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新規設備作成</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seiban">製番 <span className="text-red-500">*</span></Label>
                    <Input
                      id="seiban"
                      value={newSetsubiData.seiban}
                      onChange={(e) => handleNewSetsubiInputChange('seiban', e.target.value)}
                      className={errors.seiban ? 'border-red-500' : ''}
                      placeholder="製番を入力してください"
                    />
                    {errors.seiban && (
                      <p className="text-sm text-red-500">{errors.seiban}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setsubi_name">設備名 <span className="text-red-500">*</span></Label>
                    <Input
                      id="setsubi_name"
                      value={newSetsubiData.setsubi_name}
                      onChange={(e) => handleNewSetsubiInputChange('setsubi_name', e.target.value)}
                      className={errors.setsubi_name ? 'border-red-500' : ''}
                      placeholder="設備名を入力してください"
                    />
                    {errors.setsubi_name && (
                      <p className="text-sm text-red-500">{errors.setsubi_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shohin_category">商品区分</Label>
                    <Input
                      id="shohin_category"
                      value={newSetsubiData.shohin_category}
                      onChange={(e) => handleNewSetsubiInputChange('shohin_category', e.target.value)}
                      placeholder="商品区分を入力してください"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent_seiban">親製番</Label>
                    <Input
                      id="parent_seiban"
                      value={newSetsubiData.parent_seiban}
                      onChange={(e) => handleNewSetsubiInputChange('parent_seiban', e.target.value)}
                      placeholder="親製番を入力してください"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location_code">場所コード</Label>
                    <Input
                      id="location_code"
                      value={newSetsubiData.location_code}
                      onChange={(e) => handleNewSetsubiInputChange('location_code', e.target.value)}
                      placeholder="場所コードを入力してください"
                    />
                  </div>
                  {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      キャンセル
                    </Button>
                    <Button
                      onClick={handleCreateSetsubi}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <FolderPlus className="mr-2 h-4 w-4" />
                      作成
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 設備選択 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              設備 <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedSetsubi}
              onValueChange={handleSetsubiSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="担当させる設備を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {availableSetsubi.map((setsubi) => (
                  <SelectItem key={setsubi.id} value={setsubi.id.toString()}>
                    {setsubi.setsubi_name} (製番: {setsubi.seiban})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableSetsubi.length === 0 && (
              <p className="text-sm text-orange-600">担当可能な設備がありません。新規設備を作成してください。</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
            <Button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700"
              disabled={!selectedSetsubi}
            >
              次へ
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
