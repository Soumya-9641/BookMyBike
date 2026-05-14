import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Collapse,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  availableFilters: {
    category: string[];
    brand: string[];
    city: string[];
  };
  selectedFilters: any;
  onChange: (type: string, value: string) => void;
  onApply: () => void;
}

const FilterSection = ({
  title,
  items,
  type,
  selected,
  onChange,
}: any) => {
  const [open, setOpen] = useState(true);

  return (
    <Box mb={2}>
      {/* Section Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        <Typography fontWeight={600} fontSize={14}>
          {title}
        </Typography>
        <ExpandMoreIcon
          fontSize="small"
          sx={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}
        />
      </Box>

      <Collapse in={open}>
        <FormGroup sx={{ mt: 1 }}>
          {items.map((item: string) => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  size="small"
                  checked={selected.includes(item)}
                  onChange={() => onChange(type, item)}
                />
              }
              label={
                <Typography fontSize={13}>{item}</Typography>
              }
            />
          ))}
        </FormGroup>
      </Collapse>
    </Box>
  );
};

const FiltersSidebar = ({
  availableFilters,
  selectedFilters,
  onChange,
  onApply,
}: Props) => {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        p: 2,
        bgcolor: "#fff",
      }}
    >
      {/* Header */}
      <Typography fontWeight={700} mb={2}>
        Filter by:
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Category */}
      <FilterSection
        title="Category"
        items={availableFilters.category}
        type="category"
        selected={selectedFilters.category}
        onChange={onChange}
      />

      <Divider sx={{ my: 1 }} />

      {/* Brand */}
      <FilterSection
        title="Popular Brands"
        items={availableFilters.brand}
        type="brand"
        selected={selectedFilters.brand}
        onChange={onChange}
      />

      <Divider sx={{ my: 1 }} />

      {/* City */}
      <FilterSection
        title="Popular Cities"
        items={availableFilters.city}
        type="city"
        selected={selectedFilters.city}
        onChange={onChange}
      />

      {/* Apply */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          bgcolor: "#22a652",
          fontWeight: 600,
          "&:hover": { bgcolor: "#1e8e4a" },
        }}
        onClick={onApply}
      >
        Apply Filters
      </Button>
    </Box>
  );
};

export default FiltersSidebar;