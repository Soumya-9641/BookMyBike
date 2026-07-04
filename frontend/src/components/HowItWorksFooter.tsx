import { Box, Typography, Stack, Button, Alert } from "@mui/material";
import { useState } from "react";
import HowItWorksAccordion from "../components/HowItWorksAccordian";
import { renterSteps, listerSteps } from "../constant/howItWorks";

const HowItWorksFooter = () => {
  const [active, setActive] = useState<"renter" | "lister">("renter");

  const steps = active === "renter" ? renterSteps : listerSteps;

  return (
    <Box px={{ xs: 2, md: 4 }} py={4} maxWidth="lg" mx="auto">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600} color="#22a652">
          How it works
        </Typography>

        <Box
          sx={{ display: "flex", bgcolor: "#f1f1f1", p: 0.5, borderRadius: 1 }}
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
            Renter
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
            Lister
          </Button>
        </Box>
      </Stack>

      <HowItWorksAccordion steps={steps} />

      <Alert sx={{ mt: 3 }} severity="info" variant="filled">
        Confirm pick-up & drop-off in “My Rides” to activate and complete
        rentals
      </Alert>
    </Box>
  );
};

export default HowItWorksFooter;
