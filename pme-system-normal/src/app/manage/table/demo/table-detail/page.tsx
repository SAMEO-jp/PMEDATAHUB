'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Table, Eye, Search, Code, BarChart3, Download, Copy, Database } from 'lucide-react';

// デモデータ
const tableSchemas = {
  'PROJECT': {
    name: 'PROJECT',
    description: 'プロジェクト基本情報',
    records: 1250,
    size: '2.3 MB',
    lastUpdated: '2025-01-15',
    columns: [
      { name: 'ROWID', type: 'INTEGER', nullable: false, primary: true, description: '主キー（自動採番）' },
      { name: 'PROJECT_ID', type: 'TEXT', nullable: false, primary: false, description: 'プロジェクト識別子' },
      { name: 'PROJECT_NAME', type: 'TEXT', nullable: true, primary: false, description: 'プロジェクト名' },
      { name: 'PROJECT_DESCRIPTION', type: 'TEXT', nullable: true, primary: false, description: 'プロジェクト説明' },
      { name: 'PROJECT_START_DATE', type: 'TEXT', nullable: true, primary: false, description: 'プロジェクト開始日' },
      { name: 'PROJECT_START_ENDDATE', type: 'TEXT', nullable: true, primary: false, description: 'プロジェクト終了予定日' },
      { name: 'PROJECT_STATUS', type: 'TEXT', nullable: true, primary: false, description: 'プロジェクト状態' },
      { name: 'PROJECT_CLIENT_NAME', type: 'TEXT', nullable: true, primary: false, description: 'クライアント名' },
      { name: 'PROJECT_CLASSIFICATION', type: 'TEXT', nullable: true, primary: false, description: 'プロジェクト分類' },
      { name: 'PROJECT_BUDGENT_GRADE', type: 'TEXT', nullable: true, primary: false, description: '予算グレード' },
      { name: 'installationDate', type: 'TEXT', nullable: true, primary: false, description: '設置日' },
      { name: 'drawingCompletionDate', type: 'TEXT', nullable: true, primary: false, description: '図面完成日' },
      { name: 'PROJECT_EQUIPMENT_CATEGORY', type: 'TEXT', nullable: true, primary: false, description: '設備カテゴリ' },
      { name: 'PROJECT_SYOHIN_CATEGORY', type: 'TEXT', nullable: true, primary: false, description: '商品カテゴリ' },
      { name: 'CREATED_AT', type: 'TEXT', nullable: true, primary: false, description: '作成日時' },
      { name: 'UPDATE_AT', type: 'TEXT', nullable: true, primary: false, description: '更新日時' },
      { name: 'PROJECT_NOTE', type: 'TEXT', nullable: true, primary: false, description: '備考' },
      { name: 'SPARE1', type: 'TEXT', nullable: true, primary: false, description: '予備フィールド1' },
      { name: 'SPARE2', type: 'TEXT', nullable: true, primary: false, description: '予備フィールド2' },
      { name: 'SPARE3', type: 'TEXT', nullable: true, primary: false, description: '予備フィールド3' },
      { name: 'IS_PROJECT', type: 'TEXT', nullable: true, primary: false, description: 'プロジェクトフラグ' }
    ],
    indexes: [
      { name: 'idx_project_id', columns: ['PROJECT_ID'], type: 'UNIQUE' },
      { name: 'idx_project_status', columns: ['PROJECT_STATUS'], type: 'INDEX' },
      { name: 'idx_project_client', columns: ['PROJECT_CLIENT_NAME'], type: 'INDEX' },
      { name: 'idx_project_start_date', columns: ['PROJECT_START_DATE'], type: 'INDEX' },
      { name: 'idx_project_created_at', columns: ['CREATED_AT'], type: 'INDEX' }
    ],
    sampleData: [
      {
        ROWID: 1,
        PROJECT_ID: 'E923BXX215000',
        PROJECT_NAME: '君津２高炉BP水素吹き込み対応',
        PROJECT_DESCRIPTION: '君津２高炉BP水素吹き込み対応プロジェクト',
        PROJECT_START_DATE: '2025-03-03',
        PROJECT_START_ENDDATE: '2025-06-30',
        PROJECT_STATUS: '進行中',
        PROJECT_CLIENT_NAME: '新日鉄住金',
        PROJECT_CLASSIFICATION: '設備工事',
        PROJECT_BUDGENT_GRADE: 'A',
        installationDate: '2025-05-15',
        drawingCompletionDate: '2025-04-20',
        PROJECT_EQUIPMENT_CATEGORY: '高炉設備',
        PROJECT_SYOHIN_CATEGORY: '製鉄設備',
        CREATED_AT: '2025-01-15 10:30:00',
        UPDATE_AT: '2025-01-15 14:20:00',
        PROJECT_NOTE: '重要プロジェクト',
        SPARE1: null,
        SPARE2: null,
        SPARE3: null,
        IS_PROJECT: '1'
      },
      {
        ROWID: 2,
        PROJECT_ID: 'E924CXX216000',
        PROJECT_NAME: '名古屋製鉄所設備更新',
        PROJECT_DESCRIPTION: '名古屋製鉄所の設備更新プロジェクト',
        PROJECT_START_DATE: '2025-04-01',
        PROJECT_START_ENDDATE: '2025-12-31',
        PROJECT_STATUS: '企画中',
        PROJECT_CLIENT_NAME: '新日鉄住金',
        PROJECT_CLASSIFICATION: '設備工事',
        PROJECT_BUDGENT_GRADE: 'B',
        installationDate: '2025-11-30',
        drawingCompletionDate: '2025-08-15',
        PROJECT_EQUIPMENT_CATEGORY: '製鉄設備',
        PROJECT_SYOHIN_CATEGORY: '製鉄設備',
        CREATED_AT: '2025-01-10 09:15:00',
        UPDATE_AT: '2025-01-14 16:45:00',
        PROJECT_NOTE: '環境対応設備',
        SPARE1: null,
        SPARE2: null,
        SPARE3: null,
        IS_PROJECT: '1'
      }
    ]
  },
  'USER': {
    name: 'USER',
    description: 'ユーザー情報',
    records: 89,
    size: '156 KB',
    lastUpdated: '2025-01-14',
    columns: [
      { name: 'user_id', type: 'TEXT', nullable: true, primary: false, description: 'ユーザーID' },
      { name: 'name_japanese', type: 'TEXT', nullable: true, primary: false, description: '日本語名' },
      { name: 'TEL', type: 'TEXT', nullable: true, primary: false, description: '電話番号' },
      { name: 'mail', type: 'TEXT', nullable: true, primary: false, description: 'メールアドレス' },
      { name: 'name_english', type: 'TEXT', nullable: true, primary: false, description: '英語名' },
      { name: 'name_yomi', type: 'TEXT', nullable: true, primary: false, description: '読み仮名' },
      { name: 'company', type: 'TEXT', nullable: true, primary: false, description: '会社名' },
      { name: 'bumon', type: 'TEXT', nullable: true, primary: false, description: '部門' },
      { name: 'in_year', type: 'TEXT', nullable: true, primary: false, description: '入社年' },
      { name: 'Kengen', type: 'TEXT', nullable: true, primary: false, description: '権限' },
      { name: 'TEL_naisen', type: 'TEXT', nullable: true, primary: false, description: '内線電話番号' },
      { name: 'sitsu', type: 'TEXT', nullable: true, primary: false, description: '室' },
      { name: 'ka', type: 'TEXT', nullable: true, primary: false, description: '課' }
    ],
    indexes: [
      { name: 'idx_user_id', columns: ['user_id'], type: 'UNIQUE' },
      { name: 'idx_user_company', columns: ['company'], type: 'INDEX' },
      { name: 'idx_user_bumon', columns: ['bumon'], type: 'INDEX' }
    ],
    sampleData: [
      {
        user_id: 'U001',
        name_japanese: '田中太郎',
        TEL: '03-1234-5678',
        mail: 'tanaka@example.com',
        name_english: 'Taro Tanaka',
        name_yomi: 'タナカタロウ',
        company: '新日鉄住金',
        bumon: '技術部',
        in_year: '2015',
        Kengen: '管理者',
        TEL_naisen: '1234',
        sitsu: '技術室',
        ka: '技術課'
      }
    ]
  }
};

function TableDetailContent() {
  const searchParams = useSearchParams();
  const tableName = searchParams.get('table') || 'PROJECT';
  const [activeTab, setActiveTab] = useState('structure');
  const [copied, setCopied] = useState(false);

  const tableSchema = tableSchemas[tableName as keyof typeof tableSchemas] || tableSchemas['PROJECT'];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCreateTableSQL = () => {
    const columns = tableSchema.columns.map(col => {
      let sql = `    ${col.name} ${col.type}`;
      if (!col.nullable) sql += ' NOT NULL';
      if (col.primary) sql += ' PRIMARY KEY';
      return sql;
    }).join(',\n');
    
    return `CREATE TABLE IF NOT EXISTS "${tableSchema.name}" (\n${columns}\n);`;
  };

  const generateIndexSQL = () => {
    return tableSchema.indexes.map(index => {
      const columns = index.columns.join(', ');
      if (index.type === 'UNIQUE') {
        return `CREATE UNIQUE INDEX IF NOT EXISTS ${index.name} ON "${tableSchema.name}"(${columns});`;
      } else {
        return `CREATE INDEX IF NOT EXISTS ${index.name} ON "${tableSchema.name}"(${columns});`;
      }
    }).join('\n');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/manage/table/demo/tables">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{tableSchema.name}</h1>
            <p className="text-gray-600">{tableSchema.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/manage/table/demo/data-search?table=${tableName}`}>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" />
              データ検索
            </button>
          </Link>
          <Link href="/manage/table/demo/sql-executor">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Code className="w-4 h-4" />
              SQL実行
            </button>
          </Link>
        </div>
      </div>

      {/* テーブル情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <Database className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">レコード数</p>
              <p className="text-2xl font-bold text-gray-900">{tableSchema.records.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <Table className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">カラム数</p>
              <p className="text-2xl font-bold text-gray-900">{tableSchema.columns.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">サイズ</p>
              <p className="text-2xl font-bold text-gray-900">{tableSchema.size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">インデックス</p>
              <p className="text-2xl font-bold text-gray-900">{tableSchema.indexes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'structure', name: 'テーブル構造', icon: Table },
              { id: 'data', name: 'サンプルデータ', icon: Eye },
              { id: 'indexes', name: 'インデックス', icon: BarChart3 },
              { id: 'sql', name: 'SQL', icon: Code }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* テーブル構造 */}
          {activeTab === 'structure' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">カラム情報</h3>
                <button
                  onClick={() => copyToClipboard(generateCreateTableSQL())}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'コピー完了' : 'CREATE TABLE SQL'}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">カラム名</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">データ型</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">NULL</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">主キー</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableSchema.columns.map((column, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{column.name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{column.type}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {column.nullable ? 'YES' : 'NO'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {column.primary ? 'YES' : 'NO'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{column.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* サンプルデータ */}
          {activeTab === 'data' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">サンプルデータ</h3>
                <button className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  CSV出力
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      {tableSchema.columns.map((column, index) => (
                        <th key={index} className="border border-gray-300 px-3 py-2 text-left font-medium text-sm">
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableSchema.sampleData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {tableSchema.columns.map((column, colIndex) => (
                          <td key={colIndex} className="border border-gray-300 px-3 py-2 text-sm">
                            {row[column.name as keyof typeof row] || 'NULL'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* インデックス */}
          {activeTab === 'indexes' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">インデックス情報</h3>
                <button
                  onClick={() => copyToClipboard(generateIndexSQL())}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'コピー完了' : 'INDEX SQL'}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">インデックス名</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">タイプ</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">カラム</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableSchema.indexes.map((index, indexIndex) => (
                      <tr key={indexIndex} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{index.name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            index.type === 'UNIQUE' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {index.type}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{index.columns.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SQL */}
          {activeTab === 'sql' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">SQL スクリプト</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium mb-2">CREATE TABLE</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{generateCreateTableSQL()}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium mb-2">CREATE INDEX</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{generateIndexSQL()}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium mb-2">サンプルクエリ</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{`-- 全レコード取得
SELECT * FROM "${tableSchema.name}" LIMIT 10;

-- レコード数確認
SELECT COUNT(*) FROM "${tableSchema.name}";

-- 最新のレコード
SELECT * FROM "${tableSchema.name}" ORDER BY ROWID DESC LIMIT 5;`}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TableDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <TableDetailContent />
    </Suspense>
  );
}
