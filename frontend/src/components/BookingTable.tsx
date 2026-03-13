import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Button, Select, MenuItem
} from "@mui/material";
import type { Booking } from "../types/listing";

interface Props {
  bookings: Booking[];
  editable?: boolean;
  onStatusChange?: (id: string, status: "completed" | "refunded") => void;
}

const BookingTable = ({ bookings, editable, onStatusChange }: Props) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Bike</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Status</TableCell>
          {editable && <TableCell>Action</TableCell>}
        </TableRow>
      </TableHead>

      <TableBody>
        {bookings.map((b) => (
          <TableRow key={b._id}>
            <TableCell>
              {new Date(b.startDate).toLocaleDateString()}
            </TableCell>

            <TableCell>{b.bikeId?.title}</TableCell>

            <TableCell>₹{b.rentalAmount}</TableCell>

            <TableCell>
              {editable ? (
                <Select
                  size="small"
                  value={b.status}
                  onChange={(e) =>
                    onStatusChange?.(
                      b._id,
                      e.target.value as "completed" | "refunded"
                    )
                  }
                >
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              ) : (
                b.status
              )}
            </TableCell>

            {editable && (
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  disabled={b.status !== "completed"}
                >
                  Complete Ride
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookingTable;