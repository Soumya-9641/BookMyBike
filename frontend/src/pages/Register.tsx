import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useSignupMutation } from "../services/authApi";
import { useState } from "react";

const Register = () => {
  const [signup, { isLoading }] = useSignupMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  /* ---------- Email Validation ---------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email);
  const showEmailError =
    formData.email.length > 0 && !isEmailValid;

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.phone.trim() &&
    formData.password.trim() &&
    isEmailValid;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      const res = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      setDialogMessage(res.message || "Registration successful");
      setIsSuccess(true);
      setDialogOpen(true);
    } catch (err: any) {
      setDialogMessage(
        err?.data?.message || "Registration failed"
      );
      setIsSuccess(false);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);

    if (isSuccess) {
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      });
    }
  };

  return (
    <Box>
      {/* ================= Breadcrumb ================= */}
      <Box maxWidth="lg" mx="auto" px={2} mt={3}>
        <Typography variant="body2" color="text.secondary">
          Home &nbsp;›&nbsp;
          <Box component="span" color="#22a652">
            Sign Up
          </Box>
        </Typography>
      </Box>

      {/* ================= Page Header ================= */}
      <Box maxWidth="lg" mx="auto" px={2} mt={2}>
        <Typography variant="h5" fontWeight={700} color="#22a652">
          Create Your Account
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Register to rent bikes or list your own bikes for others.
        </Typography>
      </Box>

      {/* ================= FORM ================= */}
      <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 4 },
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <Typography fontWeight={700} mb={3}>
            Registration Details
          </Typography>

          <Stack spacing={2}>
            {/* Name Fields */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="First Name *"
                fullWidth
                value={formData.firstName}
                onChange={handleChange("firstName")}
              />

              <TextField
                label="Middle Name"
                fullWidth
                value={formData.middleName}
                onChange={handleChange("middleName")}
              />
            </Stack>

            <TextField
              label="Last Name *"
              fullWidth
              value={formData.lastName}
              onChange={handleChange("lastName")}
            />

            {/* Contact */}
            <TextField
              label="Email Address *"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange("email")}
              error={showEmailError}
              helperText={
                showEmailError
                  ? "Please enter a valid email address"
                  : " "
              }
            />

            <TextField
              label="Phone Number *"
              type="tel"
              fullWidth
              value={formData.phone}
              onChange={handleChange("phone")}
            />

            {/* Password */}
            <TextField
              label="Password *"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange("password")}
            />

            {/* Submit */}
            <Button
              variant="contained"
              size="large"
              disabled={!isFormValid || isLoading}
              sx={{
                mt: 2,
                bgcolor: "#22a652",
                "&:hover": { bgcolor: "#1e8e4a" },
                "&.Mui-disabled": {
                  bgcolor: "#cdebd9",
                  color: "#fff",
                },
              }}
              onClick={handleSubmit}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>

            {/* Login Link */}
            <Typography variant="body2" textAlign="center" mt={1}>
              Already have an account?{" "}
              <Box
                component={RouterLink}
                to="/login"
                sx={{
                  color: "#22a652",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign In
              </Box>
            </Typography>
          </Stack>
        </Paper>
      </Box>

      {/* ================= Dialog ================= */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
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
              "&:hover": {
                bgcolor: isSuccess ? "#1e8e4a" : "error.dark",
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Register;
