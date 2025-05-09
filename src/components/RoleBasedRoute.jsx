import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect based on role
    const redirectPath = user.role === "user" ? "/chat" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
