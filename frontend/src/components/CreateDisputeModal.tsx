import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";

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

const CreateDisputeModal = ({ open, onClose, onSubmit }: Props) => {
  const [type, setType] = useState<"APPLICABLE" | "NOT_APPLICABLE">(
    "APPLICABLE",
  );
  const [disputeAmount, setDisputeAmount] = useState("");
  const [reason, setReason] = useState("");
  const [image, setImage] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* 🔁 CLEANUP OBJECT URL */
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (file?: File) => {
    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const disputeOptions = [
    { label: "Yes", value: "APPLICABLE" },
    { label: "No", value: "NOT_APPLICABLE" },
  ];
  const handleSubmit = () => {
    onSubmit({
      disputeAmount: type === "NOT_APPLICABLE" ? 0 : Number(disputeAmount),
      reason: type === "NOT_APPLICABLE" ? "Not applicable" : reason,
      date: new Date(),
      time: new Date().toLocaleTimeString(),
      type,
      image,
    });

    // reset
    setImage(undefined);
    setImagePreview(null);
  };

  const handleClose = () => {
    setImage(undefined);
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Settlement / Dispute</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* TYPE */}
          <TextField
            select
            label="Raise dispute options"
            value={type}
            onChange={(e) =>
              setType(e.target.value as "APPLICABLE" | "NOT_APPLICABLE")
            }
          >
            {disputeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
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

          {/* IMAGE UPLOAD */}
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
              onChange={(e) => handleImageChange(e.target.files?.[0])}
            />
          </Button>

          {/* IMAGE PREVIEW */}
          {imagePreview && (
            <Box
              component="img"
              src={imagePreview}
              alt="Dispute Preview"
              sx={{
                width: "100%",
                maxHeight: 220,
                objectFit: "contain",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDisputeModal;
