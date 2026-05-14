import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";


const AdminLayout = () => {
  return (
    <Box display="flex" minHeight="100vh">
      <AdminSidebar />
      <Box flex={1} p={3} bgcolor="#f9fafb">
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;