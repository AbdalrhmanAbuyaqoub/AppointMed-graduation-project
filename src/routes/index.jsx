// import { lazy } from "react";

// Regular imports instead of lazy loading to avoid GitHub Pages issues
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Chat from "../pages/Chat";
import Dashboard from "../pages/Dashboard";
import Appointments from "../pages/Appointments";
import Clinics from "../pages/Clinics";
import ClinicDetails from "../pages/ClinicDetails";
import Doctors from "../pages/Doctors";
import DoctorDetails from "../pages/DoctorDetails";
import Patients from "../pages/Patients";
import PatientDetails from "../pages/PatientDetails";
import Profile from "../pages/Profile";

// Define all routes in a centralized object
export const ROUTES = {
  // Public routes
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // User routes
  CHAT: "/chat",

  // Admin routes
  DASHBOARD: "/dashboard",
  APPOINTMENTS: "/appointments",
  CLINICS: "/clinics",
  CLINIC_DETAILS: "/clinics/:id",
  DOCTORS: "/doctors",
  DOCTOR_DETAILS: "/doctors/:id",
  PATIENTS: "/patients",
  PATIENT_DETAILS: "/patients/:id",
  PROFILE: "/profile",
};

// Components with regular imports instead of lazy loading
export const LazyComponents = {
  // Public pages
  Landing,
  Login,
  Register,

  // User pages
  Chat,

  // Admin pages
  Dashboard,
  Appointments,
  Clinics,
  ClinicDetails,
  Doctors,
  DoctorDetails,
  Patients,
  PatientDetails,
  Profile,
};

// Get default route based on user role
export const getDefaultRoute = (role) => {
  switch (role?.toLowerCase()) {
    case "patient":
      return ROUTES.CHAT;
    case "admin":
      return ROUTES.DASHBOARD;
    case "doctor":
      return ROUTES.DASHBOARD;
    default:
      return ROUTES.DASHBOARD;
  }
};
