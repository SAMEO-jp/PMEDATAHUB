'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from '@src/lib/trpc/client';
import { useUserAll } from '@src/hooks/useUserData';
import { Search, Users, ChevronRight, Building, User, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

const ITEMS_PER_PAGE = 25;

export default function UserListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // tRPC hooks
  const { data: userList, isLoading } = useUserAll();

  // 検索フィルター
  const filteredUsers = useMemo(() => {
    return (userList as any)?.data?.filter((user: any) =>
      user.name_japanese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.bumon && user.bumon.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.Kengen && user.Kengen.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];
  }, [userList, searchTerm]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleUserClick = (userId: string) => {
    router.push(`/page/user/${userId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // 検索条件変更時は1ページ目に戻る
  };

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">ユーザー一覧</h1>
          <p className="text-gray-600 mt-1">全ユーザーの一覧と詳細情報の確認ができます</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="名前、社員番号、部署、役職で検索..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button
            onClick={() => router.push('/page/user/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <User className="mr-2 h-4 w-4" />
            ユーザー追加
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            ユーザー一覧 ({filteredUsers.length}件中 {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}件表示)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>社員番号</TableHead>
                  <TableHead>名前</TableHead>
                  <TableHead>部署</TableHead>
                  <TableHead>役職</TableHead>
                  <TableHead>入社年</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user: any) => (
                  <TableRow
                    key={user.user_id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserClick(user.user_id)}
                  >
                    <TableCell className="font-medium">{user.user_id}</TableCell>
                    <TableCell>{user.name_japanese}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building className="mr-1 h-4 w-4 text-gray-400" />
                        {user.bumon && user.sitsu && user.ka
                          ? `${user.bumon} ${user.sitsu} ${user.ka}`
                          : user.bumon || '-'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.Kengen && (
                        <Badge variant="secondary">{user.Kengen}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.in_year || '-'}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user.user_id);
                        }}
                      >
                        <User className="mr-1 h-4 w-4" />
                        詳細
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">
                {searchTerm ? '検索条件に一致するユーザーが見つかりません' : 'ユーザーが見つかりません'}
              </p>
              <p className="text-sm mb-4">
                {searchTerm ? '検索条件を変更して再度お試しください' : 'データベースにユーザーが登録されていない可能性があります'}
              </p>
              {filteredUsers.length === 0 && searchTerm && (
                <p className="text-sm text-gray-400 mt-2">
                  全{filteredUsers.length}件中 0件表示
                </p>
              )}
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                >
                  検索条件をクリア
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {totalPages > 0 && (
              <>ページ {currentPage} / {totalPages}</>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              前へ
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              次へ
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
