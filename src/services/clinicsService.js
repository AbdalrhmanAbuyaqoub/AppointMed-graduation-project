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
 * @typedef {Object} Doctor
 * @property {number} id - The doctor's ID
 * @property {string} name - The name of the doctor
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
   * @param {string} data.name - The name of the doctor
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
   * @param {string} data.name - The doctor's name
   * @param {string} data.email - The doctor's email
   * @param {string} data.phoneNumber - The doctor's phone number
   * @returns {Promise<void>}
   */
  updateDoctor: async (data) => {
    try {
      await api.put(`/Clinic/update-doctor/${data.id}`, data);
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
};
