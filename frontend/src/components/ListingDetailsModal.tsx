import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Divider,
  Button,
  Chip,
} from "@mui/material";

interface Props {
  open: boolean;
  listing: any;
  onClose: () => void;
}

const ListingDetailsModal = ({ open, listing, onClose }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Listing Details</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {/* BASIC INFO */}
          <Typography variant="h6">Basic Info</Typography>
          <Divider />
          <Typography>Listing ID: {listing.listingId}</Typography>
          <Typography>Title: {listing.title}</Typography>
          <Typography>Description: {listing.description}</Typography>

          {/* BIKE INFO */}
          <Typography variant="h6" mt={2}>Bike Details</Typography>
          <Divider />
          <Typography>Brand: {listing.bike.brand}</Typography>
          <Typography>Model: {listing.bike.modelbike}</Typography>
          <Typography>Category: {listing.bike.category}</Typography>
          <Typography>Size: {listing.bike.size}</Typography>

          {/* PRICING */}
          <Typography variant="h6" mt={2}>Pricing</Typography>
          <Divider />
          {listing.rates?.hourly && (
            <Typography>Hourly: SEK {listing.rates.hourly}</Typography>
          )}
          {listing.rates?.daily && (
            <Typography>Daily: SEK {listing.rates.daily}</Typography>
          )}
          {listing.rates?.weekly && (
            <Typography>Weekly: SEK {listing.rates.weekly}</Typography>
          )}
          {listing.rates?.monthly && (
            <Typography>Monthly: SEK {listing.rates.monthly}</Typography>
          )}
          <Typography>Deposit: SEK {listing.depositAmount}</Typography>

          {/* ACCESSORIES */}
          <Typography variant="h6" mt={2}>Accessories</Typography>
          <Divider />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {listing.accessories.map((a: string) => (
              <Chip key={a} label={a} size="small" />
            ))}
          </Stack>

          {/* LOCATION */}
          <Typography variant="h6" mt={2}>Location</Typography>
          <Divider />
          <Typography>{listing.location.address}</Typography>
          <Typography>City: {listing.location.city}</Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ListingDetailsModal;