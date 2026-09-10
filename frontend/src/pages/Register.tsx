import {
  Box,
  Typography,
  Stack,
  Paper,
  TextField,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import {
  useSignupMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../services/authApi";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import toast from "react-hot-toast";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { isValidPhoneNumber } from "libphonenumber-js";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/* =========================================================
   CONSTANTS
========================================================= */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REGISTER_FORM_STORAGE_KEY = "register-form-state";

/* =========================================================
   TYPES
========================================================= */

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

/* =========================================================
   INITIAL FORM
========================================================= */

const EMPTY_FORM: RegisterFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

/* =========================================================
   GET INITIAL FORM
========================================================= */

const getInitialRegisterForm = (): RegisterFormData => {
  if (typeof window === "undefined") {
    return EMPTY_FORM;
  }

  try {
    const stored = window.sessionStorage.getItem(
      REGISTER_FORM_STORAGE_KEY,
    );

    if (!stored) {
      return EMPTY_FORM;
    }

    const parsed = JSON.parse(stored);

    return {
      firstName: parsed?.firstName ?? "",
      lastName: parsed?.lastName ?? "",
      email: parsed?.email ?? "",
      phone: parsed?.phone ?? "",
      password: parsed?.password ?? "",
    };
  } catch {
    return EMPTY_FORM;
  }
};

/* =========================================================
   COMPONENT
========================================================= */

const Register = () => {
  const navigate = useNavigate();

  /* =======================================================
     API
  ======================================================= */

  const [signup, { isLoading }] = useSignupMutation();

  const [sendOtp, { isLoading: sendingOtp }] =
    useSendOtpMutation();

  const [verifyOtp, { isLoading: verifyingOtp }] =
    useVerifyOtpMutation();

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] = useState<RegisterFormData>(
    getInitialRegisterForm,
  );

  const [showPassword, setShowPassword] = useState(false);

  /* =======================================================
     OTP STATE
  ======================================================= */

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [otpVerified, setOtpVerified] = useState(false);

  /* =======================================================
     TERMS
  ======================================================= */

  const [termsChecked, setTermsChecked] = useState(false);

  /* =======================================================
     OTP PROTECTION
     
     These refs are important.

     They prevent verifyOtp from being called repeatedly
     for the same 6-digit OTP.
  ======================================================= */

  const otpVerificationInProgress = useRef(false);

  const lastVerifiedOtp = useRef("");

  /* =======================================================
     SAVE FORM TO SESSION STORAGE
     
     OTP is intentionally NOT stored.
  ======================================================= */

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        REGISTER_FORM_STORAGE_KEY,
        JSON.stringify({
          ...formData,
          otpSent,
          otpVerified,
          termsChecked,
        }),
      );
    } catch {
      // Ignore session storage errors
    }
  }, [
    formData,
    otpSent,
    otpVerified,
    termsChecked,
  ]);

  /* =======================================================
     CLEANUP
     
     Remove registration data when leaving registration.
  ======================================================= */

  useEffect(() => {
    return () => {
      try {
        window.sessionStorage.removeItem(
          REGISTER_FORM_STORAGE_KEY,
        );
      } catch {
        // Ignore session storage errors
      }
    };
  }, []);

  /* =======================================================
     EMAIL VALIDATION
  ======================================================= */

  const isEmailValid = useMemo(() => {
    return EMAIL_REGEX.test(formData.email);
  }, [formData.email]);

  /* =======================================================
     PHONE NUMBER
  ======================================================= */

  const fullPhoneNumber = useMemo(() => {
    if (!formData.phone) {
      return "";
    }

    return `+${formData.phone}`;
  }, [formData.phone]);

  const isPhoneValid = useMemo(() => {
    if (!fullPhoneNumber) {
      return false;
    }

    try {
      return isValidPhoneNumber(fullPhoneNumber);
    } catch {
      return false;
    }
  }, [fullPhoneNumber]);

  /* =======================================================
     FORM VALIDATION
  ======================================================= */

  const isFormValid = useMemo(() => {
    return Boolean(
      formData.firstName.trim() &&
        formData.lastName.trim() &&
        formData.password.trim() &&
        isEmailValid &&
        isPhoneValid &&
        otpVerified &&
        termsChecked,
    );
  }, [
    formData.firstName,
    formData.lastName,
    formData.password,
    isEmailValid,
    isPhoneValid,
    otpVerified,
    termsChecked,
  ]);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = useCallback(
    (field: keyof RegisterFormData) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      },
    [],
  );

  /* =======================================================
     PHONE CHANGE
  ======================================================= */

  const handlePhoneChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));

      /*
       * If phone number changes after OTP verification,
       * invalidate the previous verification.
       */

      setOtp("");

      setOtpSent(false);

      setOtpVerified(false);

      lastVerifiedOtp.current = "";

      otpVerificationInProgress.current = false;
    },
    [],
  );

  /* =======================================================
     SEND OTP
  ======================================================= */

  const handleSendOtp = useCallback(async () => {
    if (!isPhoneValid) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      await sendOtp({
        phoneNumber: fullPhoneNumber,
      }).unwrap();

      /*
       * Reset OTP state whenever a new OTP is requested.
       */

      setOtp("");

      setOtpSent(true);

      setOtpVerified(false);

      lastVerifiedOtp.current = "";

      otpVerificationInProgress.current = false;

      toast.success("OTP sent successfully");
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          "Failed to send OTP",
      );
    }
  }, [
    fullPhoneNumber,
    isPhoneValid,
    sendOtp,
  ]);

  /* =======================================================
     VERIFY OTP
     
     IMPORTANT:
     This function can only process the same OTP once.
  ======================================================= */

  const handleVerifyOtp = useCallback(
    async (otpValue: string) => {
      /*
       * OTP must contain exactly 6 digits.
       */

      if (!/^\d{6}$/.test(otpValue)) {
        return;
      }

      /*
       * OTP already verified.
       */

      if (otpVerified) {
        return;
      }

      /*
       * API request already running.
       */

      if (otpVerificationInProgress.current) {
        return;
      }

      /*
       * Same OTP already processed.
       */

      if (
        lastVerifiedOtp.current === otpValue
      ) {
        return;
      }

      /*
       * Lock before API request.
       */

      otpVerificationInProgress.current = true;

      lastVerifiedOtp.current = otpValue;

      try {
        await verifyOtp({
          phoneNumber: fullPhoneNumber,
          otp: otpValue,
        }).unwrap();

        /*
         * Verification successful.
         */

        setOtpVerified(true);

        toast.success(
          "Phone number verified",
        );
      } catch (err: any) {
        /*
         * Allow another OTP attempt after failure.
         */

        lastVerifiedOtp.current = "";

        setOtpVerified(false);

        toast.error(
          err?.data?.message ||
            "Invalid OTP",
        );
      } finally {
        /*
         * Unlock request.
         */

        otpVerificationInProgress.current = false;
      }
    },
    [
      fullPhoneNumber,
      otpVerified,
      verifyOtp,
    ],
  );

  /* =======================================================
     OTP INPUT CHANGE
     
     Automatically verifies when 6 digits are entered.
  ======================================================= */

  const handleOtpChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      /*
       * Numbers only.
       */

      const value = e.target.value
        .replace(/\D/g, "")
        .slice(0, 6);

      setOtp(value);

      /*
       * If user enters a different OTP,
       * allow a new verification attempt.
       */

      if (
        value !== lastVerifiedOtp.current
      ) {
        lastVerifiedOtp.current = "";

        if (otpVerified) {
          setOtpVerified(false);
        }
      }

      /*
       * Automatically verify exactly when
       * 6 digits are entered.
       */

      if (value.length === 6) {
        void handleVerifyOtp(value);
      }
    },
    [
      handleVerifyOtp,
      otpVerified,
    ],
  );

  /* =======================================================
     PASSWORD VISIBILITY
  ======================================================= */

  const togglePasswordVisibility =
    useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

  /* =======================================================
     REGISTER
  ======================================================= */

  const handleSubmit = useCallback(
    async () => {
      if (!isFormValid) {
        return;
      }

      try {
        await signup({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phoneNumber: fullPhoneNumber,
        }).unwrap();

        toast.success(
          "Registration successful. Verify your email before logging in.",
        );

        /*
         * Clear registration session data.
         */

        window.sessionStorage.removeItem(
          REGISTER_FORM_STORAGE_KEY,
        );

        navigate("/login");
      } catch (err: any) {
        toast.error(
          err?.data?.message ||
            "Registration failed",
        );
      }
    },
    [
      formData,
      fullPhoneNumber,
      isFormValid,
      navigate,
      signup,
    ],
  );

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 160px)",

        background:
          "radial-gradient(circle at center, #a8e6c2 0%, #c9f3dc 40%, #2faa54 100%)",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        py: {
          xs: 3,
          sm: 6,
        },

        px: {
          xs: 1.5,
          sm: 2,
        },

        boxSizing: "border-box",
      }}
    >
      <Box
        maxWidth="lg"
        width="100%"
        mx="auto"
        mt={{
          xs: 2,
          sm: 4,
        }}
        mb={{
          xs: 4,
          sm: 8,
        }}
      >
        <Paper
          sx={{
            p: {
              xs: 2.5,
              sm: 4,
            },

            width: "100%",

            maxWidth: 600,

            mx: "auto",

            boxSizing: "border-box",

            borderRadius: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          {/* =================================================
              TITLE
          ================================================= */}

          <Typography
            variant="h5"
            fontWeight={700}
            mb={3}
          >
            Create Account
          </Typography>

          <Stack spacing={2}>
            {/* =================================================
                FIRST NAME
            ================================================= */}

            <TextField
              label="First Name"
              fullWidth
              value={formData.firstName}
              onChange={handleChange(
                "firstName",
              )}
            />

            {/* =================================================
                LAST NAME
            ================================================= */}

            <TextField
              label="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={handleChange(
                "lastName",
              )}
            />

            {/* =================================================
                EMAIL
            ================================================= */}

            <TextField
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleChange(
                "email",
              )}
              error={
                !isEmailValid &&
                formData.email.length > 0
              }
              helperText={
                !isEmailValid &&
                formData.email.length > 0
                  ? "Please enter a valid email"
                  : ""
              }
            />

            {/* =================================================
                PHONE + SEND OTP
            ================================================= */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              alignItems={{
                xs: "stretch",
                sm: "center",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  width: "100%",
                }}
              >
                <PhoneInput
                  country="se"
                  value={formData.phone}
                  onChange={
                    handlePhoneChange
                  }
                  inputStyle={{
                    width: "100%",
                    fontSize: "16px",
                    height: "56px",
                  }}
                  buttonStyle={{
                    height: "56px",
                  }}
                  inputProps={{
                    required: true,
                  }}
                />
              </Box>

              {/* SEND OTP */}

              {!otpSent && (
                <Button
                  variant="outlined"
                  onClick={
                    handleSendOtp
                  }
                  disabled={
                    !isPhoneValid ||
                    sendingOtp
                  }
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },

                    minWidth: {
                      sm: 120,
                    },

                    height: "56px",

                    flexShrink: 0,
                  }}
                >
                  {sendingOtp
                    ? "Sending..."
                    : "Send OTP"}
                </Button>
              )}

              {/* VERIFIED */}

              {otpSent &&
                otpVerified && (
                  <Typography
                    color="success.main"
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "auto",
                      },

                      textAlign: {
                        xs: "center",
                        sm: "left",
                      },

                      fontWeight: 600,

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    ✔ Verified
                  </Typography>
                )}

              {/* WAITING FOR OTP */}

              {otpSent &&
                !otpVerified && (
                  <Typography
                    color="text.secondary"
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "auto",
                      },

                      textAlign: {
                        xs: "center",
                        sm: "left",
                      },

                      fontSize: 14,
                    }}
                  >
                    Enter 6-digit OTP
                  </Typography>
                )}
            </Stack>

            {/* =================================================
                OTP INPUT
            ================================================= */}

            {otpSent && (
              <TextField
                label="Enter 6-digit OTP"
                fullWidth
                value={otp}
                onChange={
                  handleOtpChange
                }
                disabled={otpVerified}
                inputProps={{
                  maxLength: 6,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                helperText={
                  otpVerified
                    ? "Phone number verified successfully"
                    : otp.length > 0 &&
                        otp.length < 6
                      ? `${otp.length}/6 digits`
                      : verifyingOtp
                        ? "Verifying OTP..."
                        : "OTP will be verified automatically after 6 digits"
                }
                InputProps={{
                  endAdornment:
                    verifyingOtp &&
                    !otpVerified ? (
                      <InputAdornment position="end">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Verifying...
                        </Typography>
                      </InputAdornment>
                    ) : otpVerified ? (
                      <InputAdornment position="end">
                        <Typography
                          color="success.main"
                          fontWeight={600}
                        >
                          ✓
                        </Typography>
                      </InputAdornment>
                    ) : null,
                }}
              />
            )}

            {/* =================================================
                PASSWORD
            ================================================= */}

            <TextField
              label="Password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              fullWidth
              value={formData.password}
              onChange={handleChange(
                "password",
              )}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={
                        togglePasswordVisibility
                      }
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* =================================================
                TERMS & CONDITIONS
            ================================================= */}

            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-start"
            >
              <Checkbox
                required
                checked={termsChecked}
                onChange={(e) =>
                  setTermsChecked(
                    e.target.checked,
                  )
                }
                sx={{
                  p: 0,
                  mt: "2px",
                }}
              />

              <Stack spacing={0.5}>
                <Typography
                  variant="body2"
                >
                  By Registering, I agree
                  to the{" "}
                  <Box
                    component="span"
                    sx={{ mx: 0.5 }}
                  >
                    <RouterLink
                      to="/termsConditions"
                      style={{
                        textDecoration:
                          "none",
                        color:
                          "#22a652",
                        fontWeight: 600,
                      }}
                    >
                      Terms Of Service
                    </RouterLink>
                  </Box>
                </Typography>

                <Typography
                  variant="body2"
                >
                  and{" "}
                  <Box
                    component="span"
                    sx={{ mx: 0.5 }}
                  >
                    <RouterLink
                      to="/user-agreement"
                      style={{
                        textDecoration:
                          "none",
                        color:
                          "#22a652",
                        fontWeight: 600,
                      }}
                    >
                      User (Rental)
                      Agreement
                    </RouterLink>
                  </Box>
                </Typography>
              </Stack>
            </Stack>

            {/* =================================================
                REGISTER BUTTON
            ================================================= */}

            <Button
              variant="contained"
              fullWidth
              disabled={
                !isFormValid ||
                isLoading
              }
              onClick={
                handleSubmit
              }
              sx={{
                bgcolor: "#22a652",
                fontWeight: 600,

                py: 1.4,

                "&:hover": {
                  bgcolor: "#1d9148",
                },
              }}
            >
              {isLoading
                ? "Registering..."
                : "Register"}
            </Button>

            {/* =================================================
                LOGIN
            ================================================= */}

            <Typography
              textAlign="center"
              variant="body2"
            >
              Already have an account?{" "}
              <RouterLink to="/login">
                Sign In
              </RouterLink>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;