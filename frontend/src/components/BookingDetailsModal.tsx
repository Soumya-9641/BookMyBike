import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import type { Booking } from "../types/listing";
import { formatStatusLabel, getDisplayStatus } from "../utils/bookingStatus";

interface Props {
  open: boolean;
  booking: Booking;
  onClose: () => void;
}

const formatDate = (date?: string | null) =>
  date ? new Date(date).toLocaleString() : "—";
const adminRaw = localStorage.getItem("admin");
const BookingDetailsModal = ({ open, booking, onClose }: Props) => {
  const payment = booking.payment;
  const displayStatus = getDisplayStatus(booking.status);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Booking Details</DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* ───────────── BOOKING INFO ───────────── */}
          <Typography variant="h6">Booking Info</Typography>
          <Divider />

          <Stack spacing={1}>
            <Typography>
              <strong>Booking ID:</strong> {booking.bookingId}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>
                <strong>Status:</strong>
              </Typography>
              <Chip
                label={formatStatusLabel(displayStatus)}
                size="small"
                color="primary"
              />
            </Stack>

            <Typography>
              <strong>Start:</strong> {formatDate(booking.startDate)}
            </Typography>

            <Typography>
              <strong>End:</strong> {formatDate(booking.endDate)}
            </Typography>
          </Stack>

          <Typography variant="h6">Owner Details</Typography>
          <Divider />

          <Stack spacing={1}>
            <Typography>
              {booking?.owner?.firstName} {booking?.owner?.lastName}
            </Typography>
            <Typography>Email: {booking?.owner?.email}</Typography>
            <Typography>Phone: {booking?.owner?.phone}</Typography>
          </Stack>

          <Typography variant="h6">Renter Details</Typography>
          <Divider />

          <Stack spacing={1}>
            <Typography>
              {booking?.renter?.firstName} {booking?.renter?.lastName}
            </Typography>
            <Typography>Email: {booking?.renter?.email}</Typography>
            <Typography>Phone: {booking?.renter?.phone}</Typography>
          </Stack>
          {/* ───────────── BIKE DETAILS ───────────── */}
          <Typography variant="h6">Bike Details</Typography>
          <Divider />

          <Stack spacing={1}>
            <Typography fontWeight={600}>
              {booking?.bike?.title}
            </Typography>

            <Typography>
              {booking.bike.brand} · {booking.bike.modelbike}
            </Typography>

            <Typography>
              <strong>Category:</strong> {booking.bike.category}
            </Typography>

            <Typography>
              <strong>Size:</strong> {booking.bike.size}
            </Typography>

            <Typography>
              <strong>Location:</strong>{" "}
              {booking.bike.location.address}
            </Typography>
            <Typography>
              <strong>Pickup Point:</strong>{" "}
              {booking.bike.pickupPoint || "—"}
            </Typography>
          </Stack>

          {/* ───────────── PRICING ───────────── */}
          <Typography variant="h6">Pricing</Typography>
          <Divider />

          <Stack spacing={1}>
            <Typography>
              <strong>Total Amount:</strong> SEK{" "}
              {booking.pricing.totalAmount}
            </Typography>

            <Typography>
              <strong>Security Deposit:</strong> SEK{" "}
              {booking.pricing.securityDeposit}
            </Typography>
          </Stack>
          {/* ───────────── REFUND DETAILS ───────────── */}
          {booking.refund && (
            <>
              <Typography variant="h6">Refund Details</Typography>
              <Divider />

              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>
                    <strong>Status:</strong>
                  </Typography>
                  <Chip
                    label={booking.refund.paymentStatus.toUpperCase()}
                    color="error"
                    size="small"
                  />
                </Stack>

                <Typography>
                  <strong>Amount Charged:</strong> SEK {booking.refund.amountCharged}
                </Typography>

                <Typography>
                  <strong>Deposit Amount:</strong> SEK {booking.refund.depositAmount}
                </Typography>

                <Typography fontWeight={600}>
                  Refund Amount: SEK {booking?.refund.refundAmount ?? 0}
                </Typography>

                <Typography>
                  <strong>Reason:</strong> {booking?.refund.refundReason ?? "—"}
                </Typography>

                <Typography>
                  <strong>Refunded At:</strong>{" "}
                  {new Date(booking?.refund.refundedAt).toLocaleString()}
                </Typography>
              </Stack>
            </>
          )}

          {booking.cancellation && (
            <>
              <Typography variant="h6">Cancellation Info</Typography>
              <Divider />

              <Stack spacing={1}>
                <Typography>
                  Cancelled By: {booking.cancellation.cancelledBy}
                </Typography>

                <Typography>
                  Reason: {booking.cancellation.cancellationReason ?? "—"}
                </Typography>

                <Typography>
                  Cancelled At:{" "}
                  {new Date(booking.cancellation.cancelledAt).toLocaleString()}
                </Typography>
              </Stack>
            </>
          )}
          {/* ───────────── PAYMENT DETAILS ───────────── */}
          {payment && (
            <>
              <Typography variant="h6">Payment Details</Typography>
              <Divider />

              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>
                    <strong>Status:</strong>
                  </Typography>
                  <Chip
                    label={payment?.status?.toUpperCase()}
                    size="small"
                    color="success"
                  />
                </Stack>

                <Typography>
                  <strong>Paid Amount:</strong> SEK {payment?.amount}
                </Typography>

                <Typography>
                  <strong>Deposit Amount:</strong> SEK{" "}
                  {payment?.depositAmount}
                </Typography>

                <Typography>
                  <strong>Currency:</strong> {payment?.currency}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography fontWeight={600}>
                  Platform & Fees
                </Typography>

                <Typography>
                  Platform Fee: SEK {payment?.platformFee}
                </Typography>

                {adminRaw && (<><Typography>
                  VAT Amount: SEK {payment?.vatAmount}
                </Typography>
                  <Typography fontWeight={600}>
                    Owner Payout: SEK {payment?.ownerPayout}
                  </Typography>
                </>)}

                {/* Refund Info */}
                {payment.refundAmount !== undefined && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography fontWeight={600}>
                      Refund Details
                    </Typography>

                    <Typography>
                      Refund Amount: SEK {payment?.refundAmount ?? 0}
                    </Typography>

                    <Typography>
                      Reason: {payment?.refundReason ?? "—"}
                    </Typography>

                    <Typography>
                      Refunded At:{" "}
                      {formatDate(payment?.refundedAt)}
                    </Typography>
                  </>
                )}
              </Stack>
            </>
          )}

          {/* ───────────── RIDE INFO ───────────── */}
          <Typography variant="h6">Ride Info</Typography>
          <Divider />

          <Stack spacing={1}>
            <Typography>
              Actual Start:{" "}
              {formatDate(booking?.ride?.actualStartTime)}
            </Typography>

            <Typography>
              Actual End:{" "}
              {formatDate(booking?.ride?.actualEndTime)}
            </Typography>

            <Typography>
              Penalty Amount: SEK {booking?.ride?.penaltyAmount ?? 0}
            </Typography>

            {booking.ride.penaltyReason && (
              <Typography>
                Penalty Reason: {booking?.ride?.penaltyReason}
              </Typography>
            )}
          </Stack>

          {/* ───────────── OWNER INFO ───────────── */}
          {/* <Typography variant="h6">Owner</Typography>
          <Divider />

          <Stack spacing={1}>
            <Typography>
              {booking?.owner?.firstName} {booking?.owner?.lastName}
            </Typography>
            <Typography>Email: {booking?.owner?.email}</Typography>
             <Typography>Phone: {booking?.owner?.phone}</Typography>
          </Stack> */}
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