const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/achievements.db');

// テーブル一覧を取得
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error getting tables:', err);
    return;
  }

  console.log('Tables in database:');
  tables.forEach(table => {
    console.log('-', table.name);
  });

  // PROJECTテーブルが存在する場合、そのスキーマを確認
  if (tables.some(t => t.name === 'PROJECT')) {
    console.log('\nPROJECT table schema:');
    db.all("PRAGMA table_info(PROJECT)", (err, columns) => {
      if (err) {
        console.error('Error getting PROJECT schema:', err);
      } else {
        columns.forEach(col => {
          console.log(`- ${col.name}: ${col.type} ${col.notnull ? '(NOT NULL)' : '(NULLABLE)'}`);
        });
      }
      db.close();
    });
  } else {
    console.log('\nPROJECT table does not exist');
    db.close();
  }
});
