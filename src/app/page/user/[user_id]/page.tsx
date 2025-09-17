'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from '@src/lib/trpc/client';
import { useUserDetail, useUserTimeline } from '@src/hooks/useProjectData';
import {
  ArrowLeft,
  User,
  Building,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  Users,
  Settings,
  Package,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface UserDetailPageProps {
  params: {
    user_id: string;
  };
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('setsubi');

  // tRPC hooks
  const { data: userDetail, isLoading } = useUserDetail(params.user_id);
  const { data: timeline, isLoading: timelineLoading } = useUserTimeline(params.user_id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!(userDetail as any)?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-500">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">ユーザーが見つかりません</p>
          <Button
            onClick={() => router.push('/page/user')}
            className="mt-4"
          >
            一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  const user = (userDetail as any).data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <button
              onClick={() => router.push('/')}
              className="hover:text-blue-600 transition-colors"
            >
              ホーム
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <button
              onClick={() => router.push('/page/user')}
              className="hover:text-blue-600 transition-colors"
            >
              ユーザー一覧
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-gray-900 font-medium">{user.name_japanese}</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.name_japanese}</h1>
          <p className="text-gray-600 mt-1">社員番号: {user.user_id}</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => router.push(`/page/user/${user.user_id}/edit`)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Settings className="mr-2 h-4 w-4" />
            編集
          </Button>
          <Button
            onClick={() => router.push('/page/user')}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="projects">参加プロジェクト</TabsTrigger>
          <TabsTrigger value="setsubi">担当設備</TabsTrigger>
          <TabsTrigger value="kounyu">担当購入品</TabsTrigger>
          <TabsTrigger value="timeline">プロジェクト年表</TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 基本情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  基本情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 mr-2">名前:</span>
                    <span className="font-medium">{user.name_japanese}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">社員番号:</span>
                    <span className="font-medium">{user.user_id}</span>
                  </div>

                  {user.TEL && (
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 mr-2">電話:</span>
                      <span>{user.TEL}</span>
                    </div>
                  )}

                  {user.mail && (
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 mr-2">メール:</span>
                      <span>{user.mail}</span>
                    </div>
                  )}

                  {user.bumon && (
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 mr-2">部署:</span>
                      <span>{user.bumon} {user.sitsu} {user.ka}</span>
                    </div>
                  )}

                  {user.Kengen && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">役職:</span>
                      <Badge variant="secondary">{user.Kengen}</Badge>
                    </div>
                  )}

                  {user.in_year && (
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 mr-2">入社年:</span>
                      <span>{user.in_year}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 統計情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  統計情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{user.projects.length}</div>
                    <div className="text-sm text-gray-600">参加プロジェクト</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{user.setsubi_assignments.length}</div>
                    <div className="text-sm text-gray-600">担当設備</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{user.kounyu_assignments.length}</div>
                    <div className="text-sm text-gray-600">担当購入品</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {user.projects.length + user.setsubi_assignments.length + user.kounyu_assignments.length}
                    </div>
                    <div className="text-sm text-gray-600">総担当数</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 参加プロジェクトタブ */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  参加プロジェクト ({user.projects.length})
                </CardTitle>
                <Button
                  onClick={() => router.push(`/page/user/${user.user_id}/projects/add`)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="mr-2 h-4 w-4" />
                  プロジェクト追加
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {user.projects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>プロジェクト名</TableHead>
                      <TableHead>プロジェクトID</TableHead>
                      <TableHead>役割</TableHead>
                      <TableHead>参加日</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.projects.map((project: any) => (
                      <TableRow key={project.project_id}>
                        <TableCell className="font-medium">{project.project_name}</TableCell>
                        <TableCell>{project.project_id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{project.role}</Badge>
                        </TableCell>
                        <TableCell>{new Date(project.joined_at).toLocaleDateString('ja-JP')}</TableCell>
                        <TableCell>
                          <Badge
                            variant={project.status === 'active' ? 'default' : 'secondary'}
                          >
                            {project.status === 'active' ? '進行中' :
                             project.status === 'completed' ? '完了' : 'アーカイブ'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/page/user/${user.user_id}/projects/${project.project_id}/edit`)}
                          >
                            <Settings className="mr-1 h-3 w-3" />
                            編集
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">参加しているプロジェクトはありません</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 担当設備タブ */}
        <TabsContent value="setsubi" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  担当設備 ({user.setsubi_assignments.length})
                </CardTitle>
                <Button
                  onClick={() => router.push(`/page/user/${user.user_id}/setsubi/add`)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  設備追加
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {user.setsubi_assignments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>プロジェクト番号</TableHead>
                      <TableHead>製番</TableHead>
                      <TableHead>設備名</TableHead>
                      <TableHead>担当開始日</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.setsubi_assignments.map((assignment: any) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.project_id}</TableCell>
                        <TableCell>{assignment.seiban}</TableCell>
                        <TableCell>{assignment.setsubi_name}</TableCell>
                        <TableCell>{new Date(assignment.assigned_at).toLocaleDateString('ja-JP')}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/page/user/${user.user_id}/setsubi/${assignment.id}/edit`)}
                          >
                            <Settings className="mr-1 h-3 w-3" />
                            編集
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">担当設備はありません</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 担当購入品タブ */}
        <TabsContent value="kounyu" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  担当購入品 ({user.kounyu_assignments.length})
                </CardTitle>
                <Button
                  onClick={() => router.push(`/page/user/${user.user_id}/kounyu/add`)}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Package className="mr-2 h-4 w-4" />
                  購入品追加
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {user.kounyu_assignments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>プロジェクト番号</TableHead>
                      <TableHead>管理番号</TableHead>
                      <TableHead>購入品名</TableHead>
                      <TableHead>担当開始日</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.kounyu_assignments.map((assignment: any) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.project_id}</TableCell>
                        <TableCell>{assignment.management_number}</TableCell>
                        <TableCell>{assignment.item_name}</TableCell>
                        <TableCell>{new Date(assignment.assigned_at).toLocaleDateString('ja-JP')}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/page/user/${user.user_id}/kounyu/${assignment.id}/edit`)}
                          >
                            <Settings className="mr-1 h-3 w-3" />
                            編集
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">担当購入品はありません</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* プロジェクト年表タブ */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                プロジェクト年表
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (timeline as any)?.data && (timeline as any).data.length > 0 ? (
                <div className="space-y-4">
                  {(timeline as any).data.map((item: any) => (
                    <div key={item.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {item.type === 'project_join' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {item.type === 'setsubi_assign' && <Settings className="h-5 w-5 text-blue-500" />}
                        {item.type === 'kounyu_assign' && <Package className="h-5 w-5 text-orange-500" />}
                        {item.type === 'project_leave' && <XCircle className="h-5 w-5 text-red-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{item.title}</h4>
                          <span className="text-sm text-gray-500">{item.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        {item.project_name && (
                          <Badge variant="outline" className="mt-2">
                            {item.project_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">タイムライン情報はありません</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
