import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

export type UserRole = "OWNER" | "TENANT" | "ADMIN" | "BIGBOSS";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface StateContextType {
  isAuth: boolean;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  role: UserRole | null;
  setRole: Dispatch<SetStateAction<UserRole | null>>;
  logout: () => void;
}

export const StateContext = createContext<StateContextType | undefined>(
  undefined,
);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    return (
      localStorage.getItem("token") !== null ||
      localStorage.getItem("user") !== null
    );
  });

  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem("user");
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  });

  const [role, setRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem("role") as UserRole) || null;
  });

  // Keep state in sync with localStorage updates
  useEffect(() => {
    if (user) {
      if (!isAuth) setIsAuth(true);
      if (user.role && user.role !== role) setRole(user.role);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
    } else {
      // If user is null but we think we are authed, check if we should clear
      if (isAuth && !localStorage.getItem("token")) {
        setIsAuth(false);
        setRole(null);
      }
    }
  }, [user, isAuth, role]);

  // Handle logout helper
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsAuth(false);
    setUser(null);
    setRole(null);
  };

  return (
    <StateContext.Provider
      value={{ isAuth, setIsAuth, user, setUser, role, setRole, logout }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a StateProvider");
  }
  return context;
};
