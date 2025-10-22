# JOINデータの使用方法

## 📋 概要

JOINクエリを使用して複数のテーブルから関連データを一度に取得する方法を説明します。

## 🔧 実装方法

### 1. tRPCルーターでJOINクエリを実装

```typescript
// src/lib/trpc/routers/konpoPalet.ts
export const konpoPaletRouter = createTRPCRouter({
  // JOINクエリでパレットデータを取得（部品・図面情報を含む）
  getWithDetails: publicProcedure
    .input(z.object({ 
      projectId: z.string().optional(),
      paletId: z.string().optional()
    }))
    .query(async ({ input }) => {
      try {
        let db = null;
        try {
          db = await initializeDatabase();
          
          // 基本JOINクエリ
          let query = `
            SELECT 
              kp.ROWID,
              kp.KONPO_PALET_ID as KONPO_PALT_ID,
              kp.BUHIN_ID as bom_buhin_id,
              kp.PALET_BUHIN_QUANTITY as bom_part_ko,
              kp.created_at,
              kp.updated_at,
              bb.ZUMEN_ID as zumen_id,
              bb.BUHIN_NAME,
              bb.BUHIN_MANUFACTURER,
              bb.BUHIN_PART_TANNI_WEIGHT,
              bb.BUHIN_QUANTITY,
              bb.BUHIN_REMARKS,
              bz.Zumen_Name as ZUMEN_NAME,
              bz.Zumen_Kind as ZUMEN_KIND,
              bz.project_ID as PROJECT_ID,
              kpl.PALET_DISPLAY_NAME as palet_display_name
            FROM KONPO_PALET kp 
            LEFT JOIN BOM_BUHIN bb ON kp.BUHIN_ID = bb.BUHIN_ID
            LEFT JOIN BOM_ZUMEN bz ON bb.ZUMEN_ID = bz.Zumen_ID
            LEFT JOIN KONPO_PALET_MASTER kpl ON kp.KONPO_PALET_ID = kpl.KONPO_PALET_ID
          `;
          
          const conditions: string[] = [];
          const values: unknown[] = [];
          
          // プロジェクトIDで絞り込み
          if (input.projectId) {
            conditions.push('bz.project_ID = ?');
            values.push(input.projectId);
          }
          
          // パレットIDで絞り込み
          if (input.paletId) {
            conditions.push('kp.KONPO_PALET_ID = ?');
            values.push(input.paletId);
          }
          
          // WHERE句を追加
          if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
          }
          
          query += ' ORDER BY kp.created_at DESC';
          
          const result = await db.all(query, values);
          
          return { success: true, data: result as PaletListItem[] };
        } finally {
          if (db) {
            try {
              await db.close();
            } catch (closeErr) {
              console.warn('DBクローズ時にエラーが発生しました:', closeErr);
            }
          }
        }
      } catch (error) {
        console.error('tRPC konpoPalet.getWithDetails error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'JOINデータの取得に失敗しました',
        });
      }
    }),
});
```

### 2. カスタムフックでJOINデータを取得

```typescript
// src/hooks/useKonpoPaletData.ts
export const useKonpoPaletWithDetails = (projectId?: string, paletId?: string) => {
  const utils = trpc.useUtils();
  
  const query = trpc.konpoPalet.getWithDetails.useQuery(
    { projectId, paletId },
    {
      enabled: !!projectId || !!paletId,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
```

### 3. コンポーネントでJOINデータを使用

```typescript
// ページコンポーネントでの使用例
export default function MakePaletPage({ params }: { params: { project_id: string } }) {
  const { project_id } = params;
  
  // JOINデータを取得
  const {
    konpoPaletListData,
    konpoPaletWithDetailsLoading,
    konpoPaletWithDetailsError,
    refetchKonpoPaletWithDetails,
  } = useKonpoPaletForMakePalet(project_id);

  // ローディング状態
  if (konpoPaletWithDetailsLoading) {
    return <div>データを読み込み中...</div>;
  }

  // エラー状態
  if (konpoPaletWithDetailsError) {
    return <div>エラー: {konpoPaletWithDetailsError}</div>;
  }

  return (
    <div>
      <h1>パレット一覧（JOINデータ）</h1>
      <table>
        <thead>
          <tr>
            <th>パレットID</th>
            <th>表示名</th>
            <th>部品名</th>
            <th>図面名</th>
            <th>数量</th>
            <th>重量</th>
          </tr>
        </thead>
        <tbody>
          {konpoPaletListData.map((item: any, index: number) => (
            <tr key={index}>
              <td>{item.KONPO_PALT_ID}</td>
              <td>{item.palet_display_name}</td>
              <td>{item.BUHIN_NAME || 'N/A'}</td>
              <td>{item.ZUMEN_NAME || 'N/A'}</td>
              <td>{item.bom_part_ko}</td>
              <td>{item.BUHIN_PART_TANNI_WEIGHT || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## 📊 データベース構造

### 関連テーブル

1. **KONPO_PALET** - パレットアイテム
   - `KONPO_PALET_ID` - パレットID
   - `BUHIN_ID` - 部品ID
   - `PALET_BUHIN_QUANTITY` - パレット内数量

2. **KONPO_PALET_MASTER** - パレットマスター
   - `KONPO_PALET_ID` - パレットID
   - `PALET_DISPLAY_NAME` - 表示名

3. **BOM_BUHIN** - 部品情報
   - `BUHIN_ID` - 部品ID
   - `ZUMEN_ID` - 図面ID
   - `BUHIN_NAME` - 部品名
   - `BUHIN_PART_TANNI_WEIGHT` - 単体重量

4. **BOM_ZUMEN** - 図面情報
   - `Zumen_ID` - 図面ID
   - `Zumen_Name` - 図面名
   - `project_ID` - プロジェクトID

### JOIN関係

```
KONPO_PALET (kp)
├── LEFT JOIN BOM_BUHIN (bb) ON kp.BUHIN_ID = bb.BUHIN_ID
├── LEFT JOIN BOM_ZUMEN (bz) ON bb.ZUMEN_ID = bz.Zumen_ID
└── LEFT JOIN KONPO_PALET_MASTER (kpl) ON kp.KONPO_PALET_ID = kpl.KONPO_PALET_ID
```

## 🎯 使用場面

### 1. パレット一覧表示
- パレットID、表示名、部品名、図面名を一度に取得
- プロジェクト別の絞り込みが可能

### 2. パレット詳細表示
- 特定のパレットIDで絞り込み
- 関連する部品・図面情報を表示

### 3. 統計情報の取得
- プロジェクト別のパレット数
- 部品別の登録状況

## ⚡ パフォーマンス最適化

### 1. インデックスの活用
```sql
-- 推奨インデックス
CREATE INDEX idx_konpo_palet_buhin_id ON KONPO_PALET(BUHIN_ID);
CREATE INDEX idx_konpo_palet_palet_id ON KONPO_PALET(KONPO_PALET_ID);
CREATE INDEX idx_bom_buhin_zumen_id ON BOM_BUHIN(ZUMEN_ID);
CREATE INDEX idx_bom_zumen_project_id ON BOM_ZUMEN(project_ID);
```

### 2. クエリの最適化
- 必要なカラムのみをSELECT
- WHERE句での絞り込みを活用
- ORDER BY句の最適化

### 3. キャッシュ戦略
- tRPCのstaleTime設定
- 適切なrefetchOnWindowFocus設定
- キャッシュの無効化タイミング

## 🔄 データ更新時の注意点

### 1. キャッシュの無効化
```typescript
// データ更新後にキャッシュを無効化
void konpoPalet.utils.konpoPalet.getWithDetails.invalidate();
```

### 2. トランザクション処理
- 複数テーブルの更新時はトランザクションを使用
- エラー時のロールバック処理を実装

### 3. データ整合性
- 外部キー制約の確認
- NULL値の適切な処理

## 📝 まとめ

JOINクエリを使用することで、以下のメリットが得られます：

1. **パフォーマンス向上** - 複数回のクエリを1回に統合
2. **データ整合性** - 関連データの一貫性を保証
3. **開発効率** - フロントエンドでのデータ結合処理が不要
4. **保守性** - データ取得ロジックの一元化

適切なインデックス設定とキャッシュ戦略により、高速で効率的なデータ取得が可能になります。 