'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TrendingUp, Calendar, Target, BarChart3, Play, Pause, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

// プロジェクトの型定義
interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  milestones: {
    id: string;
    name: string;
    date: string;
    status: string;
    progress: number;
  }[];
}

// デモデータ
const demoProjects = {
  'E923BXX215000': {
    id: 'E923BXX215000',
    name: '君津２高炉BP水素吹き込み対応',
    status: '進行中',
    progress: 65,
    startDate: '2025-03-03',
    endDate: '2025-06-30',
    milestones: [
      { id: '1', name: '要件定義完了', date: '2025-03-15', status: 'completed', progress: 100 },
      { id: '2', name: '基本設計完了', date: '2025-04-15', status: 'completed', progress: 100 },
      { id: '3', name: '詳細設計完了', date: '2025-05-15', status: 'in_progress', progress: 80 },
      { id: '4', name: '実装完了', date: '2025-06-15', status: 'pending', progress: 0 },
      { id: '5', name: 'テスト完了', date: '2025-06-30', status: 'pending', progress: 0 }
    ]
  }
};

const statusOptions = [
  { value: '企画中', label: '企画中', icon: Clock, color: 'bg-blue-100 text-blue-800' },
  { value: '進行中', label: '進行中', icon: Play, color: 'bg-green-100 text-green-800' },
  { value: '一時停止', label: '一時停止', icon: Pause, color: 'bg-yellow-100 text-yellow-800' },
  { value: '完了', label: '完了', icon: CheckCircle, color: 'bg-gray-100 text-gray-800' },
  { value: 'キャンセル', label: 'キャンセル', icon: AlertTriangle, color: 'bg-red-100 text-red-800' }
];

const milestoneStatusColors = {
  'completed': 'bg-green-100 text-green-800',
  'in_progress': 'bg-blue-100 text-blue-800',
  'pending': 'bg-gray-100 text-gray-800',
  'delayed': 'bg-red-100 text-red-800'
};

function PJ006ProgressManagementDemoContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id') || 'E923BXX215000';
  
  const [project, setProject] = useState<Project | null>(demoProjects[projectId as keyof typeof demoProjects]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(project?.status || '進行中');
  const [progressValue, setProgressValue] = useState(project?.progress || 65);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setSelectedStatus(project.status);
      setProgressValue(project.progress);
    }
  }, [project]);

  // ステータス変更
  const handleStatusChange = async () => {
    setIsSubmitting(true);
    
    // デモ用の遅延
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProject(prev => prev ? { ...prev, status: selectedStatus } : prev);
    setShowStatusModal(false);
    setIsSubmitting(false);
  };

  // 進捗更新
  const handleProgressUpdate = async () => {
    setIsSubmitting(true);
    
    // デモ用の遅延
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProject(prev => prev ? { ...prev, progress: progressValue } : prev);
    setShowProgressModal(false);
    setIsSubmitting(false);
  };

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">プロジェクトが見つかりません</h1>
          <Link href="/project/demo/pj-001">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              一覧に戻る
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = statusOptions.find(s => s.value === project.status);
  const StatusIcon = currentStatus?.icon || Clock;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PJ-006: プロジェクト進捗・ステータス管理</h1>
            <p className="text-gray-600 mt-2">進捗指標や状態遷移を管理</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-500">プロジェクト: {project.name}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/project/demo/pj-002?id=${project.id}`}>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                詳細に戻る
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 現在の状況 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ステータス */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <StatusIcon className="w-5 h-5" />
              現在のステータス
            </h3>
            <button
              onClick={() => setShowStatusModal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              変更
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${currentStatus?.color}`}>
              {currentStatus?.label}
            </span>
          </div>
        </div>

        {/* 進捗 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              進捗状況
            </h3>
            <button
              onClick={() => setShowProgressModal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              更新
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">進捗率</span>
              <span className="text-lg font-semibold text-gray-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 期間 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" />
            プロジェクト期間
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">開始日</span>
              <span className="text-sm text-gray-900">{project.startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">終了予定日</span>
              <span className="text-sm text-gray-900">{project.endDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">残り日数</span>
              <span className="text-sm text-gray-900">
                {Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}日
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* マイルストーン */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5" />
            マイルストーン
          </h2>
        </div>
        
        <div className="space-y-4">
          {project.milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${milestoneStatusColors[milestone.status as keyof typeof milestoneStatusColors]}`}>
                    {milestone.status === 'completed' && '完了'}
                    {milestone.status === 'in_progress' && '進行中'}
                    {milestone.status === 'pending' && '未開始'}
                    {milestone.status === 'delayed' && '遅延'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">期限: {milestone.date}</span>
                  <span className="text-sm text-gray-500">進捗: {milestone.progress}%</span>
                </div>
                
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 進捗チャート */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5" />
          進捗推移
        </h2>
        
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <div className="text-gray-500 mb-4">
            <BarChart3 className="w-16 h-16 mx-auto mb-2 opacity-50" />
            <p>進捗推移チャート（拡張予定）</p>
          </div>
          <p className="text-sm text-gray-400">
            時系列での進捗推移をグラフで表示する機能を今後実装予定です。
          </p>
        </div>
      </div>

      {/* ステータス変更モーダル */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ステータス変更</h3>
              
              <div className="space-y-3 mb-6">
                {statusOptions.map((status) => {
                  const StatusIcon = status.icon;
                  return (
                    <label
                      key={status.value}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedStatus === status.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={selectedStatus === status.value}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="text-blue-600"
                      />
                      <StatusIcon className="w-5 h-5" />
                      <span className="font-medium">{status.label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => void handleStatusChange()}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? '更新中...' : '更新'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 進捗更新モーダル */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">進捗更新</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  進捗率 ({progressValue}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressValue}
                  onChange={(e) => setProgressValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => void handleProgressUpdate()}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? '更新中...' : '更新'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 機能説明 */}
      <div className="bg-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">実装済み機能</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
          <div>
            <h4 className="font-medium mb-2">ステータス管理:</h4>
            <ul className="space-y-1">
              <li>• ステータス変更（5つの状態）</li>
              <li>• 状態遷移の視覚的表示</li>
              <li>• 変更履歴の記録（拡張予定）</li>
              <li>• 自動通知機能（拡張予定）</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">進捗管理:</h4>
            <ul className="space-y-1">
              <li>• 進捗率の更新（0-100%）</li>
              <li>• マイルストーン管理</li>
              <li>• 進捗推移チャート（拡張予定）</li>
              <li>• 遅延警告機能（拡張予定）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PJ006ProgressManagementDemo() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">読み込み中...</h1>
        </div>
      </div>
    }>
      <PJ006ProgressManagementDemoContent />
    </Suspense>
  );
}


