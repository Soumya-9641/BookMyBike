import { Box, Paper, Typography } from "@mui/material";
import { useGetAdminStatsQuery } from "../../services/adminApi";

const StatCard = ({ title, value }: any) => (
  <Paper sx={{ p: 3 }}>
    <Typography fontSize={14} color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h5" fontWeight={700}>
      {value}
    </Typography>
  </Paper>
);

const AdminDashboard = () => {
  const { data, isLoading } = useGetAdminStatsQuery();

  if (isLoading) return <Typography>Loading stats...</Typography>;

  const s = data.data;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Admin Dashboard
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <StatCard title="Total Users" value={s.users.total} />
        <StatCard title="Blocked Users" value={s.users.blocked} />
        <StatCard title="Listings" value={s.listings.total} />
        <StatCard title="Revenue (SEK)" value={s.revenue.platformNetRevenue} />
      </Box>
    </Box>
  );
};

export default AdminDashboard;