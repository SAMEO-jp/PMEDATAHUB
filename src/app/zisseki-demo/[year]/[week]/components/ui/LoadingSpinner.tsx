/**
 * ローディングスピナーコンポーネント
 * データ読み込み中に表示されるスピナー
 */
export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      {/* ローディングスピナー */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}; 