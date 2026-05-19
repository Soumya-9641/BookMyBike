// src/pages/admin/AdminEditListingModal.tsx
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import EditListing from "../EditListings";

const AdminEditListingModal = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/admin/listings");
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Edit Listing
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <EditListing />
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditListingModal;