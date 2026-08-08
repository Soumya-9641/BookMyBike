// CategorySelector.tsx
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { memo, useCallback } from "react";
import { BIKE_CATEGORIES } from "../../constant/bikecategories"; // import categories from CreateListing

interface Props {
  mainCategory: string;
  subCategory: string;
  onMainChange: (val: string) => void;
  onSubChange: (val: string) => void;
}

const CategorySelector = memo(function CategorySelector({
  mainCategory,
  subCategory,
  onMainChange,
  onSubChange,
}: Props) {
  const handleMainChange = useCallback(
    (event: any) => {
      onMainChange(event.target.value);
      onSubChange("");
    },
    [onMainChange, onSubChange],
  );

  const handleSubChange = useCallback(
    (event: any) => onSubChange(event.target.value),
    [onSubChange],
  );

  return (
    <Stack spacing={2}>
      {/* MAIN CATEGORY */}
      <FormControl fullWidth>
        <InputLabel>Main Category *</InputLabel>
        <Select
          label="Main Category *"
          value={mainCategory}
          onChange={handleMainChange}
        >
          {Object.keys(BIKE_CATEGORIES).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* SUB CATEGORY */}
      <FormControl fullWidth disabled={!mainCategory}>
        <InputLabel>Sub Category *</InputLabel>
        <Select
          label="Sub Category *"
          value={subCategory}
          onChange={handleSubChange}
        >
          {mainCategory &&
            BIKE_CATEGORIES[
              mainCategory as keyof typeof BIKE_CATEGORIES
            ].map((sub) => (
              <MenuItem key={sub} value={sub}>
                {sub}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Stack>
  );
});

export default CategorySelector;