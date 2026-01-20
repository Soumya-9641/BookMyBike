import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedIcon from "@mui/icons-material/Verified";
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";

import { useJoinWaitlistMutation } from "../services/waitlistAPI";

/* ---------------- Icon Circle ---------------- */
const IconCircle = ({
  text,
  icon,
}: {
  text: string;
  icon: React.ReactNode;
}) => (
  <Box textAlign="center" sx={{ width: 160 }}>
    <Box
      sx={{
        width: 90,
        height: 90,
        mx: "auto",
        borderRadius: "50%",
        border: "4px solid #2e7d32",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 2,
      }}
    >
      {icon}
    </Box>

    <Typography fontSize="0.95rem" fontWeight={500} lineHeight={1.3}>
      {text}
    </Typography>
  </Box>
);

/* ---------------- Main Component ---------------- */
const ComingSoon: React.FC = () => {
  const [segment, setSegment] = useState<"renter" | "lister">("renter");
  const [email, setEmail] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [joinWaitlist, { isLoading }] = useJoinWaitlistMutation();

  /* ---------- Email Validation ---------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const showEmailError = email.length > 0 && !isEmailValid;

  const handleSubmit = async () => {
    if (!isEmailValid) return;

    try {
      const res = await joinWaitlist({ email }).unwrap();
      setPopupMessage(res.message);
      setIsSuccess(true);
      setPopupOpen(true);
    } catch (err: any) {
      setPopupMessage(err?.data?.message || "Failed to join waitlist");
      setIsSuccess(false);
      setPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false);

    if (isSuccess) {
      setEmail("");
    }
  };

  const handleSegmentChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: "renter" | "lister" | null
  ) => {
    if (newValue) setSegment(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/images/coming-soon-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
        },
      }}
    >
      <Paper
        elevation={10}
        sx={{
          position: "relative",
          maxWidth: 1000,
          width: "100%",
          p: { xs: 3, sm: 6 },
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        {/* Logo */}
        <Box mb={3}>
          <img src="/images/logo.png" alt="RentMyBike" height={60} />
        </Box>

        {/* Heading */}
        <Typography
          sx={{
            fontSize: { xs: "2rem", sm: "2.8rem" },
            fontWeight: 800,
            color: "#2e7d32",
            mb: 2,
          }}
        >
          COMING SOON
        </Typography>

        <Typography fontWeight={600} mb={1} fontSize={22}>
          Our website is currently undergoing scheduled maintenance.
        </Typography>

        <Typography mb={4} fontSize={18}>
          We’ll be back shortly! Sign up now to receive early notifications of
          our launch date.
        </Typography>

        {/* Email Form */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          spacing={0}
          mb={5}
        >
          <TextField
            placeholder="Enter your email address"
            required
            value={email}
            error={showEmailError}
            helperText={showEmailError ? "Please enter a valid email address" : " "}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 380 },
              "& .MuiInputBase-root": {
                height: 52,
                backgroundColor: "#fff",
                borderRadius: { xs: 1, sm: "8px 0 0 8px" },
              },
            }}
          />

          <Button
            variant="contained"
            disabled={!isEmailValid || isLoading}
            onClick={handleSubmit}
            sx={{
              height: 52,
              borderRadius: { xs: 1, sm: "0 8px 8px 0" },
              backgroundColor: "#2e7d32",
              px: 4,
              fontWeight: 600,
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: "#1b5e20" },
              "&.Mui-disabled": {
                backgroundColor: "#a5d6a7",
                color: "#fff",
              },
            }}
          >
            {isLoading ? "Submitting..." : "Notify me"}
          </Button>
        </Stack>

        {/* Segment Toggle */}
        <Box display="flex" justifyContent="center" mb={5}>
          <ToggleButtonGroup
            value={segment}
            exclusive
            onChange={handleSegmentChange}
            sx={{
              backgroundColor: "#e0e0e0",
              borderRadius: "8px",
              padding: "4px",
            }}
          >
            <ToggleButton
              value="renter"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                border: "none",
                "&.Mui-selected": {
                  backgroundColor: "#2e7d32",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1b5e20" },
                },
              }}
            >
              For Renter
            </ToggleButton>

            <ToggleButton
              value="lister"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                border: "none",
                "&.Mui-selected": {
                  backgroundColor: "#2e7d32",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1b5e20" },
                },
              }}
            >
              For Lister
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Steps */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconCircle
              text="Visit Website"
              icon={<LanguageIcon fontSize="large" />}
            />
            <ArrowForwardIcon
              sx={{
                color: "#2e7d32",
                fontSize: 22,
                transform: "translateY(-14px)",
                display: { xs: "none", sm: "block" },
              }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <IconCircle
              text={
                segment === "renter"
                  ? "Search for bike and book"
                  : "List your bike"
              }
              icon={<SearchIcon fontSize="large" />}
            />
            <ArrowForwardIcon
              sx={{
                color: "#2e7d32",
                fontSize: 22,
                transform: "translateY(-14px)",
                display: { xs: "none", sm: "block" },
              }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <IconCircle
              text="Verify your profile"
              icon={<VerifiedIcon fontSize="large" />}
            />
            <ArrowForwardIcon
              sx={{
                color: "#2e7d32",
                fontSize: 22,
                transform: "translateY(-14px)",
                display: { xs: "none", sm: "block" },
              }}
            />
          </Stack>

          <IconCircle
            text="Get ready for your trip"
            icon={<DirectionsBikeIcon fontSize="large" />}
          />
        </Stack>
      </Paper>

      {/* Popup Dialog */}
      <Dialog open={popupOpen} onClose={handleClosePopup}>
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: isSuccess ? "#2e7d32" : "error.main",
          }}
        >
          {isSuccess ? "Success" : "Error"}
        </DialogTitle>

        <DialogContent>
          <Typography>{popupMessage}</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClosePopup}
            variant="contained"
            sx={{
              bgcolor: isSuccess ? "#2e7d32" : "error.main",
              "&:hover": {
                bgcolor: isSuccess ? "#1b5e20" : "error.dark",
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

export default ComingSoon;
