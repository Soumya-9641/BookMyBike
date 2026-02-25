import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { useFilterBikesMutation } from "../services/listingApi";
import { useState } from "react";

const FiltersSidebar = () => {
  const [filterBikes] = useFilterBikesMutation();
  const [filters, setFilters] = useState<any>({
    category: [],
    brand: [],
    city: [],
  });

  const handleCheck = (type: string, value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v: string) => v !== value)
        : [...prev[type], value],
    }));
  };

  const applyFilters = async () => {
    await filterBikes({
      filters,
      page: 1,
      limit: 9,
    });
  };

  return (
    <Box>
      <Typography fontWeight={600} mb={2}>
        Filter by
      </Typography>

      <Typography fontSize={14} mb={1}>
        Category
      </Typography>
      <FormGroup>
        {["Mountain", "Road", "Electric"].map((cat) => (
          <FormControlLabel
            key={cat}
            control={
              <Checkbox onChange={() => handleCheck("category", cat)} />
            }
            label={cat}
          />
        ))}
      </FormGroup>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, bgcolor: "#22a652" }}
        onClick={applyFilters}
      >
        Apply Filters
      </Button>
    </Box>
  );
};

export default FiltersSidebar;
