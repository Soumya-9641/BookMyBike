import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Button, Select, MenuItem,
  IconButton, Stack, Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import type { Booking } from "../types/listing";
import BookingDetailsModal from "./BookingDetailsModal";
import { useCompleteRideMutation } from "../services/stripeApi";
import { toast } from "react-hot-toast";
import { statusColorMap } from "../constant/bikecategories";

interface Props {
  bookings: Booking[];
  editable?: boolean;
  refetch?: () => void; // 🔥 to reload /my-bookings or /owner-bookings
}

const BookingTable = ({ bookings, editable, refetch }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [completeRide, { isLoading }] = useCompleteRideMutation();

  const allowedNextStatus = (status: string) => {
    if (status === "upcoming") return ["inprogress"];
    if (status === "inprogress") return ["completed"];
    return [];
  };

const handleSave = async (bookingId: string) => {
  try {
    await completeRide({
      bookingId,
      status: statusDraft === "in_progress" ? "inprogress" : "completed",
    }).unwrap();

    toast.success("Booking status updated successfully");
    setEditingId(null);
    refetch && refetch(); // Refresh the bookings list after update
  } catch (err: any) {
    // 🔥 Proper error extraction
    const errorMessage =
      err?.data?.message ||
      err?.error ||
      "Failed to complete ride";

    toast.error(errorMessage);
  }
};

  return (
    <>
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
            <TableCell>Bike</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Booking Status</TableCell>
            <TableCell>Payment Status</TableCell>
            <TableCell>Details</TableCell>
            {editable && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {bookings.map((b, idx) => {
            const isEditing = editingId === b.bookingId;
            const paymentStatus = b.payment?.status || "pending";
            const disableEdit = ["completed", "refunded"].includes(b.status);

            return (
              <TableRow
                key={b.bookingId}
                sx={{
                  backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#ebebeb",
                  "& td": { py: 2 },
                }}
              >
                <TableCell>{new Date(b.startDate).toLocaleString()}</TableCell>
                <TableCell>{new Date(b.endDate).toLocaleString()}</TableCell>
                <TableCell>{b.bike.title}</TableCell>
                <TableCell>SEK {b.pricing.totalAmount}</TableCell>

                {/* BOOKING STATUS */}
                <TableCell>
                  {!isEditing ? (
                    <Chip
                      label={b.status.replace("_", " ").toUpperCase()}
                      color={statusColorMap[b.status]}
                      size="small"
                    />
                  ) : (
                    <Select
                      size="small"
                      value={statusDraft}
                      onChange={(e) => setStatusDraft(e.target.value)}
                    >
                      <MenuItem value={b.status}>{b.status}</MenuItem>
                      {allowedNextStatus(b.status).map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                  )}
                </TableCell>

                {/* PAYMENT STATUS */}
                <TableCell>
                  <Chip
                    label={paymentStatus.replace("_", " ").toUpperCase()}
                    color={statusColorMap[paymentStatus]}
                    size="small"
                  />
                </TableCell>

                {/* DETAILS */}
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

                {/* ACTION */}
                {editable && (
                  <TableCell>
                    {!isEditing ? (
                      <IconButton
                        disabled={disableEdit || !allowedNextStatus(b.status).length}
                        onClick={() => {
                          setEditingId(b.bookingId);
                          setStatusDraft(b.status);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          color="success"
                          disabled={isLoading}
                          onClick={() => handleSave(b.bookingId)}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => setEditingId(null)}>
                          <CloseIcon />
                        </IconButton>
                      </Stack>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedBooking && (
        <BookingDetailsModal
          open={open}
          booking={selectedBooking}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default BookingTable;