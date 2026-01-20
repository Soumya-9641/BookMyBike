import { Box, Typography, Stack, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BikeCard from "./BikeCard";

const ExploreBikes = () => {
  return (
    <Box maxWidth="lg" mx="auto" px={{ xs: 2, md: 3 }} mt={8} mb={10}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h5" sx={{ color: "#22a652", fontWeight: 600 }}>
          Explore our bikes
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              border: "1px solid #22a652",
              color: "#22a652",
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              border: "1px solid #22a652",
              color: "#22a652",
            }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {["Uppsala", "Stockholm", "Gothenburg", "Stockholm"].map(
          (city, index) => (
            <BikeCard key={index} city={city} />
          )
        )}
      </Box>
    </Box>
  );
};

export default ExploreBikes;
