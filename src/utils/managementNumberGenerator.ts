/**
 * 管理番号自動生成ユーティリティ
 */

/**
 * 5桁の英数字管理番号を生成
 * @param existingNumbers - 既存の管理番号配列
 * @returns 重複しない5桁の英数字管理番号
 */
export function generateManagementNumber(existingNumbers: string[] = []): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 5;
  const maxAttempts = 1000; // 無限ループ防止
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let result = '';
    
    // 5桁の英数字をランダム生成
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // 既存の管理番号と重複しないかチェック
    if (!existingNumbers.includes(result)) {
      return result;
    }
  }
  
  // 最大試行回数に達した場合はタイムスタンプベースの番号を生成
  const timestamp = Date.now().toString().slice(-5);
  return `A${timestamp}`;
}

/**
 * 管理番号の妥当性をチェック
 * @param number - チェックする管理番号
 * @returns 妥当性の結果
 */
export function validateManagementNumber(number: string): {
  isValid: boolean;
  error?: string;
} {
  if (!number || number.length !== 5) {
    return {
      isValid: false,
      error: '管理番号は5桁である必要があります'
    };
  }
  
  const validChars = /^[A-Z0-9]{5}$/;
  if (!validChars.test(number)) {
    return {
      isValid: false,
      error: '管理番号は英数字5桁である必要があります'
    };
  }
  
  return { isValid: true };
}
