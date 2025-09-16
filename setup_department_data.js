// 部署データ設定スクリプト
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'achievements.db');
const db = new sqlite3.Database(dbPath);

// DEPARTMENTテーブル作成
const createDepartmentTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS DEPARTMENT (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        department_kind TEXT NOT NULL, -- '部', '室', '課'
        top_department TEXT, -- 上位部署名
        status TEXT DEFAULT 'active'
      )
    `;
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// USERテーブルから部署データを抽出してDEPARTMENTテーブルに挿入
const populateDepartmentData = () => {
  return new Promise((resolve, reject) => {
    // まずUSERテーブルからユニークな部署データを取得
    db.all(`
      SELECT DISTINCT
        bumon as bu,
        sitsu as shitsu,
        ka as ka
      FROM USER
      WHERE bumon IS NOT NULL AND bumon != ''
      ORDER BY bumon, sitsu, ka
    `, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      console.log(`Found ${rows.length} department combinations`);

      // 部署データを処理
      const departments = new Map();

      rows.forEach(row => {
        // 部
        if (row.bu && !departments.has(`部-${row.bu}`)) {
          departments.set(`部-${row.bu}`, {
            name: row.bu,
            kind: '部',
            top: null
          });
        }

        // 室
        if (row.shitsu && !departments.has(`室-${row.shitsu}`)) {
          departments.set(`室-${row.shitsu}`, {
            name: row.shitsu,
            kind: '室',
            top: row.bu
          });
        }

        // 課
        if (row.ka && !departments.has(`課-${row.ka}`)) {
          departments.set(`課-${row.ka}`, {
            name: row.ka,
            kind: '課',
            top: row.shitsu
          });
        }
      });

      console.log(`Creating ${departments.size} department entries`);

      // データを挿入
      const insertPromises = Array.from(departments.values()).map(dept => {
        return new Promise((resolve, reject) => {
          db.run(`
            INSERT OR IGNORE INTO DEPARTMENT (name, department_kind, top_department, status)
            VALUES (?, ?, ?, 'active')
          `, [dept.name, dept.kind, dept.top], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          });
        });
      });

      Promise.all(insertPromises)
        .then(() => {
          console.log('Department data populated successfully');
          resolve();
        })
        .catch(reject);
    });
  });
};

// 実行
async function main() {
  try {
    console.log('Creating DEPARTMENT table...');
    await createDepartmentTable();

    console.log('Populating department data...');
    await populateDepartmentData();

    console.log('Verifying data...');
    db.all('SELECT COUNT(*) as count FROM DEPARTMENT', [], (err, rows) => {
      if (err) throw err;
      console.log(`Total departments: ${rows[0].count}`);

      db.all('SELECT * FROM DEPARTMENT LIMIT 10', [], (err, rows) => {
        if (err) throw err;
        console.log('Sample departments:');
        rows.forEach(row => {
          console.log(`- ${row.department_kind}: ${row.name} (top: ${row.top_department || 'none'})`);
        });

        db.close();
        console.log('Setup complete!');
      });
    });

  } catch (error) {
    console.error('Error:', error);
    db.close();
  }
}

main();

