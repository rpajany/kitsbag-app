import React, { Children } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { GET_Api } from "../services/ApiService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const res = await GET_Api("/protected");
      setUser(res?.data);
    } catch (error) {
      console.log("Error checkAuth :", error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return(
    <AuthContext.Provider value={{user, setUser, checkAuth}}>
        {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => useContext(AuthContext);
