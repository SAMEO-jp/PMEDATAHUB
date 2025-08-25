'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Users, FileText, Settings, Plus, Search } from 'lucide-react';

// デモデータ
const demoProjects = [
  {
    id: 'E923BXX215000',
    name: '君津２高炉BP水素吹き込み対応',
    description: '君津２高炉BP水素吹き込み対応プロジェクト',
    status: '進行中',
    client: '新日鉄住金',
    startDate: '2025-03-03',
    endDate: '2025-06-30',
    progress: 65,
    members: 8,
    budget: 'A',
    category: '設備工事'
  },
  {
    id: 'E924CXX216000',
    name: '名古屋製鉄所設備更新',
    description: '名古屋製鉄所の設備更新プロジェクト',
    status: '企画中',
    client: '新日鉄住金',
    startDate: '2025-04-01',
    endDate: '2025-12-31',
    progress: 25,
    members: 5,
    budget: 'B',
    category: '設備工事'
  },
  {
    id: 'E925DXX217000',
    name: '八幡製鉄所自動化システム',
    description: '八幡製鉄所の自動化システム導入',
    status: '完了',
    client: '新日鉄住金',
    startDate: '2024-09-01',
    endDate: '2025-02-28',
    progress: 100,
    members: 12,
    budget: 'A',
    category: 'システム開発'
  }
];

const demoMembers = [
  {
    id: '1',
    name: '田中太郎',
    role: 'プロジェクトマネージャー',
    email: 'tanaka@example.com',
    department: '技術部',
    joinedAt: '2025-03-01'
  },
  {
    id: '2',
    name: '佐藤花子',
    role: '開発者',
    email: 'sato@example.com',
    department: '開発部',
    joinedAt: '2025-03-05'
  },
  {
    id: '3',
    name: '鈴木一郎',
    role: '設計者',
    email: 'suzuki@example.com',
    department: '設計部',
    joinedAt: '2025-03-10'
  }
];

const statusColors = {
  '企画中': 'bg-blue-100 text-blue-800',
  '進行中': 'bg-green-100 text-green-800',
  '一時停止': 'bg-yellow-100 text-yellow-800',
  '完了': 'bg-gray-100 text-gray-800',
  'キャンセル': 'bg-red-100 text-red-800'
};

export default function ProjectDemoPage() {
  const [selectedProject, setSelectedProject] = useState(demoProjects[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const filteredProjects = demoProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          プロジェクト管理アプリ デモ
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          基本設計ドラフトに基づく機能デモ
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/project">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              仕様書に戻る
            </button>
          </Link>
        </div>
      </div>

      {/* デモページ一覧 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          デモページ一覧
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/project/demo/pj-001">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-blue-600 mb-2">PJ-001: プロジェクト一覧</h3>
              <p className="text-sm text-gray-600 mb-3">登録済みプロジェクトを検索・確認・一括操作</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Search className="w-3 h-3" />
                検索・フィルタリング・一括操作
              </div>
            </div>
          </Link>

          <Link href="/project/demo/pj-002">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-green-600 mb-2">PJ-002: プロジェクト詳細</h3>
              <p className="text-sm text-gray-600 mb-3">個別プロジェクトの状態と構成を俯瞰・編集</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FileText className="w-3 h-3" />
                基本情報・メンバー・履歴・設定
              </div>
            </div>
          </Link>

          <Link href="/project/demo/pj-003">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-purple-600 mb-2">PJ-003: プロジェクト作成</h3>
              <p className="text-sm text-gray-600 mb-3">新規プロジェクト登録</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Plus className="w-3 h-3" />
                入力フォーム・バリデーション
              </div>
            </div>
          </Link>

          <Link href="/project/demo/pj-004">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-orange-600 mb-2">PJ-004: プロジェクト編集</h3>
              <p className="text-sm text-gray-600 mb-3">既存プロジェクトの属性変更</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Settings className="w-3 h-3" />
                変更検知・履歴記録
              </div>
            </div>
          </Link>

          <Link href="/project/demo/pj-005">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-red-600 mb-2">PJ-005: メンバー管理</h3>
              <p className="text-sm text-gray-600 mb-3">参加メンバーの登録・権限付与・履歴管理</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                メンバー追加・ロール変更・権限管理
              </div>
            </div>
          </Link>

          <Link href="/project/demo/pj-006">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-indigo-600 mb-2">PJ-006: 進捗・ステータス管理</h3>
              <p className="text-sm text-gray-600 mb-3">進捗指標や状態遷移を管理</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                ステータス変更・進捗更新・マイルストーン
              </div>
            </div>
          </Link>

          <Link href="/project/demo/pj-007">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-yellow-600 mb-2">PJ-007: 一括操作センター</h3>
              <p className="text-sm text-gray-600 mb-3">一括処理の安全な実行とログ残し</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Settings className="w-3 h-3" />
                一括変更・実行確認・結果表示
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 既存のデモコンテンツ */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          機能デモ
        </h2>

        {/* 検索・フィルター */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="プロジェクト名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全ステータス</option>
              <option value="企画中">企画中</option>
              <option value="進行中">進行中</option>
              <option value="一時停止">一時停止</option>
              <option value="完了">完了</option>
              <option value="キャンセル">キャンセル</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              新規作成
            </button>
          </div>
        </div>

        {/* プロジェクト一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status as keyof typeof statusColors]}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{project.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {project.startDate} - {project.endDate}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {project.members}人
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs">進捗: {project.progress}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* プロジェクト詳細 */}
      {selectedProject && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[selectedProject.status as keyof typeof statusColors]}`}>
              {selectedProject.status}
            </span>
          </div>

          {/* タブナビゲーション */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: '概要', icon: FileText },
                { id: 'members', name: 'メンバー', icon: Users },
                { id: 'settings', name: '設定', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* タブコンテンツ */}
          <div>
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">基本情報</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">クライアント</dt>
                      <dd className="text-sm text-gray-900">{selectedProject.client}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">開始日</dt>
                      <dd className="text-sm text-gray-900">{selectedProject.startDate}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">終了予定日</dt>
                      <dd className="text-sm text-gray-900">{selectedProject.endDate}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">予算グレード</dt>
                      <dd className="text-sm text-gray-900">{selectedProject.budget}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">カテゴリ</dt>
                      <dd className="text-sm text-gray-900">{selectedProject.category}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">進捗状況</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>進捗率</span>
                        <span>{selectedProject.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${selectedProject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">メンバー数</div>
                        <div className="font-semibold">{selectedProject.members}人</div>
                      </div>
                      <div>
                        <div className="text-gray-500">残り日数</div>
                        <div className="font-semibold">
                          {Math.max(0, Math.ceil((new Date(selectedProject.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}日
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">メンバー一覧</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    メンバー追加
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {demoMembers.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">ロール</span>
                          <span className="font-medium">{member.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">部署</span>
                          <span>{member.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">参加日</span>
                          <span>{member.joinedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">プロジェクト設定</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">設定機能は拡張予定</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-2">
                    プロジェクトの詳細設定、通知設定、権限設定などの機能を今後実装予定です。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* フッター */}
      <div className="text-center mt-12 pt-8 border-t">
        <p className="text-gray-600 mb-4">
          各デモページで詳細な機能を確認できます
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/project">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
              仕様書に戻る
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
