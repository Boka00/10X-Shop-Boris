import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser, ProfileFormValues } from "../types/user";
import { STORAGE_KEYS, StorageService } from "../models/StorageService";

interface AuthContextType {
  user: AuthUser;
  login: (username: string) => void;
  logout: () => void;
  updateProfile: (profile: ProfileFormValues) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isAuthUser(val: unknown): val is AuthUser {
  if (typeof val !== "object" || val === null) return false;
  const u = val as Record<string, unknown>;
  return typeof u.username === "string" && typeof u.isLoggedIn === "boolean";
}

const userStorage = new StorageService<AuthUser>(STORAGE_KEYS.user, isAuthUser);
const themeStorage = new StorageService<"light" | "dark">(
  STORAGE_KEYS.theme,
  (val): val is "light" | "dark" => val === "light" || val === "dark"
);

const getInitialAuth = (): AuthUser => {
  const saved = userStorage.get();
  if (saved && saved.isLoggedIn) {
    return saved;
  }
  return { username: "", isLoggedIn: false };
};

const getInitialTheme = (): "light" | "dark" => {
  return themeStorage.get() ?? "light";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(getInitialAuth);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    if (user.isLoggedIn) {
      userStorage.set(user);
    } else {
      userStorage.remove();
    }
  }, [user]);

  useEffect(() => {
    themeStorage.set(theme);
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const login = (username: string): void => {
    const clean = username.trim();
    setUser({
      username: clean,
      isLoggedIn: true,
      firstName: clean.split(" ")[0] || clean,
      lastName: clean.split(" ").slice(1).join(" "),
      email: `${clean.replace(/\s+/g, ".").toLowerCase()}@example.com`,
      phone: "",
    });
  };

  const logout = (): void => {
    setUser({
      username: "",
      isLoggedIn: false,
    });
    userStorage.remove();
  };

  const updateProfile = (profile: ProfileFormValues): void => {
    setUser((prev) => ({
      ...prev,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
    }));
  };

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateProfile, theme, toggleTheme }}
    >
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