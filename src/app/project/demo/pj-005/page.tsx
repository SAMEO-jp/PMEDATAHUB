'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Search, UserPlus, UserMinus, Edit, Users, Shield, Mail, Building } from 'lucide-react';

// デモデータ
const demoProjects = {
  'E923BXX215000': {
    id: 'E923BXX215000',
    name: '君津２高炉BP水素吹き込み対応',
    status: '進行中'
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
    avatar: 'TT',
    isActive: true
  },
  {
    id: '2',
    name: '佐藤花子',
    role: '開発者',
    email: 'sato@example.com',
    department: '開発部',
    joinedAt: '2025-03-05',
    avatar: 'SH',
    isActive: true
  },
  {
    id: '3',
    name: '鈴木一郎',
    role: '設計者',
    email: 'suzuki@example.com',
    department: '設計部',
    joinedAt: '2025-03-10',
    avatar: 'SI',
    isActive: true
  },
  {
    id: '4',
    name: '高橋次郎',
    role: 'テスター',
    email: 'takahashi@example.com',
    department: '品質管理部',
    joinedAt: '2025-03-15',
    avatar: 'TJ',
    isActive: true
  }
];

const availableUsers = [
  {
    id: '5',
    name: '山田三郎',
    email: 'yamada@example.com',
    department: '技術部',
    avatar: 'YS'
  },
  {
    id: '6',
    name: '伊藤四郎',
    email: 'ito@example.com',
    department: '開発部',
    avatar: 'IS'
  },
  {
    id: '7',
    name: '渡辺五郎',
    email: 'watanabe@example.com',
    department: '設計部',
    avatar: 'WG'
  }
];

const roleColors = {
  'プロジェクトマネージャー': 'bg-purple-100 text-purple-800',
  '開発者': 'bg-blue-100 text-blue-800',
  '設計者': 'bg-green-100 text-green-800',
  'テスター': 'bg-orange-100 text-orange-800',
  '閲覧者': 'bg-gray-100 text-gray-800'
};

const roles = [
  { value: 'プロジェクトマネージャー', label: 'プロジェクトマネージャー' },
  { value: '開発者', label: '開発者' },
  { value: '設計者', label: '設計者' },
  { value: 'テスター', label: 'テスター' },
  { value: '閲覧者', label: '閲覧者' }
];

function PJ005MemberManagementDemoContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id') || 'E923BXX215000';
  
  const [members, setMembers] = useState(demoMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('開発者');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const project = demoProjects[projectId as keyof typeof demoProjects];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableUsersForAdd = availableUsers.filter(user =>
    !members.some(member => member.id === user.id)
  );

  // メンバー追加
  const handleAddMember = () => {
    if (selectedUser && selectedRole) {
      const newMember = {
        ...selectedUser,
        role: selectedRole,
        joinedAt: new Date().toISOString().split('T')[0],
        isActive: true
      };
      setMembers(prev => [...prev, newMember]);
      setShowAddModal(false);
      setSelectedUser(null);
      setSelectedRole('開発者');
    }
  };

  // ロール変更
  const handleChangeRole = () => {
    if (selectedMember && selectedRole) {
      setMembers(prev => prev.map(member =>
        member.id === selectedMember.id
          ? { ...member, role: selectedRole }
          : member
      ));
      setShowEditModal(false);
      setSelectedMember(null);
      setSelectedRole('開発者');
    }
  };

  // メンバー削除
  const handleRemoveMember = () => {
    if (selectedMember) {
      setMembers(prev => prev.filter(member => member.id !== selectedMember.id));
      setShowRemoveModal(false);
      setSelectedMember(null);
    }
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PJ-005: メンバー管理</h1>
            <p className="text-gray-600 mt-2">参加メンバーの登録・権限付与・履歴管理</p>
            {/* プロジェクト情報をより目立つように表示 */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-900">管理対象プロジェクト</h2>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-600">プロジェクト名:</span>
                  <span className="ml-2 text-lg font-bold text-gray-900">{project.name}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">ステータス:</span>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">{project.status}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">プロジェクトID:</span>
                  <span className="ml-2 text-sm font-mono text-gray-700">{project.id}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/project/demo/pj-002?id=${project.id}`}>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                詳細に戻る
              </button>
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              メンバー追加
            </button>
          </div>
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="メンバー名、メール、部署で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* メンバー一覧 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            「{project.name}」のメンバー一覧 ({filteredMembers.length}人)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メンバー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ロール
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部署
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  参加日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[member.role as keyof typeof roleColors]}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.joinedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setSelectedRole(member.role);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowRemoveModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* メンバー追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                メンバー追加
              </h3>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>対象プロジェクト:</strong> {project.name}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ユーザー選択
                  </label>
                  <select
                    value={selectedUser?.id || ''}
                    onChange={(e) => {
                      const user = availableUsersForAdd.find(u => u.id === e.target.value);
                      setSelectedUser(user || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">ユーザーを選択してください</option>
                    {availableUsersForAdd.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email}) - {user.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ロール選択
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedUser(null);
                    setSelectedRole('開発者');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  追加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ロール変更モーダル */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Edit className="w-5 h-5" />
                ロール変更
              </h3>
              
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>対象プロジェクト:</strong> {project.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>{selectedMember.name}</strong> のロールを変更します
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新しいロール
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMember(null);
                    setSelectedRole('開発者');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleChangeRole}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  変更
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メンバー削除モーダル */}
      {showRemoveModal && selectedMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserMinus className="w-5 h-5" />
                メンバー削除
              </h3>
              
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 mb-2">
                  <strong>対象プロジェクト:</strong> {project.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{selectedMember.name}</strong> をプロジェクトから削除しますか？
                </p>
                <p className="text-xs text-gray-500">
                  この操作は取り消すことができません。
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRemoveModal(false);
                    setSelectedMember(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleRemoveMember}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 機能説明 */}
      <div className="mt-8 bg-red-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4">実装済み機能</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-800">
          <div>
            <h4 className="font-medium mb-2">メンバー操作:</h4>
            <ul className="space-y-1">
              <li>• メンバー追加（ユーザー選択 + ロール設定）</li>
              <li>• ロール変更（権限の更新）</li>
              <li>• メンバー削除（確認ダイアログ）</li>
              <li>• メンバー検索・フィルタリング</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">権限管理:</h4>
            <ul className="space-y-1">
              <li>• 5つのロール（PM/開発者/設計者/テスター/閲覧者）</li>
              <li>• ロール別の色分け表示</li>
              <li>• 参加履歴の記録</li>
              <li>• 権限チェック機能（拡張予定）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PJ005MemberManagementDemo() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">読み込み中...</h1>
        </div>
      </div>
    }>
      <PJ005MemberManagementDemoContent />
    </Suspense>
  );
}
