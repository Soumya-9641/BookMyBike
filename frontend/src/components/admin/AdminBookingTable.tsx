import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
  Button,
} from "@mui/material";
import { useState } from "react";
import { statusColorMap } from "../../constant/bikecategories";
import BookingDetailsModal from "../BookingDetailsModal";

interface Props {
  bookings: any[];
}

const AdminBookingTable = ({ bookings }: Props) => {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

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
            {bookings.map((b, idx) => (
              <TableRow
                key={b._id}
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
                <TableCell>
                  <Chip
                    label={b.status.toUpperCase()}
                    size="small"
                    color={statusColorMap[b.status]}
                  />
                </TableCell>
                <TableCell>SEK {b.pricePerDay}</TableCell>
                <TableCell>SEK {b.securityDeposit}</TableCell>
                <TableCell>
                  <strong>SEK {b.totalAmount}</strong>
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedBooking(b)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* ✅ REUSED USER MODAL */}
      {selectedBooking && (
        <BookingDetailsModal
          open={Boolean(selectedBooking)}
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
};

export default AdminBookingTable;