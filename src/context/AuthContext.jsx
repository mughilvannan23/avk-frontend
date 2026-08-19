import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Simulates user login
   * @param {string} email 
   * @param {string} password 
   */
  const login = (email, password) => {
    // Simulate API authorization response
    setUser({
      id: "usr-0912",
      name: "Aditya Kumar",
      email: email || "aditya@example.com",
      phone: "+91 99102 12007",
      address: "No. 45, Temple View St, Trichy, TN, 620002"
    });
    setIsAuthenticated(true);
    return true;
  };

  /**
   * Simulates user logout
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
