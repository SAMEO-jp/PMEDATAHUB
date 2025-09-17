const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/achievements.db');

console.log('Checking table structures...');

db.all("PRAGMA table_info(setsubi_assignment)", (err, rows) => {
  if(err) {
    console.error('Error getting setsubi_assignment structure:', err);
  } else {
    console.log('\nsetsubi_assignment table structure:');
    rows.forEach(row => {
      console.log(`  ${row.name}: ${row.type}${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
    });
  }

  db.all("PRAGMA table_info(kounyu_assignment)", (err, rows) => {
    if(err) {
      console.error('Error getting kounyu_assignment structure:', err);
    } else {
      console.log('\nkounyu_assignment table structure:');
      rows.forEach(row => {
        console.log(`  ${row.name}: ${row.type}${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
      });
    }

    db.close();
  });
});
