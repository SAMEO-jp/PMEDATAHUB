'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Package, Settings, Download, FileText, FileDown, Link, Layers } from 'lucide-react';
import { Button } from '@ui/button';
import type { BomFlatRow } from '@src/types/db_bom';
import { DetailZumenInfo } from './DetailZumenInfo';


interface RightSidebarProps {
  bomData: {
    zumen: BomFlatRow;
    parts: BomFlatRow[];
    buzais: BomFlatRow[];
  } | null;
  zumenId: string;
  projectId: string;
  onDownloadImage: () => void;
  onDownloadPDF: () => void;
  onDownloadCAD: () => void;
}

type TabType = 'info' | 'parts' | 'actions' | 'details';

export function RightSidebar({ bomData, zumenId: _zumenId, projectId, onDownloadImage, onDownloadPDF, onDownloadCAD }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const router = useRouter();

  const tabs = [
    { id: 'info' as TabType, label: '図面情報', icon: Info },
    { id: bomData?.zumen.Zumen_Kind === '組立図' ? 'details' as TabType : 'parts' as TabType, 
      label: bomData?.zumen.Zumen_Kind === '組立図' ? '詳細図' : '部品', 
      icon: bomData?.zumen.Zumen_Kind === '組立図' ? FileText : Package },
    { id: 'actions' as TabType, label: 'アクション', icon: Settings },
  ];

  // 図面ページへの遷移ハンドラー
  const handleZumenClick = (zumenId: string) => {
    router.push(`/app_project/${projectId}/zumen/${zumenId.trim()}`);
  };

  if (!bomData) {
    return (
      <div className="w-80 bg-white border-l border-gray-200">
        <div className="p-4 text-center text-gray-500">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // 組図情報の取得（セミコロン区切りで分割）
  const kumitateZumenList = bomData.zumen.Kumitate_Zumen 
    ? bomData.zumen.Kumitate_Zumen.split(';').filter(id => id.trim() !== '')
    : [];

  // 関連図面情報の取得（セミコロン区切りで分割）
  const kanrenZumenList = bomData.zumen.KANREN_ZUMEN 
    ? bomData.zumen.KANREN_ZUMEN.split(';').filter(id => id.trim() !== '')
    : [];

  return (
    <div className="w-80 bg-white border-l border-gray-200">
      {/* タブナビゲーション */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* タブコンテンツ */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'info' && (
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">基本情報</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">図面ID:</span>
                    <span className="font-medium">{bomData.zumen.Zumen_ID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">図面名:</span>
                    <span className="font-medium">{bomData.zumen.Zumen_Name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">種別:</span>
                    <span className="font-medium">{bomData.zumen.Zumen_Kind}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">プロジェクト:</span>
                    <span className="font-medium">{bomData.zumen.project_ID}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">統計情報</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">部品数:</span>
                    <span className="font-medium">{bomData.parts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">部材数:</span>
                    <span className="font-medium">{bomData.buzais.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">総部品数:</span>
                    <span className="font-medium">
                      {bomData.parts.reduce((sum, part) => sum + part.QUANTITY, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 組図情報（詳細図の場合のみ表示） */}
              {bomData.zumen.Zumen_Kind === '詳細図' && kumitateZumenList.length > 0 && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    組図情報
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">組図数:</span>
                      <span className="font-medium">{kumitateZumenList.length}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-600 text-xs">組図ID:</span>
                      <div className="flex flex-wrap gap-1">
                        {kumitateZumenList.map((zumenId, index) => (
                          <button
                            key={index}
                            onClick={() => handleZumenClick(zumenId)}
                            className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-mono hover:bg-purple-200 hover:text-purple-800 transition-colors duration-200 cursor-pointer border border-purple-200 hover:border-purple-300"
                          >
                            {zumenId.trim()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}



              {/* 関連図面情報（常に表示） */}
              <div className="bg-orange-50 p-3 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  関連図面情報
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">関連図面数:</span>
                    <span className="font-medium">{kanrenZumenList.length}</span>
                  </div>
                  {kanrenZumenList.length > 0 ? (
                    <div className="space-y-1">
                      <span className="text-gray-600 text-xs">関連図面ID:</span>
                      <div className="flex flex-wrap gap-1">
                        {kanrenZumenList.map((zumenId, index) => (
                          <button
                            key={index}
                            onClick={() => handleZumenClick(zumenId)}
                            className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-mono hover:bg-orange-200 hover:text-orange-800 transition-colors duration-200 cursor-pointer border border-orange-200 hover:border-orange-300"
                          >
                            {zumenId.trim()}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs">関連図面がありません</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parts' && (
          <div className="p-4 space-y-3">
            <h4 className="font-medium text-gray-800 mb-3">部品一覧</h4>
            {bomData.parts.length > 0 ? (
              <div className="space-y-2 max-h-[576px] overflow-auto">
                {bomData.parts.map((part, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-medium">{part.PART_ID}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">名称:</span>
                        <span className="font-medium truncate ml-2">{part.PART_NAME}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">数量:</span>
                        <span className="font-medium">{part.QUANTITY}</span>
                      </div>
                      {part.PART_TANNI_WEIGHT && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">重量:</span>
                          <span className="font-medium">{part.PART_TANNI_WEIGHT} kg</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">部品情報がありません</p>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="p-4 space-y-3">
            <h4 className="font-medium text-gray-800 mb-3">詳細図一覧</h4>
            <DetailZumenInfo zumen={bomData.zumen} projectId={projectId} />
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="p-4 space-y-4">
            <h4 className="font-medium text-gray-800 mb-3">ダウンロード</h4>
            
            <div className="space-y-3">
              <Button
                onClick={onDownloadImage}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                画像データ
              </Button>
              
              <Button
                onClick={onDownloadPDF}
                variant="outline"
                className="w-full justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                図面PDFデータ
              </Button>
              
              <Button
                onClick={onDownloadCAD}
                variant="outline"
                className="w-full justify-start"
              >
                <FileDown className="h-4 w-4 mr-2" />
                CADデータ
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">アップロード</h5>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <FileText className="h-4 w-4 mr-2" />
                ファイルをアップロード
              </Button>
              <p className="text-xs text-gray-500 mt-1">※実装予定</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">コメント</h5>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <FileText className="h-4 w-4 mr-2" />
                コメントを追加
              </Button>
              <p className="text-xs text-gray-500 mt-1">※実装予定</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">将来のTODO</h5>
              <div className="space-y-2">
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded border">
                  • 図面検討会の意見、改善メモとの連携
                </div>
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded border">
                  • 製鉄所打合せメモとの連携
                </div>
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded border">
                  • 検討書との連携
                </div>
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded border">
                  • 関連図面、電気図面、購入品図面の登録
                </div>
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded border">
                  • 第三者検図結果、検図結果の登録
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}