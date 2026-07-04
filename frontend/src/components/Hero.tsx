import { Box, Typography } from "@mui/material";

const Hero = () => {
  return (
    <Box
      height={520}
      sx={{
        backgroundImage: "url(/images/icons/banner.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.4)",
        }}
      />

      <Box
        position="relative"
        maxWidth="lg"
        mx="auto"
        height="100%"
        display="flex"
        alignItems="center"
        px={2}
      >
        {/* Content Panel */}
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            width: { xs: "100%", md: 660 },
            borderRadius: "6px",
            p: { xs: 3, md: 3 },
            mt: 10,
          }}
        >
          <Box color="white">
            <Typography
              sx={{
                fontSize: { xs: "26px", md: "36px" },
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Discover Smart Bike
            </Typography>

            {/* 🔥 FIXED RESPONSIVE TEXT */}
            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: "26px", sm: "32px", md: "36px" },
                fontWeight: 700,
                opacity: 0.9,
                letterSpacing: "0.4px",
              }}
            >
              Sharing On Your Terms.
            </Typography>

            <Typography
              sx={{
                mt: 2,
                fontSize: { xs: "24px", md: "40px" },
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              WHENEVER. WHEREVER.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;