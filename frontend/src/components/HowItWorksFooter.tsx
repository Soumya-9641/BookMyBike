import { Box, Typography, Stack, Button, Alert } from "@mui/material";
import { useState } from "react";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

/* -------------------------------- */
/* ICON CIRCLE COMPONENT             */
/* -------------------------------- */
const IconCircle = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <Stack alignItems="center" spacing={1} width={180}>
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        bgcolor: "#2e7d32",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      {icon}
    </Box>
    <Typography variant="body2" textAlign="center" fontWeight={600}>
      {text}
    </Typography>
  </Stack>
);

/* -------------------------------- */
/* DATA                             */
/* -------------------------------- */

const renterTextSteps = [
  "Sign up & verify your account",
  "Choose a bike from the catalog",
  "Select dates to rent from a calendar",
  "Complete your booking with payment & deposit",
  "Payment is released on bike return",
  "Secure payments with Stripe, trusted by millions of users worldwide.",
  "Deposit is released back to you when the bike is returned in good condition.",
];

const listerTextSteps = [
  "Sign up & verify your identity",
  "List your bike with pricing & photos",
  "Approve or reject booking requests",
  "Hand over the bike securely",
  "Get paid after ride completion",
  "All payments are secured by Stripe",
  "Confirm return to release deposit",
];

const HowItWorksFooter = () => {
  const [active, setActive] = useState<"renter" | "lister">("renter");

  const textSteps = active === "renter" ? renterTextSteps : listerTextSteps;

  return (
    <Box px={{ xs: 2, md: 4 }} py={1} maxWidth="lg" mx="auto" mt={1}>
      {/* HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={600} color="#22a652">
          How it works
        </Typography>

        {/* TOGGLE */}
        <Box
          sx={{ display: "flex", p: 0.5, bgcolor: "#f1f1f1", borderRadius: 1 }}
        >
          <Button
            onClick={() => setActive("renter")}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              bgcolor: active === "renter" ? "#22a652" : "#fff",
              color: active === "renter" ? "#fff" : "#000",
            }}
          >
            For Renter
          </Button>
          <Button
            onClick={() => setActive("lister")}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              bgcolor: active === "lister" ? "#22a652" : "#fff",
              color: active === "lister" ? "#fff" : "#000",
            }}
          >
            For Lister
          </Button>
        </Box>
      </Stack>

      {/* ================= TEXT LIST ================= */}
      <Typography fontWeight={700} mb={2}>
        {active === "renter" ? "RENT A BIKE" : "LIST YOUR BIKE"}
      </Typography>

      <Stack spacing={1.5}>
        {textSteps.map((step, index) => (
          <Stack key={index} direction="row" spacing={1}>
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                bgcolor: "#22a652",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: "4px",
              }}
            >
              <KeyboardDoubleArrowRightIcon
                sx={{ fontSize: 12, color: "#fff" }}
              />
            </Box>
            <Typography variant="body2">{step}</Typography>
          </Stack>
        ))}
      </Stack>

      {/* ================= ICON FLOW ================= */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="center"
        spacing={3}
        mt={6}
      >
        <IconCircle icon={<LanguageIcon />} text="Sign up & verify your identity(Stripe-secured)" />

        <ArrowForwardIcon
          sx={{ display: { xs: "none", md: "block" }, color: "#2e7d32" }}
      />

        <IconCircle
          icon={<SearchIcon />}
          text={active === "renter" ? "Browse and book a bike" : "List your bike(s)"}
        />

        <ArrowForwardIcon
          sx={{ display: { xs: "none", md: "block" }, color: "#2e7d32" }}
        />

        <IconCircle
          icon={<DirectionsBikeIcon />}
          text={active === "renter" ? "Pick up, ride & enjoy" : "Approve bookings & hand over your bike"}
        />

        <ArrowForwardIcon
          sx={{ display: { xs: "none", md: "block" }, color: "#2e7d32" }}
        />

        <IconCircle
          icon={<VerifiedIcon />}
          text={
            active === "renter"
              ? "Return on time in the same condition-repeat!"
              : "Confirm return, get paid - repeat!"
          }
        />
      </Stack>

      {/* ALERT */}
      <Alert sx={{ mt: 5 }} severity="info" variant="filled">
        Confirm Pick-up in “My Rides” to activate your ride” & “Confirm Drop-off
        in “My Rides” to end your ride and initiate your payout
      </Alert>
    </Box>
  );
};

export default HowItWorksFooter;
