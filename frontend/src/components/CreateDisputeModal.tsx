import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  bookingId: string;
  onClose: () => void;
  onSubmit: (data: {
    disputeAmount: number;
    reason: string;
    date: Date;
    time: string;
    type: "APPLICABLE" | "NOT_APPLICABLE";
    image?: File;
  }) => void;
}

const CreateDisputeModal = ({
  open,
  onClose,
  onSubmit,
}: Props) => {
  const [type, setType] = useState<"APPLICABLE" | "NOT_APPLICABLE">("APPLICABLE");
  const [disputeAmount, setDisputeAmount] = useState("");
  const [reason, setReason] = useState("");
  const [image, setImage] = useState<File | undefined>();

  const handleSubmit = () => {
    onSubmit({
      disputeAmount: type === "NOT_APPLICABLE" ? 0 : Number(disputeAmount),
      reason: type === "NOT_APPLICABLE" ? "Not applicable" : reason,
      date: new Date(),
      time: new Date().toLocaleTimeString(),
      type,
      image,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Settlement / Dispute</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* TYPE */}
          <TextField
            select
            label="Settlement Type"
            value={type}
            onChange={(e) =>
              setType(e.target.value as "APPLICABLE" | "NOT_APPLICABLE")
            }
          >
            <MenuItem value="APPLICABLE">Applicable</MenuItem>
            <MenuItem value="NOT_APPLICABLE">Not Applicable</MenuItem>
          </TextField>

          {/* AMOUNT */}
          <TextField
            label="Dispute Amount"
            type="number"
            disabled={type === "NOT_APPLICABLE"}
            value={disputeAmount}
            onChange={(e) => setDisputeAmount(e.target.value)}
          />

          {/* REASON */}
          <TextField
            label="Reason"
            multiline
            rows={3}
            disabled={type === "NOT_APPLICABLE"}
            value={type === "NOT_APPLICABLE" ? "Not applicable" : reason}
            onChange={(e) => setReason(e.target.value)}
          />

          {/* IMAGE */}
          <Button
            component="label"
            variant="outlined"
            disabled={type === "NOT_APPLICABLE"}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0])}
            />
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDisputeModal;