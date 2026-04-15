import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  getToken,
  getUser,
  storeToken,
  storeUser,
  clearStorage,
} from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const t = await getToken();
        const u = await getUser();
        setToken(t);
        setUser(u);
      } catch (e) {
        console.error('Failed to load auth state:', e);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  const signIn = async (userData, authToken) => {
    await storeToken(authToken);
    await storeUser(userData);
    setToken(authToken);
    setUser(userData);
  };

  const signOut = async () => {
    await clearStorage();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
