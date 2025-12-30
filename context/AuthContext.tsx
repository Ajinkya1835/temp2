
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: any) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem('pvms_auth');
    if (savedAuth) {
      const { user, token } = JSON.parse(savedAuth);
      setUser(user);
      setToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = (data: any) => {
    const authData = { user: { id: data._id, ...data }, token: data.token };
    setUser(authData.user);
    setToken(authData.token);
    localStorage.setItem('pvms_auth', JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pvms_auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
