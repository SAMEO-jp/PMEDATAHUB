import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/connection/db_connection';

export async function GET(
  request: Request,
  { params }: { params: { tableName: string } }
) {
  try {
    const db = await initializeDatabase();
    const tableName = params.tableName;

    const columns = await db.all(`PRAGMA table_info(${tableName})`);

    const data = await db.all(`SELECT * FROM ${tableName}`);

    return NextResponse.json({
      success: true,
      data: {
        columns,
        rows: data
      }
    });
  } catch (error) {
    console.error('繝・・繝悶Ν繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:', error);
    return NextResponse.json(
      { error: '繝・・繧ｿ繝吶・繧ｹ繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆' },
      { status: 500 }
    );
  }
} 