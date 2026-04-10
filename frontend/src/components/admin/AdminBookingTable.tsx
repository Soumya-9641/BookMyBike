import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
} from "@mui/material";
import { statusColorMap } from "../../constant/bikecategories";

interface Props {
  bookings: any[];
}

const AdminBookingTable = ({ bookings }: Props) => {
  return (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AdminBookingTable;