import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useChangeAdminPasswordMutation } from "../../services/adminApi";

const AdminChangePassword = () => {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [changePassword, { isLoading }] =
    useChangeAdminPasswordMutation();

  const handleSubmit = async () => {
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success("Password changed successfully");
      setCurrent("");
      setNew("");
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to change password");
    }
  };

  return (
    <Paper sx={{ maxWidth: 420, p: 3 }}>
      <Typography variant="h6" mb={2}>
        Change Password
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
        />

        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Change Password
        </Button>
      </Box>
    </Paper>
  );
};

export default AdminChangePassword;