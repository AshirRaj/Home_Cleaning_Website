/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sparkle_admin_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('sparkle_admin_token') || null;
  });

  const [isVerifying, setIsVerifying] = useState(Boolean(token));

  const logoutAdmin = useCallback(() => {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('sparkle_admin_user');
    localStorage.removeItem('sparkle_admin_token');
    localStorage.removeItem('sparkle_admin_password');
  }, []);

  const loginAdmin = useCallback((userData, userToken) => {
    setAdminUser(userData);
    setToken(userToken);
    localStorage.setItem('sparkle_admin_user', JSON.stringify(userData));
    localStorage.setItem('sparkle_admin_token', userToken);
  }, []);

  // Verify stored session with backend on load
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const storedToken = localStorage.getItem('sparkle_admin_token');
      if (!storedToken) {
        if (isMounted) setIsVerifying(false);
        return;
      }

      try {
        const res = await authApi.getCurrentAdmin();
        if (isMounted && res?.user) {
          setAdminUser(res.user);
          localStorage.setItem('sparkle_admin_user', JSON.stringify(res.user));
        }
      } catch (err) {
        // If unauthenticated or token expired, log out
        if (err.response?.status === 401 && isMounted) {
          logoutAdmin();
        }
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [logoutAdmin]);

  const isAuthenticated = Boolean(token && adminUser);

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated,
        isVerifying,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
