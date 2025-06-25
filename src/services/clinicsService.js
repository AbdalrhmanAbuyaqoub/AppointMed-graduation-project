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
 * @typedef {Object} Doctor
 * @property {number} id - The doctor's ID
 * @property {string} name - The doctor's full name (from API response)
 * @property {string} email - The doctor's email
 * @property {string} address - The doctor's address
 * @property {string} phoneNumber - The doctor's phone number
 * @property {number} clinicId - The clinic ID the doctor belongs to
 * @property {string} clinicName - The clinic name
 */

/**
 * @typedef {Object} Clinic
 * @property {number} id - The clinic's ID
 * @property {string} name - The clinic's name
 * @property {Doctor[]} doctors - Array of doctors in the clinic
 */

export const clinicsService = {
  /**
   * Get all clinics
   * @returns {Promise<Clinic[]>}
   */
  getAllClinics: async () => {
    try {
      const response = await api.get("/Clinic/get-all");
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching clinics:", error);
      // Return empty array on error to maintain consistent return type
      return [];
    }
  },

  /**
   * Get clinic by ID
   * @param {number} id - The clinic ID
   * @returns {Promise<Clinic>}
   */
  getClinicById: async (id) => {
    try {
      const response = await api.get(`/Clinic/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching clinic ${id}:`, error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch clinic"
      );
    }
  },

  /**
   * Get doctors by clinic ID
   * @param {number} clinicId - The clinic ID
   * @returns {Promise<Doctor[]>}
   */
  getDoctors: async (clinicId) => {
    try {
      const response = await api.get(`/Clinic/get-doctors/${clinicId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Error fetching doctors for clinic ${clinicId}:`, error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  },

  /**
   * Create a new clinic
   * @param {Object} data
   * @param {string} data.name - The name of the clinic
   * @returns {Promise<Clinic>}
   */
  createClinic: async (data) => {
    try {
      const response = await api.post("/Clinic/create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating clinic:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create clinic"
      );
    }
  },

  /**
   * Update a clinic
   * @param {Object} data
   * @param {number} data.id - The clinic ID
   * @param {string} data.name - The new name for the clinic
   * @returns {Promise<void>}
   */
  updateClinic: async (data) => {
    try {
      await api.put("/Clinic/update", data);
      // Handle 204 response (no content)
      return;
    } catch (error) {
      console.error("Error updating clinic:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update clinic"
      );
    }
  },

  /**
   * Add a doctor to a clinic
   * @param {Object} data
   * @param {number} data.clinicId - The ID of the clinic
   * @param {string} data.firstName - The first name of the doctor
   * @param {string} data.lastName - The last name of the doctor
   * @param {string} data.email - The email of the doctor
   * @param {string} data.address - The address of the doctor
   * @param {string} data.phoneNumber - The phone number of the doctor
   * @returns {Promise<Object>}
   */
  addDoctor: async (data) => {
    try {
      const response = await api.post("/Clinic/add-doctor", data);
      return response.data;
    } catch (error) {
      console.error("Error adding doctor:", error);
      throw new Error(error.response?.data?.message || "Failed to add doctor");
    }
  },

  // Delete a clinic
  deleteClinic: async (id) => {
    try {
      await api.delete(`/Clinic/delete/${id}`);
      // Return void since it's a 204 response
      return;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete clinic"
      );
    }
  },

  /**
   * Update a doctor's information
   * @param {Object} data
   * @param {number} data.id - The doctor ID
   * @param {string} data.firstName - The doctor's first name
   * @param {string} data.lastName - The doctor's last name
   * @param {string} data.email - The doctor's email
   * @param {string} data.address - The doctor's address
   * @param {string} data.phoneNumber - The doctor's phone number
   * @returns {Promise<void>}
   */
  updateDoctor: async (data) => {
    try {
      await api.put("/Clinic/update-doctor", data);
      return;
    } catch (error) {
      console.error("Error updating doctor:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update doctor"
      );
    }
  },

  /**
   * Delete a doctor
   * @param {number} id - The doctor ID
   * @returns {Promise<void>}
   */
  deleteDoctor: async (id) => {
    try {
      await api.delete(`/Clinic/delete-doctor/${id}`);
      return;
    } catch (error) {
      console.error("Error deleting doctor:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete doctor"
      );
    }
  },

  /**
   * Update working hours for a doctor
   * @param {Object[]} workingHours - Array of working hours
   * @param {number} workingHours[].doctorId - The doctor ID
   * @param {number} workingHours[].dayOfWeek - Day of the week (0-6, where 0 is Sunday)
   * @param {Object} workingHours[].startTime - Start time object
   * @param {number} workingHours[].startTime.ticks - Start time in ticks
   * @param {Object} workingHours[].endTime - End time object
   * @param {number} workingHours[].endTime.ticks - End time in ticks
   * @returns {Promise<void>}
   */
  updateDoctorWorkingHours: async (workingHours) => {
    try {
      // Log the request payload
      console.log(
        "Updating working hours with payload:",
        JSON.stringify(workingHours)
      );

      const response = await api.put(
        "/Clinic/update-working-hours-doctor",
        workingHours
      );

      // Log the response
      console.log("Server response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error updating doctor working hours:", error);
      if (error.response) {
        console.error("Server error response:", error.response.data);
      }
      throw new Error(
        error.response?.data?.message || "Failed to update working hours"
      );
    }
  },

  /**
   * Add working hours for a doctor (create new)
   * @param {Object[]} workingHours - Array of working hours
   * @param {number} workingHours[].doctorId - The doctor ID
   * @param {number} workingHours[].dayOfWeek - Day of the week (0-6, where 0 is Sunday)
   * @param {Object} workingHours[].startTime - Start time object
   * @param {number} workingHours[].startTime.ticks - Start time in ticks
   * @param {Object} workingHours[].endTime - End time object
   * @param {number} workingHours[].endTime.ticks - End time in ticks
   * @returns {Promise<void>}
   */
  createDoctorWorkingHours: async (workingHours) => {
    try {
      // Log the request payload
      console.log(
        "Adding working hours with payload:",
        JSON.stringify(workingHours)
      );

      const response = await api.post(
        "/Clinic/add-working-hours-doctor",
        workingHours
      );

      // Log the response
      console.log("Server response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error adding doctor working hours:", error);
      if (error.response) {
        console.error("Server error response:", error.response.data);
      }
      throw new Error(
        error.response?.data?.message || "Failed to add working hours"
      );
    }
  },
};
