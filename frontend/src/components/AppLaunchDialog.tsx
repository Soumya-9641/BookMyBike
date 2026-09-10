import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AppLaunchDialogProps {
  open: boolean;
  onClose: () => void;
}

const AppLaunchDialog = ({
  open,
  onClose,
}: AppLaunchDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 },
          overflow: "hidden",
          position: "relative",
          width: {
            xs: "calc(100% - 24px)",
            sm: "90%",
            md: "800px",
          },
          maxWidth: "800px",
          m: 0,
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        aria-label="Close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 10,
          backgroundColor: "rgba(255,255,255,0.9)",
          boxShadow: 2,

          "&:hover": {
            backgroundColor: "#fff",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent
        sx={{
          p: 0,
          lineHeight: 0,
          backgroundColor: "#fff",
        }}
      >
        <Box
          component="img"
          src="/images/app-launch-banner.jpeg"
          alt="RentMyBike App launching soon"
          sx={{
            display: "block",
            width: "100%",
            height: "auto",
            maxHeight: {
              xs: "80vh",
              sm: "85vh",
              md: "90vh",
            },
            objectFit: "contain",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppLaunchDialog;