import { lazy } from "react";

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
};

// Lazy-loaded components with better naming
export const LazyComponents = {
  // Public pages
  Landing: lazy(() => import("../pages/Landing")),
  Login: lazy(() => import("../pages/Login")),
  Register: lazy(() => import("../pages/Register")),

  // User pages
  Chat: lazy(() => import("../pages/Chat")),

  // Admin pages
  Dashboard: lazy(() => import("../pages/Dashboard")),
  Appointments: lazy(() => import("../pages/Appointments")),
  Clinics: lazy(() => import("../pages/Clinics")),
  ClinicDetails: lazy(() => import("../pages/ClinicDetails")),
  Doctors: lazy(() => import("../pages/Doctors")),
  DoctorDetails: lazy(() => import("../pages/DoctorDetails")),
  Patients: lazy(() => import("../pages/Patients")),
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
