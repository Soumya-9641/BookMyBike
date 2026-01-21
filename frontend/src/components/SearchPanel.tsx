import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import DateTimeDialog from "./DateTimeDialog";

const SearchPanel = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const [startDateTime, setStartDateTime] = useState<Dayjs>(
    dayjs().add(1, "hour")
  );
  const [endDateTime, setEndDateTime] = useState<Dayjs>(
    dayjs().add(5, "hour")
  );

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
        <TextField
          label="City"
          value="Kolkata"
          size="small"
        />

        {/* Location */}
        <TextField
          label="Location"
          size="small"
          value="Ground Floor, Motor Vehicles"
        />

        {/* Trip Start */}
        <TextField
          label="Trip Starts"
          size="small"
          value={startDateTime.format("DD MMM YY, hh:mm A")}
          onClick={() => setOpenDialog(true)}
          InputProps={{ readOnly: true }}
        />

        {/* Trip End */}
        <TextField
          label="Trip Ends"
          size="small"
          value={endDateTime.format("DD MMM YY, hh:mm A")}
          onClick={() => setOpenDialog(true)}
          InputProps={{ readOnly: true }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#22a652",
            fontWeight: 600,
          }}
        >
          SEARCH
        </Button>
      </Stack>

      {/* Date & Time Dialog */}
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
