import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email?: string, password?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('byl_auth') === 'true';
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('byl_admin') === 'true';
  });

  const login = (email?: string, password?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('byl_auth', 'true');

    if (email === 'byldaily@gmail.com' && password === 'admin6890#') {
      setIsAdmin(true);
      localStorage.setItem('byl_admin', 'true');
    } else {
      setIsAdmin(false);
      localStorage.removeItem('byl_admin');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('byl_auth');
    localStorage.removeItem('byl_admin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
