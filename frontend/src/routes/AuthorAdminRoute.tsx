import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthOrAdminRoute = () => {
  const userToken = useSelector((state: any) => state.auth.token);
  const adminToken = useSelector((state: any) => state.adminAuth.adminToken);

  if (!userToken && !adminToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthOrAdminRoute;