import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, try to restore a session from localStorage.
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  function persistSession(data) {
    const loggedInUser = {
      id: data.id,
      username: data.username,
      fullName: data.fullName,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setToken(data.token);
    setUser(loggedInUser);
  }

  async function register({ firstName, lastName, username, password }) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: { firstName, lastName, username, password },
    });

    persistSession(data);
  }

  async function login({ username, password }) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { username, password },
    });

    persistSession(data);
  }

  async function logout() {
    try {
      await apiRequest("/auth/logout", { method: "POST", token });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  }

  const value = { user, token, isLoading, register, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
