// Token Management Constants
const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
};

/**
 * Service for managing JWT tokens including storage, retrieval, and validation
 */

/**
 * Store token in localStorage
 * @param {string} token - JWT token to store
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
};

/**
 * Remove token from localStorage
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Retrieve token from localStorage
 * @returns {string|null} The stored token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
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
