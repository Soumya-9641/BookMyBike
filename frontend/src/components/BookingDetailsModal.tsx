import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import type { Booking } from "../types/listing";

interface Props {
  open: boolean;
  booking: Booking;
  onClose: () => void;
}

const BookingDetailsModal = ({ open, booking, onClose }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Booking Details</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {/* Booking Info */}
          <Typography variant="h6">Booking Info</Typography>
          <Divider />
          <Typography>Booking ID: {booking.bookingId}</Typography>
          <Typography>Status: {booking.status}</Typography>
          <Typography>
            Start: {new Date(booking.startDate).toLocaleString()}
          </Typography>
          <Typography>
            End: {new Date(booking.endDate).toLocaleString()}
          </Typography>

          {/* Bike Info */}
          <Typography variant="h6" mt={2}>Bike Details</Typography>
          <Divider />
          <Typography>Title: {booking.bike.title}</Typography>
          <Typography>Brand: {booking.bike.brand}</Typography>
          <Typography>Model: {booking.bike.modelbike}</Typography>
          <Typography>Category: {booking.bike.category}</Typography>
          <Typography>Size: {booking.bike.size}</Typography>
          <Typography>
            Location: {booking.bike.location.address}
          </Typography>

          {/* Pricing */}
          <Typography variant="h6" mt={2}>Pricing</Typography>
          <Divider />
          <Typography>
            Total Amount: SEK {booking.pricing.totalAmount}
          </Typography>
          <Typography>
            Security Deposit: SEK {booking.pricing.securityDeposit}
          </Typography>

          {/* Ride Info */}
          <Typography variant="h6" mt={2}>Ride Info</Typography>
          <Divider />
          <Typography>
            Actual Start: {booking.ride.actualStartTime ?? "—"}
          </Typography>
          <Typography>
            Actual End: {booking.ride.actualEndTime ?? "—"}
          </Typography>
          <Typography>
            Penalty: SEK {booking.ride.penaltyAmount}
          </Typography>
          {booking.ride.penaltyReason && (
            <Typography>
              Penalty Reason: {booking.ride.penaltyReason}
            </Typography>
          )}

          {/* Owner */}
          <Typography variant="h6" mt={2}>Owner</Typography>
          <Divider />
          <Typography>
            {booking.owner?.firstName} {booking.owner?.lastName}
          </Typography>
          <Typography>Email: {booking.owner?.email}</Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailsModal;