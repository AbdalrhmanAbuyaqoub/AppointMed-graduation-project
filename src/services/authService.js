import axios from "axios";
import {
  setToken,
  clearToken,
  getToken,
  hasValidToken,
  getAuthHeader,
} from "./tokenService";

// API Configuration
const API_URL = import.meta.env.VITE_API_URL;

// API Endpoints
const ENDPOINTS = {
  LOGIN: "/Users/login",
  REGISTER: "/Users/register",
  LOGOUT: "/Users/logout",
  FORGOT_PASSWORD: "/Users/Forgot Your Password",
};

// Store user data in memory (cleared on page refresh)
let currentUserData = null;

// Error Messages
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error occurred. Please check your connection.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  EMAIL_EXISTS: "Email already exists",
  USER_NOT_FOUND: "User not found",
  WEAK_PASSWORD: "Password is too weak",
  FORGOT_PASSWORD_SUCCESS:
    "A new password has been sent to your email address.",
};

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
authApi.interceptors.request.use(
  (config) => {
    // Skip token for login, register, and forgot password
    if (
      [ENDPOINTS.LOGIN, ENDPOINTS.REGISTER, ENDPOINTS.FORGOT_PASSWORD].includes(
        config.url
      )
    ) {
      return config;
    }

    const authHeader = getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Intercepts all responses to handle authentication errors
 * Automatically clears token on 401 Unauthorized responses
 */
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      clearToken();
      // Optionally redirect to login page or show session expired message
    }
    return Promise.reject(error);
  }
);

/**
 * Handles API error responses and standardizes error messages
 * Converts network/server errors into user-friendly messages
 */
const handleApiError = (error) => {
  if (!error.response) {
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }

  const message = error.response?.data?.message || ERROR_MESSAGES.SERVER_ERROR;
  throw new Error(message);
};

export const authService = {
  /**
   * Authenticates user with email/password
   * Stores JWT token and user data on successful login
   * @param {Object} userData - Contains email and password
   * @returns {Promise<{success: boolean, user: Object}>}
   */
  async login(userData) {
    try {
      console.log("Attempting login with:", userData.email);

      const loginData = {
        email: userData.email,
        password: userData.password,
      };

      const response = await authApi.post(ENDPOINTS.LOGIN, loginData);
      console.log("Login response:", response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        console.error("Invalid response format:", response.data);
        return { success: false, error: "Invalid response from server" };
      }

      // Store token
      setToken(token);

      // User object now contains all necessary fields including role
      const normalizedUser = {
        ...user,
        // Ensure lastname is normalized to lastName for consistency
        lastName: user.lastname || user.lastName,
      };

      // Remove the old lastname field if it exists
      if (normalizedUser.lastname) {
        delete normalizedUser.lastname;
      }

      // Store user data for later use
      currentUserData = normalizedUser;

      return { success: true, user: normalizedUser };
    } catch (error) {
      console.error("Login error details:", error.response || error);

      if (error.response?.status === 401) {
        return { success: false, error: ERROR_MESSAGES.INVALID_CREDENTIALS };
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        ERROR_MESSAGES.SERVER_ERROR;
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Creates new user account
   * Handles validation and duplicate email checking
   * @param {Object} userData - User registration details
   * @returns {Promise<{success: boolean, user: Object}>}
   */
  async register(userData) {
    try {
      console.log("Registering with data:", userData);

      const registerData = {
        email: userData.email,
        fname: userData.firstName,
        lname: userData.lastName,
        password: userData.password,
        conffirmPassword: userData.confirmPassword, // Note: API expects this typo
        address: userData.address,
        phoneNumber: userData.phoneNumber || "", // Default to empty string if not provided
        role: "patient", // Default role for registration
      };

      const response = await authApi.post(ENDPOINTS.REGISTER, registerData);
      console.log("Register response:", response.data);

      const { statusCode, isSuccess, messages, result } = response.data;

      if (!isSuccess || !result) {
        console.error("Registration failed:", messages);
        return {
          success: false,
          error: messages || ERROR_MESSAGES.REGISTRATION_FAILED,
        };
      }

      // Normalize the user data from registration response
      const normalizedUser = {
        ...result,
        // Ensure lastname is normalized to lastName for consistency
        lastName: result.lastname || result.lastName,
      };

      // Remove the old lastname field if it exists
      if (normalizedUser.lastname) {
        delete normalizedUser.lastname;
      }

      // After successful registration, automatically login
      const loginResult = await this.login({
        email: userData.email,
        password: userData.password,
      });

      if (!loginResult.success) {
        console.warn(
          "Auto-login after registration failed:",
          loginResult.error
        );
        return {
          success: true,
          user: normalizedUser,
          message:
            "Registration successful but auto-login failed. Please login manually.",
        };
      }

      return loginResult;
    } catch (error) {
      console.error("Registration error details:", error.response || error);

      if (error.response?.status === 409) {
        return { success: false, error: ERROR_MESSAGES.EMAIL_EXISTS };
      }

      const errorMessage =
        error.response?.data?.messages ||
        error.response?.data?.message ||
        error.message ||
        ERROR_MESSAGES.REGISTRATION_FAILED;
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Logs out user from both client and server
   * Clears stored token regardless of server response
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await authApi.get(ENDPOINTS.LOGOUT);
      console.log("Logout successful");
    } catch (error) {
      console.warn("Logout from server failed:", error);
    } finally {
      clearToken();
    }
  },

  /**
   * Checks if user has valid authentication token
   * @returns {boolean}
   */
  isAuthenticated() {
    return hasValidToken();
  },

  /**
   * Retrieves stored authentication token
   * @returns {string|null}
   */
  getStoredToken() {
    return getToken();
  },

  /**
   * Validates current session token
   * @returns {Promise<boolean>}
   */
  async validateSession() {
    return hasValidToken();
  },

  /**
   * Sends forgot password request to server
   * Server will send an email with a new password to the user
   * @param {string} email - User's email address
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async forgotPassword(email) {
    try {
      console.log("Attempting forgot password for:", email);

      const forgotPasswordData = {
        email: email,
      };

      const response = await authApi.post(
        ENDPOINTS.FORGOT_PASSWORD,
        forgotPasswordData
      );
      console.log("Forgot password response:", response.data);

      return {
        success: true,
        message: ERROR_MESSAGES.FORGOT_PASSWORD_SUCCESS,
      };
    } catch (error) {
      console.error("Forgot password error details:", error.response || error);

      if (error.response?.status === 404) {
        return { success: false, error: ERROR_MESSAGES.USER_NOT_FOUND };
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        ERROR_MESSAGES.SERVER_ERROR;
      return { success: false, error: errorMessage };
    }
  },
};
