'use client';

import { useState } from 'react';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { Alert, AlertDescription } from '@src/components/ui/alert';
import { Badge } from '@src/components/ui/badge';
import { useBomZumenByProject, useBomZumenMutations } from '@src/hooks/useBomZumenData';
import type { BomZumen } from '@src/types/db_bom';

export default function BomZumenTRPCTest() {
  const [projectId, setProjectId] = useState('PROJECT001');
  const [zumenId, setZumenId] = useState('ZUMEN001');
  const [zumenName, setZumenName] = useState('テスト図面');
  const [zumenKind, setZumenKind] = useState('組立図');
  const [revNumber, setRevNumber] = useState('A');
  const [status, setStatus] = useState('作成中');

  const { zumenList, isLoading, error, refetch } = useBomZumenByProject(projectId);
  const { createZumen, updateZumen, deleteZumen } = useBomZumenMutations();

  const handleCreateZumen = async () => {
    try {
      await createZumen.mutateAsync({
        Zumen_ID: zumenId,
        project_ID: projectId,
        Zumen_Name: zumenName,
        Zumen_Kind: zumenKind,
        rev_number: revNumber,
        status: status,
      });
      
      // フォームをリセット
      setZumenId('');
      setZumenName('');
      setZumenKind('');
      setRevNumber('');
      setStatus('');
    } catch (error) {
      console.error('図面作成エラー:', error);
    }
  };

  const handleUpdateZumen = async (zumen: BomZumen) => {
    try {
      await updateZumen.mutateAsync({
        id: zumen.ROWID,
        data: {
          Zumen_Name: `${zumen.Zumen_Name} (更新済み)`,
          status: '更新済み',
        },
      });
    } catch (error) {
      console.error('図面更新エラー:', error);
    }
  };

  const handleDeleteZumen = async (zumen: BomZumen) => {
    try {
      await deleteZumen.mutateAsync({ id: zumen.ROWID });
    } catch (error) {
      console.error('図面削除エラー:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BOM_ZUMEN tRPC API テスト</CardTitle>
          <CardDescription>
            BOM_ZUMENテーブルのCRUD操作をテストします
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* プロジェクトID入力 */}
          <div className="space-y-2">
            <Label htmlFor="projectId">プロジェクトID</Label>
            <div className="flex gap-2">
              <Input
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="プロジェクトIDを入力"
              />
              <Button onClick={() => void refetch()}>再取得</Button>
            </div>
          </div>

          {/* エラー表示 */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                エラー: {error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* ローディング表示 */}
          {isLoading && (
            <Alert>
              <AlertDescription>データを読み込み中...</AlertDescription>
            </Alert>
          )}

          {/* 図面作成フォーム */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">新規図面作成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zumenId">図面ID</Label>
                  <Input
                    id="zumenId"
                    value={zumenId}
                    onChange={(e) => setZumenId(e.target.value)}
                    placeholder="図面ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zumenName">図面名</Label>
                  <Input
                    id="zumenName"
                    value={zumenName}
                    onChange={(e) => setZumenName(e.target.value)}
                    placeholder="図面名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zumenKind">図面種別</Label>
                  <Input
                    id="zumenKind"
                    value={zumenKind}
                    onChange={(e) => setZumenKind(e.target.value)}
                    placeholder="図面種別"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revNumber">版数</Label>
                  <Input
                    id="revNumber"
                    value={revNumber}
                    onChange={(e) => setRevNumber(e.target.value)}
                    placeholder="版数"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">ステータス</Label>
                  <Input
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="ステータス"
                  />
                </div>
              </div>
                             <Button 
                 onClick={() => void handleCreateZumen()}
                 disabled={createZumen.isPending}
                 className="w-full"
               >
                 {createZumen.isPending ? '作成中...' : '図面を作成'}
               </Button>
            </CardContent>
          </Card>

          {/* 図面一覧 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                図面一覧 ({zumenList.length}件)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {zumenList.length === 0 ? (
                <p className="text-muted-foreground">図面がありません</p>
              ) : (
                <div className="space-y-4">
                  {zumenList.map((zumen) => (
                    <Card key={zumen.ROWID} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{zumen.Zumen_Name}</h3>
                            <Badge variant="secondary">{zumen.Zumen_ID}</Badge>
                            <Badge variant="outline">{zumen.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>プロジェクトID: {zumen.project_ID}</p>
                            <p>図面種別: {zumen.Zumen_Kind}</p>
                            <p>版数: {zumen.rev_number}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                                                     <Button
                             size="sm"
                             variant="outline"
                             onClick={() => void handleUpdateZumen(zumen)}
                             disabled={updateZumen.isPending}
                           >
                             {updateZumen.isPending ? '更新中...' : '更新'}
                           </Button>
                           <Button
                             size="sm"
                             variant="destructive"
                             onClick={() => void handleDeleteZumen(zumen)}
                             disabled={deleteZumen.isPending}
                           >
                             {deleteZumen.isPending ? '削除中...' : '削除'}
                           </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
} 