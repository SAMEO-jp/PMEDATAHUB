// テスト用ユーザー情報を設定するスクリプト
console.log('Setting up test user data...');

// localStorageにテストユーザー情報を設定
const testUser = {
  user_id: 'TEST001',
  name: 'テストユーザー',
  department: '技術部'
};

localStorage.setItem('current_user', JSON.stringify(testUser));
console.log('✅ Test user set in localStorage:', testUser);

// テスト完了メッセージ
console.log('テストユーザー情報を設定しました。');
console.log('ユーザーID: TEST001');
console.log('ブラウザをリロードして動作を確認してください。');

