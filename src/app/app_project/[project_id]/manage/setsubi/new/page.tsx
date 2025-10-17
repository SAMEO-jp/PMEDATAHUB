'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from '@src/lib/trpc/client';
import { ArrowLeft, Save, ChevronRight } from 'lucide-react';

interface NewSetsubiPageProps {
  params: {
    project_id: string;
  };
}

export default function NewSetsubiPage({ params }: NewSetsubiPageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    seiban: '',
    shohin_category: '',
    setsubi_name: '',
    parent_seiban: '',
    location_code: '',
  });

  const createMutation = trpc.setsubi.createMaster.useMutation();
  const registerMutation = trpc.setsubi.registerToProject.useMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!formData.seiban.trim()) {
      alert('製番は必須です');
      return;
    }

    if (!formData.setsubi_name.trim()) {
      alert('設備名は必須です');
      return;
    }

    // 製番の形式チェック（例: SEIBAN-XXX形式）
    if (!/^SEIBAN-\d{3,}$/.test(formData.seiban)) {
      alert('製番は「SEIBAN-」で始まり、その後に3桁以上の数字を入力してください');
      return;
    }

    if (formData.parent_seiban && !/^SEIBAN-\d{3,}$/.test(formData.parent_seiban)) {
      alert('親製番も正しい形式で入力してください');
      return;
    }

    try {
      // まず製番マスターを作成
      const masterResult = await createMutation.mutateAsync(formData);

      if (masterResult.success) {
        // 次にプロジェクトに登録
        await registerMutation.mutateAsync({
          project_id: params.project_id,
          seiban: formData.seiban
        });

        alert('製番を登録しました');
        router.push(`/app_project/${params.project_id}/manage/setsubi`);
      } else {
        alert(`製番の作成に失敗しました: 不明なエラー`);
      }
    } catch (error) {
      console.error('製番登録エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '製番の登録に失敗しました';
      alert(`製番の登録に失敗しました: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <button
              onClick={() => router.push('/app_project')}
              className="hover:text-blue-600 transition-colors"
            >
              プロジェクト一覧
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}`)}
              className="hover:text-blue-600 transition-colors"
            >
              プロジェクト詳細
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage`)}
              className="hover:text-blue-600 transition-colors"
            >
              管理
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage/setsubi`)}
              className="hover:text-blue-600 transition-colors"
            >
              設備製番管理
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-gray-900 font-medium">新規登録</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">新規製番登録</h1>
          <p className="text-gray-600 mt-1">新しい設備製番を登録します</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage/setsubi`)}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>製番情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="seiban">製番 <span className="text-red-500">*</span></Label>
                <Input
                  id="seiban"
                  value={formData.seiban}
                  onChange={(e) => handleInputChange('seiban', e.target.value)}
                  placeholder="SEIBAN-001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="setsubi_name">設備名 <span className="text-red-500">*</span></Label>
                <Input
                  id="setsubi_name"
                  value={formData.setsubi_name}
                  onChange={(e) => handleInputChange('setsubi_name', e.target.value)}
                  placeholder="制御盤A"
                  required
                />
              </div>

              <div>
                <Label htmlFor="shohin_category">商品区分</Label>
                <Select value={formData.shohin_category} onValueChange={(value) => handleInputChange('shohin_category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="電子機器">電子機器</SelectItem>
                    <SelectItem value="機械部品">機械部品</SelectItem>
                    <SelectItem value="電気機器">電気機器</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location_code">場所番号</Label>
                <Input
                  id="location_code"
                  value={formData.location_code}
                  onChange={(e) => handleInputChange('location_code', e.target.value)}
                  placeholder="AREA-A01"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="parent_seiban">親製番</Label>
                <Input
                  id="parent_seiban"
                  value={formData.parent_seiban}
                  onChange={(e) => handleInputChange('parent_seiban', e.target.value)}
                  placeholder="親となる製番（オプション）"
                />
                <p className="text-sm text-gray-500 mt-1">
                  この製番が別の製番のサブセットである場合に指定してください
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/app_project/${params.project_id}/manage/setsubi`)}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || registerMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {createMutation.isPending || registerMutation.isPending ? '登録中...' : '登録する'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
