'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  Database, 
  Download, 
  RefreshCw,
  Calendar,
  FileText,
  BarChart3,
  AlertCircle,
  Settings
} from 'lucide-react';
import { useTableAll, useTableData } from '@src/hooks/useTableData';
import { TableView } from '@src/components/table/TableView';

export default function DataSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [columnFilter, setColumnFilter] = useState('');
  const [operator, setOperator] = useState('contains');
  const [searchValue, setSearchValue] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [resultLimit, setResultLimit] = useState(100);

  // データを取得
  const { data: tablesData, isLoading: isTablesLoading } = useTableAll();
  const { 
    data: tableData, 
    isLoading: isDataLoading,
    refetch: refetchData,
    error: dataError
  } = useTableData(selectedTable);

  // 検索結果用のstate
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const tables = tablesData?.data || [];
  const selectedTableData = tableData?.data;

  // 選択されたテーブルのカラム情報を取得
  const tableColumns = useMemo(() => {
    if (!selectedTableData?.columns) return [];
    return selectedTableData.columns.map((col: any) => ({
      key: col.name,
      label: col.name,
      type: col.type,
      sortable: true
    }));
  }, [selectedTableData]);

  // 検索オペレーター
  const operators = [
    { value: 'contains', label: '含む' },
    { value: 'equals', label: '等しい' },
    { value: 'starts_with', label: '～で始まる' },
    { value: 'ends_with', label: '～で終わる' },
    { value: 'greater_than', label: 'より大きい' },
    { value: 'less_than', label: 'より小さい' },
    { value: 'between', label: '範囲内' },
    { value: 'is_null', label: 'NULL' },
    { value: 'is_not_null', label: 'NOT NULL' }
  ];

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setColumnFilter('');
    setSearchValue('');
    setSearchResults([]);
    setSearchError(null);
  };

  const handleSearch = async () => {
    if (!selectedTable) {
      setSearchError('テーブルを選択してください');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // 検索条件を構築
      let whereClause = '';
      const conditions: string[] = [];

      if (columnFilter && searchValue && operator !== 'is_null' && operator !== 'is_not_null') {
        switch (operator) {
          case 'contains':
            conditions.push(`${columnFilter} LIKE '%${searchValue}%'`);
            break;
          case 'equals':
            conditions.push(`${columnFilter} = '${searchValue}'`);
            break;
          case 'starts_with':
            conditions.push(`${columnFilter} LIKE '${searchValue}%'`);
            break;
          case 'ends_with':
            conditions.push(`${columnFilter} LIKE '%${searchValue}'`);
            break;
          case 'greater_than':
            conditions.push(`${columnFilter} > '${searchValue}'`);
            break;
          case 'less_than':
            conditions.push(`${columnFilter} < '${searchValue}'`);
            break;
        }
      }

      if (operator === 'is_null' && columnFilter) {
        conditions.push(`${columnFilter} IS NULL`);
      }

      if (operator === 'is_not_null' && columnFilter) {
        conditions.push(`${columnFilter} IS NOT NULL`);
      }

      // 日付範囲フィルタ
      if (dateFrom && columnFilter) {
        conditions.push(`${columnFilter} >= '${dateFrom}'`);
      }
      if (dateTo && columnFilter) {
        conditions.push(`${columnFilter} <= '${dateTo}'`);
      }

      // 全文検索
      if (searchTerm && !columnFilter) {
        const searchColumns = tableColumns.map(col => 
          `${col.key} LIKE '%${searchTerm}%'`
        ).join(' OR ');
        if (searchColumns) {
          conditions.push(`(${searchColumns})`);
        }
      }

      if (conditions.length > 0) {
        whereClause = `WHERE ${conditions.join(' AND ')}`;
      }

      const query = `SELECT * FROM ${selectedTable} ${whereClause} LIMIT ${resultLimit}`;

      // SQLクエリを実行（実際の実装では、tRPCのSQL実行APIを使用）
      const mockResults = Array.from({ length: Math.min(resultLimit, 25) }, (_, i) => ({
        id: i + 1,
        ...Object.fromEntries(
          tableColumns.map(col => [
            col.key, 
            col.type === 'INTEGER' ? Math.floor(Math.random() * 1000) :
            col.type === 'TEXT' ? `Sample data ${i + 1}` :
            col.type === 'DATE' ? new Date().toISOString().split('T')[0] :
            `Value ${i + 1}`
          ])
        )
      }));

      setSearchResults(mockResults);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : '検索中にエラーが発生しました');
    } finally {
      setIsSearching(false);
    }
  };

  const handleExportResults = () => {
    if (searchResults.length === 0) return;

    const headers = tableColumns.map(col => col.label).join(',');
    const rows = searchResults.map(row => 
      tableColumns.map(col => `"${row[col.key] || ''}"`).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `search_results_${selectedTable}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setColumnFilter('');
    setSearchValue('');
    setDateFrom('');
    setDateTo('');
    setSearchResults([]);
    setSearchError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/manage/table">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              戻る
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">データ検索</h1>
            <p className="text-gray-600">条件を指定してデータベースからデータを検索</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              showAdvanced 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            詳細検索
          </button>
        </div>
      </div>

      {/* 検索フォーム */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-6">
          {/* テーブル選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索対象テーブル
            </label>
            <select
              value={selectedTable}
              onChange={(e) => handleTableSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">テーブルを選択してください</option>
              {tables.map(table => (
                <option key={table.name} value={table.name}>
                  {table.name} - {table.description}
                </option>
              ))}
            </select>
          </div>

          {selectedTable && (
            <>
              {/* 全文検索 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  全文検索
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="全カラムから検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* カラム別検索 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    検索カラム
                  </label>
                  <select
                    value={columnFilter}
                    onChange={(e) => setColumnFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">カラムを選択</option>
                    {tableColumns.map(col => (
                      <option key={col.key} value={col.key}>
                        {col.label} ({col.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    検索条件
                  </label>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {operators.map(op => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    検索値
                  </label>
                  <input
                    type="text"
                    placeholder="検索する値を入力"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    disabled={operator === 'is_null' || operator === 'is_not_null'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* 詳細検索オプション */}
              {showAdvanced && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">詳細検索オプション</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        開始日
                      </label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        終了日
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        取得件数制限
                      </label>
                      <select
                        value={resultLimit}
                        onChange={(e) => setResultLimit(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={50}>50件</option>
                        <option value={100}>100件</option>
                        <option value={500}>500件</option>
                        <option value={1000}>1000件</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 検索ボタン */}
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  検索実行
                </button>
                
                <button
                  onClick={clearSearch}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  クリア
                </button>

                {searchResults.length > 0 && (
                  <button
                    onClick={handleExportResults}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    エクスポート
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* エラー表示 */}
      {searchError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">検索エラー</h3>
              <p className="text-sm text-red-700 mt-1">{searchError}</p>
            </div>
          </div>
        </div>
      )}

      {/* 検索結果 */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">検索結果</h3>
                <p className="text-sm text-gray-600">
                  {searchResults.length}件の結果が見つかりました (テーブル: {selectedTable})
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportResults}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  CSV出力
                </button>
              </div>
            </div>
          </div>

          <TableView
            data={searchResults}
            columns={tableColumns}
            loading={isSearching}
            paginated={true}
            pageSize={20}
            searchable={false}
            emptyMessage="検索結果がありません"
            className="border-0 shadow-none"
          />
        </div>
      )}

      {/* テーブル情報表示 */}
      {selectedTable && selectedTableData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">テーブル情報: {selectedTable}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">総レコード数</p>
                  <p className="text-lg font-semibold">{selectedTableData.total?.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">カラム数</p>
                  <p className="text-lg font-semibold">{tableColumns.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">最終更新</p>
                  <p className="text-lg font-semibold">{'-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* カラム情報 */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">カラム一覧</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {tableColumns.map(col => (
                <div key={col.key} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span className="font-mono">{col.label}</span>
                  <span className="text-gray-500">{col.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}