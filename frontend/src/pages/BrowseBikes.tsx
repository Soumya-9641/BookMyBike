import { Box, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useGetAllBikesQuery, useSearchBikesMutation } from "../services/listingApi";
import BikeCard from "../components/BikeCard";
import FiltersSidebar from "../components/FiltersSidebar";
import { useEffect, useState } from "react";

const BrowseBikes = () => {
  const [searchParams] = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const isSearchMode = !!(lat && lng && start && end);

  // 👉 All bikes (default browse)
  const { data: allBikesData, isLoading: loadingAll } =
    useGetAllBikesQuery(undefined, { skip: isSearchMode });

  // 👉 Search bikes
  const [searchBikes, { isLoading: loadingSearch }] =
    useSearchBikesMutation();

  const [bikes, setBikes] = useState<any[]>([]);

  useEffect(() => {
    if (isSearchMode) {
      searchBikes({
        lat: Number(lat),
        lng: Number(lng),
        startDate: start!,
        endDate: end!,
      })
        .unwrap()
        .then((res) => setBikes(res.bikes))
        .catch(() => setBikes([]));
    }
  }, [isSearchMode, lat, lng, start, end]);

  useEffect(() => {
    if (!isSearchMode && allBikesData) {
      setBikes(allBikesData.bikes);
    }
  }, [allBikesData, isSearchMode]);

  const isLoading = loadingAll || loadingSearch;

  return (
    <Box maxWidth="xl" mx="auto" px={2} py={4}>
      <Typography variant="h4" textAlign="center" color="#22a652" mb={4}>
        {isSearchMode ? "Available Bikes Near You" : "Browse our bikes"}
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        {/* Sidebar */}
        <Box width={{ xs: "100%", md: "25%" }}>
          <FiltersSidebar />
        </Box>

        {/* Bikes */}
        <Box width={{ xs: "100%", md: "75%" }}>
          {isLoading && <Typography>Loading...</Typography>}

          {!isLoading && bikes.length === 0 && (
            <Typography>No bikes found.</Typography>
          )}

          <Stack direction="row" flexWrap="wrap" gap={3}>
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