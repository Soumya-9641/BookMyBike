import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import BookingTable from "../components/BookingTable";
import { useGetMyRefundsQuery } from "../services/bookingApi";
import AccountTabs from "../components/AccountTabs";

const MyRefunds = () => {
  const { data, isLoading, isError } = useGetMyRefundsQuery();

  return (
      <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
      <AccountTabs />
      {/* Header */}
      <Typography variant="h5" fontWeight={700} mb={2}>
        My Refunds
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        View all your refunded bookings here.
      </Typography>

      {/* Loading */}
      {isLoading && <CircularProgress />}

      {/* Error */}
      {isError && (
        <Alert severity="error">
          Failed to load refunded bookings
        </Alert>
      )}

      {/* Data */}
      {data && data.bookings.length > 0 ? (
        <BookingTable
          bookings={data.bookings}
          editable={false} // 🔥 important
        />
      ) : (
        !isLoading && (
          <Typography color="text.secondary">
            No refunded bookings found.
          </Typography>
        )
      )}
    </Box>
  );
};

export default MyRefunds;