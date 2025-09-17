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
  Package,
  Save,
  Loader2,
  User,
  ChevronRight,
  Calendar,
  Plus,
  FolderPlus
} from 'lucide-react';

interface UserKounyuSelectPageProps {
  params: {
    user_id: string;
    project_id: string;
  };
}

export default function UserKounyuSelectPage({ params }: UserKounyuSelectPageProps) {
  const router = useRouter();
  const [selectedKounyu, setSelectedKounyu] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 新規購入品作成フォーム
  const [newKounyuData, setNewKounyuData] = useState({
    management_number: '',
    item_name: '',
    contract_number: '',
    item_category: '',
    setsubi_seiban: '',
    responsible_department: '',
    drawing_number: '',
    display_order: 0,
    remarks: ''
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

  const { data: kounyuList, isLoading: kounyuLoading } = trpc.kounyu.getAllByProject.useQuery(
    { project_id: params.project_id },
    { enabled: !!params.project_id }
  );

  const { mutate: createKounyu } = trpc.kounyu.createMaster.useMutation({
    onSuccess: (data) => {
      // 新規作成した購入品を自動選択
      setSelectedKounyu(data.data?.id?.toString() || '');
      setIsDialogOpen(false);
      // 購入品リストを再取得
      // TODO: キャッシュを無効化して最新データを取得
    },
    onError: (error) => {
      console.error('購入品作成エラー:', error);
      setErrors({ general: '購入品の作成に失敗しました' });
    }
  });

  // プロジェクトの購入品一覧から選択可能なものをフィルタリング（未担当のもののみ）
  const availableKounyu = kounyuList?.data?.filter(kounyu =>
    !userDetail?.data?.kounyu_assignments?.some(assignment => assignment.kounyu_id === kounyu.id)
  ) || [];

  const handleKounyuSelect = (kounyuId: string) => {
    setSelectedKounyu(kounyuId);
  };

  const handleNext = () => {
    if (selectedKounyu) {
      router.push(`/page/user/${params.user_id}/kounyu/add/${params.project_id}/assign?kounyu_id=${selectedKounyu}`);
    }
  };

  const handleCancel = () => {
    router.push(`/page/user/${params.user_id}/kounyu/add`);
  };

  const handleNewKounyuInputChange = (field: keyof typeof newKounyuData, value: string | number) => {
    setNewKounyuData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateNewKounyuForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newKounyuData.management_number.trim()) {
      newErrors.management_number = '管理番号は必須です';
    }
    if (!newKounyuData.item_name.trim()) {
      newErrors.item_name = '購入品名は必須です';
    }
    if (!newKounyuData.item_category.trim()) {
      newErrors.item_category = '購入品種別は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateKounyu = () => {
    if (!validateNewKounyuForm()) {
      return;
    }

    createKounyu({
      project_id: params.project_id,
      management_number: newKounyuData.management_number,
      item_name: newKounyuData.item_name,
      contract_number: newKounyuData.contract_number || undefined,
      item_category: newKounyuData.item_category,
      setsubi_seiban: newKounyuData.setsubi_seiban || undefined,
      responsible_department: newKounyuData.responsible_department || undefined,
      drawing_number: newKounyuData.drawing_number || undefined,
      display_order: newKounyuData.display_order,
      remarks: newKounyuData.remarks || undefined
    });
  };

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
          <li className="text-gray-900 font-medium">{project.project_name}</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.name_japanese} の購入品担当割り当て</h1>
           <p className="text-gray-600 mt-1">プロジェクト「{project.project_name}」の購入品を選択してください</p>
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
              <Package className="mr-2 h-5 w-5" />
              購入品選択
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  新規購入品作成
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新規購入品作成</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="management_number">管理番号 <span className="text-red-500">*</span></Label>
                    <Input
                      id="management_number"
                      value={newKounyuData.management_number}
                      onChange={(e) => handleNewKounyuInputChange('management_number', e.target.value)}
                      className={errors.management_number ? 'border-red-500' : ''}
                      placeholder="管理番号を入力してください"
                    />
                    {errors.management_number && (
                      <p className="text-sm text-red-500">{errors.management_number}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item_name">購入品名 <span className="text-red-500">*</span></Label>
                    <Input
                      id="item_name"
                      value={newKounyuData.item_name}
                      onChange={(e) => handleNewKounyuInputChange('item_name', e.target.value)}
                      className={errors.item_name ? 'border-red-500' : ''}
                      placeholder="購入品名を入力してください"
                    />
                    {errors.item_name && (
                      <p className="text-sm text-red-500">{errors.item_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract_number">契約番号</Label>
                    <Input
                      id="contract_number"
                      value={newKounyuData.contract_number}
                      onChange={(e) => handleNewKounyuInputChange('contract_number', e.target.value)}
                      placeholder="契約番号を入力してください"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item_category">購入品種別 <span className="text-red-500">*</span></Label>
                    <Select
                      value={newKounyuData.item_category}
                      onValueChange={(value) => handleNewKounyuInputChange('item_category', value)}
                    >
                      <SelectTrigger className={errors.item_category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="購入品種別を選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="機械部品">機械部品</SelectItem>
                        <SelectItem value="電気部品">電気部品</SelectItem>
                        <SelectItem value="工具">工具</SelectItem>
                        <SelectItem value="消耗品">消耗品</SelectItem>
                        <SelectItem value="その他">その他</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.item_category && (
                      <p className="text-sm text-red-500">{errors.item_category}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setsubi_seiban">設備製番</Label>
                    <Input
                      id="setsubi_seiban"
                      value={newKounyuData.setsubi_seiban}
                      onChange={(e) => handleNewKounyuInputChange('setsubi_seiban', e.target.value)}
                      placeholder="設備製番を入力してください"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible_department">担当部署</Label>
                    <Input
                      id="responsible_department"
                      value={newKounyuData.responsible_department}
                      onChange={(e) => handleNewKounyuInputChange('responsible_department', e.target.value)}
                      placeholder="担当部署を入力してください"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drawing_number">図面番号</Label>
                    <Input
                      id="drawing_number"
                      value={newKounyuData.drawing_number}
                      onChange={(e) => handleNewKounyuInputChange('drawing_number', e.target.value)}
                      placeholder="図面番号を入力してください"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_order">表示順</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={newKounyuData.display_order}
                      onChange={(e) => handleNewKounyuInputChange('display_order', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remarks">備考</Label>
                    <Input
                      id="remarks"
                      value={newKounyuData.remarks}
                      onChange={(e) => handleNewKounyuInputChange('remarks', e.target.value)}
                      placeholder="備考を入力してください"
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
                      onClick={handleCreateKounyu}
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
          {/* 購入品選択 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              購入品 <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedKounyu}
              onValueChange={handleKounyuSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="担当させる購入品を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {availableKounyu.map((kounyu) => (
                  <SelectItem key={kounyu.id} value={kounyu.id.toString()}>
                    {kounyu.item_name} (管理番号: {kounyu.management_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableKounyu.length === 0 && (
              <p className="text-sm text-orange-600">担当可能な購入品がありません。新規購入品を作成してください。</p>
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
              className="bg-orange-600 hover:bg-orange-700"
              disabled={!selectedKounyu}
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
