/**
 * ユーザー情報が空欄の業務実績データを削除するスクリプト
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// データベース接続
const dbPath = path.join(__dirname, 'data', 'achievements.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 ユーザー情報が空欄の業務実績データを削除します...\n');

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

const previewQuery = `
  SELECT id, title, employeeNumber, createdAt FROM events
  WHERE employeeNumber IS NULL
     OR employeeNumber = ''
     OR employeeNumber = 'undefined'
     OR employeeNumber = 'null'
  LIMIT 10;
`;

// 削除実行用のクエリ
const deleteQuery = `
  DELETE FROM events
  WHERE employeeNumber IS NULL
     OR employeeNumber = ''
     OR employeeNumber = 'undefined'
     OR employeeNumber = 'null';
`;

// トランザクションで実行
db.serialize(() => {
  console.log('📊 現在のデータ状況を確認...\n');

  // 1. 総レコード数を確認
  db.get(checkQuery, (err, row) => {
    if (err) {
      console.error('❌ エラー:', err.message);
      return;
    }
    console.log(`📈 全レコード数: ${row.total_count}`);
  });

  // 2. 削除対象のレコード数を確認
  db.get(emptyUserQuery, (err, row) => {
    if (err) {
      console.error('❌ エラー:', err.message);
      return;
    }
    console.log(`🗑️  削除対象レコード数: ${row.empty_count}\n`);
  });

  // 3. 削除対象のデータをプレビュー
  db.all(previewQuery, (err, rows) => {
    if (err) {
      console.error('❌ エラー:', err.message);
      return;
    }

    if (rows.length > 0) {
      console.log('🔍 削除対象のデータ（先頭10件）:');
      rows.forEach(row => {
        console.log(`  ID: ${row.id}`);
        console.log(`  タイトル: ${row.title}`);
        console.log(`  ユーザーID: ${row.employeeNumber || 'NULL'}`);
        console.log(`  作成日時: ${row.createdAt}`);
        console.log('  ---');
      });
      console.log('');

      // 削除実行の確認
      console.log('⚠️  上記のデータを削除しますか？');
      console.log('💡 削除を実行する場合は、このスクリプトの末尾の削除処理を有効化してください。');
      console.log('');

    } else {
      console.log('✅ 削除対象のデータはありません。\n');
    }
  });

  // 注意: 実際に削除する場合は以下のコメントを外す
  /*
  console.log('🗑️  削除処理を開始...\n');

  db.run(deleteQuery, function(err) {
    if (err) {
      console.error('❌ 削除エラー:', err.message);
      return;
    }

    console.log(`✅ 削除完了: ${this.changes}件のレコードを削除しました`);

    // 削除後の確認
    db.get(checkQuery, (err, row) => {
      if (err) {
        console.error('❌ エラー:', err.message);
        return;
      }
      console.log(`📊 削除後のレコード数: ${row.total_count}`);
      console.log('\n🎉 処理完了！');
      db.close();
    });
  });
  */

  // 削除を実行しない場合
  setTimeout(() => {
    console.log('ℹ️  削除処理はコメントアウトされています。');
    console.log('💡 実際に削除する場合は、スクリプト内の削除処理部分のコメントを外してください。');
    db.close();
  }, 1000);
});
