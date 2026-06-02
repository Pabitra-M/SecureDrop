import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [center, setCenter] = useState(() => {
    try { return JSON.parse(localStorage.getItem("center")); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("center", JSON.stringify(data.center));
    setCenter(data.center);
    return data;
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    localStorage.setItem("token", data.token);
    localStorage.setItem("center", JSON.stringify(data.center));
    setCenter(data.center);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("center");
    setCenter(null);
  };

  return (
    <AuthContext.Provider value={{ center, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
