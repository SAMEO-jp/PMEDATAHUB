const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/achievements.db');

console.log('Setting up test data for user TEST001...');

// テストユーザーを作成
const testUser = {
  user_id: 'TEST001',
  name_japanese: 'テストユーザー',
  bumon: '技術部',
  sitsu: '設計課',
  ka: '第1グループ',
  TEL: '03-1234-5678',
  mail: 'test@example.com',
  in_year: '2020',
  Kengen: '一般'
};

// テストプロジェクトを作成
const testProjects = [
  { PROJECT_ID: 'E923BXX215000', PROJECT_NAME: 'テストプロジェクトA' },
  { PROJECT_ID: 'E923BXX215001', PROJECT_NAME: 'テストプロジェクトB' },
  { PROJECT_ID: 'E923BXX215002', PROJECT_NAME: 'テストプロジェクトC' }
];

// テスト設備を作成
const testSetsubi = [
  {
    id: 1,
    seiban: 'SEIBAN-001',
    shohin_category: '電子機器',
    setsubi_name: '制御盤A',
    project_id: 'E923BXX215000'
  },
  {
    id: 2,
    seiban: 'SEIBAN-002',
    shohin_category: '機械部品',
    setsubi_name: 'モーター制御ユニット',
    project_id: 'E923BXX215001'
  }
];

// テスト購入品を作成
const testKounyu = [
  {
    id: 1,
    project_id: 'E923BXX215000',
    management_number: 'KOU-001',
    item_name: '制御用モーター'
  },
  {
    id: 2,
    project_id: 'E923BXX215001',
    management_number: 'KOU-002',
    item_name: 'センサーアレイ'
  }
];

// 順次実行
async function setupTestData() {
  try {
    // 1. ユーザーを挿入
    console.log('Inserting test user...');
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR REPLACE INTO USER (user_id, name_japanese, bumon, sitsu, ka, TEL, mail, in_year, Kengen)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        testUser.user_id,
        testUser.name_japanese,
        testUser.bumon,
        testUser.sitsu,
        testUser.ka,
        testUser.TEL,
        testUser.mail,
        testUser.in_year,
        testUser.Kengen
      ], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    // 2. プロジェクトを挿入
    console.log('Inserting test projects...');
    for (const project of testProjects) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO PROJECT (PROJECT_ID, PROJECT_NAME)
          VALUES (?, ?)
        `, [project.PROJECT_ID, project.PROJECT_NAME], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // 3. プロジェクトメンバーシップを作成
    console.log('Creating project memberships...');
    for (let i = 0; i < testProjects.length; i++) {
      const project = testProjects[i];
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO PROJECT_MEMBERS (project_id, user_id, role, joined_at)
          VALUES (?, ?, ?, datetime('now', '-${i * 30} days'))
        `, [project.PROJECT_ID, testUser.user_id, '開発者'], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // 4. 設備マスターデータを挿入
    console.log('Inserting test setsubi...');
    for (const setsubi of testSetsubi) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO setsubi_master (id, seiban, shohin_category, setsubi_name)
          VALUES (?, ?, ?, ?)
        `, [
          setsubi.id,
          setsubi.seiban,
          setsubi.shohin_category,
          setsubi.setsubi_name
        ], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // 5. 設備担当割り当てを作成
    console.log('Creating setsubi assignments...');
    for (const setsubi of testSetsubi) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO setsubi_assignment (project_id, user_id, setsubi_id, assigned_at, status)
          VALUES (?, ?, ?, datetime('now'), 'active')
        `, [
          setsubi.project_id,
          testUser.user_id,
          setsubi.id
        ], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // 6. 購入品マスターデータを挿入
    console.log('Inserting test kounyu...');
    for (const kounyu of testKounyu) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO kounyu_master (id, project_id, management_number, item_name)
          VALUES (?, ?, ?, ?)
        `, [
          kounyu.id,
          kounyu.project_id,
          kounyu.management_number,
          kounyu.item_name
        ], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // 7. 購入品担当割り当てを作成
    console.log('Creating kounyu assignments...');
    for (const kounyu of testKounyu) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO kounyu_assignment (project_id, kounyu_id, user_id, assigned_at, status)
          VALUES (?, ?, ?, datetime('now'), 'active')
        `, [
          kounyu.project_id,
          kounyu.id,
          testUser.user_id
        ], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log('✅ Test data setup completed successfully!');
    console.log('Test user ID: TEST001');
    console.log('Test projects:', testProjects.map(p => p.PROJECT_NAME).join(', '));

  } catch (error) {
    console.error('❌ Error setting up test data:', error);
  } finally {
    db.close();
  }
}

setupTestData();
