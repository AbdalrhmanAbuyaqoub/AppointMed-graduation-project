import axios from "axios";

// Temporary hardcoded URL for testing
const API_URL = "http://localhost:3000/api"; // Replace with your actual API URL

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await authApi.post("/auth/refresh-token", {
            refreshToken,
          });
          const { token } = response.data;

          localStorage.setItem("token", token);
          authApi.defaults.headers.Authorization = `Bearer ${token}`;

          // Retry the original request
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, logout user
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    try {
      const response = await authApi.post("/auth/login", { email, password });
      const { user, token, refreshToken } = response.data;

      // Store tokens
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }
  },

  async register(userData) {
    try {
      const response = await authApi.post("/auth/register", userData);
      const { user, token, refreshToken } = response.data;

      // Store tokens
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      throw new Error(message);
    }
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      // Only make the API call if we have a refresh token
      if (refreshToken) {
        try {
          await authApi.post("/auth/logout", { refreshToken });
        } catch (error) {
          console.warn("Failed to logout from server:", error);
          // Continue with local logout even if server logout fails
        }
      }
    } finally {
      // Always clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  },

  async validateToken() {
    try {
      const response = await authApi.get("/auth/validate");
      return response.data.valid;
    } catch {
      return false;
    }
  },

  async getUserProfile() {
    const response = await authApi.get("/auth/profile");
    return response.data;
  },
};
