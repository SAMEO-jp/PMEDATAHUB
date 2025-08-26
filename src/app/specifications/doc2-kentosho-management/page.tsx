import Link from 'next/link';

export default function KentoShoSpecificationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          検討書管理システム仕様書
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          プロジェクト実績としての検討書管理システムの設計と実装仕様
        </p>
        <div className="flex justify-center gap-4">
          <p className="text-lg text-gray-600">
            検討書の作成、管理、検索、承認ワークフローを統合的に管理
          </p>
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
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🗄️</span>
          データベース構造
        </h2>
        <p className="text-gray-600 mb-6">SQLite (achievements.db) を使用した検討書管理データベース設計</p>
        
        <div className="space-y-6">
          {/* 主要テーブル */}
          <div>
            <h4 className="font-semibold text-lg mb-3">主要テーブル</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium text-blue-600">KENTOSHO_MAIN テーブル</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• kentosho_id: 検討書ID（主キー）</li>
                  <li>• kentosho_name: 検討書名</li>
                  <li>• kentosho_type: 検討書タイプ</li>
                  <li>• kentosho_status: 検討書状態</li>
                  <li>• project_id: プロジェクトID（外部キー）</li>
                  <li>• created_by: 作成者ID（外部キー）</li>
                  <li>• created_at: 作成日</li>
                  <li>• busho: 部署</li>
                  <li>• rev_count: REV回数</li>
                  <li>• kentosho_content: 検討書内容</li>
                  <li>• kentosho_summary: 検討書概要</li>
                  <li>• file_path: ファイルパス名</li>
                  <li>• remarks: 備考</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-green-600">KENTOSHO_HISTORY テーブル</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• history_id: 履歴ID（主キー）</li>
                  <li>• kentosho_id: 検討書ID（外部キー）</li>
                  <li>• parent_kentosho_id: 親検討書ID（代表検討書の歴史）</li>
                  <li>• group_id: グループID（個別検討書のグループ化）</li>
                  <li>• review_date: レビュー日</li>
                  <li>• approval_date: 承認日時</li>
                  <li>• published_date: 公開日時</li>
                  <li>• approval_comments: 承認時コメント</li>
                </ul>
              </div>
            </div>
          </div>
          
          <hr className="my-6" />
          
          {/* 関連テーブル */}
          <div>
            <h4 className="font-semibold text-lg mb-3">関連テーブル（1:多関係）</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium text-purple-600">KENTOSHO_SEIBAN</h5>
                <p className="text-sm text-gray-600 mb-3">検討書と製番の関連テーブル</p>
                <div className="bg-purple-50 p-3 rounded-lg text-xs">
                  <ul className="space-y-1 text-purple-700">
                    <li>• kentosho_id: 検討書ID（外部キー）</li>
                    <li>• seiban: 製番</li>
                    <li>• created_at: 関連付け日時</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-orange-600">KENTOSHO_TAGS</h5>
                <p className="text-sm text-gray-600 mb-3">検討書とタグの関連テーブル</p>
                <div className="bg-orange-50 p-3 rounded-lg text-xs">
                  <ul className="space-y-1 text-orange-700">
                    <li>• kentosho_id: 検討書ID（外部キー）</li>
                    <li>• tag_name: タグ名</li>
                    <li>• tag_type: タグタイプ（一般/要素技術）</li>
                    <li>• created_at: タグ付け日時</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-red-600">KENTOSHO_EQUIPMENT</h5>
                <p className="text-sm text-gray-600 mb-3">検討書と設備の関連テーブル</p>
                <div className="bg-red-50 p-3 rounded-lg text-xs">
                  <ul className="space-y-1 text-red-700">
                    <li>• kentosho_id: 検討書ID（外部キー）</li>
                    <li>• equipment_name: 設備名</li>
                    <li>• equipment_code: 設備コード</li>
                    <li>• created_at: 関連付け日時</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-indigo-600">KENTOSHO_TYPES</h5>
                <p className="text-sm text-gray-600 mb-3">検討書とタイプの関連テーブル</p>
                <div className="bg-indigo-50 p-3 rounded-lg text-xs">
                  <ul className="space-y-1 text-indigo-700">
                    <li>• kentosho_id: 検討書ID（外部キー）</li>
                    <li>• type_name: タイプ名</li>
                    <li>• type_category: タイプカテゴリ</li>
                    <li>• created_at: 関連付け日時</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* グループ管理テーブル */}
          <div className="mt-6">
            <h4 className="font-semibold text-lg mb-3">グループ管理テーブル（1:多関係）</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium text-teal-600">KENTOSHO_GROUPS</h5>
                <p className="text-sm text-gray-600 mb-3">検討書グループのマスターテーブル</p>
                <div className="bg-teal-50 p-3 rounded-lg text-xs">
                  <ul className="space-y-1 text-teal-700">
                    <li>• group_id: グループID（主キー）</li>
                    <li>• group_name: グループ名</li>
                    <li>• group_description: グループ説明</li>
                    <li>• group_type: グループタイプ（プロジェクト/技術/部署）</li>
                    <li>• created_by: 作成者ID（外部キー）</li>
                    <li>• created_at: 作成日時</li>
                    <li>• updated_at: 更新日時</li>
                    <li>• is_active: アクティブフラグ</li>
                    <li>• remarks: 備考</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-cyan-600">KENTOSHO_GROUP_MEMBERS</h5>
                <p className="text-sm text-gray-600 mb-3">グループと検討書の関連テーブル</p>
                <div className="bg-cyan-50 p-3 rounded-lg text-xs">
                  <ul className="space-y-1 text-cyan-700">
                    <li>• member_id: メンバーID（主キー）</li>
                    <li>• group_id: グループID（外部キー）</li>
                    <li>• kentosho_id: 検討書ID（外部キー）</li>
                    <li>• member_type: メンバータイプ（代表/関連）</li>
                    <li>• added_by: 追加者ID（外部キー）</li>
                    <li>• added_at: 追加日時</li>
                    <li>• is_primary: 主要メンバーフラグ</li>
                    <li>• sort_order: 表示順序</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 設計理由 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3 text-blue-800">設計理由と特徴</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-blue-700 mb-2">代表検討書の歴史管理:</h5>
                <ul className="space-y-1 text-blue-600">
                  <li>• parent_kentosho_idで代表検討書の歴史を追跡</li>
                  <li>• REV回数でバージョン管理</li>
                  <li>• 承認・公開履歴を詳細に記録</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-blue-700 mb-2">個別検討書のグループ化:</h5>
                <ul className="space-y-1 text-blue-600">
                  <li>• group_idで関連する検討書をグループ化</li>
                  <li>• 要素技術タグによる横断検索</li>
                  <li>• 製番による関連検討書の特定</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h5 className="font-medium text-blue-700 mb-2">柔軟なグループ管理:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-1 text-blue-600">
                  <li>• KENTOSHO_GROUPSでグループのマスター管理</li>
                  <li>• 複数のグループタイプ（プロジェクト/技術/部署）</li>
                  <li>• グループの説明・備考による詳細管理</li>
                </ul>
                <ul className="space-y-1 text-blue-600">
                  <li>• KENTOSHO_GROUP_MEMBERSで1:多の関連管理</li>
                  <li>• メンバータイプによる役割の明確化</li>
                  <li>• 表示順序による整理された表示</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 要件定義 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          要件定義
        </h2>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">基本要件</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium">検討書管理</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 検討書の作成・編集・削除</li>
                  <li>• 代表検討書の歴史管理</li>
                  <li>• 個別検討書のグループ化</li>
                  <li>• バージョン管理（REV）</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">承認ワークフロー</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• レビュー・承認・公開の段階管理</li>
                  <li>• 承認時コメントの記録</li>
                  <li>• 状態変更の履歴追跡</li>
                  <li>• 承認者・承認日時の記録</li>
                </ul>
              </div>
            </div>
          </div>
          
          <hr className="my-6" />
          
          <div>
            <h4 className="font-semibold text-lg mb-3">検索・フィルタリング要件</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium">検索条件</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 検討書名による全文検索</li>
                  <li>• 製番による関連検討書検索</li>
                  <li>• 要素技術タグによる検索</li>
                  <li>• 作成者・部署による検索</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">フィルタリング</h5>
                <li>• 検討書タイプによる絞り込み</li>
                <li>• 検討書状態による絞り込み</li>
                <li>• 作成期間による絞り込み</li>
                <li>• 承認・公開状況による絞り込み</li>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">権限管理要件</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium">作成・編集権限</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 作成者: 自分の検討書の編集</li>
                  <li>• 部署管理者: 部署内検討書の管理</li>
                  <li>• プロジェクトマネージャー: プロジェクト関連検討書の管理</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">承認権限</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 部署責任者: 部署内検討書の承認</li>
                  <li>• 技術責任者: 技術的検討書の承認</li>
                  <li>• プロジェクト責任者: プロジェクト検討書の承認</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 必要ページの想定 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          必要ページの想定
        </h2>
        <p className="text-gray-600 mb-6">
          想定技術: Next.js(App Router) / SQLite（achievements.db）<br />
          主要エンティティ: KENTOSHO_MAIN, KENTOSHO_HISTORY, KENTOSHO_GROUPS, KENTOSHO_GROUP_MEMBERS, KENTOSHO_SEIBAN, KENTOSHO_TAGS, KENTOSHO_EQUIPMENT
        </p>
        
        <div className="space-y-6">
          {/* KS-001: 検討書一覧 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-blue-600">KS-001: 検討書一覧</h4>
            <p className="text-sm text-gray-600 mb-3">登録済み検討書を検索・確認・一括操作</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 検索（検討書名 / 製番 / 要素技術タグ / 作成者）</li>
                  <li>• フィルタリング（タイプ / 状態 / 期間 / 承認状況）</li>
                  <li>• 並び替え（作成日 / 更新日 / 承認日 / 名前）</li>
                  <li>• ページネーション</li>
                  <li>• 一括操作（状態変更 / 削除）</li>
                  <li>• 新規作成ボタン</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">表示項目:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 検討書名 / タイプ / 状態</li>
                  <li>• 作成者 / 部署 / 作成日</li>
                  <li>• 製番 / 要素技術タグ</li>
                  <li>• REV回数 / 承認状況</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">閲覧: 全ロール</span>
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">一括操作: 作成者/部署管理者</span>
            </div>
          </div>

          {/* KS-002: 検討書詳細 */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-green-600">KS-002: 検討書詳細</h4>
            <p className="text-sm text-gray-600 mb-3">個別検討書の内容と履歴を表示・編集</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 基本情報表示（編集モード切替）</li>
                  <li>• 検討書内容・概要の表示</li>
                  <li>• 関連データ表示（製番/タグ/設備/タイプ）</li>
                  <li>• 履歴タブ（承認・公開履歴）</li>
                  <li>• 関連検討書表示（グループ/歴史）</li>
                  <li>• ファイルダウンロード</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">表示項目:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 基本情報、検討書内容・概要</li>
                  <li>• 関連データ一覧</li>
                  <li>• 承認・公開履歴</li>
                  <li>• 関連検討書</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">閲覧: 全ロール</span>
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">編集: 作成者/部署管理者</span>
            </div>
          </div>

          {/* KS-003: 検討書作成 */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-purple-600">KS-003: 検討書作成</h4>
            <p className="text-sm text-gray-600 mb-3">新規検討書登録</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 基本情報入力フォーム</li>
                  <li>• 関連データ設定（製番/タグ/設備/タイプ）</li>
                  <li>• ファイルアップロード</li>
                  <li>• 代表検討書との関連付け</li>
                  <li>• グループ設定</li>
                  <li>• バリデーション</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">入力項目:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 検討書名、タイプ、状態</li>
                  <li>• プロジェクト、部署</li>
                  <li>• 検討書内容・概要</li>
                  <li>• 関連データ（複数選択可）</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">アクセス権: 全ユーザー</span>
            </div>
          </div>

          {/* KS-004: 検討書編集 */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-orange-600">KS-004: 検討書編集</h4>
            <p className="text-sm text-gray-600 mb-3">既存検討書の内容変更</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 基本情報の編集・保存・取消</li>
                  <li>• 関連データの追加・削除</li>
                  <li>• ファイルの差し替え</li>
                  <li>• REV回数の自動更新</li>
                  <li>• 変更履歴の記録</li>
                  <li>• 権限チェック</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">編集制限:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 承認済み検討書の編集制限</li>
                  <li>• 公開済み検討書の編集制限</li>
                  <li>• 作成者以外の編集権限</li>
                  <li>• 部署管理者の編集権限</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">アクセス権: 作成者/部署管理者</span>
            </div>
          </div>

          {/* KS-005: 承認ワークフロー */}
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-red-600">KS-005: 承認ワークフロー</h4>
            <p className="text-sm text-gray-600 mb-3">検討書のレビュー・承認・公開プロセス</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• レビュー依頼・レビュー実行</li>
                  <li>• 承認・却下・差し戻し</li>
                  <li>• 承認時コメントの記録</li>
                  <li>• 公開設定・公開実行</li>
                  <li>• ワークフロー状態の管理</li>
                  <li>• 通知機能</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">ワークフロー:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 作成 → レビュー依頼</li>
                  <li>• レビュー → 承認/却下</li>
                  <li>• 承認 → 公開設定</li>
                  <li>• 公開 → 完了</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">承認権限: 部署責任者/技術責任者</span>
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">閲覧権限: 全ロール</span>
            </div>
          </div>

          {/* KS-006: 検索・分析 */}
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-indigo-600">KS-006: 検索・分析</h4>
            <p className="text-sm text-gray-600 mb-3">高度な検索機能と分析レポート</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 全文検索（検討書内容含む）</li>
                  <li>• 製番による関連検討書検索</li>
                  <li>• 要素技術タグによる横断検索</li>
                  <li>• 複合条件検索</li>
                  <li>• 検索結果の保存・共有</li>
                  <li>• 統計レポート</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">分析機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 部署別検討書数</li>
                  <li>• 要素技術別分布</li>
                  <li>• 承認・公開状況</li>
                  <li>• 時系列分析</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">アクセス権: 全ロール</span>
            </div>
          </div>

          {/* KS-007: 関連検討書管理 */}
          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold text-lg mb-2 text-yellow-600">KS-007: 関連検討書管理</h4>
            <p className="text-sm text-gray-600 mb-3">代表検討書の歴史とグループ管理</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">主な機能:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• 代表検討書の歴史表示</li>
                  <li>• グループ内検討書の管理</li>
                  <li>• 関連検討書の追加・削除</li>
                  <li>• バージョン比較</li>
                  <li>• 差分表示</li>
                  <li>• 履歴グラフ表示</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">表示形式:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• ツリー表示（歴史）</li>
                  <li>• グループ表示</li>
                  <li>• 時系列表示</li>
                  <li>• 比較表示</li>
                </ul>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">管理権限: 作成者/部署管理者</span>
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">閲覧権限: 全ロール</span>
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
                <li>• ホーム → <strong>KS-001 一覧</strong></li>
                <li>• 一覧 → <strong>KS-002 詳細</strong> / <strong>KS-003 作成</strong> / <strong>KS-006 検索</strong></li>
                <li>• 詳細 → <strong>KS-004 編集</strong> / <strong>KS-005 承認</strong> / <strong>KS-007 関連管理</strong></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">権限モデル:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>作成者</strong>: 自分の検討書の編集・削除</li>
                <li>• <strong>部署管理者</strong>: 部署内検討書の管理・承認</li>
                <li>• <strong>技術責任者</strong>: 技術検討書の承認</li>
                <li>• <strong>一般ユーザー</strong>: 閲覧・検索・作成</li>
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
                <li>• <strong>CM-001</strong>: 削除確認モーダル</li>
                <li>• <strong>CM-002</strong>: 承認確認モーダル</li>
                <li>• <strong>CM-003</strong>: ファイルアップロードモーダル</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>CM-004</strong>: 検索条件設定パネル</li>
                <li>• <strong>CM-005</strong>: 関連データ選択モーダル</li>
                <li>• <strong>CM-006</strong>: 差分表示モーダル</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* セキュリティ・パフォーマンス */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            セキュリティ考慮事項
          </h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>• 検討書内容の機密性保護</li>
            <li>• 部署別アクセス制御</li>
            <li>• 承認権限の厳格な管理</li>
            <li>• ファイルアップロードのセキュリティ</li>
            <li>• 検索結果の権限フィルタリング</li>
            <li>• 変更履歴の完全記録</li>
            <li>• 監査ログの記録</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            パフォーマンス考慮事項
          </h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>• 全文検索のインデックス最適化</li>
            <li>• 関連データの遅延読み込み</li>
            <li>• ファイルの効率的な管理</li>
            <li>• 検索結果のキャッシュ</li>
            <li>• 大量データのページネーション</li>
            <li>• 画像・ファイルの最適化</li>
            <li>• リアルタイム更新の最適化</li>
          </ul>
        </div>
      </div>

      {/* フッター */}
      <div className="text-center mt-12 pt-8 border-t">
        <p className="text-gray-600 mb-4">
          この仕様書は継続的に更新されます
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/specifications/doc1-project-management/project">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
              プロジェクト管理仕様書
            </button>
          </Link>
          <Link href="/knowledge/kento">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
              検討書管理画面へ
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
