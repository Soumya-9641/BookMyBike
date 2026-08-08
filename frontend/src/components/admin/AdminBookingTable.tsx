import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { statusColorMap } from "../../constant/bikecategories";
import BookingDetailsModal from "../BookingDetailsModal";

import {
  useConfirmRideCompletionMutation,
  useCreateDisputeMutation,
} from "../../services/bookingApi";
import { useCompleteRideMutation } from "../../services/stripeApi";
import {
  useAdminRefundBookingMutation,
  useAdminRefundEligibleBookingsQuery,
} from "../../services/adminApi";
interface Props {
  bookings: any[];
  refetch?: () => void;
}

const AdminBookingTable = ({ bookings, refetch }: Props) => {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const [confirmCompletion] = useConfirmRideCompletionMutation();
  const [createDispute] = useCreateDisputeMutation();
  const [completeRide] = useCompleteRideMutation();
  const { data: refundEligibleData } = useAdminRefundEligibleBookingsQuery();

  const [adminRefundBooking] = useAdminRefundBookingMutation();

  const refundableBookingIds = new Set(
    refundEligibleData?.bookingIds?.map(String) || [],
  );

  const handleAdminRefund = async (booking: any) => {
    try {
      await adminRefundBooking(booking.bookingId || booking._id).unwrap();

      toast.success("Refund initiated successfully");

      refetch?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to initiate refund");
    }
  };
  /* -------------------- CONFIRM DROP-OFF -------------------- */
  const handleConfirmDropOff = async (booking: any) => {
    try {
      await confirmCompletion({
        bookingId: booking.bookingId,
      }).unwrap();

      toast.success("Ride completed");
      refetch?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to confirm drop-off");
    }
  };

  /* -------------------- ADMIN SETTLEMENT (SAME AS LISTER) -------------------- */
  const handleAdminSettlement = async (booking: any) => {
    const formData = new FormData();
    formData.append("bookingId", booking.bookingId);
    formData.append("disputeAmount", "0");
    formData.append("reason", "Admin settlement");
    formData.append("date", new Date().toISOString());
    formData.append("time", new Date().toLocaleTimeString());
    formData.append("type", "NOT_APPLICABLE");

    try {
      await createDispute(formData).unwrap();
      toast.success("Dispute created");
    } catch (err: any) {
      // ⚠️ SAME BEHAVIOR AS LISTER
      if (err?.status !== 409) {
        toast.error("Failed to create dispute");
        return;
      }
    }

    // ✅ ALWAYS complete ride (even if dispute exists)
    try {
      await completeRide({
        bookingId: booking.bookingId,
        status: "completed",
      }).unwrap();

      toast.success("Ride completed");
      refetch?.();
    } catch {
      toast.error("Failed to complete ride");
    }
  };

  return (
    <>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#22a652",
                "& th": {
                  color: "#fff",
                  fontWeight: 600,
                  py: 2,
                },
              }}
            >
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price / Day</TableCell>
              <TableCell>Security Deposit</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bookings.map((b: any, idx: number) => {
              const flags = b.flags || {};
              const bookingId = String(b.bookingId || b._id);

              const showRefundButton = refundableBookingIds.has(bookingId);
              /* ✅ EXACT SAME HIDE LOGIC AS LISTER */
              const hideSettlementButton =
                (b.dispute?.type === "APPLICABLE" && flags.isDisputeCreated) ||
                (b.dispute?.type === "NOT_APPLICABLE" &&
                  flags.isDisputeCreated &&
                  flags.isSettlementDone);

              return (
                <TableRow
                  key={bookingId}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#ebebeb",
                  }}
                >
                  <TableCell>
                    {new Date(b.startDate).toLocaleString()}
                  </TableCell>
                  <TableCell>{new Date(b.endDate).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={b.status.toUpperCase()}
                      size="small"
                      color={statusColorMap[b.status]}
                    />
                  </TableCell>
                  <TableCell>SEK {b?.pricing?.pricePerDay}</TableCell>
                  <TableCell>SEK {b?.pricing?.securityDeposit}</TableCell>
                  <TableCell>
                    <strong>SEK {b?.pricing?.totalAmount}</strong>
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {/* VIEW */}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedBooking(b)}
                      >
                        View
                      </Button>

                      {/* CONFIRM DROP-OFF */}
                      {b.status === "completionRequested" &&
                        !flags.renterConfirmedCompletion && (
                          <Button
                            size="small"
                            color="success"
                            variant="contained"
                            onClick={() => handleConfirmDropOff(b)}
                          >
                            Confirm Drop-off
                          </Button>
                        )}
                      {showRefundButton && (
                        <Button
                          size="small"
                          color="warning"
                          variant="contained"
                          onClick={() => handleAdminRefund(b)}
                        >
                          Refund
                        </Button>
                      )}
                      {/* SETTLEMENT */}
                      {flags.renterConfirmedCompletion &&
                        !hideSettlementButton && (
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => handleAdminSettlement(b)}
                          >
                            Initiate Payment
                          </Button>
                        )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* DETAILS MODAL */}
      {selectedBooking && (
        <BookingDetailsModal
          open
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
};

export default AdminBookingTable;
