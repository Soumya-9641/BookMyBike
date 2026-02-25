import { Box, Stack, Typography } from "@mui/material";
import { useGetAllBikesQuery } from "../services/listingApi";
import BikeCard from "../components/BikeCard";
import FiltersSidebar from "../components/FiltersSidebar";

const BrowseBikes = () => {
  const { data, isLoading } = useGetAllBikesQuery();

  const bikes = data?.bikes ?? [];

  return (
    <Box maxWidth="xl" mx="auto" px={2} py={4}>
      <Typography variant="h4" textAlign="center" color="#22a652" mb={4}>
        Browse our bikes
      </Typography>

      {/* Main layout */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems="flex-start"
      >
        {/* Sidebar */}
        <Box width={{ xs: "100%", md: "25%" }}>
          <FiltersSidebar />
        </Box>

        {/* Bikes section */}
        <Box width={{ xs: "100%", md: "75%" }}>
          {isLoading && <Typography>Loading...</Typography>}

          {!isLoading && bikes.length === 0 && (
            <Typography>No bikes found.</Typography>
          )}

          <Stack
            direction="row"
            flexWrap="wrap"
            gap={3}
          >
            {bikes.map((bike) => (
              <Box
                key={bike._id}
                width={{ xs: "100%", sm: "48%", md: "31%" }}
              >
                <BikeCard bike={bike} />
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default BrowseBikes;
