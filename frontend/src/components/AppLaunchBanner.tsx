import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const AppLaunchBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          mx: "auto",
          maxWidth: "1200px",
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={() => setVisible(false)}
          aria-label="Close app launch banner"
          sx={{
            position: "absolute",
            top: {
              xs: 6,
              sm: 10,
              md: 14,
            },
            right: {
              xs: 6,
              sm: 10,
              md: 14,
            },
            zIndex: 2,
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: 2,

            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          component="img"
          src="/images/app-launch-banner.jpeg"
          alt="RentMyBike App launching soon"
          sx={{
            display: "block",
            width: "100%",
            height: "auto",
            borderRadius: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            objectFit: "cover",
          }}
        />
      </Box>
    </Box>
  );
};

export default AppLaunchBanner;
