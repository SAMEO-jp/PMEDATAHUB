const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/achievements.db');

console.log('Migrating kounyu_assignment table...');

// まずテーブル構造を確認
db.all("PRAGMA table_info(kounyu_assignment)", (err, rows) => {
  if(err) {
    console.error('Error getting table structure:', err);
    return;
  }

  console.log('Current kounyu_assignment structure:');
  rows.forEach(row => {
    console.log(`  ${row.name}: ${row.type}${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
  });

  // project_idカラムが存在するか確認
  const hasProjectId = rows.some(row => row.name === 'project_id');

  if (!hasProjectId) {
    console.log('\nAdding project_id column to kounyu_assignment table...');

    // project_idカラムを追加
    db.run("ALTER TABLE kounyu_assignment ADD COLUMN project_id TEXT", (err) => {
      if(err) {
        console.error('Error adding project_id column:', err);
        return;
      }

      console.log('✅ project_id column added successfully');

      // 既存のデータを更新（kounyu_masterからproject_idを取得）
      console.log('Updating existing records with project_id...');

      const updateQuery = `
        UPDATE kounyu_assignment
        SET project_id = (
          SELECT km.project_id
          FROM kounyu_master km
          WHERE km.id = kounyu_assignment.kounyu_id
        )
        WHERE project_id IS NULL OR project_id = ''
      `;

      db.run(updateQuery, (err) => {
        if(err) {
          console.error('Error updating existing records:', err);
          return;
        }

        console.log('✅ Existing records updated successfully');

        // 制約を追加
        console.log('Adding constraints...');

        // まず、NOT NULL制約を追加
        db.run("UPDATE kounyu_assignment SET project_id = 'UNKNOWN' WHERE project_id IS NULL OR project_id = ''", (err) => {
          if(err) {
            console.error('Error setting default values:', err);
            return;
          }

          // インデックスを作成
          db.run("CREATE INDEX IF NOT EXISTS idx_kounyu_assignment_project ON kounyu_assignment(project_id)", (err) => {
            if(err) {
              console.error('Error creating index:', err);
              return;
            }

            console.log('✅ Index created successfully');
            console.log('✅ Migration completed successfully!');
            db.close();
          });
        });
      });
    });
  } else {
    console.log('✅ project_id column already exists');
    db.close();
  }
});
