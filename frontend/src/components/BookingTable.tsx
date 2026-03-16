import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Button, Select, MenuItem,
} from "@mui/material";
import { useState } from "react";
import type { Booking } from "../types/listing";
import BookingDetailsModal from "./BookingDetailsModal";
import CompleteRideButton from "./CompleteRideButton";

interface Props {
  bookings: Booking[];
  editable?: boolean; // owner flag
}

const BookingTable = ({ bookings, editable }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Bike</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Details</TableCell>
            {editable && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.bookingId}>
              <TableCell>{new Date(b.startDate).toLocaleString()}</TableCell>
              <TableCell>{new Date(b.endDate).toLocaleString()}</TableCell>
              <TableCell>{b.bike.title}</TableCell>
              <TableCell>SEK {b.pricing.totalAmount}</TableCell>

              {/* STATUS (READ-ONLY) */}
              <TableCell>
                <Select size="small" value={b.status} disabled>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </TableCell>

              {/* VIEW DETAILS */}
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleViewDetails(b)}
                >
                  View Details
                </Button>
              </TableCell>

              {/* COMPLETE RIDE */}
              {editable && (
                <TableCell>
                  {b.status === "in_progress" ? (
                    <CompleteRideButton bookingId={b.bookingId} />
                  ) : (
                    <Button size="small" disabled>
                      Complete Ride
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* DETAILS MODAL */}
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