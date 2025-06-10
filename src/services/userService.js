import axios from "axios";

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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * @typedef {Object} Patient
 * @property {string} id - The patient's ID
 * @property {string} username - The patient's username
 * @property {string} role - The patient's role (should be "Patient")
 */

export const userService = {
  /**
   * Get all patients from the API
   * @returns {Promise<Patient[]>}
   */
  getPatients: async () => {
    try {
      const response = await api.get("/Users/get-patients");

      // The API returns data in the format:
      // {
      //   "statusCode": 200,
      //   "isSuccess": true,
      //   "messages": "Successfully",
      //   "result": [...]
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
};
