import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../services/authApi";
import { useState } from "react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();

  const [resetPassword, { isLoading }] =
    useResetPasswordMutation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFormValid =
    password.length >= 6 && password === confirmPassword;

  const handleReset = async () => {
    if (!token || !isFormValid) return;

    try {
      const res = await resetPassword({
        token,
        password,
      }).unwrap();

      toast.success(res.message);
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Reset failed"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: 420,
          bgcolor: "#fff",
          p: 4,
          borderRadius: 1,
          boxShadow: "0px 8px 30px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={3}>
          Reset Password
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Minimum 6 characters"
          />

          <TextField
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            error={
              confirmPassword.length > 0 &&
              password !== confirmPassword
            }
            helperText={
              confirmPassword.length > 0 &&
                password !== confirmPassword
                ? "Passwords do not match"
                : " "
            }
          />

          <Button
            variant="contained"
            disabled={!isFormValid || isLoading}
            onClick={handleReset}
            sx={{
              bgcolor: "#1fa64b",
              fontWeight: 600,
              py: 1.2,
              "&:hover": { bgcolor: "#188f40" },
            }}
          >
            {isLoading ? "Resetting..." : "RESET PASSWORD"}
          </Button>
        </Stack>
      </Box>

      {/* Dialog */}
      {/* <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: isSuccess ? "#22a652" : "error.main",
          }}
        >
          {isSuccess ? "Success" : "Error"}
        </DialogTitle>

        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={handleDialogClose}
            sx={{
              bgcolor: isSuccess ? "#22a652" : "error.main",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default ResetPassword;
