import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  bookingId: string;
  onSubmit: (data: {
    disputeAmount: number;
    reason: string;
    date: Date;
    time: string;
  }) => void;
  onClose: () => void;
}

const CreateDisputeModal = ({
  open,
  bookingId,
  onSubmit,
  onClose,
}: Props) => {
  const [disputeAmount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit({
      disputeAmount: Number(disputeAmount),
      reason,
      date: new Date(),
      time: new Date().toLocaleTimeString(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Dispute</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Dispute Amount (SEK)"
            type="number"
            value={disputeAmount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <TextField
            label="Reason"
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!disputeAmount || !reason}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDisputeModal;