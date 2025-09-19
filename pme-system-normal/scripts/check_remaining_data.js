/**
 * 残っているデータを詳細に確認するスクリプト
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// データベース接続
const dbPath = path.join(__dirname, 'data', 'achievements.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 残っているデータを確認します...\n');

// 各種カウントを取得
const queries = [
  {
    name: '全レコード数',
    sql: 'SELECT COUNT(*) as count FROM events;'
  },
  {
    name: 'NULLのemployeeNumber',
    sql: 'SELECT COUNT(*) as count FROM events WHERE employeeNumber IS NULL;'
  },
  {
    name: '空文字のemployeeNumber',
    sql: "SELECT COUNT(*) as count FROM events WHERE employeeNumber = '';"
  },
  {
    name: "'undefined'のemployeeNumber",
    sql: "SELECT COUNT(*) as count FROM events WHERE employeeNumber = 'undefined';"
  },
  {
    name: "'null'のemployeeNumber",
    sql: "SELECT COUNT(*) as count FROM events WHERE employeeNumber = 'null';"
  },
  {
    name: '有効なemployeeNumber',
    sql: "SELECT COUNT(*) as count FROM events WHERE employeeNumber IS NOT NULL AND employeeNumber != '' AND employeeNumber != 'undefined' AND employeeNumber != 'null';"
  }
];

console.log('📊 データ状況:');
console.log('=' .repeat(50));

// 順次クエリを実行
let completed = 0;
queries.forEach(query => {
  db.get(query.sql, (err, row) => {
    if (err) {
      console.error(`❌ ${query.name}の確認エラー:`, err.message);
    } else {
      console.log(`${query.name}: ${row.count}`);
    }

    completed++;
    if (completed === queries.length) {
      // 全てのカウントが完了したら詳細データを表示
      console.log('');
      showDetails();
    }
  });
});

function showDetails() {
  console.log('🔍 残っているデータの詳細:');
  console.log('=' .repeat(50));

  // 残っているデータを全て表示
  const detailQuery = `
    SELECT
      id,
      title,
      employeeNumber,
      createdAt,
      updatedAt
    FROM events
    ORDER BY createdAt DESC;
  `;

  db.all(detailQuery, (err, rows) => {
    if (err) {
      console.error('❌ データ取得エラー:', err.message);
      db.close();
      return;
    }

    if (rows.length === 0) {
      console.log('✅ データは全て削除されました！');
    } else {
      console.log(`📋 残っているデータ: ${rows.length}件\n`);

      rows.forEach((row, index) => {
        console.log(`${index + 1}. ID: ${row.id}`);
        console.log(`   タイトル: ${row.title}`);
        console.log(`   ユーザーID: ${row.employeeNumber || 'NULL'}`);
        console.log(`   作成日時: ${row.createdAt}`);
        console.log(`   更新日時: ${row.updatedAt}`);
        console.log('   ---');
      });

      // 削除対象か判定
      const shouldDelete = rows.filter(row =>
        !row.employeeNumber ||
        row.employeeNumber === '' ||
        row.employeeNumber === 'undefined' ||
        row.employeeNumber === 'null'
      );

      if (shouldDelete.length > 0) {
        console.log(`\n⚠️  削除対象のデータ: ${shouldDelete.length}件`);
        console.log('💡 削除を実行する場合は、delete_remaining_data.js を実行してください。');
      }
    }

    db.close();
  });
}
