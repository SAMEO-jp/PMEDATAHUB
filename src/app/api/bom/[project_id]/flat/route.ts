/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/db_connection';
import type { ApiResponse } from '@src/types/api';

// ==========================================
// 型定義層（レスポンス型、データ型）
// ==========================================
/**
 * フラットBOMデータの型定義
 * @property project_ID - プロジェクトID
 * @property Zumen_ID - 図面ID
 * @property Zumen_Name - 図面名
 * @property PART_ID - 部品ID
 * @property PART_NAME - 部品名
 * @property QUANTITY - 数量
 * @property SPARE_QUANTITY - 予備数量
 * @property MANUFACTURER - 製造元
 * @property BUZAI_ID - 部材ID
 * @property BUZAI_NAME - 部材名
 * @property BUZAI_WEIGHT - 部材重量
 * @property BUZAI_QUANTITY - 部材数量
 * @property ZAISITU_NAME - 材質名
 * @property KONPO_TANNI_ID - 工法単位ID
 * @property PART_KO - 部品工法
 * @property ZENSU_KO - 全数工法
 * @property KONPO_LIST_ID - 工法リストID
 * @property KONPO_LIST_WEIGHT - 工法リスト重量
 * @property HASSOU_IN - 発送元
 * @property HASSOU_TO - 発送先
 */
interface FlatBomData {
  project_ID: string;
  Zumen_ID: string;
  Zumen_Name: string;
  PART_ID: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  MANUFACTURER: string;
  BUZAI_ID: string | null;
  BUZAI_NAME: string | null;
  BUZAI_WEIGHT: string | null;
  BUZAI_QUANTITY: string | null;
  ZAISITU_NAME: string | null;
  KONPO_TANNI_ID: string | null;
  PART_KO: string | null;
  ZENSU_KO: string | null;
  KONPO_LIST_ID: string | null;
  KONPO_LIST_WEIGHT: string | null;
  HASSOU_IN: string | null;
  HASSOU_TO: string | null;
}

// ==========================================
// API実装層（GET メソッド）
// ==========================================
/**
 * プロジェクトのフラットBOMデータを取得
 * @param request - HTTPリクエスト
 * @param params - URLパラメータ（project_id）
 * @returns フラットBOMデータの配列
 */
export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  let db: any = null;
  
  try {
    // パラメータ検証
    const projectId = params.project_id;
    if (!projectId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_PROJECT_ID',
          message: 'プロジェクトIDが指定されていません',
          status: 400
        }
      }, { status: 400 });
    }

    // データベース接続
    db = await initializeDatabase();
    if (!db) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'DATABASE_CONNECTION_FAILED',
          message: 'データベースの初期化に失敗しました',
          status: 500
        }
      }, { status: 500 });
    }

    // フラットBOMデータ取得クエリ
    const query = `
      SELECT
        z.project_ID,
        z.Zumen_ID,
        z.Zumen_Name,
        p.PART_ID,
        p.PART_NAME,
        p.QUANTITY,
        p.SPARE_QUANTITY,
        p.MANUFACTURER,
        b.BUZAI_ID,
        b.BUZAI_NAME,
        b.BUZAI_WEIGHT,
        b.BUZAI_QUANTITY,
        b.ZAISITU_NAME,
        kt.KONPO_TANNI_ID,
        kt.PART_KO,
        kt.ZENSU_KO,
        kl.KONPO_LIST_ID,
        kl.KONPO_LIST_WEIGHT,
        kl.HASSOU_IN,
        kl.HASSOU_TO
      FROM BOM_ZUMEN z
      INNER JOIN BOM_PART p
        ON z.Zumen_ID = p.ZUMEN_ID
      LEFT JOIN BOM_BUZAI b
        ON b.Zumen_ID = p.ZUMEN_ID AND b.PART_ID = p.PART_ID
      LEFT JOIN KONPO_TANNI kt
        ON kt.ZUMEN_ID = p.ZUMEN_ID AND kt.PART_ID = p.PART_ID
      LEFT JOIN KONPO_LIST kl
        ON kt.KONPO_LIST_ID = kl.KONPO_LIST_ID
      WHERE z.project_ID = ?
      ORDER BY z.Zumen_ID, p.PART_ID, b.BUZAI_ID
    `;

    const result = await db.all(query, [projectId]);

    // データ型変換
    const flatBomData: FlatBomData[] = result.map((row: any) => ({
      project_ID: row.project_ID,
      Zumen_ID: row.Zumen_ID,
      Zumen_Name: row.Zumen_Name,
      PART_ID: row.PART_ID,
      PART_NAME: row.PART_NAME,
      QUANTITY: Number(row.QUANTITY),
      SPARE_QUANTITY: Number(row.SPARE_QUANTITY),
      MANUFACTURER: row.MANUFACTURER,
      BUZAI_ID: row.BUZAI_ID,
      BUZAI_NAME: row.BUZAI_NAME,
      BUZAI_WEIGHT: row.BUZAI_WEIGHT,
      BUZAI_QUANTITY: row.BUZAI_QUANTITY,
      ZAISITU_NAME: row.ZAISITU_NAME,
      KONPO_TANNI_ID: row.KONPO_TANNI_ID,
      PART_KO: row.PART_KO,
      ZENSU_KO: row.ZENSU_KO,
      KONPO_LIST_ID: row.KONPO_LIST_ID,
      KONPO_LIST_WEIGHT: row.KONPO_LIST_WEIGHT,
      HASSOU_IN: row.HASSOU_IN,
      HASSOU_TO: row.HASSOU_TO
    }));

    return NextResponse.json<ApiResponse<FlatBomData[]>>({
      success: true,
      data: flatBomData
    });

  } catch (error) {
    console.error('フラットBOMデータの取得に失敗しました:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'FLAT_BOM_FETCH_FAILED',
        message: 'フラットBOMデータの取得に失敗しました',
        status: 500
      }
    }, { status: 500 });
  } finally {
    // データベース接続の確実なクローズ
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('データベースクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
}
