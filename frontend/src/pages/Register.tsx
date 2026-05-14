import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../services/authApi";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../services/authApi";
import { useState } from "react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { isValidPhoneNumber } from "libphonenumber-js";

const Register = () => {
  const navigate = useNavigate();

  const [signup, { isLoading }] = useSignupMutation();
  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",        // international format without +
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  /* -------------------- VALIDATION -------------------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email);
  const fullPhoneNumber = `+${formData.phone}`;
  const isPhoneValid = isValidPhoneNumber(fullPhoneNumber);

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.password.trim() &&
    isEmailValid &&
    isPhoneValid &&
    otpVerified;

  /* -------------------- HANDLERS -------------------- */
  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleSendOtp = async () => {
    try {
      await sendOtp({ phoneNumber: fullPhoneNumber }).unwrap();
      setOtpSent(true);
      toast.success("OTP sent successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({
        phoneNumber: fullPhoneNumber,
        otp,
      }).unwrap();
      setOtpVerified(true);
      toast.success("Phone number verified");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: fullPhoneNumber,
      }).unwrap();

      toast.success("Registration successful");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  /* -------------------- UI -------------------- */
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

          {/* 📞 PHONE + OTP (SINGLE LINE) */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <PhoneInput
                country={"se"} // default Sweden
                value={formData.phone}
                onChange={(value) =>
                  setFormData({ ...formData, phone: value })
                }
                inputStyle={{ width: "100%" }}
                inputProps={{ required: true }}
              />
            </Box>

            {!otpSent ? (
              <Button
                variant="outlined"
                onClick={handleSendOtp}
                disabled={!isPhoneValid || sendingOtp}
                sx={{ whiteSpace: "nowrap" }}
              >
                Send OTP
              </Button>
            ) : !otpVerified ? (
              <Button
                variant="contained"
                onClick={handleVerifyOtp}
                disabled={!otp || verifyingOtp}
                sx={{ whiteSpace: "nowrap" }}
              >
                Verify OTP
              </Button>
            ) : (
              <Typography color="success.main" sx={{ whiteSpace: "nowrap" }}>
                ✔ Verified
              </Typography>
            )}
          </Stack>

          {/* OTP INPUT */}
          {otpSent && !otpVerified && (
            <TextField
              label="Enter OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
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
            sx={{ bgcolor: "#22a652", fontWeight: 600 }}
          >
            Register
          </Button>

          <Typography textAlign="center">
            Already have an account?{" "}
            <RouterLink to="/login">Sign In</RouterLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Register;