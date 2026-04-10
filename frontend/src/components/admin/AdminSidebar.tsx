import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const links = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Users", path: "/admin/users" },
  // { label: "Listings", path: "/admin/listings" },
  // { label: "Bookings", path: "/admin/bookings" },
  // { label: "Payments", path: "/admin/payments" },
  { label: "Disputes", path: "/admin/disputes" },
];

const AdminSidebar = () => {
  return (
    <Box width={240} bgcolor="#22a652" color="#fff" p={2}>
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
               bgcolor: "#22a652",
                color: "#fff",
              },
            }}
          >
            <ListItemText primary={l.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default AdminSidebar;