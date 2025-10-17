'use client';

/**
 * @file 統計グラフコンポーネント
 * データ可視化・チャート表示機能を提供
 */

import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Database, Clock, Users, Activity } from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

interface StatisticsChartProps {
  title: string;
  data: ChartData[];
  type?: 'bar' | 'pie' | 'line' | 'metric';
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export function StatisticsChart({
  title,
  data,
  type = 'bar',
  height = 200,
  showLegend = true,
  className = ''
}: StatisticsChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map(item => item.value));
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // 色のパレット
  const defaultColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  const getColor = (index: number) => {
    return data[index]?.color || defaultColors[index % defaultColors.length];
  };

  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        const isSelected = selectedIndex === index;
        
        return (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setSelectedIndex(isSelected ? null : index)}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                  {item.label}
                </span>
                <span className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                  {item.value.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getColor(index),
                    opacity: isSelected ? 1 : 0.8
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderPieChart = () => {
    let accumulatedPercentage = 0;
    
    return (
      <div className="flex items-center gap-6">
        {/* 簡易円グラフ */}
        <div className="relative">
          <svg width="120" height="120" className="transform -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            {data.map((item, index) => {
              const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
              const strokeDasharray = `${percentage * 3.14} 314`;
              const strokeDashoffset = -accumulatedPercentage * 3.14;
              accumulatedPercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={getColor(index)}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:stroke-width-[10]"
                  style={{ strokeLinecap: 'round' }}
                />
              );
            })}
          </svg>
          
          {/* 中央の合計値 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-gray-800">{totalValue.toLocaleString()}</span>
            <span className="text-xs text-gray-500">合計</span>
          </div>
        </div>

        {/* 凡例 */}
        {showLegend && (
          <div className="flex-1 space-y-2">
            {data.map((item, index) => {
              const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1 rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getColor(index) }}
                  />
                  <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {item.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderMetricCards = () => (
    <div className="grid grid-cols-2 gap-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">{item.label}</p>
              <p className="text-2xl font-bold text-blue-800">{item.value.toLocaleString()}</p>
            </div>
            <div className="text-blue-500">
              {index === 0 && <Database className="w-8 h-8" />}
              {index === 1 && <BarChart3 className="w-8 h-8" />}
              {index === 2 && <Clock className="w-8 h-8" />}
              {index === 3 && <Users className="w-8 h-8" />}
            </div>
          </div>
          {item.percentage !== undefined && (
            <div className="mt-2 flex items-center text-xs text-blue-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>前月比 {item.percentage > 0 ? '+' : ''}{item.percentage}%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="space-y-4">
      {/* 簡易線グラフ */}
      <div className="relative" style={{ height: height }}>
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* グリッド線 */}
          {[...Array(5)].map((_, i) => {
            const y = (i + 1) * (height / 6);
            return (
              <line
                key={i}
                x1="0"
                y1={y}
                x2="100%"
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            );
          })}
          
          {/* データライン */}
          {data.length > 1 && (
            <polyline
              points={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = height - (item.value / maxValue) * (height - 20);
                return `${x}%,${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {/* データポイント */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = height - (item.value / maxValue) * (height - 20);
            
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={y}
                r="4"
                fill="#3B82F6"
                className="hover:r-6 cursor-pointer transition-all"
                onClick={() => setSelectedIndex(index)}
              />
            );
          })}
        </svg>
        
        {/* 選択されたポイントの詳細 */}
        {selectedIndex !== null && (
          <div className="absolute top-2 right-2 bg-white p-2 border border-gray-200 rounded-lg shadow-lg">
            <p className="text-xs text-gray-600">{data[selectedIndex].label}</p>
            <p className="text-sm font-semibold">{data[selectedIndex].value.toLocaleString()}</p>
          </div>
        )}
      </div>
      
      {/* X軸ラベル */}
      <div className="flex justify-between text-xs text-gray-500">
        {data.map((item, index) => (
          <span key={index} className={index === selectedIndex ? 'text-blue-600 font-medium' : ''}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return renderPieChart();
      case 'line':
        return renderLineChart();
      case 'metric':
        return renderMetricCards();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
      
      <div className="p-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>表示するデータがありません</p>
          </div>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
}

// プリセット用のコンポーネント
export function DatabaseOverviewChart({ data }: { data: any }) {
  const chartData = [
    { label: 'テーブル数', value: data?.totalTables || 0 },
    { label: '総レコード数', value: data?.totalRecords || 0 },
    { label: 'クエリ数', value: data?.performance?.totalQueries || 0 },
    { label: 'インデックス数', value: 42 } // 仮の値
  ];

  return (
    <StatisticsChart
      title="データベース概要"
      data={chartData}
      type="metric"
    />
  );
}

export function TableSizeChart({ data }: { data: any[] }) {
  const chartData = data?.slice(0, 10).map(table => ({
    label: table.name,
    value: parseFloat(table.totalSize) || 0
  })) || [];

  return (
    <StatisticsChart
      title="テーブルサイズ (Top 10)"
      data={chartData}
      type="bar"
      height={300}
    />
  );
}

export function GrowthTrendChart({ data }: { data: any[] }) {
  const chartData = data?.slice(0, 7).map(table => ({
    label: table.tableName,
    value: table.growthRate
  })) || [];

  return (
    <StatisticsChart
      title="成長率トレンド"
      data={chartData}
      type="line"
      height={250}
    />
  );
}