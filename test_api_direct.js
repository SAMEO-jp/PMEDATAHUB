const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// APIエンドポイントと同じロジックを直接テスト
async function testApiLogic() {
  console.log('APIロジックの直接テスト開始...');
  
  const dbPath = path.join(process.cwd(), 'data', 'achievements.db');
  const db = new sqlite3.Database(dbPath);
  
  try {
    // GetAllDataと同じクエリを実行
    const query = 'SELECT * FROM PROJECT';
    console.log('実行クエリ:', query);
    
    db.all(query, (err, rows) => {
      if (err) {
        console.error('クエリ実行エラー:', err);
        return;
      }
      
      console.log('取得件数:', rows.length);
      console.log('最初のレコード:', rows[0]);
      
      // APIレスポンス形式で出力
      const response = {
        projects: rows,
        total: rows.length,
        search: '',
        page: 1,
        pageSize: 10,
      };
      
      console.log('APIレスポンス形式:', JSON.stringify(response, null, 2));
    });
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    db.close();
  }
}

testApiLogic();
