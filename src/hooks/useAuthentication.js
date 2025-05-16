/**
 * Custom React hook that manages authentication state and operations.
 *
 * This hook provides functionality for:
 * - User login with email/password credentials
 * - User registration with validation
 * - User logout
 * - Authentication state management
 *
 * It integrates with:
 * - React Router for navigation
 * - Mantine notifications for user feedback
 * - Custom auth store for state management
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getDefaultRoute, ROUTES } from "../routes/index";
import useAuthStore from "../store/useAuthStore";

// Selector functions for store values
const selectUser = (state) => state.user;
const selectIsAuthenticated = (state) => state.isAuthenticated;
const selectIsLoading = (state) => state.isLoading;
const selectError = (state) => state.error;

/**
 * Hook for managing authentication state and operations
 * Provides functions for login, register, logout and checking auth status
 */
export function useAuthentication() {
  const navigate = useNavigate();

  // Get state from store
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore(selectIsLoading);
  const error = useAuthStore(selectError);

  // Get actions from store
  const loginAction = useAuthStore((state) => state.login);
  const registerAction = useAuthStore((state) => state.register);
  const logoutAction = useAuthStore((state) => state.logout);

  // Handle user login
  const handleLogin = useCallback(
    async (userData) => {
      try {
        const result = await loginAction(userData);

        if (!result.success) {
          throw new Error(result.error || "Authentication failed");
        }

        const currentUser = result.user;
        if (!currentUser?.role) {
          throw new Error("Invalid user data received after login");
        }

        const redirectPath = getDefaultRoute(currentUser.role);
        navigate(redirectPath);

        return { success: true, user: currentUser };
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
      }
    },
    [loginAction, navigate]
  );

  // Handle user registration
  const handleRegister = useCallback(
    async (userData) => {
      try {
        const success = await registerAction(userData);

        if (!success) {
          throw new Error("Registration failed");
        }

        // Get current user after successful registration and auto-login
        const currentUser = useAuthStore.getState().user;
        if (!currentUser?.role) {
          throw new Error("Invalid user data after registration");
        }

        const redirectPath = getDefaultRoute(currentUser.role);
        navigate(redirectPath);

        return { success: true, user: currentUser };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [registerAction, navigate]
  );

  // Handle user logout
  const handleLogout = useCallback(async () => {
    try {
      const success = await logoutAction();

      if (!success) {
        throw new Error("Logout failed");
      }

      navigate(ROUTES.LOGIN, { state: { isLogout: true } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [logoutAction, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}
