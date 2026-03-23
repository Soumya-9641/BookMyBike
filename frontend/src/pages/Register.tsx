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
  MenuItem,
} from "@mui/material";
import { Navigate, Link as RouterLink, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../services/authApi";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../services/authApi";
import { useState } from "react";

const countryCodes = [
  { label: "India (+91)", value: "+91" },
  { label: "Sweden (+46)", value: "+46" },
  { label: "USA (+1)", value: "+1" },
];

const Register = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email);

  const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.phone.trim() &&
    formData.password.trim() &&
    isEmailValid &&
    otpVerified;

  const handleChange =
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value });
      };

  const handleSendOtp = async () => {
    try {
      await sendOtp({ phoneNumber: fullPhoneNumber }).unwrap();
      setOtpSent(true);
      setDialogMessage("OTP sent successfully");
      setIsSuccess(true);
      setDialogOpen(true);
    } catch (err: any) {
      setDialogMessage(err?.data?.message || "Failed to send OTP");
      setIsSuccess(false);
      setDialogOpen(true);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({
        phoneNumber: fullPhoneNumber,
        otp,
      }).unwrap();
      setOtpVerified(true);
      setDialogMessage("Phone number verified successfully");
      setIsSuccess(true);
      setDialogOpen(true);
    } catch (err: any) {
      setDialogMessage(err?.data?.message || "Invalid OTP");
      setIsSuccess(false);
      setDialogOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      const res = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: fullPhoneNumber,
      }).unwrap();

      setDialogMessage(res.message || "Registration successful");
      setIsSuccess(true);
      setDialogOpen(true);
      navigate("/login");
    } catch (err: any) {
      setDialogMessage(err?.data?.message || "Registration failed");
      setIsSuccess(false);
      setDialogOpen(true);
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography fontWeight={700} mb={3}>
          Create Account
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="First Name"
            fullWidth
            value={formData.firstName}
            onChange={handleChange("firstName")}
          />

          <TextField
            label="Last Name"
            fullWidth
            value={formData.lastName}
            onChange={handleChange("lastName")}
          />

          <TextField
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange("email")}
            error={!isEmailValid && formData.email.length > 0}
          />

          {/* PHONE */}
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Country"
              value={formData.countryCode}
              onChange={handleChange("countryCode")}
              sx={{ width: 160 }}
            >
              {countryCodes.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Phone Number"
              fullWidth
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </Stack>

          {!otpSent ? (
            <Button
              variant="outlined"
              onClick={handleSendOtp}
              disabled={!formData.phone || sendingOtp}
            >
              Send OTP
            </Button>
          ) : !otpVerified ? (
            <>
              <TextField
                label="Enter OTP"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleVerifyOtp}
                disabled={!otp || verifyingOtp}
              >
                Verify OTP
              </Button>
            </>
          ) : (
            <Typography color="success.main">
              Phone Verified ✔
            </Typography>
          )}

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange("password")}
          />

          <Button
            variant="contained"
            disabled={!isFormValid || isLoading}
            onClick={handleSubmit}
            sx={{ bgcolor: "#22a652" }}
          >
            Register
          </Button>

          <Typography textAlign="center">
            Already have an account?{" "}
            <RouterLink to="/login">Sign In</RouterLink>
          </Typography>
        </Stack>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle color={isSuccess ? "success.main" : "error.main"}>
          {isSuccess ? "Success" : "Error"}
        </DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Register;