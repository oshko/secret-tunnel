import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  async function signUp(dataForm) {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: dataForm.name,
          password: "password",
        }),
      });
      const result = await response.json();
      console.log(result.token);
      setToken(result.token);
      setLocation("TABLET");
    } catch (error) {
      console.error(error);
    }
  }

  // Authenticate
  async function authenticate() {
    if (!token) throw "There is no authentication token!";
    try {
      const response = await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Authentication has been failed!");
      }
      setLocation("TUNNEL");
    } catch (error) {
      console.error(error);
    }
  }

  const value = { location, signUp, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
