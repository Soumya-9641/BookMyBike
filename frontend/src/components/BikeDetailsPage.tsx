import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import { useGetBikeByIdQuery } from "../services/listingApi";
import { useCreateBookingMutation } from "../services/bookingApi";

const BikeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetBikeByIdQuery(id!);
  const [createBooking, { isLoading: bookingLoading }] =
    useCreateBookingMutation();

  if (isLoading) return <CircularProgress />;
  if (!data) return <Typography>Bike not found</Typography>;

  const handleBookNow = async () => {
    try {
      const res = await createBooking({
        listingId: data._id,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        hours: 1,
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
        <Box width="50%">
          <img
            src={`${import.meta.env.VITE_API_URL}${data.photos[0]}`}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Box>

        <Box width="50%">
          <Typography variant="h4">{data.title}</Typography>
          <Typography>{data.brand} · {data.modelbike}</Typography>
          <Typography mt={2}>₹{data.rates.daily}/day</Typography>
          <Typography>Deposit ₹{data.depositAmount}</Typography>

          <Button
            variant="contained"
            sx={{ mt: 3, bgcolor: "#22a652" }}
            onClick={handleBookNow}
            disabled={bookingLoading}
          >
            Book Now
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default BikeDetails;
