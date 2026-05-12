import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AuthModal from '@/components/auth/AuthModal';

interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  exp?: number;
}

interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decoded = jwtDecode<UserPayload>(storedToken);
          // Check if expired
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setToken(storedToken);
            setUser(decoded);
          }
        } catch (error) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen to global 401 errors from Axios
    const handleUnauthorized = () => {
      logout();
      setShowAuthModal(true);
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode<UserPayload>(newToken);
      setUser(decoded);
      setShowAuthModal(false);
    } catch (err) {
      console.error('Invalid token on login', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, showAuthModal, setShowAuthModal }}>
      {children}
      {showAuthModal && <AuthModal />}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
