import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const AdminProtectedRoute = () => {
  const { adminToken, hydrated } = useSelector(
    (state: RootState) => state.adminAuth
  );

  // ⏳ Wait for hydration
  if (!hydrated) {
    return null; // or <Loader />
  }

  // 🔐 Enforce auth
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;