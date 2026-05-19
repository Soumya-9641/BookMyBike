import { Box, Typography, Stack, Button, Alert } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import { useState } from "react";

const steps = [
  "Sign up & verify your account",
  "Choose a bike from the catalog",
  "Select dates to rent from a calendar",
  "Complete your booking with payment & deposit",
  "Payment is released on bike return",
  "Secure payments with Stripe, trusted by millions of users worldwide.",
  "Deposit is released back to you when the bike is returned in good condition.",
];

const HowItWorks = () => {
  const [active, setActive] = useState<"renter" | "lister">("renter");

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography
          variant="h4"
          fontWeight={600}
          color="#22a652"
        >
          How it works
        </Typography>

        {/* Segmented Toggle */}
        <Box
          sx={{
            display: "flex",
            p: "4px",
            bgcolor: "#f1f1f1",
            borderRadius: 1,
          }}
        >
          <Button
            onClick={() => setActive("renter")}
            sx={{
              minWidth: 100,
              height: 32,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 600,
              bgcolor:
                active === "renter" ? "#22a652" : "#fff",
              color:
                active === "renter" ? "#fff" : "#000",
              "&:hover": {
                bgcolor:
                  active === "renter"
                    ? "#1e8e4a"
                    : "#fff",
              },
            }}
          >
            For Renter
          </Button>

          <Button
            onClick={() => setActive("lister")}
            sx={{
              minWidth: 100,
              height: 32,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 600,
              bgcolor:
                active === "lister" ? "#22a652" : "#fff",
              color:
                active === "lister" ? "#fff" : "#000",
              "&:hover": {
                bgcolor:
                  active === "lister"
                    ? "#1e8e4a"
                    : "#fff",
              },
            }}
          >
            For Lister
          </Button>
        </Box>
      </Stack>

      {/* Content */}
      <Typography fontWeight={600} mb={2}>
        RENT A BIKE
      </Typography>

      <Stack spacing={1.5}>
        {steps.map((step, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            alignItems="flex-start"
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: "#22a652", // same green as heading
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: "3px",
                flexShrink: 0,
              }}
            >
              <KeyboardDoubleArrowRightIcon
                sx={{
                  fontSize: 12,
                  color: "#ffffff",
                }}
              />
            </Box>



            <Typography variant="body2">
              {step}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Alert variant="filled" severity="info" sx={{ mt: 3, fontWeight:700 }}>
        Confirm Pick-up in “My bookings” to activate your ride” & “Confirm Drop-off in “My bookings” to end your ride and initiate your payout
      </Alert>
    </Box>
  );
};

export default HowItWorks;
