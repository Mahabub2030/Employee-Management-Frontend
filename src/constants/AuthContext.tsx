import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type UserRole = "superadmin" | "admin" | "user";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

const API_BASE = "http://localhost:5000/api"; // 👈 change to your backend URL

async function fetchAppUser(token: string): Promise<AppUser | null> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    id: data._id,
    name: data.display_name || data.email || "User",
    email: data.email || "",
    role: (data.role as UserRole) || "user",
    avatar:
      data.avatar ||
      (data.display_name || data.email || "U").slice(0, 2).toUpperCase(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check if there's a saved token and restore the session
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetchAppUser(token)
        .then((appUser) => setUser(appUser))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return false;

    const { token, user: userData } = await res.json();
    localStorage.setItem("auth_token", token);
    setUser({
      id: userData._id,
      name: userData.display_name || userData.email,
      email: userData.email,
      role: userData.role || "user",
      avatar:
        userData.avatar ||
        (userData.display_name || userData.email).slice(0, 2).toUpperCase(),
    });
    return true;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: name, email, password }),
    });
    return res.ok;
  };

  const logout = async () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
