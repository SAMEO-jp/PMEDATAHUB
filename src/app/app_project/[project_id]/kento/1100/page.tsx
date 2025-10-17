'use client';

import React from 'react';
import Link from 'next/link';

export default function Kento1100Page() {
  const kentoData = [
    {
      title: "炉体構造設計",
      description: "高炉本体の基本構造設計に関する検討内容",
      status: "完了",
      lastUpdated: "2024-12-01",
      category: "基本設計"
    },
    {
      title: "耐火物選定",
      description: "炉内耐火物の材質選定と配置設計の検討",
      status: "進行中",
      lastUpdated: "2024-12-15",
      category: "材料選定"
    },
    {
      title: "冷却システム",
      description: "炉体冷却システムの設計と熱解析結果",
      status: "完了",
      lastUpdated: "2024-11-30",
      category: "熱設計"
    },
    {
      title: "荷重解析",
      description: "炉体構造の静的・動的荷重解析結果",
      status: "完了",
      lastUpdated: "2024-11-25",
      category: "構造解析"
    },
    {
      title: "製造工法検討",
      description: "炉体製造における工法と品質管理の検討",
      status: "進行中",
      lastUpdated: "2024-12-10",
      category: "製造技術"
    },
    {
      title: "保守性検討",
      description: "炉体の保守性とメンテナンス計画の検討",
      status: "未着手",
      lastUpdated: "-",
      category: "保守設計"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "完了":
        return "bg-green-100 text-green-800";
      case "進行中":
        return "bg-blue-100 text-blue-800";
      case "未着手":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "基本設計":
        return "bg-purple-100 text-purple-800";
      case "材料選定":
        return "bg-orange-100 text-orange-800";
      case "熱設計":
        return "bg-red-100 text-red-800";
      case "構造解析":
        return "bg-indigo-100 text-indigo-800";
      case "製造技術":
        return "bg-teal-100 text-teal-800";
      case "保守設計":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="kento-detail-page p-6">
      {/* ヘッダー */}
      <div className="page-header mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="../"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <span>←</span>
            <span>検討書一覧に戻る</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">設備製番1100 (本体)</h1>
        <p className="text-gray-600">高炉本体の技術検討書</p>
      </div>

      {/* 検討書一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kentoData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              最終更新: {item.lastUpdated}
            </div>
            
            <div className="mt-4">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">
                詳細を見る
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 統計情報 */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">検討状況サマリー</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">完了</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <div className="text-sm text-gray-600">進行中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">1</div>
            <div className="text-sm text-gray-600">未着手</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">50%</div>
            <div className="text-sm text-gray-600">進捗率</div>
          </div>
        </div>
      </div>
    </div>
  );
}
