/**
 * @file 要素技術MAPデータ登録ページ
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { TextArea as Textarea } from '@src/components/ui/textarea';
import { Badge } from '@src/components/ui/badge';
import { 
  MapPin,
  Plus,
  Save,
  Trash2,
  Edit,
  Search,
  Filter
} from 'lucide-react';

interface TechMapItem {
  id: string;
  name: string;
  category: string;
  description: string;
  coordinates: {
    x: number;
    y: number;
  };
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
}

export default function TechMapPage() {
  const [techMapItems, setTechMapItems] = useState<TechMapItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // 新規アイテムのフォーム状態
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    description: '',
    x: 0,
    y: 0,
    status: 'draft' as const
  });

  // カテゴリ一覧
  const categories = [
    '製造技術',
    '材料技術',
    '設計技術',
    '品質管理',
    '生産管理',
    'その他'
  ];

  // 新規アイテム追加
  const handleAddItem = () => {
    if (!newItem.name || !newItem.category) return;

    const item: TechMapItem = {
      id: `tech_${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      description: newItem.description,
      coordinates: {
        x: newItem.x,
        y: newItem.y
      },
      status: newItem.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setTechMapItems(prev => [...prev, item]);
    setNewItem({
      name: '',
      category: '',
      description: '',
      x: 0,
      y: 0,
      status: 'draft'
    });
    setIsAdding(false);
  };

  // アイテム削除
  const handleDeleteItem = (id: string) => {
    if (confirm('このアイテムを削除しますか？')) {
      setTechMapItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // アイテム編集開始
  const handleStartEdit = (item: TechMapItem) => {
    setEditingId(item.id);
    setNewItem({
      name: item.name,
      category: item.category,
      description: item.description,
      x: item.coordinates.x,
      y: item.coordinates.y,
      status: item.status
    });
  };

  // アイテム編集保存
  const handleSaveEdit = () => {
    if (!editingId || !newItem.name || !newItem.category) return;

    setTechMapItems(prev => prev.map(item => 
      item.id === editingId 
        ? {
            ...item,
            name: newItem.name,
            category: newItem.category,
            description: newItem.description,
            coordinates: {
              x: newItem.x,
              y: newItem.y
            },
            status: newItem.status,
            updated_at: new Date().toISOString()
          }
        : item
    ));

    setEditingId(null);
    setNewItem({
      name: '',
      category: '',
      description: '',
      x: 0,
      y: 0,
      status: 'draft'
    });
  };

  // フィルタリングされたアイテム
  const filteredItems = techMapItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // ステータスバッジの色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">要素技術MAPデータ登録</h1>
            <p className="text-muted-foreground">
              要素技術マップのデータを登録・編集・管理します
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          新規登録
        </Button>
      </div>

      {/* 検索・フィルター */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            検索・フィルター
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">検索</Label>
              <Input
                id="search"
                placeholder="技術名や説明で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">カテゴリ</Label>
              <select
                id="category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">すべてのカテゴリ</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 新規登録・編集フォーム */}
      {(isAdding || editingId) && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingId ? '要素技術MAP編集' : '新規要素技術MAP登録'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">技術名 *</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="技術名を入力"
                />
              </div>
              <div>
                <Label htmlFor="category">カテゴリ *</Label>
                <select
                  id="category"
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md"
                >
                  <option value="">カテゴリを選択</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="技術の詳細説明を入力"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="x">X座標</Label>
                <Input
                  id="x"
                  type="number"
                  value={newItem.x}
                  onChange={(e) => setNewItem(prev => ({ ...prev, x: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="y">Y座標</Label>
                <Input
                  id="y"
                  type="number"
                  value={newItem.y}
                  onChange={(e) => setNewItem(prev => ({ ...prev, y: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="status">ステータス</Label>
                <select
                  id="status"
                  value={newItem.status}
                  onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-input rounded-md"
                >
                  <option value="draft">下書き</option>
                  <option value="active">アクティブ</option>
                  <option value="inactive">非アクティブ</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={editingId ? handleSaveEdit : handleAddItem}
                disabled={!newItem.name || !newItem.category}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? '保存' : '登録'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setNewItem({
                    name: '',
                    category: '',
                    description: '',
                    x: 0,
                    y: 0,
                    status: 'draft'
                  });
                }}
              >
                キャンセル
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* データ一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>
            要素技術MAP一覧
            <Badge variant="secondary" className="ml-2">
              {filteredItems.length}件
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === 'active' ? 'アクティブ' : 
                           item.status === 'inactive' ? '非アクティブ' : '下書き'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        カテゴリ: {item.category} | 座標: ({item.coordinates.x}, {item.coordinates.y})
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      )}
                      <div className="text-xs text-muted-foreground">
                        作成: {new Date(item.created_at).toLocaleString('ja-JP')} | 
                        更新: {new Date(item.updated_at).toLocaleString('ja-JP')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                {searchTerm || filterCategory !== 'all' 
                  ? '検索条件に一致するデータが見つかりませんでした' 
                  : 'データがありません。新規登録してください。'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <Card>
        <CardHeader>
          <CardTitle>統計情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{techMapItems.length}</div>
              <div className="text-sm text-muted-foreground">総件数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {techMapItems.filter(item => item.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">アクティブ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {techMapItems.filter(item => item.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">下書き</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {new Set(techMapItems.map(item => item.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">カテゴリ数</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

