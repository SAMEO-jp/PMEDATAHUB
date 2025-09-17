import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';

// データベース接続を初期化する関数
async function initializeDatabase() {
    try {
        // データベースファイルのパスを設定
        const dbPath = path.join(process.cwd(), 'data', 'achievements.db');
        
        // データベースディレクトリの存在確認
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // データベースファイルの存在確認
        if (!fs.existsSync(dbPath)) {
            throw new Error('データベースファイルが存在しません');
        }

        // データベース接続を試行
        console.log('DB: データベース接続を試行中...', dbPath);
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        console.log('DB: データベース接続成功');

        return db;
    } catch (error) {
        console.error('DB: データベース接続エラー', error);
        throw error;
    }
}

// 関数のみをエクスポート
export { initializeDatabase };

/** テーブル設定の型定義 */
export interface TableConfig {
    tableName: string;
    idColumn: string;
}
  
export interface TableReadConfig {
    tableName: string;
}

/** データ取得結果の型定義 */
export interface DataResult<T = unknown> {
    success: boolean;
    data?: T | null;
    error?: string | null;
    count?: number;
}