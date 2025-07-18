import type { BomBuhinData } from '@src/types/bom_buhin';
import type { KonpoPalet, PaletListItem } from '../types/index';
import { useMemo } from 'react';

// ==========================================
// 登録数量取得用カスタムフック（新しいテーブル構造対応）
// ==========================================

/**
 * 新しいテーブル構造（KONPO_PALET + KONPO_PALET_MASTER）に対応した登録数量計算フック
 * 
 * 【ビジネスロジックの動作】
 * 
 * 1. パレットアイテムデータのグループ化
 *    - 入力: konpoPaletData[] (KONPO_PALETテーブルから取得したパレットアイテムデータ)
 *    - 処理: 部品番号(BUHIN_ID)でキーを生成
 *    - 出力: Record<string, number> (キー: "部品番号", 値: 合計登録数量)
 * 
 * 例: konpoPaletData = [
 *   { BUHIN_ID: "B001", PALET_BUHIN_QUANTITY: 5 },
 *   { BUHIN_ID: "B001", PALET_BUHIN_QUANTITY: 3 }, // 同じ部品の追加登録
 *   { BUHIN_ID: "B002", PALET_BUHIN_QUANTITY: 2 }
 * ]
 * 
 * 結果: {
 *   "B001": 8,  // 5 + 3 = 8
 *   "B002": 2   // 2
 * }
 * 
 * 2. BOM_BUHINデータへの登録数量マージ
 *    - 入力: bomBuhinData[] (BOM部品マスタデータ)
 *    - 処理: 各BOM部品に対して、対応する登録数量を検索・追加
 *    - 出力: BomBuhinData[] + registeredQtyプロパティ
 * 
 * 例: bomBuhinData = [
 *   { BUHIN_ID: "B001", ZUMEN_ID: "Z001", BUHIN_NAME: "部品A", ... },
 *   { BUHIN_ID: "B002", ZUMEN_ID: "Z001", BUHIN_NAME: "部品B", ... }
 * ]
 * 
 * 結果: [
 *   { BUHIN_ID: "B001", ZUMEN_ID: "Z001", BUHIN_NAME: "部品A", ..., registeredQty: 8 },
 *   { BUHIN_ID: "B002", ZUMEN_ID: "Z001", BUHIN_NAME: "部品B", ..., registeredQty: 2 }
 * ]
 * 
 * 【使用例】
 * const { bomBuhinWithRegisteredQty, getRegisteredQuantity } = useRegisteredQuantity(bomBuhinData, konpoPaletData);
 * 
 * // 特定の部品の登録数量を取得
 * const qty = getRegisteredQuantity("B001"); // 8
 * 
 * // 登録数量を含むBOM部品データを使用
 * bomBuhinWithRegisteredQty.forEach(item => {
 *   console.log(`${item.BUHIN_NAME}: 登録済み ${item.registeredQty}個`);
 * });
 */
export const useRegisteredQuantity = (
  bomBuhinData: BomBuhinData[],
  konpoPaletData: KonpoPalet[],
  konpoPaletListData: PaletListItem[] = [] // パレットリストデータを追加
) => {
  // 登録済みパレットアイテムデータを部品番号でグループ化（パレット個数を考慮）
  const paletDataByBuhinId = useMemo(() => {
    const grouped: Record<string, number> = {};
    console.log('パレットアイテムデータ:', konpoPaletData);
    console.log('パレットリストデータ:', konpoPaletListData);
    
    konpoPaletData.forEach(palet => {
      const buhinId = palet.buhin_id;
      if (!buhinId) return; // buhin_idが未設定の場合はスキップ
      
      // パレット個数を取得（データベースの値を優先）
      // KONPO_PALET.konpo_palet_id と KONPO_PALET_MASTER.konpo_palet_master_id は同じ値を持つ
      const paletQuantity = konpoPaletListData.find(list => list.konpo_palet_master_id === palet.konpo_palet_id)?.palet_quantity ?? 1;
      const totalQuantity = (palet.palet_buhin_quantity || 0) * paletQuantity;
      
      console.log('部品ID:', buhinId, 'パレット内数量:', palet.palet_buhin_quantity, 'パレット個数:', paletQuantity, '総数量:', totalQuantity);
      
      if (grouped[buhinId]) {
        grouped[buhinId] += totalQuantity;
      } else {
        grouped[buhinId] = totalQuantity;
      }
    });
    
    console.log('グループ化結果（パレット個数考慮）:', grouped);
    return grouped;
  }, [konpoPaletData, konpoPaletListData]);

  // 部品ごとの登録数量を取得する関数
  const getRegisteredQuantity = (buhinId: string): number => {
    return paletDataByBuhinId[buhinId] || 0;
  };

  // BOM_BUHINデータに登録数量を追加したデータを生成
  const bomBuhinWithRegisteredQty = useMemo(() => {
    return bomBuhinData.map(dbBuhin => {
      const buhinId = dbBuhin.BUHIN_ID;
      const registeredQty = getRegisteredQuantity(buhinId);
      
      console.log('部品:', dbBuhin.BUHIN_NAME, '部品ID:', buhinId, '登録数量:', registeredQty);
      
      return {
        ...dbBuhin,
        registeredQty,
      };
    });
  }, [bomBuhinData, paletDataByBuhinId]);

  return {
    // 部品ごとの登録数量を取得する関数
    getRegisteredQuantity,
    // 登録数量を含むBOM_BUHINデータ
    bomBuhinWithRegisteredQty,
    // グループ化されたパレットデータ（デバッグ用）
    paletDataByBuhinId,
  };
};

// ==========================================
// 後方互換性のための型定義（既存コード用）
// ==========================================

// 旧PaletData（後方互換性のため残す）
export interface PaletData {
  ROWID: number;
  KONPO_PALT_ID: string;
  palet_display_name: string;
  bom_buhin_id: string;
  bom_part_ko: number;
  created_at: string;
  updated_at: string;
  zumen_id: string;
}

// 旧KonpoPaletData（後方互換性のため残す）
export interface KonpoPaletData {
  BUHIN_ID?: string;
  PALET_BUHIN_QUANTITY?: number;
}

/**
 * 旧テーブル構造用の登録数量計算（後方互換性のため残す）
 */
export const useRegisteredQuantityLegacy = (
  bomBuhinData: BomBuhinData[],
  paletData: PaletData[]
) => {
  // 登録済みパレットデータを図面番号と部品番号でグループ化
  const paletDataByKey = useMemo(() => {
    const grouped: Record<string, number> = {};
    console.log('パレットデータ（旧）:', paletData);
    
    paletData.forEach(palet => {
      // 図面番号と部品番号の組み合わせでキーを生成
      const key = `${palet.zumen_id}_${palet.bom_buhin_id}`;
      console.log('キー:', key, '数量:', palet.bom_part_ko);
      
      if (grouped[key]) {
        grouped[key] += palet.bom_part_ko;
      } else {
        grouped[key] = palet.bom_part_ko;
      }
    });
    
    console.log('グループ化結果（旧）:', grouped);
    return grouped;
  }, [paletData]);

  // 部品ごとの登録数量を取得する関数
  const getRegisteredQuantity = (zumenId: string, buhinId: string): number => {
    const key = `${zumenId}_${buhinId}`;
    return paletDataByKey[key] || 0;
  };

  // BOM_BUHINデータに登録数量を追加したデータを生成
  const bomBuhinWithRegisteredQty = useMemo(() => {
    return bomBuhinData.map(dbBuhin => {
      const zumenId = dbBuhin.ZUMEN_ID || '図面番号未設定';
      const buhinId = dbBuhin.BUHIN_ID;
      const registeredQty = getRegisteredQuantity(zumenId, buhinId);
      
      console.log('部品（旧）:', dbBuhin.BUHIN_NAME, 'キー:', `${zumenId}_${buhinId}`, '登録数量:', registeredQty);
      
      return {
        ...dbBuhin,
        registeredQty,
      };
    });
  }, [bomBuhinData, paletDataByKey]);

  return {
    // 部品ごとの登録数量を取得する関数
    getRegisteredQuantity,
    // 登録数量を含むBOM_BUHINデータ
    bomBuhinWithRegisteredQty,
    // グループ化されたパレットデータ（デバッグ用）
    paletDataByKey,
  };
}; 