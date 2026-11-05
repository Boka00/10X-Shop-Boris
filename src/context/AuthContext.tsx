import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types/user';

interface AuthContextType {
    user: AuthUser
    login: (username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  
  const [user, setUser] = useState< AuthUser >({username: "", isLoggedIn: false})

  const login = (username: string) => {
    setUser({
        username: username,
        isLoggedIn: true,
    })
  }
  
  const logout = () => {
    setUser({
        username: "",
        isLoggedIn: false
    })
  }

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook კონტექსტის მარტივად გამოსაყენებლად (ეს მზადაა, მაგრამ წაიკითხე როგორ მუშაობს!)
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}