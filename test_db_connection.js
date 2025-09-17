const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// データベース接続をテストする
async function testDatabaseConnection() {
  console.log('データベース接続テスト開始...');
  
  const dbPath = path.join(process.cwd(), 'data', 'achievements.db');
  console.log('データベースパス:', dbPath);
  
  // ファイルの存在確認
  const fs = require('fs');
  if (!fs.existsSync(dbPath)) {
    console.error('データベースファイルが存在しません:', dbPath);
    return;
  }
  
  console.log('データベースファイルが存在します');
  
  // SQLite3での接続テスト
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('SQLite3接続エラー:', err.message);
      return;
    }
    console.log('SQLite3接続成功');
    
    // 簡単なクエリをテスト
    db.get("SELECT COUNT(*) as count FROM PROJECT", (err, row) => {
      if (err) {
        console.error('クエリ実行エラー:', err.message);
      } else {
        console.log('PROJECTテーブルの件数:', row.count);
      }
      
      // 接続を閉じる
      db.close((err) => {
        if (err) {
          console.error('接続クローズエラー:', err.message);
        } else {
          console.log('接続を正常に閉じました');
        }
      });
    });
  });
}

testDatabaseConnection().catch(console.error);
