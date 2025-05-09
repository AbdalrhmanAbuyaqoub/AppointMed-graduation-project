import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from storage and validate token on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        // Validate token and get user profile
        const isValid = await authService.validateToken();
        if (!isValid) {
          throw new Error("Invalid token");
        }

        const userProfile = await authService.getUserProfile();
        setUser(userProfile);
      } catch (err) {
        console.error("Failed to restore authentication state:", err);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle login
  const login = useCallback(async (email, password) => {
    setError(null);

    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      return { success: true, user: result.user };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Handle registration
  const register = useCallback(async (userData) => {
    setError(null);

    try {
      const result = await authService.register(userData);
      setUser(result.user);
      return { success: true, user: result.user };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Handle logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Error during logout:", err);
      throw err;
    }
  }, []);

  // Check if session is expired
  const isSessionExpired = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return true;

    // You could add more sophisticated token validation here
    // For example, checking if the token is expired using JWT decode
    // For now, we'll just check if the token exists
    return false;
  }, []);

  // Provide authentication context
  const value = {
    user,
    login,
    logout,
    register,
    error,
    isLoading: loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isSessionExpired,
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
