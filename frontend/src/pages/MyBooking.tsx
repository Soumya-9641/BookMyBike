import { Typography, CircularProgress } from "@mui/material";
import { useGetMyBookingsQuery } from "../services/bookingApi";
import BookingTable from "../components/BookingTable";

const MyBookings = () => {
  const { data, isLoading } = useGetMyBookingsQuery();

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h5" mb={2}>My Bookings</Typography>
      <BookingTable bookings={data?.bookings || []} />
    </>
  );
};

export default MyBookings;