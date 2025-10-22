/**
 * 繝励Ο繧ｸ繧ｧ繧ｯ繝磯未騾｣縺ｮ繧ｯ繧ｨ繝ｪ髢｢謨ｰ鄒､
 */

import { initializeDatabase, DataResult } from '../connection/db_connection';
import type { Database } from 'sqlite';
import type { Project } from '@src/types/db_project';

/**
 * 繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｩｳ邏ｰ繧貞叙蠕・
 * @param projectId - 繝励Ο繧ｸ繧ｧ繧ｯ繝・D
 * @returns 繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｩｳ邏ｰ
 */
export async function getProjectDetail(projectId: string): Promise<DataResult<Project>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT * FROM PROJECT
      WHERE PROJECT_ID = ?
    `;

    const row = await db.get<Project>(query, [projectId]);

    if (!row) {
      return {
        success: false,
        error: '謖・ｮ壹＆繧後◆繝励Ο繧ｸ繧ｧ繧ｯ繝医′隕九▽縺九ｊ縺ｾ縺帙ｓ',
        data: null,
      };
    }

    return {
      success: true,
      data: row,
      error: null,
    };
  } catch (error) {
    console.error('繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｩｳ邏ｰ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '繝・・繧ｿ繝吶・繧ｹ繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆',
      data: null,
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DB繧ｯ繝ｭ繝ｼ繧ｺ譎ゅ↓繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆:', closeErr);
      }
    }
  }
}

/**
 * 蜈ｨ繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ蜿門ｾ・
 * @returns 繝励Ο繧ｸ繧ｧ繧ｯ繝井ｸ隕ｧ
 */
export async function getAllProjects(): Promise<DataResult<Project[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT * FROM PROJECT
      ORDER BY PROJECT_ID
    `;

    const rows = await db.all<Project>(query) as unknown as Project[];

    return {
      success: true,
      data: rows,
      error: null,
    };
  } catch (error) {
    console.error('繝励Ο繧ｸ繧ｧ繧ｯ繝井ｸ隕ｧ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '繝・・繧ｿ繝吶・繧ｹ繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆',
      data: null,
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DB繧ｯ繝ｭ繝ｼ繧ｺ譎ゅ↓繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆:', closeErr);
      }
    }
  }
}

