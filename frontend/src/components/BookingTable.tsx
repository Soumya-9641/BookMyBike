import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Button, Select, MenuItem, IconButton, Stack,
  Tab
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import type { Booking } from "../types/listing";
import BookingDetailsModal from "./BookingDetailsModal";
import { useCompleteRideMutation } from "../services/stripeApi";
import { toast } from "react-hot-toast";

interface Props {
  bookings: Booking[];
  editable?: boolean;
}

const BookingTable = ({ bookings, editable }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [completeRide, { isLoading }] = useCompleteRideMutation();

  const handleEdit = (booking: Booking) => {
    setEditingId(booking.bookingId);
    setStatusDraft(booking.status);
  };

  const handleCancel = () => {
    setEditingId(null);
    setStatusDraft("");
  };

  const handleSave = async (bookingId: string) => {
    try {
      await completeRide({
        bookingId,
        status: statusDraft === "in_progress" ? "inprogress" : "completed",
      }).unwrap();

      toast.success("Booking status updated");
      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update booking");
    }
  };

  const allowedStatuses = (status: string) => {
    if (status === "upcoming") return ["in_progress"];
    if (status === "inprogress") return ["completed"];
    return [];
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow sx={{
            backgroundColor: "#22a652",
            "& th": {
              color: "#fff",
              fontWeight: 600,
              paddingY: "14px",
            },
          }}
          >
            <TableCell sx={{ color: "#fff" }}>Start Date</TableCell>
            <TableCell sx={{ color: "#fff" }}>End Date</TableCell>
            <TableCell sx={{ color: "#fff" }}>Bike</TableCell>
            <TableCell sx={{ color: "#fff" }}>Price</TableCell>
            <TableCell sx={{ color: "#fff" }}>Status</TableCell>
            <TableCell sx={{ color: "#fff" }}>Booking Details</TableCell>
            {editable && <TableCell sx={{ color: "#fff" }}>Action</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {bookings.map((b) => {
            const isEditing = editingId === b.bookingId;

            return (
              <TableRow sx={{ '&:nth-child(odd)': { backgroundColor: "#f9f9f9" }, '&:nth-child(even)': { backgroundColor: "#EBEBEB" }, "&td": { paddingY: "16px" } }} key={b.bookingId}>
                <TableCell>{new Date(b.startDate).toLocaleString()}</TableCell>
                <TableCell>{new Date(b.endDate).toLocaleString()}</TableCell>

                <TableCell>{b.bike.title}</TableCell>
                <TableCell>SEK {b.pricing.totalAmount}</TableCell>

                {/* STATUS */}
                <TableCell>
                  <Select
                    size="small"
                    value={isEditing ? statusDraft : b.status}
                    disabled={!isEditing}
                    onChange={(e) => setStatusDraft(e.target.value)}
                  >
                    <MenuItem value={b.status}>{b.status}</MenuItem>
                    {isEditing &&
                      allowedStatuses(b.status).map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                  </Select>
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
                        disabled={!allowedStatuses(b.status).length}
                        onClick={() => handleEdit(b)}
                      >
                        <EditIcon />
                      </IconButton>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          color="success"
                          onClick={() => handleSave(b.bookingId)}
                          disabled={isLoading}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton color="error" onClick={handleCancel}>
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