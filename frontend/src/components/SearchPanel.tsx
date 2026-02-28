import {
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import DateTimeDialog from "./DateTimeDialog";
import LocationAutocomplete from "./LocationAutocomplete";
import { useSearchBikesMutation } from "../services/listingApi";
import { toast } from "react-hot-toast";

const SearchPanel = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const [city] = useState("Sweden");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [startDateTime, setStartDateTime] = useState<Dayjs>(
    dayjs().add(1, "hour")
  );
  const [endDateTime, setEndDateTime] = useState<Dayjs>(
    dayjs().add(5, "hour")
  );

  const [searchBikes, { isLoading }] = useSearchBikesMutation();

  const handleSearch = async () => {
    if (!coords) {
      toast.error("Please select a location");
      return;
    }

    try {
      const res = await searchBikes({
        lat: coords.lat,
        lng: coords.lng,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      }).unwrap();

      if (!res.bikes.length) {
        toast("No bikes available nearby");
        return;
      }

      navigate(
        `/browse-bikes?lat=${coords.lat}&lng=${coords.lng}&start=${startDateTime.toISOString()}&end=${endDateTime.toISOString()}`
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Search failed");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        p: 3,
        borderRadius: 2,
        width: 360,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2}>
        Search for Bike Rentals
      </Typography>

      <Stack spacing={2}>
        {/* City */}
        <Typography fontWeight={600}>City</Typography>
        <Typography>Sweden</Typography>

        {/* Location */}
        <LocationAutocomplete
          label="Location"
          value={location}
          onSelect={(data) => {
            setLocation(data.address);
            setCoords({ lat: data.lat, lng: data.lng });
          }}
        />

        {/* Trip Start */}
        <Button variant="outlined" onClick={() => setOpenDialog(true)}>
          Trip Starts: {startDateTime.format("DD MMM YY, HH:mm")}
        </Button>

        {/* Trip End */}
        <Button variant="outlined" onClick={() => setOpenDialog(true)}>
          Trip Ends: {endDateTime.format("DD MMM YY, HH:mm")}
        </Button>

        <Button
          fullWidth
          variant="contained"
          sx={{ bgcolor: "#22a652", fontWeight: 600 }}
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "SEARCH"}
        </Button>
      </Stack>

      <DateTimeDialog
        open={openDialog}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        onClose={() => setOpenDialog(false)}
        onApply={(start, end) => {
          setStartDateTime(start);
          setEndDateTime(end);
          setOpenDialog(false);
        }}
      />
    </Box>
  );
};

export default SearchPanel;