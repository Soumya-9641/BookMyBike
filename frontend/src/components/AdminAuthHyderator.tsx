import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateAdminAuth } from "../features/admin/adminAuthSlice";

const AdminAuthHydrator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminRaw = localStorage.getItem("admin");

    dispatch(
      hydrateAdminAuth({
        adminToken,
        admin: adminRaw ? JSON.parse(adminRaw) : null,
      })
    );
  }, [dispatch]);

  return null;
};

export default AdminAuthHydrator;