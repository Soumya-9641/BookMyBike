import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../services/authApi";
import { useSendOtpMutation, useVerifyOtpMutation } from "../services/authApi";
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
    phone: "", // international format without +
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

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
    otpVerified &&
    termsChecked;

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

            {/* 📞 PHONE + OTP */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <Box sx={{ flex: 1, width: "100%" }}>
                <PhoneInput
                  country={"se"}
                  value={formData.phone}
                  onChange={(value) =>
                    setFormData({ ...formData, phone: value })
                  }
                  inputStyle={{
                    width: "100%",
                    fontSize: "16px", // prevents mobile zoom
                  }}
                  inputProps={{ required: true }}
                />
              </Box>

              {!otpSent ? (
                <Button
                  variant="outlined"
                  onClick={handleSendOtp}
                  disabled={!isPhoneValid || sendingOtp}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    height: "56px",
                  }}
                >
                  Send OTP
                </Button>
              ) : !otpVerified ? (
                <Button
                  variant="contained"
                  onClick={handleVerifyOtp}
                  disabled={!otp || verifyingOtp}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    height: "56px",
                  }}
                >
                  Verify OTP
                </Button>
              ) : (
                <Typography
                  color="success.main"
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
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
            <div style={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <Checkbox
                required
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
                sx={{ p: 0, mt: 0 }}
              />
              <div
                style={{ display: "flex", flexDirection: "column", gap: 0.5 }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  By Registering, I agree to the
                  <RouterLink
                    to="/termsConditions"
                    style={{
                      textDecoration: "none",
                      color: "#22a652",
                      fontWeight: 600,
                    }}
                  >
                    Terms Of Service
                  </RouterLink>
                  {" "} and
                </div>
                <RouterLink
                  to="/user-agreement"
                  style={{
                    textDecoration: "none",
                    color: "#22a652",
                    fontWeight: 600,
                  }}
                >
                  User(rental) Agreement
                </RouterLink>
              </div>
            </div>
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
    </Box>
  );
};

export default Register;
