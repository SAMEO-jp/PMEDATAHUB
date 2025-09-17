const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'achievements.db');
const db = new sqlite3.Database(dbPath);

db.all("PRAGMA table_info(kounyu_master)", (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('kounyu_master テーブル構造:');
    rows.forEach(row => {
      console.log(`  ${row.name}: ${row.type}${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
    });
  }
  db.close();
});

