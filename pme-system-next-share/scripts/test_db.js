const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'achievements.db');
console.log('DB Path:', dbPath);

const db = new sqlite3.Database(dbPath);

db.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%kounyu%'", (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('購入品関連テーブル:', rows);
  }

  // すべてのテーブルを確認
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err2, allRows) => {
    if (err2) {
      console.error('Error getting all tables:', err2);
    } else {
      console.log('全テーブル:', allRows.map(r => r.name));
    }
    db.close();
  });
});

