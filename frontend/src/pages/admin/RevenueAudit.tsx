import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetAuditQuery,
  useCreateAuditMutation,
} from "../../services/auditApi";

interface AuditMonth {
  year: number;
  month: number;
  monthName: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalAdminAmount: number;
  stripeFee: number;
  platformProfit: number;
  isPayoutEligible: boolean;
  isPayoutDone: boolean;
}

const RevenueAudit = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data, isLoading, refetch } = useGetAuditQuery(year);

  const [createAudit, { isLoading: creating }] = useCreateAuditMutation();

  const handleGenerate = async (row: AuditMonth) => {
    try {
      await createAudit({
        year: row.year,
        month: row.month,
        monthName: row.monthName,
        totalBookings: row.totalBookings,
        completedBookings: row.completedBookings,
        cancelledBookings: row.cancelledBookings,
        totalAdminAmount: row.totalAdminAmount,
        stripeFee: row.stripeFee,
        platformProfit: row.platformProfit,
      }).unwrap();

      toast.success(`${row.monthName} audit generated`);

      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to generate audit");
    }
  };
  // header does not depend on a specific row

  return (
    <Box maxWidth="xl" mx="auto" p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={700}>
          Revenue Audit
        </Typography>

        <FormControl size="small">
          <Select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Paper elevation={3}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead
              sx={{
                background: "#22a652",
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>
                  Month
                </TableCell>

                <TableCell sx={{ color: "#fff" }} align="center">
                  Total
                </TableCell>

                <TableCell sx={{ color: "#fff" }} align="center">
                  Completed
                </TableCell>

                <TableCell sx={{ color: "#fff" }} align="center">
                  Cancelled
                </TableCell>

                <TableCell sx={{ color: "#fff" }} align="center">
                  Admin Amount
                </TableCell>

                <TableCell sx={{ color: "#fff" }} align="center">
                  Stripe Fee
                </TableCell>

                <TableCell sx={{ color: "#fff" }} align="center">
                  Platform Profit
                </TableCell>

                <TableCell sx={{ color: "#fff" }} align="center">
                  Status
                </TableCell>

                <TableCell align="center" sx={{ color: "#fff" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.data?.map((row: AuditMonth) => {
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1;

                const isCurrentOrFutureMonth =
                  row.year > currentYear ||
                  (row.year === currentYear && row.month >= currentMonth);

                const isCompleted = row.isPayoutDone;
                const isRowDisabled = isCurrentOrFutureMonth && !isCompleted;

                return (
                  <TableRow
                    key={`${row.year}-${row.month}`}
                    sx={{
                      opacity: isRowDisabled ? 0.5 : 1,
                      backgroundColor: isRowDisabled
                        ? "#f5f5f5"
                        : isCompleted
                        ? "#d1e7dd"
                        : "inherit",
                      pointerEvents: isRowDisabled ? "none" : "auto",
                    }}
                  >
                    <TableCell align="center">{row.monthName}</TableCell>

                    <TableCell align="center">{row.totalBookings}</TableCell>

                    <TableCell align="center">
                      {row.completedBookings}
                    </TableCell>

                    <TableCell align="center">
                      {row.cancelledBookings}
                    </TableCell>

                    <TableCell align="center">
                      {"SEK "}
                      {row.totalAdminAmount.toFixed(2)}
                    </TableCell>

                    <TableCell align="center">
                      {"SEK "}
                      {row.stripeFee.toFixed(2)}
                    </TableCell>

                    <TableCell align="center">
                      {"SEK "}
                      {row.platformProfit.toFixed(2)}
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={row.isPayoutDone ? "Completed" : "Pending"}
                        color={row.isPayoutDone ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        disabled={
                          isCompleted ||
                          isRowDisabled ||
                          creating
                        }
                        onClick={() => handleGenerate(row)}
                      >
                        {row.isPayoutDone ? "Completed" : "Payout"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default RevenueAudit;
