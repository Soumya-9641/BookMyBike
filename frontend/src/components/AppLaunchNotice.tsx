import { Box, Typography } from "@mui/material";

const AppLaunchNotice = () => {
  return (
    <Box
      sx={{
        width: "100%",
        background:
          "linear-gradient(90deg, #22a652 0%, #2faa54 50%, #22a652 100%)",
        color: "#fff",
        py: { xs: 1.2, sm: 1.5 },
        px: { xs: 2, sm: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 1, sm: 1.5 },
          textAlign: "center",
        }}
      >
        {/* Mobile icon */}
        <Box
          component="img"
          src="/images/smartphone.png"
          alt="Mobile app"
          sx={{
            width: { xs: 30, sm: 35 },
            height: { xs: 30, sm: 35 },
            objectFit: "contain",
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontSize: {
              xs: "0.85rem",
              sm: "1rem",
              md: "1.1rem",
            },
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          Keep an eye out for the RentMyBike mobile app coming soon!
        </Typography>

        {/* Bicycle icon */}
        <Box
          component="img"
          src="/images/logo_footer.png"
          alt="RentMyBike"
          sx={{
            width: { xs: 30, sm: 38 },
            height: { xs: 22, sm: 28 },
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
      </Box>
    </Box>
  );
};

export default AppLaunchNotice;