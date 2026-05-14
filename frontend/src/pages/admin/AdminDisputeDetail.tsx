import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useCompleteAdminRideMutation,
  useGetDisputeDetailQuery,
  useUpdateDisputeMutation,
} from "../../services/adminApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type DisputeStatus = "resolved" | "rejected";
const FINAL_STATUSES: DisputeStatus[] = ["resolved", "rejected"];

const AdminDisputeDetail = () => {
  const { disputeId } = useParams<{ disputeId: string }>();

  /* ───────── Hooks (ALWAYS FIRST) ───────── */
  const {
    data,
    isLoading,
    refetch,
  } = useGetDisputeDetailQuery(disputeId!, {
    skip: !disputeId,
  });

  const [updateDispute, { isLoading: updating }] =
    useUpdateDisputeMutation();

  const [completeRide, { isLoading: completing }] =
    useCompleteAdminRideMutation();

  const [status, setStatus] = useState<DisputeStatus | "">("");

  /* ───────── Sync backend status → UI ───────── */
  useEffect(() => {
    if (data?.dispute?.status && FINAL_STATUSES.includes(data.dispute.status)) {
      setStatus(data.dispute.status);
    }
  }, [data?.dispute?.status]);

  /* ───────── EARLY UI RETURNS (SAFE NOW) ───────── */
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (!data) {
    return <Typography>No dispute found</Typography>;
  }

  /* ───────── Safe destructuring AFTER checks ───────── */
  const { dispute, booking, payment } = data;
  const isFinal = FINAL_STATUSES.includes(dispute.status);

  /* ───────── Actions ───────── */
  const handleUpdate = async () => {
    if (!status) return;

    try {
      // 1️⃣ Update dispute
      await updateDispute({
        disputeId: dispute._id,
        status,
      }).unwrap();

      toast.success("Dispute updated successfully");

      // 2️⃣ Complete ride (refund + payout)
      await completeRide({
        bookingId: booking._id,
        status: "completed",
      }).unwrap();

      toast.success("Ride completed successfully");

      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  /* ───────── UI ───────── */
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Dispute Details
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography fontWeight={600}>Dispute</Typography>
        <Typography>Status: {dispute.status}</Typography>
        <Typography>Reason: {dispute.reason}</Typography>
        <Typography>Amount: SEK {dispute.disputeAmount}</Typography>
      </Paper>

      {booking && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography fontWeight={600}>Booking</Typography>
          <Typography>
            {new Date(booking.startDate).toLocaleString()} →{" "}
            {new Date(booking.endDate).toLocaleString()}
          </Typography>
          <Typography>Total: SEK {booking.totalAmount}</Typography>
        </Paper>
      )}

      {payment && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography fontWeight={600}>Payment</Typography>
          <Typography>Status: {payment.status}</Typography>
          <Typography>Method: {payment.method}</Typography>
          <Typography>Amount: SEK {payment.amount}</Typography>
        </Paper>
      )}

      <Stack direction="row" spacing={2} alignItems="center">
        <Select
          size="small"
          value={status}
          disabled={isFinal}
          displayEmpty
          sx={{ minWidth: 200 }}
          onChange={(e) =>
            setStatus(e.target.value as DisputeStatus)
          }
        >
          <MenuItem value="">Select Status</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>

        <Button
          variant="contained"
          disabled={
            isFinal ||
            !status ||
            updating ||
            completing
          }
          onClick={handleUpdate}
        >
          {updating || completing ? "Processing..." : "Update"}
        </Button>
      </Stack>

      {isFinal && (
        <Typography mt={2} fontSize={13} color="text.secondary">
          This dispute has been finalized and can no longer be modified.
        </Typography>
      )}
    </Box>
  );
};

export default AdminDisputeDetail;