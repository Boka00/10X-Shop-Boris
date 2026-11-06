import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../types/user";

interface AuthContextType {
  user: AuthUser;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "shop_user";

const getInitialAuth = (): AuthUser => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return { username: "", isLoggedIn: false };
    const parsed: unknown = JSON.parse(saved);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "isLoggedIn" in parsed &&
      (parsed as AuthUser).isLoggedIn === true
    ) {
      return parsed as AuthUser;
    }
  } catch (error) {
    console.error("Failed to parse auth state from localStorage:", error);
  }
  return { username: "", isLoggedIn: false };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(getInitialAuth);

  useEffect(() => {
    try {
      if (user.isLoggedIn) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save auth state to localStorage:", error);
    }
  }, [user]);

  const login = (username: string) => {
    setUser({
      username,
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUser({
      username: "",
      isLoggedIn: false,
    });
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove auth state from localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}