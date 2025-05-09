import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/index";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user, isAuthenticated, isSessionExpired, logout } = useAuth();

  useEffect(() => {
    // Only check for session expiration if the user is authenticated
    if (isAuthenticated && isSessionExpired()) {
      notifications.show({
        title: "Session Expired",
        message: "Your session has expired. Please log in again.",
        color: "yellow",
      });
      logout();
    }
  }, [isSessionExpired, logout, isAuthenticated]);

  // Handle loading state
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Handle unauthorized users
  if (!allowedRoles.includes(user.role)) {
    notifications.show({
      title: "Access Denied",
      message: "You don't have permission to access this page",
      color: "red",
    });
    const defaultRoute = user.role === "admin" ? ROUTES.DASHBOARD : ROUTES.CHAT;
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
};
