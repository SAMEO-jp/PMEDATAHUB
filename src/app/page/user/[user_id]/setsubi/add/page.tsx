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
  User,
  ChevronRight,
  Loader2,
  FolderPlus,
  Save
} from 'lucide-react';

interface UserSetsubiProjectSelectPageProps {
  params: {
    user_id: string;
  };
}

export default function UserSetsubiProjectSelectPage({ params }: UserSetsubiProjectSelectPageProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedSetsubi, setSelectedSetsubi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignedAt, setAssignedAt] = useState(new Date().toISOString().split('T')[0]);

  // 新規設備作成フォーム
  const [newSetsubiData, setNewSetsubiData] = useState({
    seiban: '',
    shohin_category: '',
    setsubi_name: '',
    parent_seiban: '',
    location_code: ''
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  // tRPC hooks
  const { data: userDetail, isLoading: userLoading } = trpc.user.getDetail.useQuery({
    user_id: params.user_id
  });

  // プロジェクト一覧取得
  const { data: projectList, isLoading: projectLoading } = trpc.project.getAll.useQuery();

  const { data: projectSetsubiList, isLoading: projectSetsubiLoading } = trpc.setsubi.getAllByProject.useQuery(
    { project_id: selectedProject },
    { enabled: !!selectedProject }
  );

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

  const utils = trpc.useUtils();

  const { mutate: createSetsubi } = trpc.setsubi.createMasterWithProject.useMutation({
    onSuccess: (data) => {
      // 新規作成した設備を自動選択
      setSelectedSetsubi(data.data?.id?.toString() || '');
      setIsDialogOpen(false);
      // 設備リストを再取得
      void utils.setsubi.getAllByProject.invalidate({ project_id: selectedProject });
      // フォームをリセット
      setNewSetsubiData({
        seiban: '',
        shohin_category: '',
        setsubi_name: '',
        parent_seiban: '',
        location_code: ''
      });
      // エラーをクリア
      setErrors({});
    },
    onError: (error) => {
      console.error('設備作成エラー:', error);
      setErrors({ general: '設備の作成に失敗しました' });
    }
  });

  // プロジェクトの設備一覧から選択可能な設備をフィルタリング（未担当のもののみ）
  const availableSetsubi = projectSetsubiList?.data?.filter(setsubi =>
    !userDetail?.data?.setsubi_assignments?.some(assignment => assignment.setsubi_id === setsubi.id)
  ) || [];

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setSelectedSetsubi(''); // プロジェクト変更時は選択をリセット
  };

  const handleSetsubiSelect = (setsubiId: string) => {
    setSelectedSetsubi(setsubiId);
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
    if (!newSetsubiData.shohin_category.trim()) {
      newErrors.shohin_category = '商品カテゴリは必須です';
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

    if (!selectedProject) {
      setErrors({ general: 'プロジェクトを選択してください' });
      return;
    }

    createSetsubi({
      project_id: selectedProject,
      seiban: newSetsubiData.seiban,
      shohin_category: newSetsubiData.shohin_category,
      setsubi_name: newSetsubiData.setsubi_name,
      parent_seiban: newSetsubiData.parent_seiban || undefined,
      location_code: newSetsubiData.location_code || undefined
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSetsubi) {
      setErrors({ setsubi: '設備を選択してください' });
      return;
    }

    setIsSubmitting(true);

    addSetsubiAssignment({
      project_id: selectedProject,
      setsubi_id: parseInt(selectedSetsubi),
      user_id: params.user_id,
      assigned_at: assignedAt
    });
  };

  const handleCancel = () => {
    router.push(`/page/user/${params.user_id}`);
  };

  // ローディング中
  if (userLoading || projectLoading || (selectedProject && projectSetsubiLoading)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
          <li className="text-gray-900 font-medium">設備担当追加</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.name_japanese} の設備担当割り当て</h1>
          <p className="text-gray-600 mt-1">プロジェクトと設備を選択して担当者を割り当てます</p>
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
                <Settings className="mr-2 h-5 w-5" />
                設備担当割り当て
              </div>
              {selectedProject && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FolderPlus className="mr-2 h-4 w-4" />
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
                        <Label htmlFor="shohin_category">商品カテゴリ <span className="text-red-500">*</span></Label>
                        <Select
                          value={newSetsubiData.shohin_category}
                          onValueChange={(value) => handleNewSetsubiInputChange('shohin_category', value)}
                        >
                          <SelectTrigger className={errors.shohin_category ? 'border-red-500' : ''}>
                            <SelectValue placeholder="商品カテゴリを選択してください" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="機械">機械</SelectItem>
                            <SelectItem value="電気">電気</SelectItem>
                            <SelectItem value="制御">制御</SelectItem>
                            <SelectItem value="その他">その他</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.shohin_category && (
                          <p className="text-sm text-red-500">{errors.shohin_category}</p>
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

            {/* 設備選択（プロジェクトが選択されている場合のみ表示） */}
            {selectedProject && (
              <div className="space-y-2">
                <Label htmlFor="setsubi" className="text-sm font-medium">
                  設備 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedSetsubi}
                  onValueChange={handleSetsubiSelect}
                >
                  <SelectTrigger className={errors.setsubi ? 'border-red-500' : ''}>
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
                {errors.setsubi && (
                  <p className="text-sm text-red-500">{errors.setsubi}</p>
                )}
              </div>
            )}

            {/* 担当開始日（プロジェクトと設備が選択されている場合のみ表示） */}
            {selectedProject && selectedSetsubi && (
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
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting || !selectedProject || !selectedSetsubi}
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
