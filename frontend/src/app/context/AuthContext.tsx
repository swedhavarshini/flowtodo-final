import { createContext, useState, useEffect, ReactNode, useContext as React_useContext } from "react";

interface User {
  _id: string;
  email: string;
  routine?: any;
  // add more user fields as needed
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  autoLoginEnabled: boolean;
  setAutoLoginEnabled: (enabled: boolean) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoLoginEnabled, setAutoLoginEnabled] = useState(false);

  // Check for saved user on mount (auto-login)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const autoLoginSetting = localStorage.getItem("autoLoginEnabled");
    
    if (autoLoginSetting) {
      setAutoLoginEnabled(JSON.parse(autoLoginSetting));
    }

    if (savedUser && autoLoginSetting && JSON.parse(autoLoginSetting)) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse saved user:", err);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleSetAutoLoginEnabled = (enabled: boolean) => {
    setAutoLoginEnabled(enabled);
    localStorage.setItem("autoLoginEnabled", JSON.stringify(enabled));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        autoLoginEnabled,
        setAutoLoginEnabled: handleSetAutoLoginEnabled,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React_useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
