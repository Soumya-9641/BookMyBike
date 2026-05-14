import {
  Typography,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Button,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../../services/adminApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const IconYes = () => (
  <CheckCircleIcon sx={{ color: "success.main" }} />
);

const IconNo = () => (
  <CancelIcon sx={{ color: "error.main" }} />
);

const AdminUsers = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  if (isLoading) return <Typography>Loading users...</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Users
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Verified</TableCell>
            <TableCell>Is Renter</TableCell>
            <TableCell>Is Lister</TableCell>
            <TableCell>Joined</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.data.map((u: any) => {
            const isAdmin = u.systemRole === "admin";
            const isLister = u.systemRole === "user" && u.isLister === true;
            const isRenter =
              u.systemRole === "user";

            return (
              <TableRow key={u.userId}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.systemRole}</TableCell>
                <TableCell>
                  {u.emailVerified ? <IconYes /> : <IconNo />}
                </TableCell>

                {/* IS RENTER */}
                <TableCell>
                  {isAdmin ? <IconNo /> : isRenter ? <IconYes /> : <IconNo />}
                </TableCell>

                {/* IS LISTER */}
                <TableCell>
                  {isAdmin ? <IconNo /> : isLister ? <IconYes /> : <IconNo />}
                </TableCell>

                <TableCell>
                  {new Date(u.memberSince).toLocaleDateString()}
                </TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(`/admin/users/${u.userId}`)
                      }
                    >
                      Bookings
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      onClick={async () => {
                        if (!confirm("Delete user?")) return;
                        await deleteUser(u.userId).unwrap();
                        toast.success("User deleted");
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AdminUsers;