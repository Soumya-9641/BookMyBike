import { Typography, CircularProgress } from "@mui/material";
import { useGetOwnerBookingsQuery } from "../services/bookingApi";
import BookingTable from "../components/BookingTable";

const OwnerBookings = () => {
  const { data, isLoading } = useGetOwnerBookingsQuery();

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h5" mb={2}>
        Owner Bookings
      </Typography>

      <BookingTable
        bookings={data?.bookings || []}
        editable
      />
    </>
  );
};

export default OwnerBookings;