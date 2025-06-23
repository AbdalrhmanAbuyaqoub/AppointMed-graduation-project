import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { authService } from "../services/authService";
import { isRememberedSession } from "../services/tokenService";

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
        hasHydrated: false,

        // Set hydration state
        setHasHydrated: (hasHydrated) => set({ hasHydrated }),

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
          const currentState = get();

          // Wait for hydration to complete before proceeding
          if (!currentState.hasHydrated) {
            return false;
          }

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

            // Get persisted user data from store
            const user = currentState.user;

            // If we have a valid token but no user data, we need to fetch it
            if (!user) {
              set({
                user: null,
                isAuthenticated: false,
                sessionChecked: true,
                isLoading: false,
              });
              return false;
            }

            set({
              user,
              isAuthenticated: !!user,
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
              return { success: false, error: response.error };
            }

            // After successful registration, automatically login
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
              return { success: false, error: loginResult.error };
            }

            return { success: true, user: loginResult.user };
          } catch (error) {
            set({
              error: error.message,
              isLoading: false,
              sessionChecked: true,
            });
            return { success: false, error: error.message };
          }
        },

        // Forgot Password
        forgotPassword: async (email) => {
          set({ isLoading: true, error: null });

          try {
            const response = await authService.forgotPassword(email);

            if (!response.success) {
              set({ error: response.error, isLoading: false });
              return { success: false, error: response.error };
            }

            set({ isLoading: false, error: null });
            return { success: true, message: response.message };
          } catch (error) {
            set({
              error: error.message,
              isLoading: false,
            });
            return { success: false, error: error.message };
          }
        },

        // Send verification code
        sendVerificationCode: async (email) => {
          set({ isLoading: true, error: null });

          try {
            const response = await authService.sendVerificationCode(email);

            if (!response.success) {
              set({ error: response.error, isLoading: false });
              return { success: false, error: response.error };
            }

            set({ isLoading: false, error: null });
            return { success: true, message: response.message };
          } catch (error) {
            set({
              error: error.message,
              isLoading: false,
            });
            return { success: false, error: error.message };
          }
        },

        // Verify code
        verifyCode: async (email, code) => {
          set({ isLoading: true, error: null });

          try {
            const response = await authService.verifyCode(email, code);

            if (!response.success) {
              set({ error: response.error, isLoading: false });
              return { success: false, error: response.error };
            }

            set({ isLoading: false, error: null });
            return { success: true, message: response.message };
          } catch (error) {
            set({
              error: error.message,
              isLoading: false,
            });
            return { success: false, error: error.message };
          }
        },

        // Logout user
        logout: async () => {
          set({ isLoading: true, error: null });

          try {
            await authService.logout();

            // Reset to initial state but keep sessionChecked true and don't reset hasHydrated
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              sessionChecked: true,
              // Keep hasHydrated as is
            });

            return true;
          } catch (error) {
            console.error("Logout failed:", error);

            // Even if API fails, clear sensitive data
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: `Logout failed: ${error.message}`,
              sessionChecked: true,
              // Keep hasHydrated as is
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
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            sessionChecked: true,
            // Keep hasHydrated as is
          });
        },
      }),
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          sessionChecked: state.sessionChecked,
          // Don't persist hasHydrated - it should reset to false on each page load
        }),
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            console.error("An error happened during hydration", error);
          } else {
            if (state) {
              state.setHasHydrated(true);
            }
          }
        },
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

    // Extract basic information from token
    // Note: Full user data (firstName, lastName, address, phoneNumber)
    // comes from the login response, not from the token
    return {
      username: tokenData.unique_name,
      role:
        tokenData.role === "Patient"
          ? "patient"
          : tokenData.role?.toLowerCase(),
      // Add any other fields that are actually in the token
      userId:
        tokenData.nameid || tokenData.userId || tokenData.sub || tokenData.id,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export default useAuthStore;
