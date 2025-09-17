/**
 * ユーザー情報が空欄の業務実績データを削除するスクリプト（実行版）
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// データベース接続
const dbPath = path.join(__dirname, 'data', 'achievements.db');
const db = new sqlite3.Database(dbPath);

console.log('🗑️  ユーザー情報が空欄の業務実績データを削除します...\n');

// 削除対象のデータを確認
const checkQuery = `
  SELECT COUNT(*) as total_count FROM events;
`;

const emptyUserQuery = `
  SELECT COUNT(*) as empty_count FROM events
  WHERE employeeNumber IS NULL
     OR employeeNumber = ''
     OR employeeNumber = 'undefined'
     OR employeeNumber = 'null';
`;

// 削除実行用のクエリ
const deleteQuery = `
  DELETE FROM events
  WHERE employeeNumber IS NULL
     OR employeeNumber = ''
     OR employeeNumber = 'undefined'
     OR employeeNumber = 'null';
`;

console.log('📊 削除前の状況を確認...\n');

// トランザクションで実行
db.serialize(() => {
  // 1. 総レコード数を確認
  db.get(checkQuery, (err, row) => {
    if (err) {
      console.error('❌ エラー:', err.message);
      db.close();
      return;
    }
    console.log(`📈 削除前 全レコード数: ${row.total_count}`);
  });

  // 2. 削除対象のレコード数を確認
  db.get(emptyUserQuery, (err, row) => {
    if (err) {
      console.error('❌ エラー:', err.message);
      db.close();
      return;
    }
    console.log(`🗑️  削除対象レコード数: ${row.empty_count}`);

    if (row.empty_count === 0) {
      console.log('\n✅ 削除対象のデータはありません。処理を終了します。');
      db.close();
      return;
    }

    console.log('\n🗑️  削除処理を開始...\n');

    // 3. 削除実行
    db.run(deleteQuery, function(err) {
      if (err) {
        console.error('❌ 削除エラー:', err.message);
        db.close();
        return;
      }

      const deletedCount = this.changes;
      console.log(`✅ 削除完了: ${deletedCount}件のレコードを削除しました`);

      // 4. 削除後の確認
      db.get(checkQuery, (err, row) => {
        if (err) {
          console.error('❌ エラー:', err.message);
          db.close();
          return;
        }

        const remainingCount = row.total_count;
        console.log(`📊 削除後 全レコード数: ${remainingCount}`);

        console.log('\n🎉 処理完了！');
        console.log(`📈 削除されたレコード: ${deletedCount}件`);
        console.log(`📊 残りのレコード: ${remainingCount}件`);

        db.close();
      });
    });
  });
});
