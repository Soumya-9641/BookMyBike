import { Typography, CircularProgress, Box } from "@mui/material";
import { useGetMyBookingsQuery } from "../services/bookingApi";
import BookingTable from "../components/BookingTable";
import AccountTabs from "../components/AccountTabs";

const MyBookings = () => {
  const { data, isLoading } = useGetMyBookingsQuery();

  if (isLoading) return <CircularProgress />;

  return (
    <Box
      sx={{
        height: {
          xs: "calc(100vh - 120px)", // mobile: header + footer height
          md: "auto",
        },
        overflow: "hidden",
      }}
    >
      <AccountTabs />

      <Typography variant="h5" mb={3} fontWeight={700}>
        My Bookings
      </Typography>

      <BookingTable bookings={data?.bookings || []} />
    </Box>

  );
};

export default MyBookings;