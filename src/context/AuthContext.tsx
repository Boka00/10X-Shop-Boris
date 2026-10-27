import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types/user';

// TODO 1: შეავსე AuthContextType ინტერფეისი.
// მას უნდა ჰქონდეს 3 ველი:
// 1) user (რომლის ტიპია AuthUser)
// 2) login ფუნქცია (იღებს username: string პარამეტრს და აბრუნებს void-ს)
// 3) logout ფუნქცია (არ იღებს პარამეტრს და აბრუნებს void-ს)
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
    // TODO 5: value-ში გადაეცი ობიექტი: { user, login, logout }
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook კონტექსტის მარტივად გამოსაყენებლად (ეს მზადაა, მაგრამ წაიკითხე როგორ მუშაობს!)
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}