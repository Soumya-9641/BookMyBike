import { Box, Stack, Typography } from "@mui/material";
import { useGetAllBikesQuery } from "../services/listingApi";
import BikeCard from "../components/BikeCard";
import FiltersSidebar from "../components/FiltersSidebar";
import { useEffect, useState } from "react";

const BrowseBikes = () => {
  const { data, isLoading } = useGetAllBikesQuery();

  const [allBikes, setAllBikes] = useState<any[]>([]);
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

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (data?.bikes) {
      setAllBikes(data.bikes);
      setFilteredBikes(data.bikes);
    }
  }, [data]);

  /* ---------------- FILTER HANDLERS ---------------- */
  const handleCheck = (type: string, value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v: string) => v !== value)
        : [...prev[type], value],
    }));
  };

  const applyFilters = () => {
    let result = [...allBikes];

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

  /* ---------------- UI ---------------- */
  return (
    <Box maxWidth="xl" mx="auto" px={2} py={4}>
      <Typography
        variant="h4"
        textAlign="center"
        color="#22a652"
        fontWeight={700}
        mb={4}
      >
        Browse our bikes
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        {/* Sidebar */}
        <Box width={{ xs: "100%", md: "22%" }}>
          {data?.filters && (
            <FiltersSidebar
              availableFilters={data.filters}
              selectedFilters={filters}
              onChange={handleCheck}
              onApply={applyFilters}
            />
          )}
        </Box>

        {/* Bikes */}
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