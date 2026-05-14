import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useAddAdminMutation } from "../../services/adminApi";
import toast from "react-hot-toast";

const AddAdminDialog = ({ open, onClose }: any) => {
  const [addAdmin] = useAddAdminMutation();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    await addAdmin(form).unwrap();
    toast.success("Admin created");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Admin</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Email"
          margin="dense"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="dense"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdminDialog;