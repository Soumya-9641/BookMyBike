import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../features/admin/adminAuthSlice";

const links = [
 { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Users", path: "/admin/users" },
  { label: "Bookings", path: "/admin/bookings" },
  { label: "Listings", path: "/admin/listings" },
  { label: "Disputes", path: "/admin/disputes" },
  { label: "Revenue Audit", path: "/admin/audit" },
];

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login", { replace: true });
  };

  return (
    <Box
      width={240}
      minHeight="100vh"
      bgcolor="#22a652"
      color="#fff"
      p={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      {/* TOP */}
      <Box>
        <Typography fontWeight={700} mb={2}>
          Admin Panel
        </Typography>

        <List>
          {links.map((l) => (
            <ListItemButton
              key={l.path}
              component={NavLink}
              to={l.path}
              sx={{
                color: "#d1d5db",
                "&.active": {
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                },
              }}
            >
              <ListItemText primary={l.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* BOTTOM ACTIONS */}
      <Box>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 1 }} />

        <List>
          <ListItemButton
            component={NavLink}
            to="/admin/change-password"
            sx={{
              color: "#d1d5db",
              "&.active": { color: "#fff" },
            }}
          >
            <ListItemText primary="Change Password" />
          </ListItemButton>

          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: "#fca5a5",
              "&:hover": {
                bgcolor: "rgba(255,0,0,0.15)",
              },
            }}
          >
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
};

export default AdminSidebar;