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
import {
  useSignupMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../services/authApi";
import { useState } from "react";

const Register = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  /* ---------- Email Validation ---------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email);

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  /* ---------- OTP HANDLERS ---------- */
  const handleSendOtp = async () => {
    try {
      await sendOtp({ phoneNumber: formData.phone }).unwrap();
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
      const res = await verifyOtp({
        phoneNumber: formData.phone,
        otp,
      }).unwrap();

      if (res.verified) {
        setOtpVerified(true);
        setDialogMessage("Phone number verified");
        setIsSuccess(true);
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (err: any) {
      setDialogMessage(err?.data?.message || "Invalid OTP");
      setIsSuccess(false);
    } finally {
      setDialogOpen(true);
    }
  };

  /* ---------- REGISTER ---------- */
  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.password &&
    isEmailValid &&
    otpVerified;

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
      setDialogMessage(err?.data?.message || "Registration failed");
      setIsSuccess(false);
      setDialogOpen(true);
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" mt={5}>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Create Your Account
        </Typography>

        <Stack spacing={2}>
          <TextField label="First Name *" fullWidth value={formData.firstName} onChange={handleChange("firstName")} />
          <TextField label="Last Name *" fullWidth value={formData.lastName} onChange={handleChange("lastName")} />
          <TextField label="Email *" fullWidth value={formData.email} onChange={handleChange("email")} />
          <TextField label="Phone *" fullWidth value={formData.phone} onChange={handleChange("phone")} />

          {!otpSent && (
            <Button variant="outlined" onClick={handleSendOtp} disabled={!formData.phone || sendingOtp}>
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </Button>
          )}

          {otpSent && !otpVerified && (
            <>
              <TextField label="Enter OTP" fullWidth value={otp} onChange={(e) => setOtp(e.target.value)} />
              <Button variant="outlined" onClick={handleVerifyOtp} disabled={!otp || verifyingOtp}>
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </Button>
            </>
          )}

          {otpVerified && (
            <Typography color="success.main" fontWeight={600}>
              Phone number verified ✔
            </Typography>
          )}

          <TextField label="Password *" type="password" fullWidth value={formData.password} onChange={handleChange("password")} />

          <Button
            variant="contained"
            size="large"
            disabled={!isFormValid || isLoading}
            sx={{ bgcolor: "#22a652" }}
            onClick={handleSubmit}
          >
            Register
          </Button>

          <Typography textAlign="center">
            Already have an account?{" "}
            <RouterLink to="/login">Sign In</RouterLink>
          </Typography>
        </Stack>
      </Paper>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{isSuccess ? "Success" : "Error"}</DialogTitle>
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