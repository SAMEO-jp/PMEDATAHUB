'use client';

import Link from 'next/link';
import { FileText, Settings, Users, Calendar, Database } from 'lucide-react';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const generateDatabaseSQL = async () => {
    try {
      // ボタンを無効化してローディング状態にする
      const button = document.querySelector('button[onclick*="generateDatabaseSQL"]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = 'データベース作成中...';
      }

      // APIを呼び出してデータベーステーブルを作成
      const response = await fetch('/api/database/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json() as {
        success: boolean;
        message?: string;
        createdTables?: string[];
        createdViews?: string[];
        error?: string;
        details?: string;
      };

      if (result.success) {
        alert(`✅ データベーステーブルが正常に作成されました！\n\n作成されたテーブル:\n- ${result.createdTables?.join('\n- ') || 'なし'}\n\n作成されたビュー:\n- ${result.createdViews?.join('\n- ') || 'なし'}\n\nこれでプロジェクト管理機能が使用できます。`);
      } else {
        alert(`❌ データベース作成に失敗しました。\n\nエラー: ${result.error || '不明なエラー'}\n\n詳細: ${result.details || '詳細情報なし'}`);
      }

    } catch (error) {
      console.error('データベース作成エラー:', error);
      alert(`❌ データベース作成中にエラーが発生しました。\n\nエラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // ボタンを元に戻す
      const button = document.querySelector('button[onclick*="generateDatabaseSQL"]') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.textContent = 'データベース作成';
      }
    }
  };
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
            
            <div className="flex items-center gap-2">
              <Link href="/project/api.document">
                <button className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  API設計方針
                </button>
              </Link>
              <Link href="/project/demo">
                <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  デモページ
                </button>
              </Link>
              <button 
                onClick={() => void generateDatabaseSQL()}
                className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
              >
                <Database className="h-4 w-4" />
                データベース作成
              </button>
              <Link href="/manage">
                <button className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition-colors">
                  管理画面へ
                </button>
              </Link>
              <Link href="/">
                <button className="border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50 transition-colors">
                  ホームに戻る
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
