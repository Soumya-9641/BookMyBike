import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import { useVerifyEmailMutation } from "../services/authApi";
import { useEffect, useRef, useState } from "react";
import ResendVerificationDialog from "../components/ResendVerificationDialog";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [verifyEmail] = useVerifyEmailMutation();
  const hasRun = useRef(false);

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    if (!token || hasRun.current) return;
    hasRun.current = true;

    verifyEmail(token)
      .unwrap()
      .then(() => {
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token, verifyEmail]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Paper sx={{ p: 4, maxWidth: 420, textAlign: "center" }}>
        {status === "loading" && (
          <>
            <CircularProgress />
            <Typography mt={2}>
              Verifying your email...
            </Typography>
          </>
        )}

        {status === "success" && (
          <>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#22a652"
            >
              Email Verified 🎉
            </Typography>

            <Button
              sx={{ mt: 3 }}
              variant="contained"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <Typography
              variant="h5"
              fontWeight={700}
              color="error"
            >
              Verification Failed
            </Typography>
            <Typography mt={1}>
              The verification link is invalid or expired.
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3, bgcolor: "#22a652" }}
              onClick={() => setOpenDialog(true)}
            >
              Resend Verification
            </Button>
          </>
        )}
      </Paper>

      {/* Reusable Dialog */}
      <ResendVerificationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </Box>
  );
};

export default VerifyEmail;