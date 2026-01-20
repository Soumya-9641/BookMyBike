import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { useResendVerificationMutation } from "../services/authApi";
import { useState } from "react";

interface Props {
  open: boolean;
  email?: string; // optional now
  onClose: () => void;
}

const ResendVerificationDialog = ({
  open,
  email: initialEmail = "",
  onClose,
}: Props) => {
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");

  const [
    resendVerification,
    { isLoading },
  ] = useResendVerificationMutation();

  const handleResend = async () => {
    if (!email) {
      setMessage("Email is required");
      return;
    }

    try {
      const res = await resendVerification({
        email,
      }).unwrap();
      setMessage(res.message);
    } catch (err: any) {
      setMessage(
        err?.data?.message ||
          "Failed to resend verification email"
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Email Verification Required
      </DialogTitle>

      <DialogContent>
        <Typography mb={2}>
          Please enter your email to receive a new
          verification link.
        </Typography>

        <TextField
          fullWidth
          label="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          sx={{ mb: 2 }}
        />

        {message && (
          <Typography
            color={
              message.includes("sent")
                ? "#22a652"
                : "error"
            }
          >
            {message}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        <Button
          onClick={handleResend}
          disabled={isLoading}
          variant="contained"
          sx={{ bgcolor: "#22a652" }}
        >
          {isLoading
            ? "Sending..."
            : "Resend Verification"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResendVerificationDialog;
