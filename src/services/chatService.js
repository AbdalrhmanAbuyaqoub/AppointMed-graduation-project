import axios from "axios";
import { getToken } from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL_CHATBOT;

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

// Helper function to get user ID from token
const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);
    // console.log("[chatService] Decoded token payload:", decoded); // DEBUG LOG
    return decoded.nameid || decoded.userId || decoded.sub || decoded.id; // use nameid for user ID
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const chatService = {
  /**
   * Send a message and get the response
   * @param {string} message - The message to send
   * @returns {Promise<Object>} The response message
   */
  sendMessage: async (message) => {
    try {
      const userId = getUserIdFromToken();
      const requestBody = {
        user_id: userId || "",
        message: message,
      };
      console.log("[chatService] Sending message:", requestBody);
      const response = await api.post("/chat", requestBody);
      console.log("[chatService] Received response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
};
