import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Settings, Users, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'プロジェクト管理アプリ - 仕様書・デモ',
  description: 'プロジェクト管理アプリの仕様書とデモページ',
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションヘッダー */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/project" className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-lg">プロジェクト管理アプリ</span>
              </Link>
              
              <div className="flex items-center gap-1">
                <Link href="/project">
                  <button className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    仕様書
                  </button>
                </Link>
                <Link href="/project/demo">
                  <button className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    デモ
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50 transition-colors">
                  ホームに戻る
                </button>
              </Link>
              <Link href="/manage">
                <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                  管理画面へ
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="flex-1">
        {children}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">プロジェクト管理アプリ</h3>
              <p className="text-sm text-gray-600">
                統合的なプロジェクト管理システムの仕様書とデモページです。
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">主要機能</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  プロジェクト管理
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  メンバー管理
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  進捗管理
                </li>
                <li className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  設定管理
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">リンク</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/project" className="text-blue-600 hover:text-blue-800">
                    仕様書
                  </Link>
                </li>
                <li>
                  <Link href="/project/demo" className="text-blue-600 hover:text-blue-800">
                    デモページ
                  </Link>
                </li>
                <li>
                  <Link href="/manage" className="text-blue-600 hover:text-blue-800">
                    管理画面
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-blue-600 hover:text-blue-800">
                    ホーム
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              © 2025 プロジェクト管理アプリ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
