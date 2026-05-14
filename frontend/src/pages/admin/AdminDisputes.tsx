import { Typography, Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetAllDisputesQuery } from "../../services/adminApi";
import AdminTable from "../../components/admin/AdminTable";

const AdminDisputes = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllDisputesQuery();

  if (isLoading) return <Typography>Loading disputes...</Typography>;

  const columns = [
    { key: "bookingId", label: "Booking ID" },
    { key: "disputeAmount", label: "Amount (SEK)" },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <Chip
          label={row.status.toUpperCase()}
          color={
            row.status === "open"
              ? "warning"
              : row.status === "resolved"
              ? "success"
              : "error"
          }
          size="small"
        />
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row: any) =>
        new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "action",
      label: "Action",
      render: (row: any) => (
        <Button
          size="small"
          onClick={() => navigate(`/admin/disputes/${row._id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Disputes
      </Typography>

      <AdminTable columns={columns} rows={data.disputes} />
    </>
  );
};

export default AdminDisputes;