import { Typography, CircularProgress, Box } from "@mui/material";
import { useGetOwnerBookingsQuery } from "../services/bookingApi";
import BookingTable from "../components/BookingTable";
import AccountTabs from "../components/AccountTabs";

const OwnerBookings = () => {
  const { data, isLoading, refetch } = useGetOwnerBookingsQuery();

  if (isLoading) return <CircularProgress />;

  return (
    <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
      <AccountTabs />
      <Typography variant="h5" mb={2} fontWeight={700}>
        Owner Bookings
      </Typography>

      <BookingTable
        bookings={data?.bookings || []}
        editable
        refetch={refetch}
      />
    </Box>
  );
};

export default OwnerBookings;