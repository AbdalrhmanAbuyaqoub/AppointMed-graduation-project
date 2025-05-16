import { Navigate, useLocation } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import useAuthStore from "../store/useAuthStore";
import { ROUTES } from "./index";

export const RouteGuard = memo(
  ({
    children,
    requireAuth = false,
    allowedRoles = [],
    redirectPath, // Optional custom redirect path
  }) => {
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const { user, isAuthenticated, checkSession } = useAuthStore();
    const sessionChecked = useAuthStore((state) => state.sessionChecked);

    useEffect(() => {
      const validateSession = async () => {
        if (!sessionChecked) {
          await checkSession();
        }
        setIsChecking(false);
      };

      validateSession();
    }, [checkSession, sessionChecked]);

    // Show loading state while checking session
    if (isChecking) {
      return <LoadingOverlay visible={true} />;
    }

    // Handle public routes (like login)
    if (!requireAuth) {
      if (isAuthenticated) {
        // Get default route based on user role
        const defaultRoute = getDefaultRouteForRole(user?.role);
        return <Navigate to={defaultRoute} replace />;
      }
      return children;
    }

    // Handle authentication check
    if (!isAuthenticated) {
      return (
        <Navigate
          to={ROUTES.LOGIN}
          state={{ from: location.pathname }}
          replace
        />
      );
    }

    // Handle role-based access
    if (allowedRoles.length > 0) {
      const userRole = user?.role?.toLowerCase();
      const hasAccess = allowedRoles.some(
        (role) => role.toLowerCase() === userRole
      );

      if (!hasAccess) {
        // Use custom redirectPath if provided, otherwise use default route
        const redirectTo = redirectPath || getDefaultRouteForRole(userRole);
        return <Navigate to={redirectTo} replace />;
      }
    }

    return children;
  }
);

// Helper function to determine default route based on role
const getDefaultRouteForRole = (role) => {
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

RouteGuard.displayName = "RouteGuard";
