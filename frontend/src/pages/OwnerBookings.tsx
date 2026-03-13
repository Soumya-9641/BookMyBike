import { Typography, CircularProgress } from "@mui/material";
import {
  useGetOwnerBookingsQuery,
} from "../services/bookingApi";
import BookingTable from "../components/BookingTable";
import { toast } from "react-hot-toast";

const OwnerBookings = () => {
  const { data, isLoading } = useGetOwnerBookingsQuery();

  const handleStatusChange = async (
    bookingId: string,
    status: "completed" | "refunded"
  ) => {
    // try {
    //   await updateStatus({ bookingId, status }).unwrap();
    //   toast.success("Status updated");
    // } catch {
    //   toast.error("Failed to update status");
    // }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h5" mb={2}>Owner Bookings</Typography>
      <BookingTable
        bookings={data?.bookings || []}
        editable
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default OwnerBookings;