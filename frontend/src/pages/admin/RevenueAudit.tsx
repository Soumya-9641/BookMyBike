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
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState(currentYear);

  const {
    data,
    isLoading,
    refetch,
  } = useGetAuditQuery(year);

  const [createAudit, { isLoading: creating }] =
    useCreateAuditMutation();

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

  return (
    <Box
      maxWidth="xl"
      mx="auto"
      p={3}
    >
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
            onChange={(e) =>
              setYear(Number(e.target.value))
            }
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
          <Box
            display="flex"
            justifyContent="center"
            py={8}
          >
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

                <TableCell sx={{ color: "#fff" }}>
                  Total
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Completed
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Cancelled
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Admin Amount
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Stripe Fee
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Platform Profit
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Status
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "#fff" }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.data?.map((row: AuditMonth) => {
                const disabled =
                  row.year > currentYear ||
                  (row.year === currentYear &&
                    row.month >= currentMonth);

                return (
                  <TableRow key={row.month}>
                    <TableCell>
                      {row.monthName}
                    </TableCell>

                    <TableCell>
                      {row.totalBookings}
                    </TableCell>

                    <TableCell>
                      {row.completedBookings}
                    </TableCell>

                    <TableCell>
                      {row.cancelledBookings}
                    </TableCell>

                    <TableCell>
                      {"SEK "}
                      {row.totalAdminAmount.toFixed(2)}
                    </TableCell>

                    <TableCell>
                      {"SEK "}
                      {row.stripeFee.toFixed(2)}
                    </TableCell>

                    <TableCell>
                      {"SEK "}
                      {row.platformProfit.toFixed(2)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          row.isPayoutDone
                            ? "Completed"
                            : "Pending"
                        }
                        color={
                          row.isPayoutDone
                            ? "success"
                            : "warning"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        disabled={
                          disabled ||
                          row.isPayoutDone ||
                          !row.isPayoutEligible ||
                          creating
                        }
                        onClick={() =>
                          handleGenerate(row)
                        }
                      >
                        {row.isPayoutDone
                          ? "Completed"
                          : "Generate"}
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