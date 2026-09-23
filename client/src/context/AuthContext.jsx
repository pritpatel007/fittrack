import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fittrack_token'));
  const [loading, setLoading] = useState(true);

  const saveAuth = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('fittrack_token', tokenData);
    localStorage.setItem('fittrack_user', JSON.stringify(userData));
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fittrack_token');
    localStorage.removeItem('fittrack_user');
  };

  const fetchMe = useCallback(async () => {
    if (!localStorage.getItem('fittrack_token')) { setLoading(false); return; }
    try {
      const { data } = await authAPI.me();
      setUser(data.user);
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    saveAuth(data.user, data.token);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    saveAuth(data.user, data.token);
    return data.user;
  };

  const logout = () => clearAuth();

  const updateLocalUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('fittrack_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
