import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }

    setLoading(false);
  }, []);

  function login(userData, tokenData) {
    setUser(userData);
    setToken(tokenData);
    setRole(userData.role);

    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);
  }

  function logout() {
    setUser(null);
    setToken(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}