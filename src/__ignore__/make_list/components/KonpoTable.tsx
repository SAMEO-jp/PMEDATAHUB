// ==========================================
// インポート層
// ==========================================
// 1. React関連（必ず最初）
import React from 'react';
// 2. TanStack Table関連
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Row,
  Column,
} from '@tanstack/react-table';
// 3. 外部ライブラリ（アルファベット順）
import { ChevronRight, ChevronUp, ChevronDown, Search, X } from 'lucide-react';
// 4. 内部コンポーネント（階層順）
import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/table';
// 5. ヘッダーストア
import { useHeaderStore } from '@/src/features/header/store/headerSlice';
// 6. 型定義（最後）
import type { GroupedData, KonpoData } from '../types/konpo.types';

// ==========================================
// 型定義層（Props, 内部型, API型）
// ==========================================
/**
 * 工法テーブルコンポーネントのProps
 * @property groupedData - グループ化された工法データ
 * @property isLoading - データ読み込み中の状態
 * @property error - エラーメッセージ
 * @property selectedRows - 選択された行のキーセット
 * @property expandedRows - 展開された行のキーセット
 * @property activeTab - 現在アクティブなタブ
 * @property onToggleRow - 行選択の切り替えハンドラ
 * @property onToggleExpand - 行展開の切り替えハンドラ
 * @property onTabChange - タブ変更ハンドラ
 * @property onCreateListId - 選択リストID作成ハンドラ
 * @property showSearch - 検索欄の表示/非表示
 * @property showPagination - ページネーションの表示/非表示
 * @property showSorting - ソート機能の表示/非表示
 * @property showTabs - タブの表示/非表示
 * @property rowHeight - 行の高さ設定
 * @property tableSize - テーブルのサイズ設定
 * @property fontSize - フォントサイズ設定
 */
interface KonpoTableProps {
  // データ関連
  groupedData: GroupedData;
  isLoading?: boolean;
  error?: string | null;
  
  // 状態管理
  selectedRows: Set<string>;
  expandedRows: Set<string>;
  activeTab: string;
  
  // イベントハンドラ
  onToggleRow: (key: string) => void;
  onToggleExpand: (key: string) => void;
  onTabChange?: (value: string) => void;
  onCreateListId?: () => void;
  
  // 表示設定
  showSearch?: boolean;
  showPagination?: boolean;
  showSorting?: boolean;
  showTabs?: boolean;
  
  // スタイル設定
  rowHeight?: 'sm' | 'md' | 'lg';
  tableSize?: 'sm' | 'md' | 'lg';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg';
}

/**
 * テーブル行データの型定義
 * @property key - 行の一意識別子
 * @property zumenName - 図面名
 * @property partName - 部品名
 * @property konpoTanniId - 工法単位ID
 * @property konpoListId - 工法リストID
 * @property totalWeight - 総重量
 * @property konpoData - 工法データ
 */
interface TableRowData {
  key: string;
  zumenName: string;
  partName: string;
  konpoTanniId: string;
  konpoListId: string;
  totalWeight: number;
  konpoData: KonpoData;
}

// ==========================================
// カラム定義層
// ==========================================
/**
 * TanStack Table用のカラム定義を生成
 * テーブル設定層 → カラム定義
 */
const createTableColumns = (
  selectedRows: Set<string>,
  expandedRows: Set<string>,
  onToggleRow: (key: string) => void,
  onToggleExpand: (key: string) => void,
  showSorting: boolean = true
): ColumnDef<TableRowData>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="べて選択す"
        className="h-4 w-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={selectedRows.has(row.original.key)}
        onCheckedChange={() => onToggleRow(row.original.key)}
        aria-label="行を選択"
        className="h-4 w-4"
      />
    ),
    enableSorting: false,
    size: 50,
  },
  {
    id: 'expand',
    header: () => <span className="sr-only">展開</span>,
    cell: ({ row }) => {
      const isExpanded = expandedRows.has(row.original.key);
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleExpand(row.original.key)}
          className="p-0 h-6 w-6"
          aria-label={isExpanded ? "詳細を閉じる" : "詳細を開く"}
        >
          <ChevronRight 
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
          />
        </Button>
      );
    },
    enableSorting: false,
    size: 40,
  },
  {
    accessorKey: 'konpoTanniId',
    header: ({ column }) => showSorting ? (
      <SortableHeader column={column}>
        単位ID
      </SortableHeader>
    ) : (
      <span>単位ID</span>
    ),
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
    size: 150,
  },
  {
    accessorKey: 'konpoListId',
    header: ({ column }) => showSorting ? (
      <SortableHeader column={column}>
        リストID
      </SortableHeader>
    ) : (
      <span>リストID</span>
    ),
    cell: ({ getValue }) => <span>{getValue<string>() || '-'}</span>,
    size: 150,
  },
  {
    id: 'partZumenName',
    header: ({ column }) => showSorting ? (
      <SortableHeader column={column}>
        部品名-図面名
      </SortableHeader>
    ) : (
      <span>部品名-図面名</span>
    ),
    cell: ({ row }) => (
      <span>{`${row.original.partName}-${row.original.zumenName}`}</span>
    ),
    size: 300,
  },
];

// ==========================================
// テーブル設定層（Props, 内部型, API型）
// ==========================================
/**
 * スタイル設定の外部化
 */
const tableStyles = {
  fontSize: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  },
  padding: {
    sm: 'px-2 py-1.5',
    md: 'px-3 py-2',
    lg: 'px-4 py-3'
  },
  margin: {
    sm: 'm-1',
    md: 'm-2',
    lg: 'm-3'
  }
};

/**
 * 行の高さをピクセル値に変換
 * スタイル設定層 → 行の高さ計算
 */
const getRowHeightPixels = (rowHeight: 'sm' | 'md' | 'lg') => {
  switch (rowHeight) {
    case 'sm':
      return 20;  // デフォルトの行の高さ: 20px
    case 'md':
      return 24;  // 中サイズの行の高さ: 24px
    case 'lg':
      return 28;  // 大サイズの行の高さ: 28px
    default:
      return 20;  // デフォルト値
  }
};

/**
 * テーブルサイズの動的設定
 */
const getTableSizeClass = (tableSize: 'sm' | 'md' | 'lg') => {
  switch (tableSize) {
    case 'sm':
      return 'text-xs';
    case 'md':
      return 'text-sm';
    case 'lg':
      return 'text-base';
    default:
      return 'text-sm';
  }
};

// ==========================================
// サブコンポーネント層
// ==========================================
/**
 * ソート可能なヘッダーコンポーネント
 * UI表示層 → ソート機能付きヘッダー
 */
const SortableHeader: React.FC<{
  column: Column<TableRowData, unknown>;
  children: React.ReactNode;
  className?: string;
}> = ({ column, children, className = "" }) => {
  const sortStatus = column.getIsSorted();
  const sortDirection = sortStatus === 'asc' ? '昇順' : sortStatus === 'desc' ? '降順' : 'ソートなし';
  
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sortStatus === 'asc')}
      className={`h-auto p-0 font-semibold text-white hover:bg-blue-700 transition-all duration-200 group ${className}`}
      aria-label={`${children}で${sortDirection}にソート`}
    >
      {children}
      <div className="ml-1 flex items-center">
        {sortStatus === 'asc' ? (
          <ChevronUp className="h-4 w-4 text-white" />
        ) : sortStatus === 'desc' ? (
          <ChevronDown className="h-4 w-4 text-white" />
        ) : (
          <div className="h-4 w-4 flex flex-col items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
            <ChevronUp className="h-2 w-4 text-white" />
            <ChevronDown className="h-2 w-4 -mt-1 text-white" />
          </div>
        )}
      </div>
    </Button>
  );
};

/**
 * タブチップコンポーネント
 * UI表示層 → タブ選択
 */
const TabChips: React.FC<{
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}> = ({ activeTab, onTabChange, className = "" }) => {
  const tabs = [
    { value: 'all', label: 'すべて' },
    { value: 'with-list', label: 'リストIDあり' },
    { value: 'without-list', label: 'リストIDなし' }
  ];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`
            px-3 py-1 text-xs font-medium rounded-full transition-all duration-200
            ${activeTab === tab.value
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

/**
 * ローディングスケルトンコンポーネント
 * UI表示層 → ローディング状態表示
 */
const LoadingSkeleton: React.FC<{ columns: number; rows: number }> = ({ columns, rows }) => (
  <div className="w-full rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-white">
    <Table>
      <TableHeader>
        <TableRow className="bg-blue-600">
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead key={index}>
              <div className="h-4 bg-blue-500 animate-pulse rounded" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white">
            {Array.from({ length: columns }).map((_, cellIndex) => (
              <TableCell key={cellIndex} className="border-b border-slate-100 dark:border-slate-700 bg-white">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

/**
 * エラー表示コンポーネント
 * UI表示層 → エラー状態表示
 */
const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
      <div className="text-red-600 dark:text-red-400 font-semibold mb-2">エラーが発生しました</div>
      <div className="text-slate-600 dark:text-slate-400 text-sm">{error}</div>
    </div>
  </div>
);

// ==========================================
// ヘルパー関数層
// ==========================================
/**
 * グループ化されたデータをテーブル用の行データに変換
 * データ変換層 → テーブル表示用データ整形
 */
const transformGroupedDataToTableData = (
  groupedData: GroupedData,
  activeTab: string
): TableRowData[] => {
  return Object.entries(groupedData)
    .filter(([, group]) => {
      const firstItem = group.items[0];
      switch (activeTab) {
        case 'with-list':
          return firstItem.KONPO_LIST_ID && firstItem.KONPO_LIST_ID.trim() !== '';
        case 'without-list':
          return !firstItem.KONPO_LIST_ID || firstItem.KONPO_LIST_ID.trim() === '';
        default:
          return true;
      }
    })
    .map(([key, group]) => {
      const firstItem = group.items[0];
      const totalWeight = group.totalWeight;

      return {
        key,
        zumenName: firstItem.Zumen_Name,
        partName: firstItem.PART_NAME,
        konpoTanniId: firstItem.KONPO_TANNI_ID,
        konpoListId: firstItem.KONPO_LIST_ID,
        totalWeight,
        konpoData: firstItem,
      };
    });
};

/**
 * 展開可能な行の詳細情報をレンダリング
 * UI表示層 → 詳細情報表示
 */
const renderExpandedDetails = (row: Row<TableRowData>) => {
  const { konpoData, totalWeight } = row.original;
  
  return (
    <TableRow className="bg-slate-50 dark:bg-slate-800/50 border-l-4 border-blue-500">
      <TableCell colSpan={5} className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">図面ID</span>
            <div className="text-sm font-semibold">{konpoData.Zumen_ID}</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">部品ID</span>
            <div className="text-sm font-semibold">{konpoData.PART_ID}</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">数量</span>
            <div className="text-sm font-semibold">{konpoData.QUANTITY}</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">部品口</span>
            <div className="text-sm font-semibold">{konpoData.PART_KO}</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">全数口</span>
            <div className="text-sm font-semibold">{konpoData.ZENSU_KO}</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">単重量</span>
            <div className="text-sm font-semibold">{totalWeight.toFixed(2)}</div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

// ==========================================
// コンポーネント層
// ==========================================
/**
 * 工法データを表示するテーブルコンポーネント
 * TanStack Table + Shadcn UIの組み合わせで実装
 * テーブル表示層 → 工法データ一覧表示
 */
export const KonpoTable: React.FC<KonpoTableProps> = ({
  groupedData,
  selectedRows,
  expandedRows,
  activeTab,
  onToggleRow,
  onToggleExpand,
  onTabChange,
  onCreateListId,
  showSearch = true,
  showPagination = true,
  showSorting = true,
  showTabs = true,
  rowHeight = 'sm',
  tableSize = 'md',
  fontSize = 'sm',
  isLoading = false,
  error = null,
}) => {
  // ==========================================
  // 状態管理層
  // ==========================================
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const { setPageTitle } = useHeaderStore();

  // ==========================================
  // ページタイトル設定層
  // ==========================================
  React.useEffect(() => {
    // コンポーネントマウント時にページタイトルを設定
    setPageTitle('部品単位管理');
    
    // コンポーネントアンマウント時にデフォルトタイトルに戻す
    return () => {
      setPageTitle('プロジェクト管理');
    };
  }, [setPageTitle]);

  // ==========================================
  // データ変換層
  // ==========================================
  const tableData = React.useMemo<TableRowData[]>(() => {
    return transformGroupedDataToTableData(groupedData, activeTab);
  }, [groupedData, activeTab]);

  // ==========================================
  // カラム定義層
  // ==========================================
  const columns = React.useMemo<ColumnDef<TableRowData>[]>(() => {
    return createTableColumns(selectedRows, expandedRows, onToggleRow, onToggleExpand, showSorting);
  }, [selectedRows, expandedRows, onToggleRow, onToggleExpand, showSorting]);

  // ==========================================
  // TanStack Table設定層
  // ==========================================
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  // ==========================================
  // エラーハンドリング層（エラー処理、フォールバック）
  // ==========================================
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (isLoading) {
    return <LoadingSkeleton columns={columns.length} rows={5} />;
  }

  // ==========================================
  // レンダリング層（JSX return）
  // ==========================================
  return (
    <div className={`space-y-3 ${getTableSizeClass(tableSize)}`}>
      {/* 上部コントロールエリア - 1段構成 */}
      <div className="flex items-center justify-between gap-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-slate-200 dark:border-slate-700">
        {/* 左側: 検索欄 */}
        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="relative w-48">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="検索..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>
          )}
          {globalFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGlobalFilter('')}
              className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="検索をクリア"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <div className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-md">
            {table.getFilteredRowModel().rows.length} 件中 {table.getRowModel().rows.length} 件表示
          </div>
          {showTabs && activeTab && onTabChange && (
            <TabChips 
              activeTab={activeTab} 
              onTabChange={onTabChange}
            />
          )}
        </div>
        
        {/* 右側: 選択リストID作成ボタン、ソート情報、ページネーション */}
        <div className="flex items-center gap-3">
          {/* 選択リストID作成ボタン */}
          {onCreateListId && (
            <Button
              onClick={onCreateListId}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm h-8"
            >
              選択リストID作成
            </Button>
          )}
          
          {/* ソート情報 */}
          {table.getState().sorting.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                ソート: {table.getState().sorting.map(sort => 
                  `${sort.id} ${sort.desc ? '降順' : '昇順'}`
                ).join(', ')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.resetSorting()}
                className="h-6 px-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                リセット
              </Button>
            </div>
          )}
          
          {/* ページネーション */}
          {showPagination && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground bg-white dark:bg-slate-700 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-600">
                ページ {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="前のページへ"
                  className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 h-8 px-2"
                >
                  前へ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="次のページへ"
                  className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 h-8 px-2"
                >
                  次へ
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* テーブル本体 */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-blue-600 border-b border-blue-700">
                {headerGroup.headers.map(header => (
                  <TableHead 
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="font-semibold text-white"
                    aria-sort={
                      header.column.getIsSorted() === 'asc' 
                        ? 'ascending' 
                        : header.column.getIsSorted() === 'desc' 
                        ? 'descending' 
                        : undefined
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {table.getRowModel().rows.map(row => (
              <React.Fragment key={row.id}>
                <TableRow 
                  className={`
                    hover:bg-slate-50 dark:hover:bg-slate-800/50 
                    transition-colors duration-150
                    ${selectedRows.has(row.original.key) ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : 'bg-white'}
                    ${expandedRows.has(row.original.key) ? 'bg-slate-25 dark:bg-slate-750' : ''}
                  `}
                  style={{ height: `${getRowHeightPixels(rowHeight)}px` }}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell 
                      key={cell.id}
                      className={`
                        ${tableStyles.fontSize[fontSize]} 
                        ${tableStyles.padding[tableSize]}
                        border-b border-slate-100 dark:border-slate-700
                        ${selectedRows.has(row.original.key) ? 'text-blue-900 dark:text-blue-100' : 'text-slate-900 dark:text-slate-300'}
                        bg-white font-semibold
                      `}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {/* 展開された詳細行 */}
                {expandedRows.has(row.original.key) && renderExpandedDetails(row)}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 