import { Box, Typography, Stack, Button } from "@mui/material";
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
  const [location, setLocation] = useState("");

  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [startDateTime, setStartDateTime] = useState<Dayjs>(
    dayjs().add(1, "hour"),
  );

  const [endDateTime, setEndDateTime] = useState<Dayjs>(
    dayjs().add(5, "hour"),
  );

  const [searchBikes, { isLoading }] =
    useSearchBikesMutation();

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

      if (res.count === 0) {
        toast("No bikes found nearby");
      }

      navigate(
        `/browse-bikes?lat=${coords.lat}&lng=${coords.lng}&start=${startDateTime.toISOString()}&end=${endDateTime.toISOString()}`,
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Search failed",
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: {
          xs: 1.5,
          sm: 2,
          md: 0,
        },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          p: {
            xs: 2,
            sm: 3,
          },

          /*
           * Responsive width:
           * Mobile -> almost full width
           * Tablet/Desktop -> fixed comfortable width
           */
          width: {
            xs: "100%",
            sm: 380,
            md: 360,
          },

          maxWidth: {
            xs: "100%",
            sm: 380,
          },

          boxSizing: "border-box",

          borderRadius: 2,

          boxShadow:
            "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
          sx={{
            fontSize: {
              xs: "1.1rem",
              sm: "1.25rem",
            },
          }}
        >
          Search for Bike Rentals
        </Typography>

        <Stack spacing={2}>

          {/* ================= LOCATION ================= */}

          <LocationAutocomplete
            label="Location"
            value={location}
            onChange={(val) => {
              setLocation(val);

              // Force user to select
              // an actual location suggestion
              setCoords(null);
            }}
            onSelect={(data) => {
              setLocation(data.address);

              setCoords({
                lat: data.lat,
                lng: data.lng,
              });
            }}
          />

          {/* ================= TRIP START ================= */}

          <Button
            variant="outlined"
            fullWidth
            onClick={() =>
              setOpenDialog(true)
            }
            sx={{
              minHeight: 48,
              textTransform: "none",
              justifyContent: "flex-start",
              px: 2,
              whiteSpace: "normal",
              textAlign: "left",
            }}
          >
            Trip Starts:{" "}
            {startDateTime.format(
              "DD MMM YY, HH:mm",
            )}
          </Button>

          {/* ================= TRIP END ================= */}

          <Button
            variant="outlined"
            fullWidth
            onClick={() =>
              setOpenDialog(true)
            }
            sx={{
              minHeight: 48,
              textTransform: "none",
              justifyContent: "flex-start",
              px: 2,
              whiteSpace: "normal",
              textAlign: "left",
            }}
          >
            Trip Ends:{" "}
            {endDateTime.format(
              "DD MMM YY, HH:mm",
            )}
          </Button>

          {/* ================= SEARCH ================= */}

          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#22a652",
              fontWeight: 600,
              minHeight: 48,

              "&:hover": {
                bgcolor: "#1e9449",
              },
            }}
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading
              ? "Searching..."
              : "SEARCH"}
          </Button>
        </Stack>

        {/* ================= DATE/TIME DIALOG ================= */}

        <DateTimeDialog
          open={openDialog}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          onClose={() =>
            setOpenDialog(false)
          }
          onApply={(start, end) => {
            setStartDateTime(start);
            setEndDateTime(end);
            setOpenDialog(false);
          }}
        />
      </Box>
    </Box>
  );
};

export default SearchPanel;