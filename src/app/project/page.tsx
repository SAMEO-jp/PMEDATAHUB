import Link from 'next/link';

export default function ProjectSpecificationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          プロジェクト管理アプリ仕様書
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          統合的なプロジェクト管理システムの設計と実装仕様
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/project/demo">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              デモページを見る
            </button>
          </Link>
          <Link href="/manage">
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              管理画面へ
            </button>
          </Link>
        </div>
      </div>

      {/* 技術スタック */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🛠️</span>
          技術スタック
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">フロントエンド</h4>
            <div className="space-y-1">
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-2">Next.js 14 (App Router)</span>
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-2">TypeScript</span>
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-2">Tailwind CSS</span>
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-2">shadcn/ui</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">バックエンド</h4>
            <div className="space-y-1">
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-2">tRPC v11</span>
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-2">Next.js API Routes</span>
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-2">SQLite</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">状態管理</h4>
            <div className="space-y-1">
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-2">Zustand</span>
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-2">React Query</span>
              <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-2">Zod</span>
            </div>
          </div>
        </div>
      </div>

      {/* データベース構造 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-2xl">🗄️</span>
          データベース構造
        </h2>
        <p className="text-gray-600 mb-6">SQLite (achievements.db) を使用したデータベース設計</p>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">主要テーブル</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium text-blue-600">PROJECT テーブル</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• PROJECT_ID: プロジェクト識別子</li>
                  <li>• PROJECT_NAME: プロジェクト名</li>
                  <li>• PROJECT_STATUS: プロジェクト状態</li>
                  <li>• PROJECT_CLIENT_NAME: クライアント名</li>
                  <li>• PROJECT_START_DATE: 開始日</li>
                  <li>• PROJECT_START_ENDDATE: 終了予定日</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-green-600">USER テーブル</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• user_id: ユーザーID</li>
                  <li>• name_japanese: 日本語名</li>
                  <li>• name_english: 英語名</li>
                  <li>• company: 会社名</li>
                  <li>• bumon: 部門</li>
                  <li>• Kengen: 権限</li>
                </ul>
              </div>
            </div>
          </div>
          
          <hr className="my-6" />
          
          <div>
            <h4 className="font-semibold text-lg mb-3">新規追加予定テーブル</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium text-purple-600">PROJECT_MEMBERS</h5>
                <p className="text-sm text-gray-600">
                  プロジェクトメンバー管理用テーブル
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-orange-600">PROJECT_HISTORY</h5>
                <p className="text-sm text-gray-600">
                  プロジェクト変更履歴管理用テーブル
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 機能要件 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          機能要件
        </h2>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">プロジェクト管理機能</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium">基本機能</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• プロジェクト一覧表示</li>
                  <li>• プロジェクト作成・編集</li>
                  <li>• プロジェクト詳細表示</li>
                  <li>• プロジェクト削除</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">高度機能</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 検索・フィルタリング</li>
                  <li>• ページネーション</li>
                  <li>• 一括操作</li>
                  <li>• 進捗管理</li>
                </ul>
              </div>
            </div>
          </div>
          
          <hr className="my-6" />
          
          <div>
            <h4 className="font-semibold text-lg mb-3">メンバー管理機能</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium">メンバー操作</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• メンバー追加・削除</li>
                  <li>• 権限管理</li>
                  <li>• ロール変更</li>
                  <li>• 参加履歴管理</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">権限システム</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• プロジェクトマネージャー</li>
                  <li>• 開発者</li>
                  <li>• 設計者</li>
                  <li>• テスター</li>
                  <li>• 閲覧者</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* アーキテクチャ */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🏗️</span>
          アーキテクチャ設計
        </h2>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-3">レイヤー構造</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">Presentation Layer</span>
                  <span className="text-gray-600">Pages, Components, UI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">Application Layer</span>
                  <span className="text-gray-600">tRPC Hooks, Custom Hooks</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">Domain Layer</span>
                  <span className="text-gray-600">tRPC Routers, Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">Infrastructure Layer</span>
                  <span className="text-gray-600">Database, DAL</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-3">フォルダ構造</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono">
              <div>src/</div>
              <div className="ml-4">├── app/</div>
              <div className="ml-8">├── manage/</div>
              <div className="ml-12">├── project/</div>
              <div className="ml-16">├── [project_id]/</div>
              <div className="ml-20">├── page.tsx</div>
              <div className="ml-20">├── edit/</div>
              <div className="ml-20">└── members/</div>
              <div className="ml-8">├── components/</div>
              <div className="ml-8">└── create/</div>
              <div className="ml-4">├── components/</div>
              <div className="ml-4">├── hooks/</div>
              <div className="ml-4">├── lib/</div>
              <div className="ml-8">└── trpc/</div>
              <div className="ml-4">├── types/</div>
              <div className="ml-4">└── store/</div>
            </div>
          </div>
        </div>
      </div>

      {/* 実装計画 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          実装計画
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-3">Phase 1: 基盤構築</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• 型定義の整備</li>
                <li>• tRPCルーターの実装</li>
                <li>• データベーススキーマの更新</li>
                <li>• カスタムフックの作成</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Phase 2: プロジェクト管理</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• プロジェクト一覧ページ</li>
                <li>• プロジェクト作成・編集機能</li>
                <li>• プロジェクト詳細ページ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Phase 3: メンバー管理</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• メンバー管理ページ</li>
                <li>• 権限管理機能</li>
                <li>• 参加履歴管理</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Phase 4: 高度な機能</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• 進捗管理機能</li>
                <li>• レポート機能</li>
                <li>• 通知システム</li>
                <li>• 承認ワークフロー</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* セキュリティ・パフォーマンス */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            セキュリティ考慮事項
          </h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>• JWTトークンによる認証</li>
            <li>• ロールベースアクセス制御（RBAC）</li>
            <li>• プロジェクトレベルの権限管理</li>
            <li>• 入力値のサニタイゼーション</li>
            <li>• SQLインジェクション対策</li>
            <li>• XSS対策</li>
            <li>• 監査ログの記録</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            パフォーマンス考慮事項
          </h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>• データベースインデックスの最適化</li>
            <li>• クエリの最適化</li>
            <li>• ページネーションの実装</li>
            <li>• コンポーネントのメモ化</li>
            <li>• 遅延読み込み</li>
            <li>• React Queryによるキャッシュ</li>
            <li>• 仮想スクロール</li>
          </ul>
        </div>
      </div>

      {/* 基本設計ドラフト */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          画面一覧（基本設計ドラフト）
        </h2>
        <p className="text-gray-600 mb-6">
          想定技術: Next.js(App Router) / SQLite（achievements.db）<br />
          主要エンティティ: PROJECT, USER, PROJECT_MEMBERS, PROJECT_HISTORY
        </p>
        
        <div className="space-y-6">
          {/* PJ-001: プロジェクト一覧 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-blue-600">PJ-001: プロジェクト一覧</h4>
            <p className="text-sm text-gray-600 mb-3">登録済みプロジェクトを検索・確認・一括操作</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 検索（キーワード / ステータス / クライアント / 期間）</li>
                  <li>• 並び替え（更新日 / 開始日 / 名前）</li>
                  <li>• ページネーション</li>
                  <li>• 一括操作（ステータス変更 / 削除）</li>
                  <li>• 新規作成ボタン</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">表示項目:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 名称 / ステータス / クライアント</li>
                  <li>• 開始日 / 終了予定 / 最終更新</li>
                  <li>• PM（プロジェクトマネージャー）</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">閲覧: 全ロール</span>
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">一括操作: PM/開発者</span>
            </div>
          </div>

          {/* PJ-002: プロジェクト詳細 */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-green-600">PJ-002: プロジェクト詳細</h4>
            <p className="text-sm text-gray-600 mb-3">個別プロジェクトの状態と構成を俯瞰・編集</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 基本情報表示（編集モード切替）</li>
                  <li>• 進捗表示（%やステータス履歴の要点）</li>
                  <li>• 履歴タブ（PROJECT_HISTORY）</li>
                  <li>• メンバータブ（PROJECT_MEMBERS 概要）</li>
                  <li>• 削除（PMのみ）</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">表示項目:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 基本情報、タグ/メモ（任意）</li>
                  <li>• 更新者/更新日時</li>
                  <li>• メンバー一覧</li>
                  <li>• 変更履歴</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">閲覧: 全ロール</span>
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">編集/削除: PM/開発者</span>
            </div>
          </div>

          {/* PJ-003: プロジェクト作成 */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-purple-600">PJ-003: プロジェクト作成</h4>
            <p className="text-sm text-gray-600 mb-3">新規プロジェクト登録</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 入力フォーム（名称 / ステータス / クライアント）</li>
                  <li>• 開始日 / 終了予定</li>
                  <li>• バリデーション（必須 / 日付整合）</li>
                  <li>• 登録後に詳細へ遷移</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">関連データ:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• PROJECT</li>
                  <li>• 初期メンバー設定</li>
                  <li>• プロジェクト履歴記録</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">アクセス権: PM/開発者</span>
            </div>
          </div>

          {/* PJ-004: プロジェクト編集 */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-orange-600">PJ-004: プロジェクト編集</h4>
            <p className="text-sm text-gray-600 mb-3">既存プロジェクトの属性変更</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 基本情報の編集・保存・取消</li>
                  <li>• 変更差分の履歴記録</li>
                  <li>• リアルタイム保存</li>
                  <li>• 権限チェック</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">関連データ:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• PROJECT</li>
                  <li>• PROJECT_HISTORY</li>
                  <li>• 変更通知</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">アクセス権: PM/開発者</span>
            </div>
          </div>

          {/* PJ-005: メンバー管理 */}
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-red-600">PJ-005: メンバー管理（プロジェクト別）</h4>
            <p className="text-sm text-gray-600 mb-3">参加メンバーの登録・権限付与・履歴管理</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• ユーザー検索 → 追加 / 削除</li>
                  <li>• ロール変更（PM/開発者/設計者/テスター/閲覧者）</li>
                  <li>• 参加履歴表示</li>
                  <li>• 権限管理</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">関連データ:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• USER</li>
                  <li>• PROJECT_MEMBERS</li>
                  <li>• PROJECT_HISTORY</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">変更可: PM</span>
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">閲覧可: 開発者</span>
            </div>
          </div>

          {/* PJ-006: プロジェクト進捗・ステータス管理 */}
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-indigo-600">PJ-006: プロジェクト進捗・ステータス管理（拡張）</h4>
            <p className="text-sm text-gray-600 mb-3">進捗指標や状態遷移を管理</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• ステータス更新（ToDo → Doing → Review → Done）</li>
                  <li>• 進捗%入出力（将来拡張）</li>
                  <li>• 履歴自動記録</li>
                  <li>• マイルストーン管理</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">関連データ:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• PROJECT</li>
                  <li>• PROJECT_HISTORY</li>
                  <li>• 進捗レポート</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">アクセス権: PM/開発者</span>
            </div>
          </div>

          {/* PJ-007: 一括操作センター */}
          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-yellow-600">PJ-007: 一括操作センター（拡張）</h4>
            <p className="text-sm text-gray-600 mb-3">一括処理の安全な実行とログ残し</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 対象一括選択（一覧側の選択を引継ぎ）</li>
                  <li>• 実行プレビュー / 影響件数表示</li>
                  <li>• 実行結果（成功/失敗）と履歴記録</li>
                  <li>• 安全確認ダイアログ</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">関連データ:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• PROJECT</li>
                  <li>• PROJECT_HISTORY</li>
                  <li>• 操作ログ</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">アクセス権: PM/開発者</span>
            </div>
          </div>
        </div>

        {/* 画面間遷移サマリ */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-lg mb-3">画面間遷移（サマリ）</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-2">主要フロー:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• ホーム → <strong>PJ-001 一覧</strong></li>
                <li>• 一覧 → <strong>PJ-002 詳細</strong> / <strong>PJ-003 作成</strong> / <strong>PJ-007 一括操作</strong></li>
                <li>• 詳細 → <strong>PJ-004 編集</strong> / <strong>PJ-005 メンバー管理</strong> / <strong>PJ-006 進捗操作</strong></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">権限モデル:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>PM</strong>: 作成/編集/削除/メンバー変更/一括操作</li>
                <li>• <strong>開発者</strong>: 作成/編集/一部一括操作</li>
                <li>• <strong>設計者/テスター</strong>: 閲覧 + 軽微更新</li>
                <li>• <strong>閲覧者</strong>: 閲覧のみ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 共通UI/モーダル */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-lg mb-3 text-blue-800">共通UI/モーダル</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>CM-001</strong>: 削除確認モーダル（PJ/メンバー）</li>
                <li>• <strong>CM-002</strong>: 失敗/成功トースト</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>CM-003</strong>: インポート/エクスポート（将来）</li>
                <li>• <strong>CM-004</strong>: 絞り込みパネル（一覧）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="text-center mt-12 pt-8 border-t">
        <p className="text-gray-600 mb-4">
          この仕様書は継続的に更新されます
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/project/demo">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
              デモページを見る
            </button>
          </Link>
          <Link href="/manage">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
              管理画面へ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
