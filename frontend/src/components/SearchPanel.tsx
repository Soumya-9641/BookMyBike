import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const SearchPanel = () => {
  return (
    <Box
      sx={{
        bgcolor: "#22a652",
        color: "#fff",
        p: 3,
        borderRadius: 1,
        width: 340,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Search for Bike Rentals
      </Typography>

      <Stack spacing={2}>
        <TextField
          select
          size="small"
          label="Category"
          InputProps={{ sx: { bgcolor: "#eafff1" } }}
        >
          <MenuItem value="">Categories select</MenuItem>
        </TextField>

        <Stack direction="row" spacing={2}>
          <TextField
            select
            fullWidth
            size="small"
            label="City"
            InputProps={{ sx: { bgcolor: "#eafff1" } }}
          >
            <MenuItem value="">Select city</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label="#"
            defaultValue="1"
            InputProps={{ sx: { bgcolor: "#eafff1" } }}
          >
            <MenuItem value="1">1</MenuItem>
          </TextField>
        </Stack>

        <TextField
          size="small"
          label="Trip start"
          placeholder="MM/DD/YYYY"
          InputProps={{ sx: { bgcolor: "#eafff1" } }}
        />

        <TextField
          size="small"
          label="Trip end"
          placeholder="MM/DD/YYYY"
          InputProps={{ sx: { bgcolor: "#eafff1" } }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#fff",
            color: "#22a652",
            fontWeight: 600,
          }}
        >
          Search Bikes
        </Button>
      </Stack>
    </Box>
  );
};

export default SearchPanel;
