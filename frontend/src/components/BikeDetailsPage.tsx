import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

import { useGetBikeByIdQuery } from "../services/listingApi";
import { useCreateBookingMutation } from "../services/bookingApi";
import DateTimeDialog from "../components/DateTimeDialog";

const BikeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetBikeByIdQuery(id!);
  const [createBooking, { isLoading: bookingLoading }] =
    useCreateBookingMutation();

  /** ---------------- State ---------------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Dayjs | null>(null);
  const [endDateTime, setEndDateTime] = useState<Dayjs | null>(null);

  if (isLoading) return <CircularProgress />;
  if (!data) return <Typography>Bike not found</Typography>;

  /** ---------------- Booking ---------------- */
  const handleBookNow = async () => {
    if (!startDateTime || !endDateTime) return;

    const hours = endDateTime.diff(startDateTime, "hour");

    try {
      const res = await createBooking({
        listingId: data._id,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        hours,
      }).unwrap();

      navigate("/checkout", {
        state: {
          clientSecret: res.clientSecret,
          bookingId: res.bookingId,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" px={2} py={4}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* Image */}
        <Box width={{ xs: "100%", md: "50%" }}>
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${data.photos[0]}`}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Box>

        {/* Details */}
        <Box width={{ xs: "100%", md: "50%" }}>
          <Typography variant="h4" fontWeight={700}>
            {data.title}
          </Typography>

          <Typography color="text.secondary">
            {data.brand} · {data.modelbike}
          </Typography>

          <Typography mt={2}>
            📍 {data.location.address}, {data.location.city}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography fontSize={18}>
            ₹{data.rates.daily} / day
          </Typography>
          <Typography color="text.secondary">
            Deposit: ₹{data.depositAmount}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Date & Time */}
          <Stack spacing={1}>
            <Typography fontWeight={600}>Trip Time</Typography>

            {startDateTime && endDateTime ? (
              <Typography>
                {startDateTime.format("DD MMM YYYY, hh:mm A")} →{" "}
                {endDateTime.format("DD MMM YYYY, hh:mm A")}
              </Typography>
            ) : (
              <Typography color="text.secondary">
                No time selected
              </Typography>
            )}

            <Button
              variant="outlined"
              onClick={() => setDialogOpen(true)}
            >
              Select Date & Time
            </Button>
          </Stack>

          {/* Book */}
          <Button
            variant="contained"
            sx={{ mt: 3, bgcolor: "#22a652" }}
            disabled={!startDateTime || !endDateTime || bookingLoading}
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        </Box>
      </Stack>

      {/* Date Time Dialog */}
      {startDateTime && endDateTime && (
        <DateTimeDialog
          open={dialogOpen}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          onClose={() => setDialogOpen(false)}
          onApply={(start, end) => {
            setStartDateTime(start);
            setEndDateTime(end);
            setDialogOpen(false);
          }}
        />
      )}

      {/* Initialize dialog first time */}
      {!startDateTime && (
        <DateTimeDialog
          open={dialogOpen}
          startDateTime={dayjs()}
          endDateTime={dayjs().add(1, "hour")}
          onClose={() => setDialogOpen(false)}
          onApply={(start, end) => {
            setStartDateTime(start);
            setEndDateTime(end);
            setDialogOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default BikeDetails;
