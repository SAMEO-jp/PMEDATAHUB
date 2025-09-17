const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'achievements.db');
const db = new sqlite3.Database(dbPath);

console.log('PROJECTテーブルのデータを確認中...');

// テーブルの構造を確認
db.all("PRAGMA table_info(PROJECT)", (err, columns) => {
  if (err) {
    console.error('テーブル構造の取得エラー:', err);
    db.close();
    return;
  }

  console.log('\nPROJECTテーブル構造:');
  columns.forEach(col => {
    console.log(`- ${col.name}: ${col.type} ${col.notnull ? '(NOT NULL)' : '(NULLABLE)'}`);
  });

  // データの件数を確認
  db.get("SELECT COUNT(*) as count FROM PROJECT", (err, row) => {
    if (err) {
      console.error('データ件数の取得エラー:', err);
      db.close();
      return;
    }

    console.log(`\nPROJECTテーブルのデータ件数: ${row.count}`);

    if (row.count > 0) {
      // 最初の5件のデータを表示
      db.all("SELECT * FROM PROJECT LIMIT 5", (err, rows) => {
        if (err) {
          console.error('データ取得エラー:', err);
        } else {
          console.log('\n最初の5件のデータ:');
          rows.forEach((row, index) => {
            console.log(`\n--- レコード ${index + 1} ---`);
            Object.keys(row).forEach(key => {
              console.log(`${key}: ${row[key]}`);
            });
          });
        }
        db.close();
      });
    } else {
      console.log('\nPROJECTテーブルにデータがありません');
      db.close();
    }
  });
});
