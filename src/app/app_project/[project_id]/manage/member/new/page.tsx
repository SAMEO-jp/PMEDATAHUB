'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProjectMembers, useDepartments, useAllUsers } from '@src/hooks/useProjectData';

// tRPCの型を使用
type Department = {
  id: number;
  name: string;
  department_kind: string;
  top_department: string | null;
  status: string;
};

type User = {
  user_id: string;
  name_japanese: string;
  TEL: string | null;
  mail: string | null;
  bumon: string | null;
  sitsu: string | null;
  ka: string | null;
  in_year: string | null;
  Kengen: string | null;
};

// プロジェクトメンバーの型（tRPCから取得されるデータ構造に基づく）

// 階層構造型
interface DepartmentTree {
  [bu: string]: {
    [sitsu: string]: string[] // 課のリスト
  }
}

// 役職グループ順（部長→部長代理→課長→室長）
const positionOrder = [
  ['部長', '部長代理', '課長', '室長'],
  ['上席主幹'],
  ['主幹'],
  ['主査'],
  ['メンバー']
];

function normalize(str: string | null | undefined) {
  return (str || '').trim().toLocaleUpperCase().replace(/\s/g, '');
}

interface NewMemberPageProps {
  params: {
    project_id: string;
  };
}

export default function NewMemberPage({ params }: NewMemberPageProps) {
  const [tree, setTree] = useState<DepartmentTree>({});
  const [selectedBu, setSelectedBu] = useState<string>("");
  const [selectedSitsu, setSelectedSitsu] = useState<string>("");
  const [selectedKa, setSelectedKa] = useState<string>("");
  const [addedUserIds, setAddedUserIds] = useState<string[]>([]);
  const router = useRouter();

  // tRPCを使用してプロジェクトメンバー管理
  const { handleAddMember: addMemberToProject, isAddingMember, members } = useProjectMembers(params.project_id);

  // tRPCを使用して部署データ取得
  const { data: departments = [], isLoading: isLoadingDepartments } = useDepartments();

  // tRPCを使用して全ユーザーデータ取得
  const { data: users = [], isLoading: isLoadingUsers } = useAllUsers();

  // 部署データが変更されたらツリーを再生成
  useEffect(() => {
    if (departments.length > 0) {
      // 部→室→課のツリー生成
      const buList = departments.filter((d: any) => d.department_kind === "部");
      const sitsuList = departments.filter((d: any) => d.department_kind === "室");
      const kaList = departments.filter((d: any) => d.department_kind === "課");
      const newTree: DepartmentTree = {};
      buList.forEach((bu: any) => {
        newTree[bu.name] = {};
        const sitsus = sitsuList.filter((s: any) => normalize(s.top_department) === normalize(bu.name));
        sitsus.forEach((sitsu: any) => {
          newTree[bu.name][sitsu.name] = kaList
            .filter((k: any) => normalize(k.top_department) === normalize(sitsu.name))
            .map((k: any) => k.name);
        });
      });
      setTree(newTree);
    }
  }, [departments]);

  // プロジェクト参加メンバー取得（tRPCから取得したデータを使用）
  const projectMembers = members.map((member: any) => member.user);

  // 選択肢リスト
  const buList = Object.keys(tree);
  const sitsuList = selectedBu ? Object.keys(tree[selectedBu] || {}) : [];
  const kaList = (selectedBu && selectedSitsu) ? tree[selectedBu][selectedSitsu] || [] : [];

  // メンバーリストのロジック
  let memberList: User[] = [];
  if (selectedBu && !selectedSitsu && !selectedKa) {
    // 部だけ選択時: 部に所属し、sectionもteamも空の人のみ
    memberList = users.filter((u: any) =>
      u.bumon === selectedBu && !u.sitsu && !u.ka
    );
  } else if (selectedBu && selectedSitsu && !selectedKa) {
    // 室選択時: 室に所属し、teamが空
    memberList = users.filter((u: any) =>
      u.bumon === selectedBu &&
      u.sitsu === selectedSitsu &&
      (!u.ka)
    );
  } else if (selectedBu && selectedSitsu && selectedKa) {
    // 課選択時: 課に所属
    memberList = users.filter((u: any) =>
      u.bumon === selectedBu &&
      u.sitsu === selectedSitsu &&
      u.ka === selectedKa
    );
  }

  // 役職ごとにグループ化し、各グループ内で年次順（なければ社員番号順）でソート
  const groupedMembers: User[][] = positionOrder.map(roles =>
    memberList
      .filter((u: any) => (u.Kengen && roles.includes(u.Kengen)) || (roles[0] === 'メンバー' && (!u.Kengen || !positionOrder.flat().includes(u.Kengen))))
      .sort((a, b) => {
        // 部長→部長代理→課長→室長の順
        if (roles.length > 1) {
          const idxA = roles.indexOf(a.Kengen || '');
          const idxB = roles.indexOf(b.Kengen || '');
          if (idxA !== idxB) return idxA - idxB;
        }
        return (a.in_year ? a.in_year : a.user_id).localeCompare(b.in_year ? b.in_year : b.user_id);
      })
  );

  // メンバー追加処理
  const handleAddMemberToProject = async (user: User) => {
    try {
      await addMemberToProject(user.user_id, "閲覧者");
      setAddedUserIds(ids => [...ids, user.user_id]);
      // メンバー追加成功後、メンバー管理画面に戻る
      router.push(`/app_project/${params.project_id}/manage/member`);
    } catch (error) {
      console.error('メンバー追加エラー:', error);
      alert('メンバー追加に失敗しました');
    }
  };

  // すでにプロジェクトに参加しているか
  const isAlreadyMember = (user: User) => projectMembers.some((pm: any) => pm.user_id === user.user_id);

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
          <li>/</li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}`)}
              className="hover:text-blue-600 transition-colors"
            >
              プロジェクト詳細
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage`)}
              className="hover:text-blue-600 transition-colors"
            >
              管理
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push(`/app_project/${params.project_id}/manage/member`)}
              className="hover:text-blue-600 transition-colors"
            >
              メンバー管理
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">メンバー追加</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">メンバー追加</h1>
          <p className="text-gray-600 mt-1">組織階層からメンバーを選択してプロジェクトに追加します</p>
        </div>
        <button
          onClick={() => router.push(`/app_project/${params.project_id}/manage/member`)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          メンバー管理に戻る
        </button>
      </div>

      {/* ローディング表示 */}
      {isLoadingDepartments || isLoadingUsers ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">データを読み込み中...</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 p-6 bg-gradient-to-br from-blue-100 to-orange-100 rounded-2xl min-h-[80vh] shadow-xl justify-center">
          {/* 4カラム均等レイアウト */}
          <div className="w-1/5 min-w-[140px] h-[600px] flex flex-col">
            <Card className="shadow-lg rounded-xl bg-white h-full">
              <CardHeader><CardTitle>部</CardTitle></CardHeader>
              <CardContent>
                {buList.map(bu => (
                  <Button
                    key={bu}
                    variant={selectedBu === bu ? "default" : "outline"}
                    className={`w-full mb-2 text-left rounded-lg transition-all ${selectedBu === bu ? 'bg-black text-white font-bold shadow' : 'hover:bg-orange-50'}`}
                    onClick={() => {
                      setSelectedBu(bu);
                      setSelectedSitsu("");
                      setSelectedKa("");
                    }}
                  >
                    {bu}
                  </Button>
                ))}
              </CardContent>
            </Card>
        </div>
        <div className="w-1/5 min-w-[140px] h-[600px] flex flex-col">
          <Card className="shadow-lg rounded-xl bg-white h-full">
            <CardHeader><CardTitle>室</CardTitle></CardHeader>
            <CardContent>
              {sitsuList.map(sitsu => (
                <Button
                  key={sitsu}
                  variant={selectedSitsu === sitsu ? "default" : "outline"}
                  className={`w-full mb-2 text-left rounded-lg transition-all ${selectedSitsu === sitsu ? 'bg-black text-white font-bold shadow' : 'hover:bg-orange-50'}`}
                  onClick={() => {
                    setSelectedSitsu(sitsu);
                    setSelectedKa("");
                  }}
                  disabled={!selectedBu}
                >
                  {sitsu}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-1/5 min-w-[140px] h-[600px] flex flex-col">
          <Card className="shadow-lg rounded-xl bg-white h-full">
            <CardHeader><CardTitle>課</CardTitle></CardHeader>
            <CardContent>
              {kaList.map(ka => (
                <Button
                  key={ka}
                  variant={selectedKa === ka ? "default" : "outline"}
                  className={`w-full mb-2 text-left rounded-lg transition-all ${selectedKa === ka ? 'bg-black text-white font-bold shadow' : 'hover:bg-orange-50'}`}
                  onClick={() => setSelectedKa(ka)}
                  disabled={!selectedSitsu}
                >
                  {ka}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-2/5 min-w-[320px] h-[1000px] flex flex-col">
          <Card className="shadow-lg rounded-xl bg-white h-full">
            <CardContent>
              <div className="flex flex-col gap-4 h-full overflow-y-auto">
                {groupedMembers.map((group, idx) => (
                  group.length > 0 && (
                    <div key={idx}>
                      {idx > 0 && <hr className="my-2 border-t-2 border-gray-200" />}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {group.map(user => (
                          <div
                            key={user.user_id}
                            className={`p-2 border rounded-xl shadow flex flex-col gap-1 border w-full min-h-[88px] justify-between break-words whitespace-normal`}
                          >
                            <div className="font-bold text-xs text-orange-700 flex items-center gap-1 break-words whitespace-normal">
                              <span>{user.name_japanese}</span>
                              <span className="text-[10px] text-gray-500 break-words whitespace-normal">({user.user_id})</span>
                            </div>
                            <div className="text-xs text-gray-700 break-words whitespace-normal">役職: {user.Kengen || '-'}</div>
                            <div className="text-xs text-gray-500 break-words whitespace-normal">{user.in_year ? `入社: ${user.in_year}` : ''}</div>
                            <div className="flex justify-end mt-1">
                              <Button
                                size="sm"
                                className="rounded-full px-2 py-0.5 shadow hover:bg-orange-200 transition-all text-xs"
                                disabled={isAddingMember || addedUserIds.includes(user.user_id) || isAlreadyMember(user)}
                                onClick={() => void handleAddMemberToProject(user)}
                              >
                                {isAlreadyMember(user)
                                  ? "参加済み"
                                  : addedUserIds.includes(user.user_id)
                                    ? "追加済み"
                                    : isAddingMember
                                      ? "追加中..."
                                      : "追加"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
                {groupedMembers.flat().length === 0 && (
                  <div className="text-gray-400 text-center py-8">
                    該当するメンバーがいません
                    <br />
                    <span className="text-sm">部・室・課を選択してください</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
}
