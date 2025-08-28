'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Database, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  RefreshCw, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive
} from 'lucide-react';
import { useStatisticsDashboard, useTableSizeManager, useGrowthAnalysis, usePerformanceMonitor } from '@src/hooks/useStatisticsData';
import { StatisticsChart, DatabaseOverviewChart, TableSizeChart, GrowthTrendChart } from '@src/components/statistics/StatisticsChart';

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // 統計データを取得
  const {
    databaseStats,
    tableSizes,
    growthRates,
    performanceStats,
    selectedPeriod,
    selectedTable,
    isLoading,
    hasError,
    setSelectedPeriod,
    setSelectedTable,
    refreshAllStats,
    errors
  } = useStatisticsDashboard();

  const { tables: sizeTableData, handleSort, getTopTables } = useTableSizeManager();
  const { getFastestGrowingTables, getAverageGrowthRate } = useGrowthAnalysis();
  const { alerts, performanceScore } = usePerformanceMonitor();

  const tabs = [
    { id: 'overview', label: '概要', icon: Database },
    { id: 'sizes', label: 'サイズ分析', icon: HardDrive },
    { id: 'growth', label: '成長率', icon: TrendingUp },
    { id: 'performance', label: 'パフォーマンス', icon: Activity },
  ];

  const handleExportData = () => {
    const exportData = {
      databaseStats,
      tableSizes,
      growthRates,
      performanceStats,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `database_statistics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* データベース概要 */}
      {databaseStats && <DatabaseOverviewChart data={databaseStats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 主要統計 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            データベース詳細統計
          </h3>
          
          {databaseStats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">総容量</div>
                  <div className="text-lg font-semibold">{databaseStats.totalSize}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">平均レコードサイズ</div>
                  <div className="text-lg font-semibold">{databaseStats.averageRecordSize}</div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">最大テーブル</h4>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm">{databaseStats.largestTable?.name}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{databaseStats.largestTable?.records.toLocaleString()}件</div>
                    <div className="text-xs text-gray-500">{databaseStats.largestTable?.size}</div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">最も活発なテーブル</h4>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm">{databaseStats.mostActiveTable?.name}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{databaseStats.mostActiveTable?.dailyUpdates}更新/日</div>
                    <div className="text-xs text-green-600">{databaseStats.mostActiveTable?.weeklyGrowth}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>統計データを読み込み中...</p>
            </div>
          )}
        </div>

        {/* ディスク使用量 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-purple-600" />
            ディスク使用量
          </h3>
          
          {databaseStats ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">データサイズ</span>
                  <span className="font-medium">{databaseStats.diskUsage?.dataSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">インデックスサイズ</span>
                  <span className="font-medium">{databaseStats.diskUsage?.indexSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ログサイズ</span>
                  <span className="font-medium">{databaseStats.diskUsage?.logSize}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">空き容量</span>
                    <span className="font-medium text-green-600">{databaseStats.diskUsage?.freeSpace}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <HardDrive className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>ディスク使用量を読み込み中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSizesTab = () => (
    <div className="space-y-6">
      {/* テーブルサイズチャート */}
      {sizeTableData && <TableSizeChart data={sizeTableData} />}
      
      {/* トップテーブル */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">サイズ上位テーブル</h3>
        <div className="space-y-2">
          {getTopTables(10).map((table, index) => (
            <div key={table.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="font-mono text-sm">{table.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{table.totalSize}</div>
                <div className="text-xs text-gray-500">{table.records.toLocaleString()}件</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGrowthTab = () => (
    <div className="space-y-6">
      {/* 期間選択 */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">分析期間:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">週間</option>
            <option value="month">月間</option>
            <option value="quarter">四半期</option>
            <option value="year">年間</option>
          </select>
        </div>
      </div>

      {/* 成長トレンドチャート */}
      {growthRates?.growthData && <GrowthTrendChart data={growthRates.growthData} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 急成長テーブル */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            急成長テーブル
          </h3>
          <div className="space-y-3">
            {getFastestGrowingTables().map(table => (
              <div key={table.tableName} className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="font-mono text-sm">{table.tableName}</span>
                <div className="text-right">
                  <div className="text-green-600 font-medium">+{table.growthRate}</div>
                  <div className="text-xs text-gray-500">{table.recordGrowth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 成長率サマリー */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">成長率サマリー</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{getAverageGrowthRate().toFixed(1)}%</div>
              <div className="text-sm text-blue-800">平均成長率</div>
            </div>
            
            {growthRates?.summary && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">総成長レコード数</span>
                  <span className="font-medium">{growthRates.summary.totalGrowthRecords.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">最速成長テーブル</span>
                  <span className="font-medium">{growthRates.summary.fastestGrowingTable}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">来月予測サイズ</span>
                  <span className="font-medium">{growthRates.summary.projectedSizeNextMonth}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {/* パフォーマンススコア */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          パフォーマンススコア
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    総合スコア
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {performanceScore}/100
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div 
                  style={{ width: `${performanceScore}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    performanceScore >= 80 ? 'bg-green-500' : 
                    performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* アラート */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            パフォーマンスアラート
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 rounded border-l-4 ${
                  alert.severity === 'error' 
                    ? 'bg-red-50 border-red-500 text-red-800' 
                    : 'bg-yellow-50 border-yellow-500 text-yellow-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {alert.severity === 'error' ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  <span className="font-medium">{alert.type}</span>
                </div>
                <p className="text-sm mt-1">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* クエリ統計 */}
      {performanceStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">クエリ統計</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">総クエリ数</span>
                <span className="font-medium">{performanceStats.queryStats.totalQueries.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">平均実行時間</span>
                <span className="font-medium">{performanceStats.queryStats.averageExecutionTime.toFixed(3)}秒</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">スロークエリ数</span>
                <span className="font-medium text-red-600">{0}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">最遅クエリ</h4>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-mono text-xs text-gray-800 mb-1">
                  {performanceStats.queryStats?.slowestQuery?.query.substring(0, 60)}...
                </div>
                <div className="text-xs text-gray-500">
                  実行時間: {performanceStats.queryStats?.slowestQuery?.executionTime.toFixed(3)}秒
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">システム統計</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">キャッシュヒット率</span>
                  <span className="font-medium">{performanceStats.cacheStats.hitRate}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: performanceStats.cacheStats.hitRate }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">アクティブ接続</span>
                <span className="font-medium">
                  {performanceStats.connectionStats.activeConnections}/{performanceStats.connectionStats.maxConnections}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">インデックス効率</span>
                <span className="font-medium">{performanceStats.indexStats.indexEfficiency}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">未使用インデックス</span>
                <span className="font-medium text-orange-600">{performanceStats.indexStats.unusedIndexes}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/manage/table">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              戻る
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">データベース統計</h1>
            <p className="text-gray-600">データベースのパフォーマンスと成長分析</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={refreshAllStats}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            更新
          </button>
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            エクスポート
          </button>
        </div>
      </div>

      {/* エラー表示 */}
      {hasError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">統計データの取得に失敗しました</h3>
              <p className="text-sm text-red-700 mt-1">データベース接続を確認してください。</p>
            </div>
          </div>
        </div>
      )}

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
      <div className="min-h-96">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'sizes' && renderSizesTab()}
        {activeTab === 'growth' && renderGrowthTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
      </div>
    </div>
  );
}