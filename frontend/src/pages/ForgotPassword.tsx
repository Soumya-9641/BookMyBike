import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useForgotPasswordMutation } from "../services/authApi";
import { Link as RouterLink } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [forgotPassword, { isLoading }] =
    useForgotPasswordMutation();

  /* ---------- Email Validation ---------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const handleSubmit = async () => {
    if (!isEmailValid) return;

    try {
      const res = await forgotPassword({ email }).unwrap();
      setDialogMessage(res.message);
      setIsSuccess(true);
      setDialogOpen(true);
      setEmail("");
    } catch (err: any) {
      setDialogMessage(
        err?.data?.message || "Something went wrong"
      );
      setIsSuccess(false);
      setDialogOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 160px)",
        background:
          "radial-gradient(circle at center, #a8e6c2 0%, #c9f3dc 40%, #2faa54 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
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
          Forgot Password
        </Typography>

        <Stack spacing={2.5}>
          <Typography fontSize={14}>
            Enter your email address and we’ll send you a password
            reset link.
          </Typography>

          <TextField
            fullWidth
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email.length > 0 && !isEmailValid}
            helperText={
              email.length > 0 && !isEmailValid
                ? "Please enter a valid email"
                : " "
            }
          />

          <Button
            fullWidth
            disabled={!isEmailValid || isLoading}
            sx={{
              bgcolor: "#1fa64b",
              color: "#fff",
              fontWeight: 600,
              py: 1.2,
              "&:hover": { bgcolor: "#188f40" },
            }}
            onClick={handleSubmit}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>

          <Button
            component={RouterLink}
            to="/login"
            sx={{ fontWeight: 600 }}
          >
            Back to Login
          </Button>
        </Stack>
      </Box>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
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
            onClick={() => setDialogOpen(false)}
            sx={{
              bgcolor: isSuccess ? "#22a652" : "error.main",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForgotPassword;
