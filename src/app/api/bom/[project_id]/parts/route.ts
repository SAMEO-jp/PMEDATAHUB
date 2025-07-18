import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/db_connection';
import type { ApiResponse } from '@src/types/api';

// ==========================================
// 型定義層（レスポンス型、データ型）
// ==========================================
interface PartData {
  ROWID: number;
  PART_ID: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  PART_NAME: string;
  REMARKS: string;
  TEHAI_DIVISION: string;
  TEHAI_ID: string;
  MANUFACTURER: string;
  PART_PROJECT_ID: string;
  ZUMEN_ID: string;
  PART_TANNI_WEIGHT: string | null;
}

// ==========================================
// API実装層
// ==========================================
export async function GET(
  req: NextRequest,
  { params }: { params: { project_id: string } }
) {
  try {
    const db = await initializeDatabase();
    // BOM_PARTとBOM_ZUMENをZUMEN_IDでJOINし、BOM_ZUMEN.project_IDで絞り込む
    const parts = await db.all<PartData[]>(`
      SELECT 
        p.ROWID,
        p.PART_ID,
        p.QUANTITY,
        p.SPARE_QUANTITY,
        p.PART_NAME,
        p.REMARKS,
        p.TEHAI_DIVISION,
        p.TEHAI_ID,
        p.MANUFACTURER,
        p.PART_PROJECT_ID,
        p.ZUMEN_ID,
        p.PART_TANNI_WEIGHT
      FROM BOM_PART p
      JOIN BOM_ZUMEN z ON p.ZUMEN_ID = z.ZUMEN_ID
      WHERE z.project_ID = ?
      ORDER BY p.PART_NAME ASC
    `, [params.project_id]);

    if (!parts || parts.length === 0) {
      return NextResponse.json<ApiResponse<PartData[]>>({
        success: true,
        data: []
      });
    }

    return NextResponse.json<ApiResponse<PartData[]>>({
      success: true,
      data: parts
    });

  } catch (error) {
    console.error('GET /api/bom/[project_id]/parts error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '部品データの取得に失敗しました',
        status: 500
      }
    }, { status: 500 });
  }
} 