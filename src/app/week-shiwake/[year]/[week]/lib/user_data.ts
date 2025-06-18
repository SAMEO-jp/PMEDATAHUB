/**
 * ユーザー関連のデータを取得するための関数群
 */

/**
 * 社員一覧を取得する関数
 * @returns 社員一覧
 */
export async function getEmployees() {
  try {
    const response = await fetch('/api/employees');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('社員一覧の取得中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * プロジェクト一覧を取得する関数
 * @returns プロジェクト一覧
 */
export async function getProjects() {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('プロジェクト一覧の取得中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * 現在のユーザー情報を取得する関数
 * @returns ユーザー情報
 */
export async function getCurrentUser() {
  try {
    const response = await fetch('/api/user/current');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('ユーザー情報の取得中にエラーが発生しました:', error);
    throw error;
  }
} 