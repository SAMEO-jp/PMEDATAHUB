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
  User,
  ChevronRight,
  Loader2,
  FolderPlus,
  Save
} from 'lucide-react';

interface UserKounyuProjectSelectPageProps {
  params: {
    user_id: string;
  };
}

export default function UserKounyuProjectSelectPage({ params }: UserKounyuProjectSelectPageProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedKounyu, setSelectedKounyu] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignedAt, setAssignedAt] = useState(new Date().toISOString().split('T')[0]);

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

  // TODO: プロジェクトリスト取得の実装が必要
  // const { data: projectList, isLoading: projectLoading } = trpc.project.getAll.useQuery();
  const projectList = { data: [] };
  const projectLoading = false;

  const { data: projectKounyuList, isLoading: projectKounyuLoading } = trpc.kounyu.getAllByProject.useQuery(
    { project_id: selectedProject },
    { enabled: !!selectedProject }
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

  const utils = trpc.useUtils();

  const { mutate: createKounyu } = trpc.kounyu.createMaster.useMutation({
    onSuccess: (data) => {
      // 新規作成した購入品を自動選択
      setSelectedKounyu(data.data?.id?.toString() || '');
      setIsDialogOpen(false);
      // 購入品リストを再取得
      void utils.kounyu.getAllByProject.invalidate({ project_id: selectedProject });
      // フォームをリセット
      setNewKounyuData({
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
      // エラーをクリア
      setErrors({});
    },
    onError: (error) => {
      console.error('購入品作成エラー:', error);
      setErrors({ general: '購入品の作成に失敗しました' });
    }
  });

  // プロジェクトの購入品一覧から選択可能なものをフィルタリング（未担当のもののみ）
  const availableKounyu = projectKounyuList?.data?.filter(kounyu =>
    !userDetail?.data?.kounyu_assignments?.some(assignment => assignment.kounyu_id === kounyu.id)
  ) || [];

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setSelectedKounyu(''); // プロジェクト変更時は選択をリセット
  };

  const handleKounyuSelect = (kounyuId: string) => {
    setSelectedKounyu(kounyuId);
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
      project_id: selectedProject,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedKounyu) {
      setErrors({ kounyu: '購入品を選択してください' });
      return;
    }

    setIsSubmitting(true);

    addKounyuAssignment({
      project_id: selectedProject,
      kounyu_id: parseInt(selectedKounyu),
      user_id: params.user_id,
      assigned_at: assignedAt
    });
  };

  const handleCancel = () => {
    router.push(`/page/user/${params.user_id}`);
  };

  // ローディング中
  if (userLoading || projectLoading || (selectedProject && projectKounyuLoading)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
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
  const availableProjects = projectList?.data || [];

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
          <li className="text-gray-900 font-medium">購入品担当追加</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.name_japanese} の購入品担当割り当て</h1>
          <p className="text-gray-600 mt-1">プロジェクトと購入品を選択して担当者を割り当てます</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={handleCancel}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            詳細に戻る
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                購入品担当割り当て
              </div>
              {selectedProject && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FolderPlus className="mr-2 h-4 w-4" />
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
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* プロジェクト選択 */}
            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-medium">
                プロジェクト <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedProject}
                onValueChange={handleProjectSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="担当させるプロジェクトを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.map((project: any) => (
                    <SelectItem key={project.PROJECT_ID} value={project.PROJECT_ID}>
                      {project.PROJECT_NAME} ({project.PROJECT_ID})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableProjects.length === 0 && (
                <p className="text-sm text-orange-600">利用可能なプロジェクトがありません</p>
              )}
            </div>

            {/* 購入品選択（プロジェクトが選択されている場合のみ表示） */}
            {selectedProject && (
              <div className="space-y-2">
                <Label htmlFor="kounyu" className="text-sm font-medium">
                  購入品 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedKounyu}
                  onValueChange={handleKounyuSelect}
                >
                  <SelectTrigger className={errors.kounyu ? 'border-red-500' : ''}>
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
                {errors.kounyu && (
                  <p className="text-sm text-red-500">{errors.kounyu}</p>
                )}
              </div>
            )}

            {/* 担当開始日（プロジェクトと購入品が選択されている場合のみ表示） */}
            {selectedProject && selectedKounyu && (
              <div className="space-y-2">
                <Label htmlFor="assigned_at" className="text-sm font-medium">
                  担当開始日 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="assigned_at"
                  type="date"
                  value={assignedAt}
                  onChange={(e) => setAssignedAt(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            )}

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
                キャンセル
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
                disabled={isSubmitting || !selectedProject || !selectedKounyu}
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
