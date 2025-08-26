'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Users, FileText, Settings, Edit, Trash2, Clock, User, Building, Tag, MessageSquare } from 'lucide-react';

// デモデータ
const demoProjects = {
  'E923BXX215000': {
    id: 'E923BXX215000',
    name: '君津２高炉BP水素吹き込み対応',
    description: '君津２高炉BP水素吹き込み対応プロジェクト。環境負荷低減のための水素吹き込み技術の導入と運用開始を目指す。',
    status: '進行中',
    client: '新日鉄住金',
    startDate: '2025-03-03',
    endDate: '2025-06-30',
    updatedAt: '2025-01-15',
    pm: '田中太郎',
    progress: 65,
    members: 8,
    budget: 'A',
    category: '設備工事',
    equipmentCategory: '高炉設備',
    productCategory: '製鉄設備',
    installationDate: '2025-05-15',
    drawingCompletionDate: '2025-04-30',
    notes: '水素供給設備の設計変更により、設置日が1週間延期される可能性があります。',
    tags: ['環境対策', '技術革新', '重要プロジェクト']
  }
};

const demoMembers = [
  {
    id: '1',
    name: '田中太郎',
    role: 'プロジェクトマネージャー',
    email: 'tanaka@example.com',
    department: '技術部',
    joinedAt: '2025-03-01',
    avatar: 'TT'
  },
  {
    id: '2',
    name: '佐藤花子',
    role: '開発者',
    email: 'sato@example.com',
    department: '開発部',
    joinedAt: '2025-03-05',
    avatar: 'SH'
  },
  {
    id: '3',
    name: '鈴木一郎',
    role: '設計者',
    email: 'suzuki@example.com',
    department: '設計部',
    joinedAt: '2025-03-10',
    avatar: 'SI'
  },
  {
    id: '4',
    name: '高橋次郎',
    role: 'テスター',
    email: 'takahashi@example.com',
    department: '品質管理部',
    joinedAt: '2025-03-15',
    avatar: 'TJ'
  }
];

const demoHistory = [
  {
    id: '1',
    action: 'プロジェクト作成',
    oldValue: null,
    newValue: '君津２高炉BP水素吹き込み対応',
    changedBy: '田中太郎',
    changedAt: '2025-03-01 10:00:00'
  },
  {
    id: '2',
    action: 'ステータス変更',
    oldValue: '企画中',
    newValue: '進行中',
    changedBy: '田中太郎',
    changedAt: '2025-03-15 14:30:00'
  },
  {
    id: '3',
    action: 'メンバー追加',
    oldValue: null,
    newValue: '佐藤花子（開発者）',
    changedBy: '田中太郎',
    changedAt: '2025-03-20 09:15:00'
  },
  {
    id: '4',
    action: '進捗更新',
    oldValue: '45%',
    newValue: '65%',
    changedBy: '佐藤花子',
    changedAt: '2025-01-15 16:45:00'
  }
];

const statusColors = {
  '企画中': 'bg-blue-100 text-blue-800',
  '進行中': 'bg-green-100 text-green-800',
  '一時停止': 'bg-yellow-100 text-yellow-800',
  '完了': 'bg-gray-100 text-gray-800',
  'キャンセル': 'bg-red-100 text-red-800'
};

const roleColors = {
  'プロジェクトマネージャー': 'bg-purple-100 text-purple-800',
  '開発者': 'bg-blue-100 text-blue-800',
  '設計者': 'bg-green-100 text-green-800',
  'テスター': 'bg-orange-100 text-orange-800',
  '閲覧者': 'bg-gray-100 text-gray-800'
};

function PJ002ProjectDetailDemoContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id') || 'E923BXX215000';
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const project = demoProjects[projectId as keyof typeof demoProjects];

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-2">PJ-002: プロジェクト詳細 - 個別プロジェクトの状態と構成を俯瞰・編集</p>
          </div>
          <div className="flex gap-3">
            <Link href="/project/demo/pj-001">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                一覧に戻る
              </button>
            </Link>
            <Link href={`/project/demo/pj-004?id=${project.id}`}>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Edit className="w-4 h-4" />
                編集
              </button>
            </Link>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              削除
            </button>
          </div>
        </div>

        {/* プロジェクト基本情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[project.status as keyof typeof statusColors]}`}>
                {project.status}
              </span>
              <div className="text-sm text-gray-500">
                進捗: {project.progress}%
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">{project.client}</div>
                <div className="text-sm text-gray-500">クライアント</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">{project.pm}</div>
                <div className="text-sm text-gray-500">プロジェクトマネージャー</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: '概要', icon: FileText },
              { id: 'members', name: 'メンバー', icon: Users },
              { id: 'history', name: '履歴', icon: Clock },
              { id: 'settings', name: '設定', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
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
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* プロジェクト説明 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">プロジェクト説明</h3>
                <p className="text-gray-700">{project.description}</p>
              </div>

              {/* 基本情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">基本情報</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">プロジェクトID</dt>
                      <dd className="text-sm text-gray-900">{project.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">開始日</dt>
                      <dd className="text-sm text-gray-900">{project.startDate}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">終了予定日</dt>
                      <dd className="text-sm text-gray-900">{project.endDate}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">予算グレード</dt>
                      <dd className="text-sm text-gray-900">{project.budget}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">カテゴリ</dt>
                      <dd className="text-sm text-gray-900">{project.category}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">スケジュール情報</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">図面完成日</dt>
                      <dd className="text-sm text-gray-900">{project.drawingCompletionDate}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">設置日</dt>
                      <dd className="text-sm text-gray-900">{project.installationDate}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">設備カテゴリ</dt>
                      <dd className="text-sm text-gray-900">{project.equipmentCategory}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">商品カテゴリ</dt>
                      <dd className="text-sm text-gray-900">{project.productCategory}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">最終更新</dt>
                      <dd className="text-sm text-gray-900">{project.updatedAt}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* タグ */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  タグ
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 備考 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  備考
                </h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{project.notes}</p>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">メンバー一覧</h3>
                <Link href={`/project/demo/pj-005?id=${project.id}`}>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    メンバー管理
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoMembers.map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">ロール</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[member.role as keyof typeof roleColors]}`}>
                          {member.role}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">部署</span>
                        <span className="text-sm text-gray-900">{member.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">参加日</span>
                        <span className="text-sm text-gray-900">{member.joinedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">変更履歴</h3>
              <div className="space-y-4">
                {demoHistory.map((history) => (
                  <div key={history.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{history.action}</div>
                        <div className="text-sm text-gray-500">
                          {history.oldValue && `変更前: ${history.oldValue}`}
                          {history.oldValue && history.newValue && ' → '}
                          {history.newValue && `変更後: ${history.newValue}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{history.changedBy}</div>
                        <div className="text-sm text-gray-500">{history.changedAt}</div>
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
              <div className="space-y-4">
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
            </div>
          )}
        </div>
      </div>

      {/* 機能説明 */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4">実装済み機能</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
          <div>
            <h4 className="font-medium mb-2">基本情報表示:</h4>
            <ul className="space-y-1">
              <li>• プロジェクト基本情報</li>
              <li>• スケジュール情報</li>
              <li>• タグ・備考表示</li>
              <li>• 進捗状況</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">タブ機能:</h4>
            <ul className="space-y-1">
              <li>• 概要タブ（基本情報）</li>
              <li>• メンバータブ（参加者一覧）</li>
              <li>• 履歴タブ（変更履歴）</li>
              <li>• 設定タブ（拡張予定）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PJ002ProjectDetailDemo() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">読み込み中...</h1>
        </div>
      </div>
    }>
      <PJ002ProjectDetailDemoContent />
    </Suspense>
  );
}


