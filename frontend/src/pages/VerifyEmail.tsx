import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import { useVerifyEmailQuery } from "../services/authApi";
import ResendVerificationDialog from "../components/ResendVerificationDialog";
import { useState } from "react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [openDialog, setOpenDialog] =
    useState(false);

  const {
    isLoading,
    isSuccess,
    isError,
  } = useVerifyEmailQuery(token!, {
    skip: !token,
  });

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Loading */}
        {isLoading && (
          <>
            <CircularProgress />
            <Typography mt={2}>
              Verifying your email...
            </Typography>
          </>
        )}

        {/* Success */}
        {isSuccess && (
          <>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#22a652"
            >
              Email Verified 🎉
            </Typography>

            <Typography mt={1}>
              Your email has been successfully
              verified.
            </Typography>

            <Button
              href="/login"
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: "#22a652",
              }}
            >
              Go to Login
            </Button>
          </>
        )}

        {/* Error */}
        {(isError || !token) && !isLoading && (
          <>
            <Typography
              variant="h5"
              fontWeight={700}
              color="error"
            >
              Verification Failed
            </Typography>

            <Typography mt={1}>
              The verification link is invalid or
              expired.
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
