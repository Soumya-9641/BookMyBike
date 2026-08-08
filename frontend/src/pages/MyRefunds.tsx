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
    <Box
      sx={{
        height: {
          xs: "calc(100vh - 120px)", // mobile: header + footer height
          md: "auto",
        },
        overflow: "hidden",
      }}
      mt={4} mb={8} px={2}
    >
      <AccountTabs />
      {/* Header */}
      <Typography variant="h5" fontWeight={700} mb={2}>
        My Payments
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