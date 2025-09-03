import Link from 'next/link';

export default function ApiDesignDocumentPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          API設計方針
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          プロジェクト管理アプリのtRPC API設計と実装ガイドライン
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/specifications/doc1-project-management/project">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              仕様書に戻る
            </button>
          </Link>
          <Link href="/manage">
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              管理画面へ
            </button>
          </Link>
        </div>
      </div>

      {/* 設計原則 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          API設計原則
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">技術スタック</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">tRPC v11</span>
                <span className="text-gray-600">エンドツーエンド型安全API</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Zod</span>
                <span className="text-gray-600">バリデーション・型定義</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">SQLite</span>
                <span className="text-gray-600">データベース（achievements.db）</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">DAL層</span>
                <span className="text-gray-600">統一データアクセス層</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">設計方針</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>型安全性</strong>: TypeScript + Zodによる完全型安全</li>
              <li>• <strong>統一レスポンス</strong>: success/error形式の統一</li>
              <li>• <strong>エラーハンドリング</strong>: TRPCErrorによる標準化</li>
              <li>• <strong>権限管理</strong>: ロールベースアクセス制御</li>
              <li>• <strong>履歴記録</strong>: 全操作の監査ログ</li>
              <li>• <strong>パフォーマンス</strong>: React Queryによるキャッシュ</li>
            </ul>
          </div>
        </div>
      </div>

      {/* プロジェクト管理API */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          プロジェクト管理API
        </h2>
        <p className="text-gray-600 mb-6">PJ-001〜PJ-007の画面を支えるtRPCルーター設計</p>
        
        <div className="space-y-6">
          {/* プロジェクトルーター */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-lg mb-3 text-blue-600">projectRouter</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono mb-4">
              <div>src/lib/trpc/routers/project.ts</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2">Query プロシージャ</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <code>getAll</code> - プロジェクト一覧取得（PJ-001）</li>
                  <li>• <code>getById</code> - プロジェクト詳細取得（PJ-002）</li>
                  <li>• <code>search</code> - 検索・フィルタリング（PJ-001）</li>
                  <li>• <code>getByStatus</code> - ステータス別取得</li>
                  <li>• <code>getByClient</code> - クライアント別取得</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Mutation プロシージャ</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <code>create</code> - プロジェクト作成（PJ-003）</li>
                  <li>• <code>update</code> - プロジェクト更新（PJ-004）</li>
                  <li>• <code>delete</code> - プロジェクト削除</li>
                  <li>• <code>updateStatus</code> - ステータス更新（PJ-006）</li>
                  <li>• <code>bulkUpdate</code> - 一括更新（PJ-007）</li>
                </ul>
              </div>
            </div>
          </div>

                     {/* プロジェクトメンバー管理ルーター */}
           <div className="border-l-4 border-green-500 pl-4">
             <h4 className="font-semibold text-lg mb-3 text-green-600">projectMemberRouter</h4>
             <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono mb-4">
               <div>src/lib/trpc/routers/projectMember.ts</div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h5 className="font-medium mb-2">Query プロシージャ</h5>
                 <ul className="space-y-2 text-sm text-gray-600">
                   <li>• <code>getByProject</code> - プロジェクトメンバー取得（PJ-005）</li>
                   <li>• <code>getAllUsers</code> - 全ユーザー取得</li>
                   <li>• <code>searchUsers</code> - ユーザー検索</li>
                   <li>• <code>getMemberHistory</code> - 参加履歴取得</li>
                 </ul>
               </div>
               <div>
                 <h5 className="font-medium mb-2">Mutation プロシージャ</h5>
                 <ul className="space-y-2 text-sm text-gray-600">
                   <li>• <code>addMember</code> - メンバー追加（PJ-005）</li>
                   <li>• <code>removeMember</code> - メンバー削除</li>
                   <li>• <code>updateRole</code> - 権限変更</li>
                   <li>• <code>bulkAddMembers</code> - 一括追加</li>
                 </ul>
               </div>
             </div>
           </div>

           {/* プロジェクト履歴管理ルーター */}
           <div className="border-l-4 border-purple-500 pl-4">
             <h4 className="font-semibold text-lg mb-3 text-purple-600">projectHistoryRouter</h4>
             <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono mb-4">
               <div>src/lib/trpc/routers/projectHistory.ts</div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h5 className="font-medium mb-2">Query プロシージャ</h5>
                 <ul className="space-y-2 text-sm text-gray-600">
                   <li>• <code>getByProject</code> - プロジェクト履歴取得（PJ-002）</li>
                   <li>• <code>getByUser</code> - ユーザー別履歴</li>
                   <li>• <code>getByDateRange</code> - 期間別履歴</li>
                 </ul>
               </div>
               <div>
                 <h5 className="font-medium mb-2">Mutation プロシージャ</h5>
                 <ul className="space-y-2 text-sm text-gray-600">
                   <li>• <code>createHistory</code> - 履歴記録（自動）</li>
                   <li>• <code>bulkCreateHistory</code> - 一括履歴記録</li>
                 </ul>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* データモデル */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🗄️</span>
          データモデル設計
        </h2>
        
        <div className="space-y-6">
          {/* PROJECT テーブル */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-lg mb-3 text-blue-600">PROJECT テーブル</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono mb-4">
              <div>主要フィールド（achievements.db）</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">基本情報</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• <code>PROJECT_ID</code> - プロジェクト識別子（PK）</li>
                  <li>• <code>PROJECT_NAME</code> - プロジェクト名</li>
                  <li>• <code>PROJECT_DESCRIPTION</code> - 説明</li>
                  <li>• <code>PROJECT_STATUS</code> - ステータス</li>
                  <li>• <code>PROJECT_CLIENT_NAME</code> - クライアント名</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">期間・分類</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• <code>PROJECT_START_DATE</code> - 開始日</li>
                  <li>• <code>PROJECT_START_ENDDATE</code> - 終了予定日</li>
                  <li>• <code>PROJECT_CLASSIFICATION</code> - 分類</li>
                  <li>• <code>PROJECT_BUDGENT_GRADE</code> - 予算グレード</li>
                  <li>• <code>CREATED_AT</code> / <code>UPDATE_AT</code> - タイムスタンプ</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PROJECT_MEMBERS テーブル */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-lg mb-3 text-green-600">PROJECT_MEMBERS テーブル（新規）</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono mb-4">
              <div>プロジェクトメンバー管理用テーブル</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">基本情報</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• <code>member_id</code> - メンバーID（PK）</li>
                  <li>• <code>project_id</code> - プロジェクトID（FK）</li>
                  <li>• <code>user_id</code> - ユーザーID（FK）</li>
                  <li>• <code>role</code> - ロール（PM/開発者/設計者/テスター/閲覧者）</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">管理情報</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• <code>joined_at</code> - 参加日</li>
                  <li>• <code>left_at</code> - 退任日</li>
                  <li>• <code>assigned_by</code> - 任命者</li>
                  <li>• <code>created_at</code> / <code>updated_at</code> - タイムスタンプ</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PROJECT_HISTORY テーブル */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-lg mb-3 text-purple-600">PROJECT_HISTORY テーブル（新規）</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono mb-4">
              <div>プロジェクト変更履歴管理用テーブル</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">基本情報</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• <code>history_id</code> - 履歴ID（PK）</li>
                  <li>• <code>project_id</code> - プロジェクトID（FK）</li>
                  <li>• <code>action_type</code> - 操作種別</li>
                  <li>• <code>field_name</code> - 変更フィールド</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">変更内容</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• <code>old_value</code> - 変更前値</li>
                  <li>• <code>new_value</code> - 変更後値</li>
                  <li>• <code>changed_by</code> - 変更者</li>
                  <li>• <code>changed_at</code> - 変更日時</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* API引数詳細 */}
       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
         <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
           <span className="text-2xl">📝</span>
           API引数詳細
         </h2>
         
         <div className="space-y-6">
           {/* プロジェクトルーター引数 */}
           <div className="border-l-4 border-blue-500 pl-4">
             <h4 className="font-semibold text-lg mb-3 text-blue-600">projectRouter 引数詳細</h4>
             
             <div className="space-y-4">
               <div>
                 <h5 className="font-medium mb-2">Query プロシージャ引数</h5>
                 <div className="bg-gray-50 p-4 rounded-lg text-sm">
                   <div className="mb-3">
                     <strong>getAll</strong> - プロジェクト一覧取得
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  search?: string;           // 検索キーワード（プロジェクト名、クライアント名）
  status?: 'active' | 'completed' | 'cancelled';  // ステータスフィルタ
  client?: string;           // クライアント名フィルタ
  dateFrom?: string;         // 開始日フィルタ（YYYY-MM-DD）
  dateTo?: string;           // 終了日フィルタ（YYYY-MM-DD）
  limit?: number;            // 取得件数（デフォルト: 20）
  offset?: number;           // オフセット（デフォルト: 0）
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>getById</strong> - プロジェクト詳細取得
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  id: string;                // プロジェクトID
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>search</strong> - 検索・フィルタリング
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  search?: string;           // 検索キーワード
  status?: string;           // ステータス
  client?: string;           // クライアント名
  dateFrom?: string;         // 開始日
  dateTo?: string;           // 終了日
  sortBy?: 'name' | 'created_at' | 'updated_at';  // ソート項目
  sortOrder?: 'asc' | 'desc'; // ソート順序
  limit?: number;            // 取得件数
  offset?: number;           // オフセット
}`}
                     </pre>
                   </div>
                 </div>
               </div>
               
               <div>
                 <h5 className="font-medium mb-2">Mutation プロシージャ引数</h5>
                 <div className="bg-gray-50 p-4 rounded-lg text-sm">
                   <div className="mb-3">
                     <strong>create</strong> - プロジェクト作成
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  PROJECT_NAME: string;      // プロジェクト名（必須）
  PROJECT_DESCRIPTION?: string;  // 説明
  PROJECT_CLIENT_NAME: string;   // クライアント名（必須）
  PROJECT_START_DATE: string;    // 開始日（必須）
  PROJECT_START_ENDDATE: string; // 終了予定日（必須）
  PROJECT_CLASSIFICATION?: string; // 分類
  PROJECT_BUDGENT_GRADE?: string;  // 予算グレード
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>update</strong> - プロジェクト更新
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  id: string;                // プロジェクトID（必須）
  data: {                    // 更新データ（部分更新可能）
    PROJECT_NAME?: string;
    PROJECT_DESCRIPTION?: string;
    PROJECT_CLIENT_NAME?: string;
    PROJECT_START_DATE?: string;
    PROJECT_START_ENDDATE?: string;
    PROJECT_CLASSIFICATION?: string;
    PROJECT_BUDGENT_GRADE?: string;
  }
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>updateStatus</strong> - ステータス更新
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  id: string;                // プロジェクトID（必須）
  status: 'active' | 'completed' | 'cancelled';  // 新しいステータス（必須）
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>bulkUpdate</strong> - 一括更新
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  ids: string[];             // プロジェクトID配列（必須）
  data: {                    // 更新データ
    status?: 'active' | 'completed' | 'cancelled';
    PROJECT_CLASSIFICATION?: string;
    PROJECT_BUDGENT_GRADE?: string;
  }
}`}
                     </pre>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* プロジェクトメンバールーター引数 */}
           <div className="border-l-4 border-green-500 pl-4">
             <h4 className="font-semibold text-lg mb-3 text-green-600">projectMemberRouter 引数詳細</h4>
             
             <div className="space-y-4">
               <div>
                 <h5 className="font-medium mb-2">Query プロシージャ引数</h5>
                 <div className="bg-gray-50 p-4 rounded-lg text-sm">
                   <div className="mb-3">
                     <strong>getByProject</strong> - プロジェクトメンバー取得
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  projectId: string;         // プロジェクトID（必須）
  includeInactive?: boolean; // 非アクティブメンバーを含むか
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>getAllUsers</strong> - 全ユーザー取得
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  limit?: number;            // 取得件数（デフォルト: 100）
  offset?: number;           // オフセット（デフォルト: 0）
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>searchUsers</strong> - ユーザー検索
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  search: string;            // 検索キーワード（名前、会社名）
  limit?: number;            // 取得件数
  excludeProjectId?: string; // 除外するプロジェクトID
}`}
                     </pre>
                   </div>
                 </div>
               </div>
               
               <div>
                 <h5 className="font-medium mb-2">Mutation プロシージャ引数</h5>
                 <div className="bg-gray-50 p-4 rounded-lg text-sm">
                   <div className="mb-3">
                     <strong>addMember</strong> - メンバー追加
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  projectId: string;         // プロジェクトID（必須）
  userId: string;            // ユーザーID（必須）
  role: 'PM' | '開発者' | '設計者' | 'テスター' | '閲覧者';  // ロール（必須）
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>removeMember</strong> - メンバー削除
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  projectId: string;         // プロジェクトID（必須）
  userId: string;            // ユーザーID（必須）
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>updateRole</strong> - 権限変更
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  projectId: string;         // プロジェクトID（必須）
  userId: string;            // ユーザーID（必須）
  role: 'PM' | '開発者' | '設計者' | 'テスター' | '閲覧者';  // 新しいロール（必須）
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>bulkAddMembers</strong> - 一括追加
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  projectId: string;         // プロジェクトID（必須）
  members: Array<{           // メンバー配列
    userId: string;          // ユーザーID
    role: 'PM' | '開発者' | '設計者' | 'テスター' | '閲覧者';  // ロール
  }>;
}`}
                     </pre>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* プロジェクト履歴ルーター引数 */}
           <div className="border-l-4 border-purple-500 pl-4">
             <h4 className="font-semibold text-lg mb-3 text-purple-600">projectHistoryRouter 引数詳細</h4>
             
             <div className="space-y-4">
               <div>
                 <h5 className="font-medium mb-2">Query プロシージャ引数</h5>
                 <div className="bg-gray-50 p-4 rounded-lg text-sm">
                   <div className="mb-3">
                     <strong>getByProject</strong> - プロジェクト履歴取得
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  projectId: string;         // プロジェクトID（必須）
  actionType?: string;       // 操作種別フィルタ
  fieldName?: string;        // 変更フィールドフィルタ
  dateFrom?: string;         // 開始日フィルタ
  dateTo?: string;           // 終了日フィルタ
  limit?: number;            // 取得件数（デフォルト: 50）
  offset?: number;           // オフセット（デフォルト: 0）
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>getByUser</strong> - ユーザー別履歴
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  userId: string;            // ユーザーID（必須）
  projectId?: string;        // プロジェクトID（オプション）
  dateFrom?: string;         // 開始日フィルタ
  dateTo?: string;           // 終了日フィルタ
  limit?: number;            // 取得件数
  offset?: number;           // オフセット
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>getByDateRange</strong> - 期間別履歴
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  dateFrom: string;          // 開始日（必須）
  dateTo: string;            // 終了日（必須）
  projectId?: string;        // プロジェクトID（オプション）
  actionType?: string;       // 操作種別フィルタ
  limit?: number;            // 取得件数
  offset?: number;           // オフセット
}`}
                     </pre>
                   </div>
                 </div>
               </div>
               
               <div>
                 <h5 className="font-medium mb-2">Mutation プロシージャ引数</h5>
                 <div className="bg-gray-50 p-4 rounded-lg text-sm">
                   <div className="mb-3">
                     <strong>createHistory</strong> - 履歴記録（自動）
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  projectId: string;         // プロジェクトID（必須）
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'MEMBER_ADD' | 'MEMBER_REMOVE';  // 操作種別（必須）
  fieldName?: string;        // 変更フィールド名
  oldValue?: string;         // 変更前値
  newValue?: string;         // 変更後値
  changedBy: string;         // 変更者ID（必須）
}`}
                     </pre>
                   </div>
                   <div className="mb-3">
                     <strong>bulkCreateHistory</strong> - 一括履歴記録
                     <pre className="bg-gray-900 text-green-400 p-2 rounded mt-1 text-xs">
{`input: {
  histories: Array<{         // 履歴配列
    projectId: string;       // プロジェクトID
    actionType: string;      // 操作種別
    fieldName?: string;      // 変更フィールド名
    oldValue?: string;       // 変更前値
    newValue?: string;       // 変更後値
    changedBy: string;       // 変更者ID
  }>;
}`}
                     </pre>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* 実装パターン */}
       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🔧</span>
          実装パターン
        </h2>
        
        <div className="space-y-6">
          {/* Zodスキーマ */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-lg mb-3 text-blue-600">Zodスキーマ設計</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono mb-4">
              <div>types/project.ts</div>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// プロジェクト作成スキーマ
const CreateProjectSchema = z.object({
  PROJECT_NAME: z.string().min(1, 'プロジェクト名は必須です'),
  PROJECT_DESCRIPTION: z.string().optional(),
  PROJECT_CLIENT_NAME: z.string().min(1, 'クライアント名は必須です'),
  PROJECT_START_DATE: z.string().datetime(),
  PROJECT_START_ENDDATE: z.string().datetime(),
  PROJECT_CLASSIFICATION: z.string().optional(),
  PROJECT_BUDGENT_GRADE: z.string().optional(),
});

// プロジェクト更新スキーマ
const UpdateProjectSchema = CreateProjectSchema.partial();

// プロジェクト検索スキーマ
const ProjectSearchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
  client: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});`}
            </pre>
          </div>

          {/* tRPCプロシージャ */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-lg mb-3 text-green-600">tRPCプロシージャ実装</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono mb-4">
              <div>lib/trpc/routers/project.ts</div>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`export const projectRouter = createTRPCRouter({
  // プロジェクト一覧取得（PJ-001）
  getAll: publicProcedure
    .input(ProjectSearchSchema)
    .query(async ({ input }) => {
      try {
        const result = await getAllRecords<ProjectData>(
          'PROJECT', 
          buildSearchQuery(input), 
          buildSearchParams(input)
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'データの取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの取得に失敗しました',
        });
      }
    }),

  // プロジェクト作成（PJ-003）
  create: publicProcedure
    .input(CreateProjectSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await createRecord('PROJECT', input);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'プロジェクトの作成に失敗しました',
          });
        }
        
        // 履歴記録
        await createHistoryRecord({
          project_id: result.data.PROJECT_ID,
          action_type: 'CREATE',
          field_name: 'PROJECT',
          new_value: JSON.stringify(result.data),
          changed_by: 'current_user_id', // 認証コンテキストから取得
        });
        
        return { success: true, data: result.data };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクトの作成に失敗しました',
        });
      }
    }),
});`}
            </pre>
          </div>

          {/* カスタムフック */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-lg mb-3 text-purple-600">カスタムフック実装</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono mb-4">
              <div>hooks/useProjectData.ts</div>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import { trpc } from '@src/lib/trpc/client';

// プロジェクト一覧取得フック
export const useProjectList = (filters: ProjectSearchInput) => {
  return trpc.project.getAll.useQuery(filters, {
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    refetchOnWindowFocus: false,
  });
};

// プロジェクト詳細取得フック
export const useProjectDetail = (projectId: string) => {
  return trpc.project.getById.useQuery({ id: projectId }, {
    enabled: !!projectId,
  });
};

// プロジェクト操作フック
export const useProjectMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
    }
  });

  const updateMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.getById.invalidate();
    }
  });

  return { createMutation, updateMutation };
};`}
            </pre>
          </div>
        </div>
      </div>

      {/* 権限管理 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">🔒</span>
          権限管理設計
        </h2>
        
        <div className="space-y-6">
          {/* ロール定義 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-lg mb-3 text-blue-600">ロール定義</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2">ロール種別</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>PM（プロジェクトマネージャー）</strong></li>
                  <li>• <strong>開発者</strong></li>
                  <li>• <strong>設計者</strong></li>
                  <li>• <strong>テスター</strong></li>
                  <li>• <strong>閲覧者</strong></li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">権限マトリックス</h5>
                <div className="text-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-1">操作</th>
                        <th className="border p-1">PM</th>
                        <th className="border p-1">開発者</th>
                        <th className="border p-1">設計者</th>
                        <th className="border p-1">テスター</th>
                        <th className="border p-1">閲覧者</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-1">プロジェクト作成</td>
                        <td className="border p-1 text-center">✅</td>
                        <td className="border p-1 text-center">✅</td>
                        <td className="border p-1 text-center">❌</td>
                        <td className="border p-1 text-center">❌</td>
                        <td className="border p-1 text-center">❌</td>
                      </tr>
                      <tr>
                        <td className="border p-1">プロジェクト編集</td>
                        <td className="border p-1 text-center">✅</td>
                        <td className="border p-1 text-center">✅</td>
                        <td className="border p-1 text-center">⚠️</td>
                        <td className="border p-1 text-center">❌</td>
                        <td className="border p-1 text-center">❌</td>
                      </tr>
                      <tr>
                        <td className="border p-1">メンバー管理</td>
                        <td className="border p-1 text-center">✅</td>
                        <td className="border p-1 text-center">❌</td>
                        <td className="border p-1 text-center">❌</td>
                        <td className="border p-1 text-center">❌</td>
                        <td className="border p-1 text-center">❌</td>
                      </tr>
                      <tr>
                        <td className="border p-1">プロジェクト削除</td>
                        <td className="border p-1 text-center">✅</td>
                        <td className="border p-1 text-center">❌</td>
                        <td className="border p-1 text-center">❌</td>
                        <td className="border p-1 text-center">❌</td>
                        <td className="border p-1 text-center">❌</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 権限チェック実装 */}
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-lg mb-3 text-green-600">権限チェック実装</h4>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono mb-4">
              <div>lib/auth/permissions.ts</div>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// 権限チェック関数
export const checkProjectPermission = async (
  userId: string,
  projectId: string,
  requiredRole: ProjectRole
): Promise<boolean> => {
  const member = await getProjectMember(userId, projectId);
  if (!member) return false;
  
  const roleHierarchy = {
    'PM': 5,
    '開発者': 4,
    '設計者': 3,
    'テスター': 2,
    '閲覧者': 1,
  };
  
  return roleHierarchy[member.role] >= roleHierarchy[requiredRole];
};

// tRPCミドルウェア
export const requireProjectPermission = (requiredRole: ProjectRole) =>
  t.middleware(async ({ ctx, next, input }) => {
    const { projectId } = input as { projectId: string };
    const userId = ctx.user?.id;
    
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    
    const hasPermission = await checkProjectPermission(userId, projectId, requiredRole);
    if (!hasPermission) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    
    return next({ ctx });
  });`}
            </pre>
          </div>
        </div>
      </div>

      {/* 実装チェックリスト */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">✅</span>
          実装チェックリスト
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-3">Phase 1: 基盤構築</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>型定義ファイルの作成（types/project.ts）</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Zodスキーマの定義</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>tRPCルーターの基本構造</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>DAL層の拡張</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Phase 2: プロジェクト管理API</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>projectRouterの実装</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>CRUD操作の実装</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>検索・フィルタリング機能</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>カスタムフックの作成</span>
                </li>
              </ul>
            </div>
                         <div>
               <h4 className="font-semibold text-lg mb-3">Phase 3: メンバー管理API</h4>
               <ul className="space-y-2 text-sm text-gray-600">
                 <li className="flex items-center gap-2">
                   <input type="checkbox" className="rounded" />
                   <span>projectMemberRouterの実装</span>
                 </li>
                 <li className="flex items-center gap-2">
                   <input type="checkbox" className="rounded" />
                   <span>権限管理機能</span>
                 </li>
                 <li className="flex items-center gap-2">
                   <input type="checkbox" className="rounded" />
                   <span>参加履歴管理</span>
                 </li>
                 <li className="flex items-center gap-2">
                   <input type="checkbox" className="rounded" />
                   <span>権限チェックミドルウェア</span>
                 </li>
               </ul>
             </div>
             <div>
               <h4 className="font-semibold text-lg mb-3">Phase 4: 履歴管理API</h4>
               <ul className="space-y-2 text-sm text-gray-600">
                 <li className="flex items-center gap-2">
                   <input type="checkbox" className="rounded" />
                   <span>projectHistoryRouterの実装</span>
                 </li>
                 <li className="flex items-center gap-2">
                   <input type="checkbox" className="rounded" />
                   <span>自動履歴記録機能</span>
                 </li>
                 <li className="flex items-center gap-2">
                   <input type="checkbox" className="rounded" />
                   <span>履歴検索機能</span>
                 </li>
                 <li className="flex items-center gap-2">
                   <input type="checkbox" className="rounded" />
                   <span>監査ログ機能</span>
                 </li>
               </ul>
             </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="text-center mt-12 pt-8 border-t">
        <p className="text-gray-600 mb-4">
          このAPI設計方針は継続的に更新されます
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/specifications/doc1-project-management/project">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
              仕様書に戻る
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
