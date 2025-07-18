// ==========================================
// テーブル管理テストページ用レイアウト
// ==========================================

export default function TestTableManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 