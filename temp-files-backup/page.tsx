'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextArea } from "@/components/ui/TextArea";
import { trpc } from '@src/lib/trpc/client';
import { ArrowLeft, Save, ChevronRight } from 'lucide-react';

interface NewKounyuPageProps {
  params: {
    project_id: string;
  };
}

export default function NewKounyuPage({ params }: NewKounyuPageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    project_id: params.project_id,
    management_number: '',
    item_name: '',
    contract_number: '',
    item_category: '',
    setsubi_seiban: '',
    responsible_department: '',
    drawing_number: '',
    display_order: 0,
    remarks: '',
  });

  const createMutation = trpc.kounyu.createMaster.useMutation();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリチE�Eション
    if (!formData.management_number.trim()) {
      alert('管琁E��号は忁E��でぁE);
      return;
    }

    if (!formData.item_name.trim()) {
      alert('購入品名は忁E��でぁE);
      return;
    }

    if (!formData.item_category) {
      alert('購入品種別は忁E��でぁE);
      return;
    }

    // 管琁E��号の形式チェチE��
    if (!/^KOU-\d{3,}$/.test(formData.management_number)) {
      alert('管琁E��号は「KOU-」で始まり、その後に3桁以上�E数字を入力してください');
      return;
    }

    try {
      const result = await createMutation.mutateAsync(formData);

      if (result.success) {
        alert('購入品を登録しました');
        router.push(`/app_project/${params.project_id}/manage/kounyu`);
      } else {
        alert(`購入品�E作�Eに失敗しました: ${result.error || '不�Eなエラー'}`);
      }
    } catch (error) {
      console.error('購入品登録エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '購入品�E登録に失敗しました';
      alert(`購入品�E登録に失敗しました: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスチE*/}
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
              管琁E
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu`)}
              className="hover:text-blue-600 transition-colors"
            >
              購入品管琁E
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
          <h1 className="text-2xl font-bold">新規購入品登録</h1>
          <p className="text-gray-600 mt-1">新しい購入品を登録しまぁE/p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu`)}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻めE
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>購入品情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="management_number">管琁E��号 <span className="text-red-500">*</span></Label>
                <Input
                  id="management_number"
                  value={formData.management_number}
                  onChange={(e) => handleInputChange('management_number', e.target.value)}
                  placeholder="KOU-001"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">KOU-XXX形式で入力してください</p>
              </div>

              <div>
                <Label htmlFor="item_name">購入品名 <span className="text-red-500">*</span></Label>
                <Input
                  id="item_name"
                  value={formData.item_name}
                  onChange={(e) => handleInputChange('item_name', e.target.value)}
                  placeholder="制御用モーター"
                  required
                />
              </div>

              <div>
                <Label htmlFor="item_category">購入品種別 <span className="text-red-500">*</span></Label>
                <Select value={formData.item_category} onValueChange={(value) => handleInputChange('item_category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="電気機器">電気機器</SelectItem>
                    <SelectItem value="電子部品E>電子部品E/SelectItem>
                    <SelectItem value="機械部品E>機械部品E/SelectItem>
                    <SelectItem value="電緁E>電緁E/SelectItem>
                    <SelectItem value="工具">工具</SelectItem>
                    <SelectItem value="消耗品">消耗品</SelectItem>
                    <SelectItem value="そ�E仁E>そ�E仁E/SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contract_number">契紁E��号</Label>
                <Input
                  id="contract_number"
                  value={formData.contract_number}
                  onChange={(e) => handleInputChange('contract_number', e.target.value)}
                  placeholder="CONT-2024-001"
                />
              </div>

              <div>
                <Label htmlFor="setsubi_seiban">設備製番</Label>
                <Input
                  id="setsubi_seiban"
                  value={formData.setsubi_seiban}
                  onChange={(e) => handleInputChange('setsubi_seiban', e.target.value)}
                  placeholder="SEIBAN-001"
                />
              </div>

              <div>
                <Label htmlFor="responsible_department">購入拁E��部門</Label>
                <Select value={formData.responsible_department} onValueChange={(value) => handleInputChange('responsible_department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="技術部">技術部</SelectItem>
                    <SelectItem value="製造部">製造部</SelectItem>
                    <SelectItem value="賁E��部">賁E��部</SelectItem>
                    <SelectItem value="営業部">営業部</SelectItem>
                    <SelectItem value="管琁E��">管琁E��</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="drawing_number">図面番号</Label>
                <Input
                  id="drawing_number"
                  value={formData.drawing_number}
                  onChange={(e) => handleInputChange('drawing_number', e.target.value)}
                  placeholder="DRW-001"
                />
              </div>

              <div>
                <Label htmlFor="display_order">表示頁E��号</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">一覧での表示頁E��小さぁE��字が先頭�E�E/p>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="remarks">備老E��E/Label>
              <TextArea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                placeholder="備老E��あれば入力してください"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/app_project/${params.project_id}/manage/kounyu`)}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {createMutation.isPending ? '登録中...' : '登録する'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
