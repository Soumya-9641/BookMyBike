import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useChangePasswordMutation } from "../services/authApi";
import { toast } from "react-hot-toast";
import AccountTabs from "../components/AccountTabs";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changePassword, { isLoading }] =
    useChangePasswordMutation();

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      toast.success(res.message || "Password changed successfully");

      // reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
      <AccountTabs />
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Change Password
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
          />

          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />

          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Update Password"
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ChangePassword;