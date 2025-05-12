import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { authService } from "../services/authService";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionChecked: false,
};

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Set current user
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            error: null,
          }),

        // Set error message
        setError: (error) => set({ error }),

        // Set loading state
        setLoading: (isLoading) => set({ isLoading }),

        // Initialize auth state
        initializeAuth: async () => {
          set({ isLoading: true });

          try {
            const isValid = await authService.validateSession();

            if (!isValid) {
              set({
                user: null,
                isAuthenticated: false,
                sessionChecked: true,
                isLoading: false,
              });
              return false;
            }

            // Get user data from stored token
            const token = authService.getStoredToken();
            if (!token) {
              throw new Error("No token available");
            }

            // Decode token to get user data
            const user = decodeToken(token);

            set({
              user,
              isAuthenticated: true,
              sessionChecked: true,
              isLoading: false,
              error: null,
            });

            return true;
          } catch (error) {
            console.error("Failed to restore authentication state:", error);
            set({
              user: null,
              isAuthenticated: false,
              sessionChecked: true,
              isLoading: false,
              error: error.message,
            });
            return false;
          }
        },

        // Login user
        login: async (userData) => {
          set({ isLoading: true, error: null });

          try {
            const response = await authService.login(userData);

            if (!response.success) {
              set({ error: response.error, isLoading: false });
              return { success: false, error: response.error };
            }

            const { user } = response;
            if (!user) {
              const error = "Invalid user data received";
              set({ error, isLoading: false });
              return { success: false, error };
            }

            set({
              user,
              isAuthenticated: true,
              sessionChecked: true,
              error: null,
              isLoading: false,
            });

            return { success: true, user };
          } catch (error) {
            set({
              error: error.message,
              isLoading: false,
              user: null,
              isAuthenticated: false,
              sessionChecked: true,
            });
            return { success: false, error: error.message };
          }
        },

        // Register new user
        register: async (userData) => {
          set({ isLoading: true, error: null });

          try {
            const response = await authService.register(userData);

            if (!response.success) {
              set({ error: response.error, isLoading: false });
              return false;
            }

            // After successful registration, proceed with login
            const loginResult = await get().login({
              email: userData.email,
              password: userData.password,
            });

            if (!loginResult.success) {
              set({
                error:
                  "Registration successful but login failed. Please try logging in.",
                isLoading: false,
              });
              return false;
            }

            return true;
          } catch (error) {
            set({
              error: error.message,
              isLoading: false,
              sessionChecked: true,
            });
            return false;
          }
        },

        // Logout user
        logout: async () => {
          console.log("🚪 Starting logout process");
          set({ isLoading: true, error: null });

          try {
            await authService.logout();
            console.log("✅ Logout successful, clearing state");

            // Reset to initial state but keep sessionChecked true
            set({
              ...initialState,
              sessionChecked: true,
              isLoading: false,
            });

            return true;
          } catch (error) {
            console.error("❌ Logout failed:", error);

            // Even if API fails, clear sensitive data
            set({
              ...initialState,
              sessionChecked: true,
              isLoading: false,
              error: `Logout failed: ${error.message}`,
            });

            return false;
          }
        },

        // Check session status
        checkSession: async () => {
          if (!get().sessionChecked) {
            return get().initializeAuth();
          }
          return get().isAuthenticated;
        },

        // Update user data
        updateUser: (userData) => {
          const currentUser = get().user;
          set({ user: { ...currentUser, ...userData } });
        },

        // Reset store state
        reset: () => {
          set({ ...initialState, sessionChecked: true });
        },
      }),
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          sessionChecked: state.sessionChecked,
        }),
      }
    )
  )
);

// Helper function to decode JWT token
function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const tokenData = JSON.parse(jsonPayload);
    return {
      username: tokenData.unique_name,
      role:
        tokenData.role === "Patient"
          ? "patient"
          : tokenData.role?.toLowerCase(),
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export default useAuthStore;
