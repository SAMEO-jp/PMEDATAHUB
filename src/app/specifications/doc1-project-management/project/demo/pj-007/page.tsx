'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Settings, CheckSquare, Square, AlertTriangle, Play, Pause, CheckCircle, Trash2, Users, Calendar } from 'lucide-react';

// デモデータ
const demoProjects = [
  {
    id: 'E923BXX215000',
    name: '君津２高炉BP水素吹き込み対応',
    status: '進行中',
    client: '新日鉄住金',
    startDate: '2025-03-03',
    endDate: '2025-06-30',
    progress: 65
  },
  {
    id: 'E924CXX216000',
    name: '名古屋製鉄所設備更新',
    status: '企画中',
    client: '新日鉄住金',
    startDate: '2025-04-01',
    endDate: '2025-12-31',
    progress: 25
  },
  {
    id: 'E925DXX217000',
    name: '八幡製鉄所自動化システム',
    status: '完了',
    client: '新日鉄住金',
    startDate: '2024-09-01',
    endDate: '2025-02-28',
    progress: 100
  },
  {
    id: 'E926EXX218000',
    name: '千葉製鉄所環境対策',
    status: '一時停止',
    client: '新日鉄住金',
    startDate: '2025-01-01',
    endDate: '2025-08-31',
    progress: 40
  }
];

const statusOptions = [
  { value: '企画中', label: '企画中', icon: Calendar },
  { value: '進行中', label: '進行中', icon: Play },
  { value: '一時停止', label: '一時停止', icon: Pause },
  { value: '完了', label: '完了', icon: CheckCircle },
  { value: 'キャンセル', label: 'キャンセル', icon: Trash2 }
];

const statusColors = {
  '企画中': 'bg-blue-100 text-blue-800',
  '進行中': 'bg-green-100 text-green-800',
  '一時停止': 'bg-yellow-100 text-yellow-800',
  '完了': 'bg-gray-100 text-gray-800',
  'キャンセル': 'bg-red-100 text-red-800'
};

function PJ007BulkOperationsDemoContent() {
  const searchParams = useSearchParams();
  const selectedProjectIds = searchParams.get('ids')?.split(',') || ['E923BXX215000', 'E924CXX216000'];
  
  const [projects, setProjects] = useState(demoProjects);
  const [selectedProjects, setSelectedProjects] = useState<string[]>(selectedProjectIds);
  const [operationType, setOperationType] = useState<'status' | 'delete'>('status');
  const [newStatus, setNewStatus] = useState('進行中');
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<any[]>([]);

  const selectedProjectData = projects.filter(project => selectedProjects.includes(project.id));

  // 全選択・選択解除
  const handleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(p => p.id));
    }
  };

  // 個別選択
  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  // プレビュー表示
  const handlePreview = () => {
    setShowPreview(true);
  };

  // 実行確認
  const handleConfirm = () => {
    setShowConfirm(true);
  };

  // 一括操作実行
  const handleExecute = async () => {
    setIsExecuting(true);
    
    // デモ用の遅延
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = selectedProjectData.map(project => {
      const success = Math.random() > 0.1; // 90%の成功率
      
      if (operationType === 'status' && success) {
        // ステータス変更
        setProjects(prev => prev.map(p => 
          p.id === project.id ? { ...p, status: newStatus } : p
        ));
      }
      
      return {
        projectId: project.id,
        projectName: project.name,
        operation: operationType === 'status' ? `ステータス変更: ${project.status} → ${newStatus}` : '削除',
        success,
        message: success ? '成功' : 'エラーが発生しました'
      };
    });
    
    setExecutionResults(results);
    setShowConfirm(false);
    setIsExecuting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PJ-007: 一括操作センター</h1>
            <p className="text-gray-600 mt-2">一括処理の安全な実行とログ残し</p>
          </div>
          <div className="flex gap-3">
            <Link href="/project/demo/pj-001">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                一覧に戻る
              </button>
            </Link>
          </div>
        </div>

        {/* 選択状況 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-800">
                {selectedProjects.length}件選択中
              </span>
              <button
                onClick={handleSelectAll}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {selectedProjects.length === projects.length ? '選択解除' : '全選択'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 操作設定 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          操作設定
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 操作タイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              操作タイプ
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="operationType"
                  value="status"
                  checked={operationType === 'status'}
                  onChange={(e) => setOperationType(e.target.value as 'status' | 'delete')}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-medium">ステータス変更</div>
                  <div className="text-sm text-gray-500">選択したプロジェクトのステータスを一括変更</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="operationType"
                  value="delete"
                  checked={operationType === 'delete'}
                  onChange={(e) => setOperationType(e.target.value as 'status' | 'delete')}
                  className="text-red-600"
                />
                <div>
                  <div className="font-medium text-red-600">削除</div>
                  <div className="text-sm text-gray-500">選択したプロジェクトを一括削除（取り消し不可）</div>
                </div>
              </label>
            </div>
          </div>

          {/* ステータス選択 */}
          {operationType === 'status' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                新しいステータス
              </label>
              <div className="space-y-2">
                {statusOptions.map((status) => {
                  const StatusIcon = status.icon;
                  return (
                    <label
                      key={status.value}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        newStatus === status.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="newStatus"
                        value={status.value}
                        checked={newStatus === status.value}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="text-blue-600"
                      />
                      <StatusIcon className="w-5 h-5" />
                      <span className="font-medium">{status.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 操作ボタン */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <button
            onClick={handlePreview}
            disabled={selectedProjects.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            プレビュー
          </button>
        </div>
      </div>

      {/* 対象プロジェクト一覧 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            対象プロジェクト ({selectedProjects.length}件)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProjects.length === projects.length && projects.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  プロジェクト名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  現在のステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  クライアント
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  進捗
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">ID: {project.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status as keyof typeof statusColors]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.progress}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* プレビューモーダル */}
      {showPreview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                実行プレビュー
              </h3>
              
              <div className="mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">実行前の確認</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-2">
                    以下の操作を {selectedProjects.length}件のプロジェクトに対して実行します。
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">実行内容</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {operationType === 'status' 
                          ? `ステータス変更: ${selectedProjectData.map(p => p.status).join(', ')} → ${newStatus}`
                          : 'プロジェクト削除'
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">対象プロジェクト</h4>
                    <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                      <ul className="text-sm text-gray-700 space-y-1">
                        {selectedProjectData.map(project => (
                          <li key={project.id}>
                            {project.name} ({project.id})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  実行確認
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 実行確認モーダル */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                最終確認
              </h3>
              
              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">注意</span>
                  </div>
                  <p className="text-red-700 text-sm mt-2">
                    この操作は取り消すことができません。本当に実行しますか？
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  {operationType === 'status' 
                    ? `${selectedProjects.length}件のプロジェクトのステータスを「${newStatus}」に変更します。`
                    : `${selectedProjects.length}件のプロジェクトを削除します。`
                  }
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isExecuting ? '実行中...' : '実行'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 実行結果 */}
      {executionResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">実行結果</h2>
          
          <div className="space-y-4">
            {executionResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${
                  result.success 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{result.projectName}</div>
                    <div className="text-sm text-gray-600">{result.operation}</div>
                  </div>
                  <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    result.success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? '成功' : '失敗'}
                  </div>
                </div>
                {!result.success && (
                  <div className="text-sm text-red-600 mt-2">{result.message}</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                成功: {executionResults.filter(r => r.success).length}件 / 
                失敗: {executionResults.filter(r => !r.success).length}件
              </div>
              <button
                onClick={() => setExecutionResults([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                クリア
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 機能説明 */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">実装済み機能</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
          <div>
            <h4 className="font-medium mb-2">一括操作:</h4>
            <ul className="space-y-1">
              <li>• ステータス一括変更</li>
              <li>• プロジェクト一括削除</li>
              <li>• 対象選択・全選択</li>
              <li>• 実行プレビュー</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">安全機能:</h4>
            <ul className="space-y-1">
              <li>• 実行前の確認ダイアログ</li>
              <li>• 実行結果の詳細表示</li>
              <li>• 操作ログの記録（拡張予定）</li>
              <li>• 権限チェック機能（拡張予定）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function PJ007BulkOperationsDemo() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">読み込み中...</h1>
        </div>
      </div>
    }>
      <PJ007BulkOperationsDemoContent />
    </Suspense>
  );
}


