'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Database, 
  Table,
  BarChart3,
  Calendar,
  FileText,
  Search,
  Download,
  RefreshCw,
  Eye,
  Settings,
  TrendingUp,
  AlertCircle,
  Info,
  Activity
} from 'lucide-react';
import { useTableDetail, useTableSchema, useTableData, useTableStatistics } from '@src/hooks/useTableData';
import { TableView } from '@src/components/table/TableView';

export default function TableDetailPage() {
  const params = useParams();
  const tableId = decodeURIComponent(params.id as string);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sampleLimit, setSampleLimit] = useState(50);
  
  // データを取得
  const { data: tableDetail, isLoading: isDetailLoading, error: detailError } = useTableDetail(tableId);
  const { data: tableSchema, isLoading: isSchemaLoading } = useTableSchema(tableId);  
  const { data: tableData, isLoading: isDataLoading } = useTableData(tableId, sampleLimit);
  const { data: tableStats, isLoading: isStatsLoading } = useTableStatistics(tableId);

  const table = tableDetail?.data;
  const schema = tableSchema?.data;
  const sampleData = tableData?.data?.rows || [];
  const columns = tableData?.data?.columns || [];
  const stats = tableStats?.data;

  // TableView用のカラム定義
  const tableViewColumns = useMemo(() => {
    return columns.map((col: any) => ({
      key: col.name,
      label: col.name,
      sortable: true,
      render: (value: any) => {
        if (value === null || value === undefined) return <span className="text-gray-400">NULL</span>;
        if (typeof value === 'string' && value.length > 50) {
          return (
            <div className="max-w-xs">
              <div className="truncate" title={value}>
                {value}
              </div>
            </div>
          );
        }
        return String(value);
      }
    }));
  }, [columns]);

  const tabs = [
    { id: 'overview', label: '概要', icon: Database },
    { id: 'schema', label: 'スキーマ', icon: FileText },
    { id: 'data', label: 'データ', icon: Table },
    { id: 'statistics', label: '統計', icon: BarChart3 },
  ];

  const handleExportSchema = () => {
    if (!schema) return;

    const schemaInfo = {
      tableName: tableId,
      description: table?.description,
      columns: schema?.columns?.map((col: any) => ({
        name: col.name,
        type: col.type,
        nullable: col.nullable,
        defaultValue: col.defaultValue,
        isPrimaryKey: col.primary,
        comment: col.comment
      })) || [],
      indexes: schema?.columns?.filter((col: any) => col.primary).map((col: any) => col.name) || [],
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(schemaInfo, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tableId}_schema.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportData = () => {
    if (sampleData.length === 0) return;

    const headers = columns.map((col: any) => col.name).join(',');
    const rows = sampleData.map((row: any) => 
      columns.map((col: any) => `"${row[col.name] || ''}"`).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${tableId}_data.csv`;
    link.click();
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 基本情報 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            基本情報
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">テーブル名</label>
              <p className="text-lg font-mono bg-gray-50 p-2 rounded">{tableId}</p>
            </div>
            
            {table?.description && (
              <div>
                <label className="text-sm font-medium text-gray-600">説明</label>
                <p className="text-gray-900">{table.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">レコード数</label>
                <p className="text-2xl font-bold text-blue-600">
                  {table?.records?.toLocaleString() || '0'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">カラム数</label>
                <p className="text-2xl font-bold text-green-600">
                  {schema?.columns?.length || 0}
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">最終更新</label>
              <p className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4" />
                {table?.lastUpdated || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* サイズ情報 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            サイズ情報
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">データサイズ</label>
                <p className="text-lg font-semibold">{table?.size || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">インデックス数</label>
                <p className="text-lg font-semibold">{table?.indexes?.length || 0}</p>
              </div>
            </div>
            
            {stats && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">統計情報</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">総レコード数</span>
                    <p className="font-medium text-green-600">{stats.totalRecords || 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">総サイズ</span>
                    <p className="font-medium text-blue-600">{stats.totalSize || '-'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">関連操作</h3>
        <div className="flex flex-wrap gap-3">
          <Link href={`/manage/table/search?table=${encodeURIComponent(tableId)}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Search className="w-4 h-4" />
              データを検索
            </button>
          </Link>
          
          <Link href={`/manage/table/sql`}>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Database className="w-4 h-4" />
              SQLエディタ
            </button>
          </Link>
          
          <button
            onClick={handleExportSchema}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            スキーマ出力
          </button>
        </div>
      </div>
    </div>
  );

  const renderSchemaTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">スキーマ情報</h3>
        <button
          onClick={handleExportSchema}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          スキーマ出力
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">カラム名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">データ型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NULL許可</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">デフォルト値</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">キー</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">コメント</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schema?.columns?.map((column: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {column.name}
                      </span>
                      {column.isPrimaryKey && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          PK
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {column.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.nullable ? (
                      <span className="text-green-600">YES</span>
                    ) : (
                      <span className="text-red-600">NO</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {column.defaultValue || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {column.isPrimaryKey && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          PRIMARY
                        </span>
                      )}
                      {column.hasIndex && !column.isPrimaryKey && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          INDEX
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {column.comment || '-'}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    スキーマ情報を読み込み中...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">サンプルデータ</h3>
          <p className="text-sm text-gray-600">最新{sampleLimit}件のデータを表示</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sampleLimit}
            onChange={(e) => setSampleLimit(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={25}>25件</option>
            <option value={50}>50件</option>
            <option value={100}>100件</option>
            <option value={500}>500件</option>
          </select>
          <button
            onClick={handleExportData}
            disabled={sampleData.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            CSV出力
          </button>
        </div>
      </div>

      <TableView
        data={sampleData}
        columns={tableViewColumns}
        loading={isDataLoading}
        paginated={true}
        pageSize={20}
        searchable={true}
        emptyMessage="データがありません"
      />
    </div>
  );

  const renderStatisticsTab = () => (
    <div className="space-y-6">
      {stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">成長率</p>
                  <p className="text-2xl font-bold text-green-600">{stats.growthRate}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">インデックス数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.indexCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold mb-4">詳細統計</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-3">基本情報</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>総レコード数</span>
                    <span>{stats.totalRecords}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>総サイズ</span>
                    <span>{stats.totalSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>平均レコードサイズ</span>
                    <span>{stats.avgRecordSize}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-3">構造情報</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>カラム数</span>
                    <span>{stats.columnCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>インデックス数</span>
                    <span>{stats.indexCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>最終更新</span>
                    <span>{stats.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : isStatsLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">統計情報を読み込み中...</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Info className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">統計情報が利用できません</p>
        </div>
      )}
    </div>
  );

  if (isDetailLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">テーブル情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">エラーが発生しました</h3>
              <p className="text-sm text-red-700 mt-1">テーブル情報の読み込みに失敗しました。</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/manage/table/tables">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              テーブル一覧に戻る
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">テーブル詳細</h1>
            <p className="text-gray-600 font-mono">{tableId}</p>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map(tab => {
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
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'schema' && renderSchemaTab()}
        {activeTab === 'data' && renderDataTab()}
        {activeTab === 'statistics' && renderStatisticsTab()}
      </div>
    </div>
  );
}