import { lazy } from "react";

// Define all routes in a centralized object
export const ROUTES = {
  // Public routes
  LANDING: "/",
  LOGIN: "/login",

  // User routes
  CHAT: "/chat",

  // Admin routes
  HOME: "/home",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
};

// Lazy-loaded components with better naming
export const LazyComponents = {
  // Public pages
  Landing: lazy(() => import("../pages/Landing")),
  Login: lazy(() => import("../pages/Login")),

  // User pages
  Chat: lazy(() => import("../pages/Chat")),

  // Admin pages
  Home: lazy(() => import("../pages/Home")),
  Dashboard: lazy(() => import("../pages/Dashboard")),
  Settings: lazy(() => import("../pages/Settings")),
};

// Get default route based on user role
export const getDefaultRoute = (role) => {
  switch (role?.toLowerCase()) {
    case "patient":
      return ROUTES.CHAT;
    case "admin":
      return ROUTES.HOME;
    case "doctor":
      return ROUTES.DASHBOARD;
    default:
      return ROUTES.HOME;
  }
};
