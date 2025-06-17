'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types/user';

interface LoginContextType {
  currentUser: User | null;
  logout: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.location.reload();
  };

  return (
    <LoginContext.Provider value={{ currentUser, logout }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLoginContext() {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useLoginContext must be used within a LoginProvider');
  }
  return context;
} 