import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  useGetAllBikesQuery,
  useSearchBikesMutation,
} from "../services/listingApi";

import BikeCard from "../components/BikeCard";
import FiltersSidebar from "../components/FiltersSidebar";

const BrowseBikes = () => {
  const [searchParams] = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const isSearchMode = Boolean(lat && lng && start && end);

  /* ----------------------------------
   API hooks
  -----------------------------------*/
  const { data: allBikesData, isLoading: loadingAll } =
    useGetAllBikesQuery(undefined, {
      skip: isSearchMode,
    });

  const [searchBikes, { isLoading: loadingSearch }] =
    useSearchBikesMutation();

  /* ----------------------------------
   State
  -----------------------------------*/
  const [baseBikes, setBaseBikes] = useState<any[]>([]);
  const [filteredBikes, setFilteredBikes] = useState<any[]>([]);

  const [filters, setFilters] = useState<{
    category: string[];
    brand: string[];
    city: string[];
  }>({
    category: [],
    brand: [],
    city: [],
  });

  const isLoading = loadingAll || loadingSearch;

  /* ----------------------------------
   Load bikes (SEARCH MODE)
  -----------------------------------*/
  useEffect(() => {
    if (isSearchMode) {
      searchBikes({
        lat: Number(lat),
        lng: Number(lng),
        startDate: start!,
        endDate: end!,
      })
        .unwrap()
        .then((res) => {
          setBaseBikes(res.bikes);
          setFilteredBikes(res.bikes);
        })
        .catch(() => {
          setBaseBikes([]);
          setFilteredBikes([]);
        });
    }
  }, [isSearchMode, lat, lng, start, end, searchBikes]);

  /* ----------------------------------
   Load bikes (BROWSE MODE)
  -----------------------------------*/
  useEffect(() => {
    if (!isSearchMode && allBikesData) {
      setBaseBikes(allBikesData.bikes);
      setFilteredBikes(allBikesData.bikes);
    }
  }, [allBikesData, isSearchMode]);

  /* ----------------------------------
   Reset filters when mode changes
  -----------------------------------*/
  useEffect(() => {
    setFilters({
      category: [],
      brand: [],
      city: [],
    });
  }, [isSearchMode]);

  /* ----------------------------------
   Filter handlers
  -----------------------------------*/
  const handleCheck = (type: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type as keyof typeof prev].includes(value)
        ? prev[type as keyof typeof prev].filter((v) => v !== value)
        : [...prev[type as keyof typeof prev], value],
    }));
  };

  const applyFilters = () => {
    let result = [...baseBikes];

    if (filters.category.length) {
      result = result.filter((bike) =>
        filters.category.includes(bike.category)
      );
    }

    if (filters.brand.length) {
      result = result.filter((bike) =>
        filters.brand.includes(bike.brand)
      );
    }

    if (filters.city.length) {
      result = result.filter((bike) =>
        filters.city.includes(bike.location?.city)
      );
    }

    setFilteredBikes(result);
  };

  /* ----------------------------------
   UI
  -----------------------------------*/
  return (
    <Box maxWidth="xl" mx="auto" px={2} py={4}>
      <Typography
        variant="h4"
        textAlign="center"
        color="#22a652"
        fontWeight={700}
        mb={4}
      >
        {isSearchMode
          ? "Available Bikes Near You"
          : "Browse our bikes"}
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        {/* ---------------- Sidebar ---------------- */}
        <Box width={{ xs: "100%", md: "22%" }}>
          {allBikesData?.filters && (
            <FiltersSidebar
              availableFilters={allBikesData.filters}
              selectedFilters={filters}
              onChange={handleCheck}
              onApply={applyFilters}
            />
          )}
        </Box>

        {/* ---------------- Bikes ---------------- */}
        <Box width={{ xs: "100%", md: "78%" }}>
          {isLoading && <Typography>Loading...</Typography>}

          {!isLoading && filteredBikes.length === 0 && (
            <Typography>No bikes found.</Typography>
          )}

          <Stack direction="row" flexWrap="wrap" gap={3}>
            {filteredBikes.map((bike) => (
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