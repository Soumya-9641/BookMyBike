import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { useGetHomeBikesQuery } from "../services/listingApi";
import BikeCard from "./BikeCard";

const ExploreBikes = () => {
  const { data, isLoading, isError } = useGetHomeBikesQuery();

  if (isLoading) {
    return (
      <Box textAlign="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box textAlign="center" py={6}>
        <Typography color="error">
          Failed to load bikes
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="lg" mx="auto" px={2} py={6}>
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        mb={4}
        color="#22a652"
      >
        Explore Bikes
      </Typography>

      <Stack
        direction="row"
        flexWrap="wrap"
        gap={3}
      >
        {data.bikes.map((bike) => (
          <Box
            key={bike._id}
            width={{ xs: "100%", sm: "48%", md: "23%" }}
          >
            <BikeCard bike={bike} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ExploreBikes;
