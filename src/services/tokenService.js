// Token Management Constants
const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REMEMBER_ME: "remember_me",
};

/**
 * Service for managing JWT tokens including storage, retrieval, and validation
 * Supports both persistent (localStorage) and session-only (sessionStorage) storage
 */

/**
 * Store token with appropriate storage strategy
 * @param {string} token - JWT token to store
 * @param {boolean} rememberMe - Whether to use persistent storage
 */
export const setToken = (token, rememberMe = false) => {
  if (rememberMe) {
    // Persistent storage - survives browser restart
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(TOKEN_KEYS.REMEMBER_ME, "true");
  } else {
    // Session storage - cleared when browser closes
    sessionStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
    // Clear any existing persistent storage
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REMEMBER_ME);
  }
};

/**
 * Remove token from both storage types
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REMEMBER_ME);
  sessionStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Retrieve token from storage (checks both localStorage and sessionStorage)
 * @returns {string|null} The stored token or null if not found
 */
export const getToken = () => {
  // First check localStorage (persistent)
  const persistentToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  if (persistentToken) {
    return persistentToken;
  }

  // Then check sessionStorage (temporary)
  return sessionStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Validate token expiration and format
 * @param {string} token - JWT token to validate
 * @returns {boolean} Whether the token is valid and not expired
 */
export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

/**
 * Check if current stored token is valid
 * @returns {boolean}
 */
export const hasValidToken = () => {
  const token = getToken();
  return isTokenValid(token);
};

/**
 * Get authorization header value
 * @returns {string|null} Bearer token string or null if no valid token
 */
export const getAuthHeader = () => {
  const token = getToken();
  return token ? `Bearer ${token}` : null;
};

/**
 * Check if the current session was created with "Remember Me"
 * @returns {boolean}
 */
export const isRememberedSession = () => {
  return localStorage.getItem(TOKEN_KEYS.REMEMBER_ME) === "true";
};
