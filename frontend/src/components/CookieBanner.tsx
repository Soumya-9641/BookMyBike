import { Box, Button, Typography, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getCookieConsent,
  setCookieConsent,
} from "../utils/cookieConsent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent("accepted");
    setVisible(false);
  };

  const handleReject = () => {
    setCookieConsent("rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 1300,
        bgcolor: "#1e1e1e",
        color: "#fff",
        borderRadius: 2,
        p: 2,
        boxShadow: 6,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
      >
        <Typography variant="body2" sx={{ maxWidth: 700 }}>
          We use cookies to improve your experience, analyze traffic, and
          personalize content. You can accept or reject cookies.
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={handleReject}
            sx={{
              color: "#fff",
              borderColor: "#777",
              "&:hover": { borderColor: "#fff" },
            }}
          >
            Reject
          </Button>

          <Button
            variant="contained"
            onClick={handleAccept}
            sx={{
              bgcolor: "#22a652",
              "&:hover": { bgcolor: "#1e8e4a" },
            }}
          >
            Accept
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CookieBanner;