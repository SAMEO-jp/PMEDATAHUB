import BomZumenTRPCTest from '@src/components/test/BomZumenTRPCTest';

export default function TestBomZumenTRPCPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">BOM_ZUMEN tRPC API テスト</h1>
          <p className="text-muted-foreground mt-2">
            BOM_ZUMENテーブルのCRUD操作をtRPCでテストします
          </p>
        </div>
        <BomZumenTRPCTest />
      </div>
    </div>
  );
} 