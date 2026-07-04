import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

type ProtectedRouteProps = {
  requireOnboarded?: boolean;
};

const ProtectedRoute = ({ requireOnboarded = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isOnboarded } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireOnboarded && !isOnboarded) {
    return <Navigate to="/verify-profile" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;