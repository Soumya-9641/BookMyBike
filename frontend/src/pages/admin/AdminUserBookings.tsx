import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { useState } from "react";
import { useGetUserBookingSummaryQuery } from "../../services/adminApi";
import AdminBookingTable from "../../components/admin/AdminBookingTable";

const AdminUserBookings = () => {
  const { userId } = useParams();
  const { data, isLoading } = useGetUserBookingSummaryQuery(userId!);
  const [tab, setTab] = useState(0);

  if (isLoading) {
    return <Typography>Loading bookings...</Typography>;
  }

  const renterBookings = data.asRenter.bookings;
  const ownerBookings = data.asOwner.bookings;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        User Booking Summary
      </Typography>

      {/* TABS */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2 }}
      >
        <Tab label={`Renter (${data.asRenter.count})`} />
        <Tab label={`Owner (${data.asOwner.count})`} />
      </Tabs>

      {/* RENTER TAB */}
      {tab === 0 && (
        <>
          {renterBookings.length > 0 ? (
            <AdminBookingTable bookings={renterBookings} />
          ) : (
            <Typography color="text.secondary">
              No bookings found for renter
            </Typography>
          )}
        </>
      )}

      {/* OWNER TAB */}
      {tab === 1 && (
        <>
          {ownerBookings.length > 0 ? (
            <AdminBookingTable bookings={ownerBookings} />
          ) : (
            <Typography color="text.secondary">
              No bookings found for owner
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default AdminUserBookings;