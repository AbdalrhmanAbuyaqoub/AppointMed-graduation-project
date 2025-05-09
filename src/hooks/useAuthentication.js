import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDefaultRoute, ROUTES } from "../routes/index";
import { notifications } from "@mantine/notifications";

export function useAuthentication() {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (credentials) => {
      try {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const result = await login(credentials.email, credentials.password);

        if (!result?.success) {
          throw new Error("Authentication failed");
        }

        const redirectPath = getDefaultRoute(result.user.role);
        navigate(redirectPath);

        notifications.show({
          title: "Welcome back!",
          message: `Logged in successfully as ${result.user.name}`,
          color: "green",
        });

        return { success: true };
      } catch (error) {
        const errorMessage =
          error.message === "Invalid credentials"
            ? "Invalid email or password"
            : error.message || "An unexpected error occurred";

        notifications.show({
          title: "Authentication Failed",
          message: errorMessage,
          color: "red",
        });

        return { success: false, error: errorMessage };
      }
    },
    [login, navigate]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
      notifications.show({
        title: "Logged out",
        message: "You have been successfully logged out",
        color: "blue",
      });
    } catch (error) {
      notifications.show({
        title: "Logout Failed",
        message: "Failed to log out. Please try again.",
        color: "red",
      });
    }
  }, [logout, navigate]);

  return {
    handleLogin,
    handleLogout,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
    user,
  };
}
