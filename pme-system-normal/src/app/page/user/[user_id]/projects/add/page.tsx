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
  Users,
  Save,
  Loader2,
  User,
  ChevronRight,
  Calendar,
  FolderPlus
} from 'lucide-react';

interface UserProjectAddPageProps {
  params: {
    user_id: string;
  };
}

export default function UserProjectAddPage({ params }: UserProjectAddPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // フォームデータ
  const [formData, setFormData] = useState({
    project_id: '',
    role: '閲覧者',
    joined_at: new Date().toISOString().split('T')[0] // 今日の日付をデフォルト
  });

  // 新規プロジェクト作成フォーム
  const [newProjectData, setNewProjectData] = useState({
    PROJECT_ID: '',
    PROJECT_NAME: '',
    PROJECT_STATUS: 'active' as 'active' | 'completed' | 'archived',
    PROJECT_CLIENT_NAME: '',
    PROJECT_START_DATE: '',
    PROJECT_START_ENDDATE: '',
    PROJECT_DESCRIPTION: ''
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<Record<string, string>>({});

  // tRPC hooks
  const { data: userDetail, isLoading: userLoading } = trpc.user.getDetail.useQuery({
    user_id: params.user_id
  });

  // プロジェクト一覧取得
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

  const utils = trpc.useUtils();

  const { mutate: createProject } = trpc.project.create.useMutation({
    onSuccess: (data) => {
      // 新規作成したプロジェクトを自動選択
      setFormData(prev => ({ ...prev, project_id: data.data?.PROJECT_ID || '' }));
      setIsDialogOpen(false);
      // プロジェクトリストを再取得
      void utils.project.getAll.invalidate();
      // フォームをリセット
      setNewProjectData({
        PROJECT_ID: '',
        PROJECT_NAME: '',
        PROJECT_STATUS: 'active',
        PROJECT_CLIENT_NAME: '',
        PROJECT_START_DATE: '',
        PROJECT_START_ENDDATE: '',
        PROJECT_DESCRIPTION: ''
      });
      // エラーをクリア
      setErrors({});
    },
    onError: (error) => {
      console.error('プロジェクト作成エラー:', error);
      setErrors({ general: 'プロジェクトの作成に失敗しました' });
    }
  });

  // プロジェクト一覧から選択可能なプロジェクトをフィルタリング（未参加のもののみ）
  const availableProjects = (projectList?.data as any[])?.filter((project: any) =>
    !userDetail?.data?.projects?.some(userProject => userProject.project_id === project.PROJECT_ID)
  ) || [];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNewProjectInputChange = (field: keyof typeof newProjectData, value: string) => {
    setNewProjectData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateNewProjectForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newProjectData.PROJECT_ID.trim()) {
      newErrors.PROJECT_ID = 'プロジェクトIDは必須です';
    }
    if (!newProjectData.PROJECT_NAME.trim()) {
      newErrors.PROJECT_NAME = 'プロジェクト名は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProject = () => {
    if (!validateNewProjectForm()) {
      return;
    }

    createProject({
      PROJECT_ID: newProjectData.PROJECT_ID,
      PROJECT_NAME: newProjectData.PROJECT_NAME,
      PROJECT_STATUS: newProjectData.PROJECT_STATUS,
      PROJECT_CLIENT_NAME: newProjectData.PROJECT_CLIENT_NAME || undefined,
      PROJECT_START_DATE: newProjectData.PROJECT_START_DATE || undefined,
      PROJECT_START_ENDDATE: newProjectData.PROJECT_START_ENDDATE || undefined,
      PROJECT_DESCRIPTION: newProjectData.PROJECT_DESCRIPTION || undefined
    });
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
      role: formData.role as "設計" | "製造" | "工事" | "プロマネ",
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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                プロジェクト参加情報
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    新規プロジェクト作成
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新規プロジェクト作成</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="PROJECT_ID">プロジェクトID <span className="text-red-500">*</span></Label>
                      <Input
                        id="PROJECT_ID"
                        value={newProjectData.PROJECT_ID}
                        onChange={(e) => handleNewProjectInputChange('PROJECT_ID', e.target.value)}
                        className={errors.PROJECT_ID ? 'border-red-500' : ''}
                        placeholder="プロジェクトIDを入力してください"
                      />
                      {errors.PROJECT_ID && (
                        <p className="text-sm text-red-500">{errors.PROJECT_ID}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="PROJECT_NAME">プロジェクト名 <span className="text-red-500">*</span></Label>
                      <Input
                        id="PROJECT_NAME"
                        value={newProjectData.PROJECT_NAME}
                        onChange={(e) => handleNewProjectInputChange('PROJECT_NAME', e.target.value)}
                        className={errors.PROJECT_NAME ? 'border-red-500' : ''}
                        placeholder="プロジェクト名を入力してください"
                      />
                      {errors.PROJECT_NAME && (
                        <p className="text-sm text-red-500">{errors.PROJECT_NAME}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="PROJECT_STATUS">ステータス</Label>
                      <Select
                        value={newProjectData.PROJECT_STATUS}
                        onValueChange={(value) => handleNewProjectInputChange('PROJECT_STATUS', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="ステータスを選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">進行中</SelectItem>
                          <SelectItem value="completed">完了</SelectItem>
                          <SelectItem value="archived">アーカイブ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="PROJECT_CLIENT_NAME">クライアント名</Label>
                      <Input
                        id="PROJECT_CLIENT_NAME"
                        value={newProjectData.PROJECT_CLIENT_NAME}
                        onChange={(e) => handleNewProjectInputChange('PROJECT_CLIENT_NAME', e.target.value)}
                        placeholder="クライアント名を入力してください"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="PROJECT_START_DATE">開始日</Label>
                      <Input
                        id="PROJECT_START_DATE"
                        type="date"
                        value={newProjectData.PROJECT_START_DATE}
                        onChange={(e) => handleNewProjectInputChange('PROJECT_START_DATE', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="PROJECT_START_ENDDATE">終了日</Label>
                      <Input
                        id="PROJECT_START_ENDDATE"
                        type="date"
                        value={newProjectData.PROJECT_START_ENDDATE}
                        onChange={(e) => handleNewProjectInputChange('PROJECT_START_ENDDATE', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="PROJECT_DESCRIPTION">説明</Label>
                      <Input
                        id="PROJECT_DESCRIPTION"
                        value={newProjectData.PROJECT_DESCRIPTION}
                        onChange={(e) => handleNewProjectInputChange('PROJECT_DESCRIPTION', e.target.value)}
                        placeholder="プロジェクトの説明を入力してください"
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
                        onClick={handleCreateProject}
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
                <p className="text-sm text-orange-600">参加可能なプロジェクトがありません。新規プロジェクトを作成してください。</p>
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
