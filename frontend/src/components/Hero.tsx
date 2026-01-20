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
        {/* Background Panel */}
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.6)", // opacity: 0.600
            width: { xs: "100%", md: 660 },
            borderRadius: "6px",
            p: { xs: 3, md: 3 },
            border: "0px solid #000",
            mt: 10
          }}
        >
          <Box color="white">
            <Typography variant="h3" fontWeight="bold">
              Discover Smart Bike
            </Typography>

            <Typography variant="h6" mt={1}>
              Sharing On Your Terms
            </Typography>

            <Typography variant="h3" fontWeight="bold" mt={2}>
              WHENEVER. WHEREVER.
            </Typography>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default Hero;
