'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, Database, Calendar, Download, RefreshCw } from 'lucide-react';

// デモデータ
const tableStats = [
  {
    name: 'PROJECT',
    records: 1250,
    size: 2.3,
    growth: 12.5,
    lastUpdated: '2025-01-15',
    category: 'プロジェクト管理'
  },
  {
    name: 'USER',
    records: 89,
    size: 0.156,
    growth: 5.2,
    lastUpdated: '2025-01-14',
    category: 'ユーザー管理'
  },
  {
    name: 'BOM_BUHIN',
    records: 15420,
    size: 8.7,
    growth: 18.3,
    lastUpdated: '2025-01-15',
    category: 'BOM管理'
  },
  {
    name: 'BOM_BUZAI',
    records: 8920,
    size: 5.2,
    growth: 15.7,
    lastUpdated: '2025-01-15',
    category: 'BOM管理'
  },
  {
    name: 'BOM_PART',
    records: 11230,
    size: 6.8,
    growth: 22.1,
    lastUpdated: '2025-01-14',
    category: 'BOM管理'
  },
  {
    name: 'BOM_ZUMEN',
    records: 4560,
    size: 3.4,
    growth: 8.9,
    lastUpdated: '2025-01-13',
    category: 'BOM管理'
  },
  {
    name: 'PALET_MASTER',
    records: 3420,
    size: 4.2,
    growth: 11.4,
    lastUpdated: '2025-01-13',
    category: 'パレット管理'
  },
  {
    name: 'PALET_LIST',
    records: 6780,
    size: 2.1,
    growth: 16.8,
    lastUpdated: '2025-01-15',
    category: 'パレット管理'
  },
  {
    name: 'business_achievements',
    records: 5670,
    size: 3.1,
    growth: 25.6,
    lastUpdated: '2025-01-15',
    category: '業務管理'
  },
  {
    name: 'photos',
    records: 2340,
    size: 12.8,
    growth: 31.2,
    lastUpdated: '2025-01-12',
    category: 'ファイル管理'
  }
];

const monthlyGrowth = [
  { month: '2024-08', records: 45000, size: 45.2 },
  { month: '2024-09', records: 48000, size: 48.1 },
  { month: '2024-10', records: 52000, size: 52.3 },
  { month: '2024-11', records: 55000, size: 55.7 },
  { month: '2024-12', records: 58000, size: 59.2 },
  { month: '2025-01', records: 62000, size: 63.8 }
];

const categoryStats = [
  { category: 'BOM管理', tables: 4, records: 41130, size: 24.1, percentage: 39.2 },
  { category: 'プロジェクト管理', tables: 1, records: 1250, size: 2.3, percentage: 2.0 },
  { category: 'パレット管理', tables: 2, records: 10200, size: 6.3, percentage: 16.4 },
  { category: 'ファイル管理', tables: 1, records: 2340, size: 12.8, percentage: 3.8 },
  { category: '業務管理', tables: 1, records: 5670, size: 3.1, percentage: 9.1 },
  { category: 'ユーザー管理', tables: 1, records: 89, size: 0.156, percentage: 0.1 }
];

const performanceMetrics = [
  { metric: '総テーブル数', value: 16, unit: 'テーブル', trend: 'up', change: '+2' },
  { metric: '総レコード数', value: 62000, unit: 'レコード', trend: 'up', change: '+12.5%' },
  { metric: '総サイズ', value: 63.8, unit: 'MB', trend: 'up', change: '+7.8%' },
  { metric: '平均レコード数', value: 3875, unit: 'レコード/テーブル', trend: 'up', change: '+8.2%' },
  { metric: '最大テーブル', value: 'BOM_BUHIN', unit: '', trend: 'stable', change: '0%' },
  { metric: '最古のデータ', value: '2024-08', unit: '', trend: 'stable', change: '0%' }
];

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('1month');
  const [sortBy, setSortBy] = useState('records');

  const totalStats = {
    tables: tableStats.length,
    records: tableStats.reduce((sum, table) => sum + table.records, 0),
    size: tableStats.reduce((sum, table) => sum + table.size, 0),
    avgGrowth: tableStats.reduce((sum, table) => sum + table.growth, 0) / tableStats.length
  };

  const sortedTables = [...tableStats].sort((a, b) => {
    switch (sortBy) {
      case 'records':
        return b.records - a.records;
      case 'size':
        return b.size - a.size;
      case 'growth':
        return b.growth - a.growth;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/manage/table/demo">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">データベース統計</h1>
            <p className="text-gray-600">データベースの統計情報とパフォーマンス指標</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1week">過去1週間</option>
            <option value="1month">過去1ヶ月</option>
            <option value="3months">過去3ヶ月</option>
            <option value="6months">過去6ヶ月</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            更新
          </button>
        </div>
      </div>

      {/* 主要統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総テーブル数</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.tables}</p>
            </div>
            <Database className="w-12 h-12 text-blue-600" />
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+2 テーブル</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総レコード数</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.records.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-green-600" />
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12.5%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総サイズ</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.size.toFixed(1)} MB</p>
            </div>
            <Database className="w-12 h-12 text-purple-600" />
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+7.8%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均成長率</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.avgGrowth.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-600" />
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+2.3%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* テーブル別統計 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">テーブル別統計</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="records">レコード数順</option>
                <option value="size">サイズ順</option>
                <option value="growth">成長率順</option>
                <option value="name">名前順</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {sortedTables.slice(0, 8).map((table) => (
                <div key={table.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{table.name}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {table.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>{table.records.toLocaleString()} レコード</span>
                      <span>{table.size} MB</span>
                      <span className="text-green-600">+{table.growth}%</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {table.lastUpdated}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* カテゴリ別統計 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold">カテゴリ別統計</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {categoryStats.map((category) => (
                <div key={category.category} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">{category.category}</h3>
                    <span className="text-sm text-gray-600">{category.tables} テーブル</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>{category.records.toLocaleString()} レコード</span>
                    <span>{category.size} MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {category.percentage}% のデータ
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* パフォーマンス指標 */}
      <div className="bg-white rounded-lg shadow-md mt-8">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold">パフォーマンス指標</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.metric} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{metric.metric}</h3>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <span className="text-sm text-gray-600">{metric.unit}</span>
                </div>
                <div className="text-sm text-green-600 mt-1">
                  {metric.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 月次成長グラフ */}
      <div className="bg-white rounded-lg shadow-md mt-8">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold">月次成長推移</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* レコード数推移 */}
            <div>
              <h3 className="text-lg font-medium mb-4">レコード数推移</h3>
              <div className="space-y-3">
                {monthlyGrowth.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{month.records.toLocaleString()}</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(month.records / 70000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* サイズ推移 */}
            <div>
              <h3 className="text-lg font-medium mb-4">データサイズ推移</h3>
              <div className="space-y-3">
                {monthlyGrowth.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{month.size} MB</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(month.size / 80) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* アクション */}
      <div className="bg-white rounded-lg shadow-md mt-8 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">レポート出力</h2>
            <p className="text-gray-600">統計情報をCSVまたはPDFで出力できます</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              CSV出力
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              PDF出力
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
