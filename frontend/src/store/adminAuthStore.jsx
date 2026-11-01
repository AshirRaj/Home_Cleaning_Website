/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const savedUser = localStorage.getItem('sparkle_admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('sparkle_admin_token') || null;
  });

  const isAuthenticated = Boolean(token && adminUser);

  const loginAdmin = (userData, userToken) => {
    setAdminUser(userData);
    setToken(userToken);
    localStorage.setItem('sparkle_admin_user', JSON.stringify(userData));
    localStorage.setItem('sparkle_admin_token', userToken);
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('sparkle_admin_user');
    localStorage.removeItem('sparkle_admin_token');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated,
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
