import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/connection/db_connection';
import type { ApiResponse } from '@src/types/api';

// ==========================================
// 蝙句ｮ夂ｾｩ螻､・医Ξ繧ｹ繝昴Φ繧ｹ蝙九√ョ繝ｼ繧ｿ蝙具ｼ・// ==========================================
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
// API螳溯｣・ｱ､
// ==========================================
export async function GET(
  req: NextRequest,
  { params }: { params: { project_id: string } }
) {
  try {
    const db = await initializeDatabase();
    // BOM_PART縺ｨBOM_ZUMEN繧短UMEN_ID縺ｧJOIN縺励。OM_ZUMEN.project_ID縺ｧ邨槭ｊ霎ｼ繧
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
        message: '驛ｨ蜩√ョ繝ｼ繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
        status: 500
      }
    }, { status: 500 });
  }
} 