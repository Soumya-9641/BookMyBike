// components/StatusBadge.tsx
import { Chip } from "@mui/material";

const statusColorMap: any = {
  upcoming: "info",
  inprogress: "warning",
  completed: "success",
  refunded: "error",
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <Chip
      label={status.toUpperCase()}
      color={statusColorMap[status] || "default"}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
};

export default StatusBadge;