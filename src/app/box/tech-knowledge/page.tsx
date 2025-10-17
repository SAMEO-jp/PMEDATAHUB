/**
 * @file 要素技術ナレッジデータ表示ページ
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { Badge } from '@src/components/ui/badge';
import { 
  FileText,
  Search,
  Filter,
  BookOpen,
  Tag,
  Calendar,
  User,
  ExternalLink,
  Download,
  Eye
} from 'lucide-react';

interface TechKnowledgeItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  status: 'published' | 'draft' | 'archived';
  attachments: {
    name: string;
    url: string;
    size: number;
  }[];
}

export default function TechKnowledgePage() {
  const [knowledgeItems, setKnowledgeItems] = useState<TechKnowledgeItem[]>([
    {
      id: '1',
      title: '製造技術の基礎知識',
      category: '製造技術',
      tags: ['基礎', '製造', '技術'],
      content: '製造技術における基本的な概念と手法について説明します。...',
      author: '技術部 田中',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
      view_count: 156,
      status: 'published',
      attachments: [
        { name: '製造技術ガイド.pdf', url: '#', size: 2048576 },
        { name: '技術資料.xlsx', url: '#', size: 512000 }
      ]
    },
    {
      id: '2',
      title: '材料選定のポイント',
      category: '材料技術',
      tags: ['材料', '選定', '設計'],
      content: '製品設計における材料選定の重要なポイントを解説します。...',
      author: '設計部 佐藤',
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-18T16:45:00Z',
      view_count: 89,
      status: 'published',
      attachments: [
        { name: '材料選定基準.pdf', url: '#', size: 1536000 }
      ]
    },
    {
      id: '3',
      title: '品質管理手法の実践',
      category: '品質管理',
      tags: ['品質', '管理', '実践'],
      content: '現場で実践できる品質管理手法について詳しく説明します。...',
      author: '品質部 山田',
      created_at: '2024-01-05T11:00:00Z',
      updated_at: '2024-01-12T13:20:00Z',
      view_count: 234,
      status: 'published',
      attachments: []
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState<TechKnowledgeItem | null>(null);

  // カテゴリ一覧
  const categories = [
    '製造技術',
    '材料技術',
    '設計技術',
    '品質管理',
    '生産管理',
    'その他'
  ];

  // フィルタリングされたアイテム
  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // ステータスバッジの色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ファイルサイズフォーマット
  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  // 日時フォーマット
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">要素技術ナレッジデータ表示</h1>
            <p className="text-muted-foreground">
              要素技術ナレッジのデータを表示・検索・閲覧します
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <BookOpen className="w-4 h-4 mr-2" />
            新規作成
          </Button>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">検索</Label>
              <Input
                id="search"
                placeholder="タイトル、内容、タグで検索..."
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
            <div>
              <Label htmlFor="status">ステータス</Label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">すべてのステータス</option>
                <option value="published">公開済み</option>
                <option value="draft">下書き</option>
                <option value="archived">アーカイブ</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ナレッジ一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>
            ナレッジ一覧
            <Badge variant="secondary" className="ml-2">
              {filteredItems.length}件
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold cursor-pointer hover:text-purple-600"
                            onClick={() => setSelectedItem(item)}>
                          {item.title}
                        </h3>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === 'published' ? '公開済み' : 
                           item.status === 'draft' ? '下書き' : 'アーカイブ'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {item.category}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {item.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.updated_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {item.view_count}回閲覧
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.content}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {item.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                              <ExternalLink className="w-3 h-3" />
                              {attachment.name} ({formatFileSize(attachment.size)})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        詳細
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        ダウンロード
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                  ? '検索条件に一致するデータが見つかりませんでした' 
                  : 'データがありません。'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 詳細表示モーダル */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {selectedItem.category}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedItem.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  作成: {formatDate(selectedItem.created_at)} | 更新: {formatDate(selectedItem.updated_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {selectedItem.view_count}回閲覧
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedItem.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">内容</h3>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {selectedItem.content}
                </div>
              </div>

              {selectedItem.attachments.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">添付ファイル</h3>
                  <div className="space-y-2">
                    {selectedItem.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          <span>{attachment.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({formatFileSize(attachment.size)})
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          ダウンロード
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 統計情報 */}
      <Card>
        <CardHeader>
          <CardTitle>統計情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{knowledgeItems.length}</div>
              <div className="text-sm text-muted-foreground">総件数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {knowledgeItems.filter(item => item.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">公開済み</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {knowledgeItems.reduce((sum, item) => sum + item.view_count, 0)}
              </div>
              <div className="text-sm text-muted-foreground">総閲覧数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {new Set(knowledgeItems.map(item => item.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">カテゴリ数</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

