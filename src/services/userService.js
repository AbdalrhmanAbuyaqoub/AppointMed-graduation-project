import axios from "axios";
import { getToken, clearToken } from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn(
    "API_URL is not defined in environment variables. Please check your .env file."
  );
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      // Optionally redirect to login or show session expired message
    }
    return Promise.reject(error);
  }
);

/**
 * @typedef {Object} Patient
 * @property {string} id - The patient's ID
 * @property {string} fullName - The patient's full name
 * @property {string} email - The patient's email address
 * @property {string|null} phoneNumber - The patient's phone number (can be null)
 * @property {string} address - The patient's address
 * @property {boolean} isBanned - Whether the patient is banned
 */

export const userService = {
  /**
   * Send verification code to user's email
   * @param {string} email - The user's email address
   * @returns {Promise<any>}
   */
  sendVerificationCode: async (email) => {
    try {
      const response = await api.post("/Users/send-verification-code", {
        email: email,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending verification code:", error);
      throw new Error(
        error.response?.data?.message || "Failed to send verification code"
      );
    }
  },

  /**
   * Verify email with code
   * @param {string} email - The user's email address
   * @param {string} code - The verification code
   * @returns {Promise<any>}
   */
  verifyCode: async (email, code) => {
    try {
      const response = await api.post("/Users/verify-code", {
        email: email,
        code: code,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying code:", error);
      throw new Error(error.response?.data?.message || "Failed to verify code");
    }
  },

  /**
   * Get all patients from the API
   * @returns {Promise<Patient[]>}
   */
  getPatients: async () => {
    try {
      const response = await api.get("/Users/get-ALL-patients");

      // The API returns data in the format:
      // {
      //   "statusCode": 200,
      //   "isSuccess": true,
      //   "messages": "Successfully",
      //   "result": [
      //     {
      //       "id": "04d14f5e-b2a5-4e8d-83af-5a701f8814d3",
      //       "fullName": "test test",
      //       "email": "newtest@example.com",
      //       "phoneNumber": null,
      //       "address": "test",
      //       "isBanned": true
      //     }
      //   ]
      // }

      if (response.data.isSuccess && Array.isArray(response.data.result)) {
        return response.data.result;
      }

      // If the response format is unexpected, return empty array
      console.warn(
        "Unexpected response format from get-patients:",
        response.data
      );
      return [];
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch patients"
      );
    }
  },

  /**
   * Ban a patient by ID
   * @param {string} userId - The patient's ID
   * @returns {Promise<any>}
   */
  banPatient: async (userId) => {
    try {
      const response = await api.post(`/Users/ban/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error banning patient:", error);
      throw new Error(error.response?.data?.message || "Failed to ban patient");
    }
  },

  /**
   * Unban a patient by ID
   * @param {string} userId - The patient's ID
   * @returns {Promise<any>}
   */
  unbanPatient: async (userId) => {
    try {
      const response = await api.post(`/Users/unban/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error unbanning patient:", error);
      throw new Error(
        error.response?.data?.message || "Failed to unban patient"
      );
    }
  },

  /**
   * Get reset token for password reset
   * @param {string} email - User's email address
   * @returns {Promise<string>} Reset token
   */
  getResetToken: async (email) => {
    try {
      console.log("Getting reset token for email:", email);
      const response = await api.post(
        "/Users/reset-token",
        JSON.stringify(email)
      );
      console.log("Reset token response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting reset token:", error);
      console.error("Error response data:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to get reset token"
      );
    }
  },

  /**
   * Reset user password
   * @param {Object} passwordData - Password reset data
   * @param {string} passwordData.email - User's email
   * @param {string} passwordData.oldPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @param {string} passwordData.confirmNewPassword - Confirm new password
   * @param {string} passwordData.Token - Reset token from reset-token API
   * @returns {Promise<any>}
   */
  resetPassword: async (passwordData) => {
    try {
      console.log("Reset Password Request Body:", passwordData);
      const response = await api.post("/Users/ResetPassword", passwordData);
      console.log("Reset Password Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Full error response:", error.response);
      if (error.response?.data?.errors) {
        console.error("API validation errors:", error.response.data.errors);
      }
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.messages ||
          (error.response?.data?.errors?.length > 0
            ? error.response.data.errors.join(", ")
            : "Failed to reset password")
      );
    }
  },

  /**
   * Delete user account
   * @param {string} email - User's email
   * @param {string} id - User's ID
   * @returns {Promise<any>}
   */
  deleteAccount: async (email, id) => {
    try {
      console.log("Delete Account Request - Email:", email, "ID:", id);
      const response = await api.delete(
        `/Users/delete-user?email=${email}&id=${id}`
      );
      console.log("Delete Account Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting account:", error);
      console.error("Error response data:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to delete account"
      );
    }
  },
};
