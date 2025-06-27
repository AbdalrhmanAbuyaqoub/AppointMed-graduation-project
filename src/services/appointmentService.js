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
 * @property {number} id - The doctor ID
 * @property {string} name - The doctor's full name (from API response)
 * @property {string} email - The doctor's email
 * @property {string} address - The doctor's address
 * @property {string} phoneNumber - The doctor's phone number
 */

/**
 * @typedef {Object} Appointment
 * @property {number} id - The appointment ID
 * @property {string} startDate - The appointment start date and time
 * @property {string} endDate - The appointment end date and time
 * @property {string} notes - Additional notes for the appointment
 * @property {Doctor} doctor - The doctor object with full details
 * @property {string} clinicName - The name of the clinic (may not be present in user appointments)
 * @property {string} patientName - The name of the patient
 * @property {string} patientId - The UUID of the patient (may not be present in user appointments)
 * @property {number} status - The appointment status (0: scheduled, 1: cancelled, 2: completed, 3: no show)
 */

export const appointmentService = {
  /**
   * Get all appointments
   * @returns {Promise<Appointment[]>}
   */
  getAllAppointments: async () => {
    try {
      const response = await api.get(
        "/Appointment/get-all-appointments-with-status"
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  },

  /**
   * Get appointment by ID
   * @param {number} id - The appointment ID
   * @returns {Promise<Appointment>}
   */
  getAppointmentById: async (id) => {
    try {
      const response = await api.get(
        `/Appointment/get-by-id-Appointments/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new appointment
   * @param {Object} data - The appointment data
   * @param {string} data.startDate - Start date and time
   * @param {string} data.endDate - End date and time
   * @param {string} data.notes - Additional notes
   * @param {number} data.doctorId - Doctor ID
   * @param {string} data.userId - User ID
   * @returns {Promise<Appointment>}
   */
  createAppointment: async (data) => {
    try {
      const response = await api.post("/Appointment/create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  /**
   * Create a new appointment with patient information
   * @param {Object} data - The appointment data
   * @param {string} data.firstName - Patient first name
   * @param {string} data.lastName - Patient last name
   * @param {string} data.email - Patient email
   * @param {string} data.phoneNumber - Patient phone number
   * @param {string} data.address - Patient address
   * @param {string} data.startDate - Appointment start date and time
   * @param {string} data.endDate - Appointment end date and time
   * @param {string} data.notes - Additional notes for the appointment
   * @param {number} data.doctorId - Doctor ID
   * @returns {Promise<Object>} - Returns object with: message, appointment (with id, startDate, endDate, notes, doctorId, doctorName, clinicName, userId, patientName), userCreated (boolean), temporaryPassword (string if new user)
   */
  createAppointmentWithPatient: async (data) => {
    try {
      console.log("Sending appointment data:", JSON.stringify(data, null, 2));
      const response = await api.post("/Appointment/create-with-patient", data);
      return response.data;
    } catch (error) {
      console.error("Error creating appointment with patient:", error);
      if (error.response?.data) {
        console.error("Server error response:", error.response.data);
      }
      if (error.response?.status) {
        console.error("HTTP status:", error.response.status);
      }
      throw error;
    }
  },

  /**
   * Update an appointment
   * @param {Object} data - The updated appointment data
   * @param {number} data.id - Appointment ID
   * @param {string} data.newStartDate - New start date and time in ISO format
   * @param {string} data.newEndDate - New end date and time in ISO format
   * @param {string} data.notes - Additional notes
   * @param {number} data.doctorId - Doctor ID
   * @returns {Promise<void>}
   */
  updateAppointment: async (data) => {
    try {
      console.log("🔄 UPDATE APPOINTMENT API CALL");
      console.log("📤 Sending to PUT /Appointment/update:");
      console.log("   Request Body:", JSON.stringify(data, null, 2));

      const response = await api.put(`/Appointment/update`, data);

      console.log("✅ UPDATE APPOINTMENT SUCCESS");
      console.log("📥 Response:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ ERROR UPDATING APPOINTMENT:");
      console.error("   Error object:", error);
      console.error("   Error message:", error.message);
      console.error("   Error response:", error.response?.data);
      console.error("   Error status:", error.response?.status);
      console.error(
        "   Request data that failed:",
        JSON.stringify(data, null, 2)
      );
      throw error;
    }
  },

  /**
   * Delete an appointment
   * @param {number} id - The appointment ID
   * @returns {Promise<void>}
   */
  deleteAppointment: async (id) => {
    try {
      await api.delete(`/Appointment/delete-Appointments/${id}`);
      return;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  },

  /**
   * Get appointments by clinic ID
   * @param {number} clinicId - The clinic ID
   * @returns {Promise<Appointment[]>}
   */
  getAppointmentsByClinic: async (clinicId) => {
    try {
      const response = await api.get(
        `/Appointment/get-Appointments-by-clinic/${clinicId}`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        `Error fetching appointments for clinic ${clinicId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Get appointments by doctor ID
   * @param {number} doctorId - The doctor ID
   * @returns {Promise<Appointment[]>}
   */
  getAppointmentsByDoctor: async (doctorId) => {
    try {
      const response = await api.get(
        `/Appointment/get-Appointments-by-doctor/${doctorId}`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        `Error fetching appointments for doctor ${doctorId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Get appointments by user ID with status
   * @param {string} userId - The user ID
   * @returns {Promise<Appointment[]>}
   */
  getAppointmentsByUser: async (userId) => {
    try {
      const response = await api.get(
        `/Appointment/get-Appointments-by-user-with-status/${userId}`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Error fetching appointments for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Get available doctors
   * @returns {Promise<Doctor[]>}
   */
  getAvailableDoctors: async () => {
    try {
      const response = await api.get("/Appointment/get-available-doctors");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching available doctors:", error);
      throw error;
    }
  },

  /**
   * Get all doctors working hours
   * @returns {Promise<Object[]>} Array of doctor objects with working hours
   */
  getAllDoctorsWorkingHours: async () => {
    try {
      const response = await api.get("/Appointment/all-doctors-working-hours");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching all doctors working hours:", error);
      throw error;
    }
  },

  /**
   * Update appointment status
   * @param {number} appointmentId - The appointment ID
   * @param {number} newStatus - The new status (0: scheduled, 1: cancelled, 2: completed, 3: no show)
   * @returns {Promise<{message: string, newStatus: number}>}
   */
  updateAppointmentStatus: async (appointmentId, newStatus) => {
    try {
      const response = await api.put(
        `/Appointment/update-status/${appointmentId}?newStatus=${newStatus}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get appointment status only
   * @param {number} id - The appointment ID
   * @returns {Promise<{id: number, status: number}>}
   */
  getAppointmentStatus: async (id) => {
    try {
      const response = await api.get(`/Appointment/status-only/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check available time slots for a doctor
   * @param {number} doctorId - The doctor ID
   * @param {Object} data - The time slot data
   * @param {number} data.id - The appointment ID (optional, for updates)
   * @param {string} data.from - Start time in ISO format
   * @param {string} data.to - End time in ISO format
   * @returns {Promise<{isAvailable: boolean, conflictingAppointments?: Object[]}>}
   */
  getAvailableSlots: async (doctorId, data) => {
    try {
      const params = new URLSearchParams();
      if (data.id) params.append("id", data.id);
      params.append("from", data.from);
      params.append("to", data.to);

      const response = await api.get(
        `/Appointment/doctors/${doctorId}/available-slots?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error checking available slots for doctor ${doctorId}:`,
        error
      );
      throw error;
    }
  },
};
