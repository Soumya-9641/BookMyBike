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
  useGetDisputeDetailQuery,
  useUpdateDisputeMutation,
} from "../../services/adminApi";
import { useState } from "react";
import toast from "react-hot-toast";

const AdminDisputeDetail = () => {
  const { disputeId } = useParams();
  const { data, isLoading } = useGetDisputeDetailQuery(disputeId!);
  const [updateDispute] = useUpdateDisputeMutation();

  const [status, setStatus] = useState("");

  if (isLoading) return <Typography>Loading...</Typography>;

  const { dispute, booking, payment } = data;

  const handleUpdate = async () => {
    try {
      await updateDispute({
        disputeId: dispute._id,
        body: { status },
      }).unwrap();

      toast.success("Dispute updated successfully");
    } catch {
      toast.error("Failed to update dispute");
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Dispute Details
      </Typography>

      {/* DISPUTE */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography fontWeight={600}>Dispute</Typography>
        <Typography>Status: {dispute.status}</Typography>
        <Typography>Reason: {dispute.reason}</Typography>
        <Typography>Amount: SEK {dispute.disputeAmount}</Typography>
      </Paper>

      {/* BOOKING */}
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

      {/* PAYMENT */}
      {payment && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography fontWeight={600}>Payment</Typography>
          <Typography>Status: {payment.status}</Typography>
          <Typography>Method: {payment.method}</Typography>
          <Typography>Amount: SEK {payment.amount}</Typography>
        </Paper>
      )}

      {/* ADMIN ACTION */}
      <Stack direction="row" spacing={2}>
        <Select
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Select Status</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>

        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={!status}
        >
          Update
        </Button>
      </Stack>
    </Box>
  );
};

export default AdminDisputeDetail;