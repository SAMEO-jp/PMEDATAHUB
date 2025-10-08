//本ページは、タスク管理ページで、タスクの作成、編集、管理を行います。

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckSquare, 
  PlusCircle, 
  Clock, 
  Pencil, 
  Trash2, 
  Search,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// ========================================
// 型定義
// ========================================

interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  estimatedTime?: number; // 分単位
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// メインコンポーネント
// ========================================

export default function TaskManagementPage() {
  // ========================================
  // State管理
  // ========================================
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'プロジェクト企画書作成',
      description: '新規プロジェクトの企画書を作成する',
      category: '企画',
      priority: 'high',
      status: 'in_progress',
      estimatedTime: 120,
      assignee: '山田太郎',
      dueDate: '2025-10-15',
      createdAt: '2025-10-01',
      updatedAt: '2025-10-07'
    },
    {
      id: '2',
      title: '顧客ミーティング',
      description: '月次進捗報告のための顧客ミーティング',
      category: '会議',
      priority: 'high',
      status: 'todo',
      estimatedTime: 60,
      assignee: '佐藤花子',
      dueDate: '2025-10-10',
      createdAt: '2025-10-01',
      updatedAt: '2025-10-07'
    },
    {
      id: '3',
      title: '資料作成',
      description: 'プレゼン資料の作成',
      category: '作成',
      priority: 'medium',
      status: 'todo',
      estimatedTime: 90,
      assignee: '鈴木一郎',
      dueDate: '2025-10-20',
      createdAt: '2025-10-02',
      updatedAt: '2025-10-07'
    },
    {
      id: '4',
      title: 'システムテスト',
      description: '新機能のテスト実行',
      category: '開発',
      priority: 'medium',
      status: 'in_progress',
      estimatedTime: 180,
      assignee: '田中次郎',
      dueDate: '2025-10-18',
      createdAt: '2025-10-03',
      updatedAt: '2025-10-07'
    },
    {
      id: '5',
      title: 'メール返信',
      description: '各種メールへの返信',
      category: '事務',
      priority: 'low',
      status: 'completed',
      estimatedTime: 30,
      assignee: '山田太郎',
      dueDate: '2025-10-08',
      createdAt: '2025-10-05',
      updatedAt: '2025-10-07'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // 新規タスク用のフォームデータ
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'todo' as 'todo' | 'in_progress' | 'completed',
    estimatedTime: 0,
    assignee: '',
    dueDate: ''
  });

  // ========================================
  // フィルター・検索処理
  // ========================================

  const categories = ['all', ...Array.from(new Set(tasks.map(task => task.category)))];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // ========================================
  // CRUD操作
  // ========================================

  const handleCreateTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      priority: newTask.priority,
      status: newTask.status,
      estimatedTime: newTask.estimatedTime,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setIsCreateDialogOpen(false);
    
    // フォームリセット
    setNewTask({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      status: 'todo',
      estimatedTime: 0,
      assignee: '',
      dueDate: ''
    });
  };

  const handleEditTask = () => {
    if (!editingTask) return;

    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? { ...editingTask, updatedAt: new Date().toISOString() }
        : task
    ));
    
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('このタスクを削除してもよろしいですか？')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in_progress' | 'completed') => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  // ========================================
  // ユーティリティ関数
  // ========================================

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return '未着手';
      case 'in_progress': return '進行中';
      case 'completed': return '完了';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return priority;
    }
  };

  // ========================================
  // 統計情報
  // ========================================

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  };

  // ========================================
  // レンダリング
  // ========================================

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-blue-600" />
            タスク管理
          </h1>
          <p className="text-gray-600 mt-2">タスクの作成、編集、進捗管理を行います</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              新規タスク作成
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>新規タスク作成</DialogTitle>
              <DialogDescription>
                新しいタスクの情報を入力してください
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">タスク名 *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="タスク名を入力"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="タスクの説明を入力"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">カテゴリ *</Label>
                  <Input
                    id="category"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    placeholder="例: 企画、会議、開発"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="assignee">担当者</Label>
                  <Input
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="担当者名を入力"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">優先度</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: 'high' | 'medium' | 'low') => 
                      setNewTask({ ...newTask, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="low">低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">ステータス</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value: 'todo' | 'in_progress' | 'completed') => 
                      setNewTask({ ...newTask, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">未着手</SelectItem>
                      <SelectItem value="in_progress">進行中</SelectItem>
                      <SelectItem value="completed">完了</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="estimatedTime">予定時間(分)</Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">期限</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                キャンセル
              </Button>
              <Button 
                onClick={handleCreateTask}
                disabled={!newTask.title || !newTask.category}
              >
                作成
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">総タスク数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">未着手</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todo}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">進行中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">完了</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルター */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            検索・フィルター
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="タスクを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのカテゴリ</SelectItem>
                {categories.filter(c => c !== 'all').map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="優先度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての優先度</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのステータス</SelectItem>
                <SelectItem value="todo">未着手</SelectItem>
                <SelectItem value="in_progress">進行中</SelectItem>
                <SelectItem value="completed">完了</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* タスク一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              タスク一覧
            </span>
            <span className="text-sm font-normal text-gray-500">
              {filteredTasks.length}件のタスク
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">カテゴリ:</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded">{task.category}</span>
                        </span>

                        {task.assignee && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">担当:</span>
                            <span>{task.assignee}</span>
                          </span>
                        )}

                        {task.estimatedTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {Math.floor(task.estimatedTime / 60) > 0 && `${Math.floor(task.estimatedTime / 60)}時間`}
                              {task.estimatedTime % 60 > 0 && `${task.estimatedTime % 60}分`}
                            </span>
                          </span>
                        )}

                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">期限:</span>
                            <span>{task.dueDate}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Select
                        value={task.status}
                        onValueChange={(value: 'todo' | 'in_progress' | 'completed') =>
                          handleStatusChange(task.id, value)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">未着手</SelectItem>
                          <SelectItem value="in_progress">進行中</SelectItem>
                          <SelectItem value="completed">完了</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTask(task);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>該当するタスクがありません</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 編集ダイアログ */}
      {editingTask && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>タスク編集</DialogTitle>
              <DialogDescription>
                タスクの情報を編集してください
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">タスク名 *</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">説明</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">カテゴリ *</Label>
                  <Input
                    id="edit-category"
                    value={editingTask.category}
                    onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-assignee">担当者</Label>
                  <Input
                    id="edit-assignee"
                    value={editingTask.assignee || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">優先度</Label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value: 'high' | 'medium' | 'low') => 
                      setEditingTask({ ...editingTask, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="low">低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-status">ステータス</Label>
                  <Select
                    value={editingTask.status}
                    onValueChange={(value: 'todo' | 'in_progress' | 'completed') => 
                      setEditingTask({ ...editingTask, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">未着手</SelectItem>
                      <SelectItem value="in_progress">進行中</SelectItem>
                      <SelectItem value="completed">完了</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-estimatedTime">予定時間(分)</Label>
                  <Input
                    id="edit-estimatedTime"
                    type="number"
                    value={editingTask.estimatedTime || 0}
                    onChange={(e) => setEditingTask({ ...editingTask, estimatedTime: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-dueDate">期限</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={editingTask.dueDate || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setEditingTask(null);
              }}>
                キャンセル
              </Button>
              <Button 
                onClick={handleEditTask}
                disabled={!editingTask.title || !editingTask.category}
              >
                更新
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


