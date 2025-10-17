import React from 'react';
import Link from 'next/link';

export default function IndividualKentoPage() {
  return (
    <div className="individual-kento-page p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/knowledge/kento" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 検討書管理に戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">個別検討書</h1>
          <p className="text-lg text-gray-600">
            各機能やモジュールの個別検討書を管理・閲覧できます。
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">個別検討書一覧</h2>
          <div className="space-y-6">
            {/* ユーザー認証機能検討書 */}
            <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                <span className="text-gray-500 text-lg">🔐</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-3 text-gray-900">ユーザー認証機能検討書</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  ユーザー認証システムの設計と実装について検討した文書です。セキュリティ要件、認証フロー、パスワードポリシーなどを含みます。
                </p>
                <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
                  <span>最終更新: 2024-01-24</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">承認済み</span>
                  <span>担当: 認証チーム</span>
                </div>
                <Link href="/knowledge/kento/individual/auth-001" className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium transition-colors inline-block border border-gray-300">
                  詳細を見る
                </Link>
              </div>
            </div>

            {/* データ管理機能検討書 */}
            <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                <span className="text-gray-500 text-lg">💾</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-3 text-gray-900">データ管理機能検討書</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  データベース設計、データフロー、バックアップ戦略など、データ管理に関する包括的な検討書です。
                </p>
                <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
                  <span>最終更新: 2024-01-23</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">レビュー中</span>
                  <span>担当: データチーム</span>
                </div>
                <Link href="/knowledge/kento/individual/data-001" className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium transition-colors inline-block border border-gray-300">
                  詳細を見る
                </Link>
              </div>
            </div>

            {/* API設計検討書 */}
            <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                <span className="text-gray-500 text-lg">🔌</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-3 text-gray-900">API設計検討書</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  RESTful APIの設計原則、エンドポイント設計、認証方式、レスポンス形式などを検討した文書です。
                </p>
                <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
                  <span>最終更新: 2024-01-21</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">承認済み</span>
                  <span>担当: APIチーム</span>
                </div>
                <Link href="/knowledge/kento/individual/api-001" className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium transition-colors inline-block border border-gray-300">
                  詳細を見る
                </Link>
              </div>
            </div>

            {/* UI/UXコンポーネント検討書 */}
            <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                <span className="text-gray-500 text-lg">🎨</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-3 text-gray-900">UI/UXコンポーネント検討書</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  ユーザーインターフェースの設計原則、コンポーネントライブラリ、ユーザビリティガイドラインなどを検討した文書です。
                </p>
                <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
                  <span>最終更新: 2024-01-19</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">レビュー中</span>
                  <span>担当: UI/UXチーム</span>
                </div>
                <Link href="/knowledge/kento/individual/ui-001" className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium transition-colors inline-block border border-gray-300">
                  詳細を見る
                </Link>
              </div>
            </div>

            {/* バッチ処理機能検討書 */}
            <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                <span className="text-gray-500 text-lg">⚙️</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-3 text-gray-900">バッチ処理機能検討書</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  定期実行処理、データ処理パイプライン、ジョブスケジューリングなど、バッチ処理システムの設計を検討した文書です。
                </p>
                <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
                  <span>最終更新: 2024-01-17</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">承認済み</span>
                  <span>担当: バッチチーム</span>
                </div>
                <Link href="/knowledge/kento/individual/batch-001" className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium transition-colors inline-block border border-gray-300">
                  詳細を見る
                </Link>
              </div>
            </div>

            {/* レポート機能検討書 */}
            <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                <span className="text-gray-500 text-lg">📊</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-3 text-gray-900">レポート機能検討書</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  レポート生成機能、データ可視化、エクスポート機能など、レポートシステムの設計を検討した文書です。
                </p>
                <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
                  <span>最終更新: 2024-01-16</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">作成中</span>
                  <span>担当: レポートチーム</span>
                </div>
                <Link href="/knowledge/kento/individual/report-001" className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium transition-colors inline-block border border-gray-300">
                  詳細を見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 