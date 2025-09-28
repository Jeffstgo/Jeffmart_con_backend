import { createContext, useState, useContext, useEffect } from "react";
import * as authApi from "../services/auth";

const AuthContext = createContext();

export { AuthContext };

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem("jm_user");
    const token = localStorage.getItem("jm_token");
    if (rawUser && token) {
      try { setUser(JSON.parse(rawUser)); } catch {}
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user, token } = await authApi.login({ email, password });
      setUser(user);
      localStorage.setItem("jm_user", JSON.stringify(user));
      localStorage.setItem("jm_token", token);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.response?.data?.error || "Error de login" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { user, token } = await authApi.register(payload);
      setUser(user);
      localStorage.setItem("jm_user", JSON.stringify(user));
      localStorage.setItem("jm_token", token);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.response?.data?.error || "Error de registro" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("jm_user");
    localStorage.removeItem("jm_token");
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
