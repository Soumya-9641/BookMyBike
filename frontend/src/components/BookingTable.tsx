import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Stack,
  Chip,
  TableContainer,
  Paper,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import type { Booking } from "../types/listing";
import BookingDetailsModal from "./BookingDetailsModal";
import { toast } from "react-hot-toast";
import { statusColorMap } from "../constant/bikecategories";
import {
  useCancelBookingMutation,
  useCompleteRideMutation,
} from "../services/stripeApi";

import {
  useRequestRideStartMutation,
  useAcceptRideStartMutation,
  useRequestRideCompletionMutation,
  useConfirmRideCompletionMutation,
  useCreateDisputeMutation,
} from "../services/bookingApi";
import CreateDisputeModal from "./CreateDisputeModal";
import { getDisplayStatus, formatStatusLabel } from "../utils/bookingStatus";

interface Props {
  bookings: Booking[];
  editable?: boolean; // true = OWNER, false = RENTER
  refetch?: () => void;
}

const BookingTable = ({ bookings, editable = false, refetch }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [openDispute, setOpenDispute] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);

  const [cancelBooking, { isLoading: isCanceling }] =
    useCancelBookingMutation();

  const [requestStart] = useRequestRideStartMutation();
  const [acceptStart] = useAcceptRideStartMutation();
  const [requestCompletion] = useRequestRideCompletionMutation();
  const [confirmCompletion] = useConfirmRideCompletionMutation();
  const [createDispute] = useCreateDisputeMutation();
  const [completeRide] = useCompleteRideMutation();

  /* -------------------- CANCEL -------------------- */
  const handleCancelBooking = async (booking: Booking) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmed) return;

    try {
      await cancelBooking({
        bookingId: booking.bookingId,
        reason: "Cancelled by user",
      }).unwrap();

      toast.success("Booking cancelled successfully");
      refetch?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel booking");
    }
  };

  /* -------------------- DISPUTE + SETTLEMENT -------------------- */
  const handleDisputeSubmit = async (data: {
    disputeAmount: number;
    reason: string;
    date: Date;
    time: string;
    type: "APPLICABLE" | "NOT_APPLICABLE";
    image?: File;
  }) => {
    if (!pendingBooking) return;

    const formData = new FormData();
    formData.append("bookingId", pendingBooking.bookingId);
    formData.append("disputeAmount", String(data.disputeAmount));
    formData.append("reason", data.reason);
    formData.append("date", data.date.toISOString());
    formData.append("time", data.time);
    formData.append("type", data.type);

    if (data.image) {
      formData.append("images", data.image);
    }

    try {
      await createDispute(formData).unwrap();
      toast.success("Dispute created");

      // ONLY for NOT_APPLICABLE → complete ride
      if (data.type === "NOT_APPLICABLE") {
        await completeRide({
          bookingId: pendingBooking.bookingId,
          status: "completed",
        }).unwrap();

        toast.success("Ride completed");
      }

      // ✅ close modal ONLY on success
      setOpenDispute(false);
      setPendingBooking(null);
      refetch?.();
    } catch (err: any) {
      // ❌ modal stays open
      if (err?.status === 409) {
        toast("Dispute already exists", { icon: "ℹ️" });
      } else {
        toast.error(err?.data?.message || "Failed to submit dispute");
      }
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ height: "100%", overflowX: "auto", overflowY: "auto" }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#22a652",
                "& th": { color: "#fff", fontWeight: 600, py: 2 },
              }}
            >
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Bike</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bookings.map((b, idx) => {
              const flags = b.flags || {};
              const paymentStatus = b.payment?.status || b.refund?.paymentStatus || "pending";
              const displayStatus = getDisplayStatus(b.status);

              const amountToShow =
                b.refund?.refundAmount ??
                b.payment?.refundAmount ??
                b.pricing.totalAmount;

              // ✅ NEW settlement hide logic (ONLY ADDITION)
              const hideSettlementButton =
                (b.dispute?.type === "APPLICABLE" &&
                  flags.isDisputeCreated) ||
                (b.dispute?.type === "NOT_APPLICABLE" &&
                  flags.isDisputeCreated &&
                  flags.isSettlementDone);

              return (
                <TableRow
                  key={b.bookingId}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#ebebeb",
                  }}
                >
                  <TableCell>
                    {new Date(b.startDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(b.endDate).toLocaleString()}
                  </TableCell>
                  <TableCell>{b.bike?.title}</TableCell>
                  <TableCell>SEK {amountToShow}</TableCell>

                  <TableCell>
                    <Chip
                      label={formatStatusLabel(displayStatus)}
                      color={statusColorMap[displayStatus]}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={paymentStatus.toUpperCase()}
                      color={statusColorMap[paymentStatus]}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedBooking(b);
                        setOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap">

                      {/* RENTER → REQUEST START */}
                      {!editable &&
                        b.status === "upcoming" &&
                        !flags.renterRequestedStart && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={async () => {
                              try {
                                await requestStart({
                                  bookingId: b.bookingId,
                                }).unwrap();
                                toast.success("Ride start requested");
                                refetch?.();
                              } catch (e: any) {
                                toast.error(
                                  e?.data?.message ||
                                  "Failed to request start"
                                );
                              }
                            }}
                          >
                            Pick it up
                          </Button>
                        )}

                      {/* OWNER → ACCEPT START */}
                      {editable &&
                        b.status === "startRequested" &&
                        flags.renterRequestedStart &&
                        !flags.ownerAcceptedStart && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={async () => {
                              try {
                                await acceptStart({
                                  bookingId: b.bookingId,
                                }).unwrap();
                                toast.success("Ride started");
                                refetch?.();
                              } catch (e: any) {
                                toast.error(
                                  e?.data?.message ||
                                  "Failed to accept start"
                                );
                              }
                            }}
                          >
                            Confirm Pick-up
                          </Button>
                        )}

                      {/* OWNER → END RIDE */}
                      {editable &&
                        b.status === "inprogress" &&
                        !flags.ownerRequestedCompletion && (
                          <Button
                            size="small"
                            color="warning"
                            variant="contained"
                            onClick={async () => {
                              try {
                                await requestCompletion({
                                  bookingId: b.bookingId,
                                }).unwrap();
                                toast.success("Ride end requested");
                                refetch?.();
                              } catch (e: any) {
                                toast.error(
                                  e?.data?.message ||
                                  "Failed to request completion"
                                );
                              }
                            }}
                          >
                            Drop it off
                          </Button>
                        )}

                      {/* RENTER → CONFIRM COMPLETION */}
                      {!editable &&
                        b.status === "completionRequested" &&
                        !flags.renterConfirmedCompletion && (
                          <Button
                            size="small"
                            color="success"
                            variant="contained"
                            onClick={async () => {
                              try {
                                await confirmCompletion({
                                  bookingId: b.bookingId,
                                }).unwrap();
                                toast.success("Ride completed");
                                refetch?.();
                              } catch (e: any) {
                                toast.error(
                                  e?.data?.message ||
                                  "Failed to confirm completion"
                                );
                              }
                            }}
                          >
                            Confirm Drop-off
                          </Button>
                        )}

                      {/* SETTLEMENT / DISPUTE */}
                      {editable &&
                        flags.renterConfirmedCompletion &&
                        !hideSettlementButton && (
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => {
                              setPendingBooking(b);
                              setOpenDispute(true);
                            }}
                          >
                            Settlement
                          </Button>
                        )}

                      {/* CANCEL */}
                      {(b.status === "upcoming" ||
                        b.status === "startRequested") && (
                        <IconButton
                          color="error"
                          disabled={isCanceling}
                          onClick={() => handleCancelBooking(b)}
                        >
                          <CancelIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedBooking && (
        <BookingDetailsModal
          open={open}
          booking={selectedBooking}
          onClose={() => setOpen(false)}
        />
      )}

      {pendingBooking && (
        <CreateDisputeModal
          open={openDispute}
          bookingId={pendingBooking.bookingId}
          onClose={() => setOpenDispute(false)}
          onSubmit={handleDisputeSubmit}
        />
      )}
    </>
  );
};

export default BookingTable;