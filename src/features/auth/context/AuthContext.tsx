"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthSession, User } from "../../../core/types/domain";
import { initializeSeedData } from "../../../core/data/seedService";
import { authService } from "../services/authService";

interface AuthContextValue {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(() => {
    setSession(authService.getSession());
    setUser(authService.getCurrentUser());
  }, []);

  useEffect(() => {
    let isMounted = true;
    void initializeSeedData().then(() => {
      if (isMounted) {
        refreshUser();
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const authenticatedUser = await authService.login(email, password);
    setUser(authenticatedUser);
    setSession(authService.getSession());
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ user, session, isLoading, login, logout, refreshUser }),
    [user, session, isLoading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
  }
  return context;
}
