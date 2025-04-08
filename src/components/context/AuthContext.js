import { createContext, useState, useEffect } from "react";
import axios from "axios";
import {  LoginAPI, RegisterAPI } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  // Automatically set token in headers
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Login Function
  const login = async (email, password, cmd) => {
    try {
      await axios
        .post(LoginAPI, { email, password, cmd })
        .then((res) => {
          localStorage.setItem("token", res.data.value.token);
          window.alert(res.data.msg);
        })
        .catch((error) => {
          window.alert(error.response.data.msg);
          window.location.reload();
        });
    } catch (error) {
      
      window.alert(error.response?.data?.message || error.message)
    }
  };

  // Register Function
  const register = async (name, email, password, role, cmd) => {
    try {
      await axios
        .post(RegisterAPI, { name, email, password, role, cmd })
        .then((res) => {
          localStorage.setItem("token", res.data.value.token);
          window.alert(res.data.msg);
        })
        .catch((error) => {
          window.alert(error.response.data.msg);
          window.location.reload();
        });
    } catch (error) {
      
      window.alert(error.data?.message || error.message)
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register}}
    >
      {children}
    </AuthContext.Provider>
  );
};
