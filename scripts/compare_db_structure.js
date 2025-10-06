const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

/**
 * データベース構造比較スクリプト
 */

class DatabaseStructureComparator {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.dbPath)) {
        reject(new Error(`データベースファイルが見つかりません: ${this.dbPath}`));
        return;
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ データベースに接続しました: ${this.dbPath}`);
          resolve();
        }
      });
    });
  }

  async close() {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('🔒 データベース接続を閉じました');
            resolve();
          }
        });
      });
    }
  }

  async getAllTables() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT name, type, sql 
        FROM sqlite_master 
        WHERE type IN ('table', 'index', 'trigger', 'view')
        ORDER BY type, name
      `;
      
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getTableInfo(tableName) {
    return new Promise((resolve, reject) => {
      this.db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getTableCount(tableName) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.count : 0);
        }
      });
    });
  }

  async analyzeTable(tableName) {
    try {
      const [columns, rowCount] = await Promise.all([
        this.getTableInfo(tableName),
        this.getTableCount(tableName)
      ]);

      return { columns, rowCount };
    } catch (error) {
      console.error(`テーブル ${tableName} の分析中にエラー:`, error.message);
      return null;
    }
  }

  async generateReport() {
    console.log('\n📊 データベース構造レポート\n');

    // 基本情報
    console.log('='.repeat(80));
    console.log('📋 データベース基本情報');
    console.log('='.repeat(80));
    console.log(`🗄️  データベースファイル: ${this.dbPath}`);
    console.log(`📅 作成日時: ${fs.statSync(this.dbPath).birthtime}`);
    console.log(`📏 ファイルサイズ: ${(fs.statSync(this.dbPath).size / 1024).toFixed(2)} KB`);

    // テーブル一覧
    console.log('\n' + '='.repeat(80));
    console.log('📋 テーブル一覧');
    console.log('='.repeat(80));
    
    const allObjects = await this.getAllTables();
    const tables = allObjects.filter(obj => obj.type === 'table');
    
    console.log(`\n📊 テーブル (${tables.length}個):`);
    tables.forEach(table => {
      console.log(`  ✅ ${table.name}`);
    });

    // プロジェクト関連テーブルの詳細分析
    console.log('\n' + '='.repeat(80));
    console.log('🎯 プロジェクト関連テーブル詳細分析');
    console.log('='.repeat(80));

    const projectTables = tables.filter(t => 
      t.name.toLowerCase().includes('project') || 
      t.name.toLowerCase().includes('user') ||
      t.name.toLowerCase().includes('member')
    );

    for (const table of projectTables) {
      console.log(`\n📋 テーブル: ${table.name}`);
      console.log('-'.repeat(50));
      
      const analysis = await this.analyzeTable(table.name);
      if (analysis) {
        console.log(`📊 レコード数: ${analysis.rowCount}`);
        
        console.log('\n🏗️  カラム構造:');
        analysis.columns.forEach(col => {
          const pk = col.pk === 1 ? ' 🔑' : '';
          const nn = col.notnull === 1 ? ' ⚠️' : '';
          const def = col.dflt_value ? ` (デフォルト: ${col.dflt_value})` : '';
          console.log(`  ${col.name}: ${col.type}${pk}${nn}${def}`);
        });
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ データベース構造レポート完了');
    console.log('='.repeat(80));
  }
}

// メイン実行関数
async function main() {
  const args = process.argv.slice(2);
  const dbPath = args[0] || path.join(__dirname, '..', 'data', 'achievements.db');
  
  console.log('🔍 データベース構造比較スクリプト');
  console.log('='.repeat(80));
  
  const comparator = new DatabaseStructureComparator(dbPath);
  
  try {
    await comparator.connect();
    await comparator.generateReport();
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  } finally {
    await comparator.close();
  }
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DatabaseStructureComparator;
