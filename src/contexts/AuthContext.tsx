import React, { createContext, useContext, useState, useCallback } from 'react';
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";

export type Role = 'guest' | 'member' | 'admin' | 'demon';

export interface User {
  id: string; // user_id (login ID)
  name: string;
  role: Role;
  dbId?: string; // convex _id
}

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from sessionStorage
    const stored = sessionStorage.getItem('innovex_user');
    return stored ? JSON.parse(stored) : null;
  });
  const convex = useConvex();

  const login = useCallback(async (userId: string, password: string): Promise<boolean> => {
    try {
      const data = await convex.query(api.users.checkCredentials, { userId, password });

      if (!data) return false;

      const newUser: User = {
        id: data.user_id,
        name: data.name,
        role: (data.role.toLowerCase()) as Role,
        dbId: data._id,
      };

      setUser(newUser);
      sessionStorage.setItem('innovex_user', JSON.stringify(newUser));
      return true;
    } catch {
      return false;
    }
  }, [convex]);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('innovex_user');
  }, []);

  const role: Role = user?.role ?? 'guest';

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
