import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Link,
} from "@mui/material";
import { useLoginMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { Link as RouterLink } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import ResendVerificationDialog from "../components/ResendVerificationDialog";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIGN_IN_STORAGE_KEY = "sign-in-form-state";

const getInitialSignInForm = () => {
  if (typeof window === "undefined") {
    return { email: "", password: "", rememberMe: false };
  }

  try {
    const stored = window.sessionStorage.getItem(SIGN_IN_STORAGE_KEY);
    if (!stored) return { email: "", password: "", rememberMe: false };

    return JSON.parse(stored);
  } catch {
    return { email: "", password: "", rememberMe: false };
  }
};

const SignIn = () => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(() => getInitialSignInForm().email);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [password, setPassword] = useState(() => getInitialSignInForm().password);
  const [rememberMe, setRememberMe] = useState(() => getInitialSignInForm().rememberMe);
  const [showPassword, setShowPassword] = useState(false);
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.sessionStorage.setItem(
      SIGN_IN_STORAGE_KEY,
      JSON.stringify({ email, password, rememberMe }),
    );
  }, [email, password, rememberMe]);

  useEffect(() => {
    return () => {
      window.sessionStorage.removeItem(SIGN_IN_STORAGE_KEY);
    };
  }, []);

  /* ---------- Email Validation ---------- */
  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email), [email]);
  const showEmailError = useMemo(() => email.length > 0 && !isEmailValid, [email, isEmailValid]);

  const isFormValid = useMemo(() => isEmailValid && password.trim().length > 0, [isEmailValid, password]);
  const ONE_HOUR = 60 * 60 * 1000;
  const handleLogin = useCallback(async () => {
    if (!isFormValid) return;

    try {
      const res = await login({ email, password }).unwrap();

      const expiresAt = Date.now() + ONE_HOUR;

      dispatch(
        setCredentials({
          token: res.token,
          user: {
            email,
            hasBusinessProfile: res.hasBusinessProfile,
          },
        }),
      );
      if (rememberMe) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("tokenExpiry", expiresAt.toString());
        localStorage.setItem(
          "hasBusinessProfile",
          res.hasBusinessProfile.toString(),
        );
      } else {
        localStorage.setItem("token", res.token);
        localStorage.setItem(
          "hasBusinessProfile",
          res.hasBusinessProfile.toString(),
        );
        localStorage.setItem("tokenExpiry", expiresAt.toString());
      }

      toast.success("Login successful");
      window.sessionStorage.removeItem(SIGN_IN_STORAGE_KEY);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 800);
    } catch (err: any) {
      if (err?.data?.message === "Please verify your email before logging in") {
        setShowVerifyDialog(true);
        return;
      }

      toast.error(err?.data?.message || "Login failed");
    }
  }, [dispatch, email, isFormValid, login, navigate, password, rememberMe]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleRememberMeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleVerifyDialogClose = useCallback(() => {
    setShowVerifyDialog(false);
  }, []);

  // const handleDialogClose = () => {
  //   setDialogOpen(false);

  //   if (isSuccess) {
  //     setEmail("");
  //     setPassword("");
  //     setRememberMe(false);
  //   }
  // };

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
          Sign in
        </Typography>

        <Stack spacing={2.5}>
          {/* Email */}
          <Box>
            <Typography fontSize={14} mb={0.5}>
              Email address <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              error={showEmailError}
              helperText={
                showEmailError ? "Please enter a valid email address" : " "
              }
            />
          </Box>

          {/* Password */}
          <Box>
            <Typography fontSize={14} mb={0.5}>
              Password <span style={{ color: "red" }}>*</span>
            </Typography>

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Remember Me */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
              }
              label="Remember Me"
            />
            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="none"
              fontSize={14}
            >
              Forgot Password?
            </Link>
          </Stack>

          {/* Login Button */}
          <Button
            fullWidth
            disabled={!isFormValid || isLoading}
            sx={{
              bgcolor: "#1fa64b",
              color: "#fff",
              fontWeight: 600,
              py: 1.2,
              "&:hover": { bgcolor: "#188f40" },
              "&.Mui-disabled": {
                bgcolor: "#c7e6d2",
                color: "#fff",
              },
            }}
            onClick={handleLogin}
          >
            {isLoading ? "Logging in..." : "LOGIN"}
          </Button>

          <Typography textAlign="center" fontSize={14}>
            OR
          </Typography>

          {/* Register */}
          <Button
            fullWidth
            sx={{
              bgcolor: "#294acb",
              color: "#fff",
              fontWeight: 600,
              py: 1.2,
              "&:hover": { bgcolor: "#1f3aa3" },
            }}
            component={RouterLink}
            to="/register"
          >
            CREATE AN ACCOUNT
          </Button>
        </Stack>
      </Box>

      {/* ================= Dialog ================= */}
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
              "&:hover": {
                bgcolor: isSuccess ? "#1e8e4a" : "error.dark",
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog> */}
      <ResendVerificationDialog
        open={showVerifyDialog}
        email={email}
        onClose={handleVerifyDialogClose}
      />
    </Box>
  );
};

export default SignIn;
