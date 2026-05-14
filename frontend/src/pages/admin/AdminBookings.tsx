import { Typography, CircularProgress } from "@mui/material";
import { useGetAllBookingsQuery } from "../../services/adminApi";
import AdminBookingTable from "../../components/admin/AdminBookingTable";

const AdminBookings = () => {
  const { data, isLoading, isError } = useGetAllBookingsQuery();

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error loading bookings</Typography>;

  return (
    <>
      <Typography variant="h5" fontWeight={700}>
        All Bookings
      </Typography>

      <AdminBookingTable bookings={data || []} />
    </>
  );
};

export default AdminBookings;