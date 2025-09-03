/**
 * @file box item専用のデータベース接続関数
 */

import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';

// Box item専用のデータベース接続を初期化する関数
export async function initializeBoxDatabase() {
    try {
        // sync.dbファイルのパスを設定
        const dbPath = path.join(process.cwd(), 'data', 'sync.db');
        
        // データベースディレクトリの存在確認
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // データベースファイルの存在確認
        if (!fs.existsSync(dbPath)) {
            throw new Error('sync.dbファイルが存在しません');
        }

        // データベース接続を試行
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        return db;
    } catch (error) {
        console.error('Box DB: データベース接続エラー', error);
        throw error;
    }
}
