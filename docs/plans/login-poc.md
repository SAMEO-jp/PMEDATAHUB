# ログインシステム POC実装計画書

## 1. 概要
既存のログインモーダルを拡張し、USERテーブル（318件のレコード）を使用した簡単なログイン機能のPOCを実装する。

### 1.1 最小限の機能要件
- UserID直接入力によるログイン
- 氏名検索によるUserID取得→ログイン
- 簡単なセッション管理（ブラウザストレージ使用）

### 1.2 技術スタック
- フロントエンド: Next.js 14, React, TypeScript
- バックエンド: Next.js API Routes
- データベース: SQLite (`data/achievements.db`)
- 状態管理: Zustand (既存のauthStore)
- UI: 既存のUIコンポーネント

## 2. UI設計

### 2.1 ログインモーダルのレイアウト
```
┌─────────────────────────────┐
│        ログイン             │
├─────────────────────────────┤
│  ○ UserID直接入力          │
│  ○ 名前から検索            │
├─────────────────────────────┤
│ [UserID直接入力の場合]      │
│ UserID: [_____________]    │
│                            │
│ [名前検索の場合]            │
│ 氏名: [_____________] [検索] │
│                            │
│ [検索結果一覧]              │
│ □ 立木 可菜 (338844)       │
│ □ 高橋 新 (338586)         │
│                            │
│      [ログイン] [キャンセル]  │
└─────────────────────────────┘
```

## 3. 実装タスク

### タスク1: API作成 (30分)
#### ファイル: `src/app/api/auth/search-users/route.ts`
```typescript
// ユーザー検索API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  
  // SQLite クエリで名前検索
  // SELECT user_id, name_japanese, bumon, syokui FROM USER WHERE name_japanese LIKE '%name%'
}
```

#### ファイル: `src/app/api/auth/login/route.ts`
```typescript
// ログインAPI (UserID存在確認)
export async function POST(request: Request) {
  const { userId } = await request.json();
  
  // SQLite クエリでUserID存在確認
  // SELECT * FROM USER WHERE user_id = userId
}
```

### タスク2: データベース接続 (15分)
#### ファイル: `src/lib/db/userDb.ts`
```typescript
import sqlite3 from 'sqlite3';

export async function searchUsers(name: string) {
  // 簡単なSQLite接続とクエリ実行
}

export async function getUser(userId: string) {
  // UserID で ユーザー取得
}
```

### タスク3: 型定義 (10分)
#### ファイル: `src/types/user.ts`
```typescript
export interface User {
  user_id: string;
  name_japanese: string;
  company: string;
  bumon: string;
  sitsu: string;
  ka: string;
  syokui: string;
}

export interface UserSearchResult {
  user_id: string;
  name_japanese: string;
  bumon: string;
  syokui: string;
}
```

### タスク4: ログインモーダル更新 (45分)
#### ファイル: `src/components/auth/LoginModal.tsx`
機能追加:
- ラジオボタン（UserID入力 / 名前検索）
- 名前検索フォーム
- 検索結果表示
- ユーザー選択

### タスク5: 状態管理更新 (15分)
#### ファイル: `src/store/authStore.ts`
```typescript
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

// localStorageを使用した簡単な永続化
```

### タスク6: カスタムフック (20分)
#### ファイル: `src/hooks/useAuth.ts`
```typescript
export function useLogin() {
  // ログイン処理
}

export function useUserSearch() {
  // ユーザー検索処理
}
```

## 4. 実装詳細

### 4.1 検索API実装例
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';
  
  if (name.length < 2) {
    return NextResponse.json([]);
  }
  
  // 簡単なSQLiteクエリ
  const db = new sqlite3.Database('data/achievements.db');
  
  return new Promise((resolve) => {
    db.all(
      "SELECT user_id, name_japanese, bumon, syokui FROM USER WHERE name_japanese LIKE ? LIMIT 10",
      [`%${name}%`],
      (err, rows) => {
        db.close();
        resolve(NextResponse.json(rows || []));
      }
    );
  });
}
```

### 4.2 ログインモーダル実装例
```typescript
export function LoginModal() {
  const [method, setMethod] = useState<'userid' | 'name'>('userid');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  
  const handleSearch = async () => {
    const response = await fetch(`/api/auth/search-users?name=${name}`);
    const results = await response.json();
    setSearchResults(results);
  };
  
  const handleLogin = async () => {
    const loginUserId = method === 'userid' ? userId : selectedUser?.user_id;
    // ログイン処理
  };
  
  return (
    // UI実装
  );
}
```

## 5. 実装順序

### ステップ1: バックエンド (45分)
1. データベース接続関数作成
2. ユーザー検索API作成
3. ログインAPI作成
4. 型定義作成

### ステップ2: フロントエンド (60分)
1. カスタムフック作成
2. ログインモーダル更新
3. 状態管理更新

### ステップ3: 動作確認・調整 (30分)
1. 動作テスト
2. 簡単なバグ修正
3. UI調整

## 6. POC完了後の動作イメージ

1. **UserID直接入力の場合**:
   - UserIDを入力 → ログインボタン → ユーザー情報取得 → ログイン完了

2. **名前検索の場合**:
   - 名前を入力 → 検索ボタン → 候補一覧表示 → ユーザー選択 → ログインボタン → ログイン完了

3. **ログイン後**:
   - ユーザー情報がlocalStorageに保存
   - authStoreにユーザー情報セット
   - ヘッダーにログインユーザー名表示

## 7. 制約事項・今後の課題

### POCの制約
- パスワード認証なし（UserID存在確認のみ）
- セキュリティ機能なし
- エラーハンドリング最小限
- テストコードなし

### 今後の改善点
- 本格的な認証システム導入
- セキュリティ強化
- エラーハンドリング改善
- テストコード追加

---

**推定作業時間**: 約2.5時間  
**作成日**: 2025-08-28  
**バージョン**: POC 1.0