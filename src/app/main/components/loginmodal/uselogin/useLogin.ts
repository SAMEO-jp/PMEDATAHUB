import { useState } from 'react';
import { User } from '../types/user';

export function useLogin() {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (userId: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await fetch('/api/loginmodals/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'ログインに失敗しました。');
        return false;
      }

      const userData: User = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('ログイン中にエラーが発生しました。');
      return false;
    }
  };

  return { handleLogin, error };
} 