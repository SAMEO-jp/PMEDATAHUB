'use client';

import React from 'react';
import Link from 'next/link';

export default function Kento1B00Page() {
  const kentoData = [
    {
      title: "装入設備設計",
      description: "原料装入設備の基本設計と制御システムの検討",
      status: "完了",
      lastUpdated: "2024-12-05",
      category: "基本設計"
    },
    {
      title: "ガス処理システム",
      description: "炉頂ガスの処理・回収システムの設計検討",
      status: "進行中",
      lastUpdated: "2024-12-20",
      category: "環境設備"
    },
    {
      title: "計装システム",
      description: "炉頂部の計測・制御システムの設計検討",
      status: "完了",
      lastUpdated: "2024-11-28",
      category: "制御システム"
    },
    {
      title: "安全設備設計",
      description: "炉頂部の安全設備と緊急時対応システムの検討",
      status: "完了",
      lastUpdated: "2024-11-20",
      category: "安全設計"
    },
    {
      title: "メンテナンス性検討",
      description: "炉頂設備の保守性とメンテナンス計画の検討",
      status: "進行中",
      lastUpdated: "2024-12-12",
      category: "保守設計"
    },
    {
      title: "操作性検討",
      description: "炉頂操作の効率性と安全性の検討",
      status: "未着手",
      lastUpdated: "-",
      category: "操作性"
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
      case "環境設備":
        return "bg-green-100 text-green-800";
      case "制御システム":
        return "bg-blue-100 text-blue-800";
      case "安全設計":
        return "bg-red-100 text-red-800";
      case "保守設計":
        return "bg-yellow-100 text-yellow-800";
      case "操作性":
        return "bg-indigo-100 text-indigo-800";
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">設備製番1B00 (炉頂)</h1>
        <p className="text-gray-600">高炉炉頂設備の技術検討書</p>
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
