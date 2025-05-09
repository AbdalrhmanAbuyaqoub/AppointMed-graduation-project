import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/index";

export const RouteGuard = ({
  children,
  requireAuth = false,
  allowedRoles = [],
}) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Public routes are always accessible
  if (!requireAuth) {
    // Redirect authenticated users to their default route if they try to access public routes
    if (isAuthenticated) {
      return (
        <Navigate
          to={user.role === "admin" ? ROUTES.DASHBOARD : ROUTES.CHAT}
          replace
        />
      );
    }
    return children;
  }

  // Protected routes require authentication
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "admin" ? ROUTES.DASHBOARD : ROUTES.CHAT}
        replace
      />
    );
  }

  return children;
};
