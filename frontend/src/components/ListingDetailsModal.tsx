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
  if (!listing) return null;

  // ✅ NORMALIZE DATA (User + Admin)
  const listingId = listing.listingId || listing._id;
  const brand = listing?.bike?.brand ?? listing?.brand ?? "—";
  const model = listing?.bike?.modelbike ?? listing?.modelbike ?? "—";
  const category = listing?.bike?.category ?? listing?.category ?? "—";
  const size = listing?.bike?.size ?? listing?.size ?? "—";
  const accessories = listing?.accessories ?? [];
  const rates = listing?.rates ?? {};
  const location = listing?.location ?? {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Listing Details</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {/* BASIC INFO */}
          <Typography variant="h6">Basic Info</Typography>
          <Divider />
          <Typography>Listing ID: {listingId}</Typography>
          <Typography>Title: {listing.title}</Typography>
          <Typography>Description: {listing.description}</Typography>

          {/* BIKE INFO */}
          <Typography variant="h6" mt={2}>
            Bike Details
          </Typography>
          <Divider />
          <Typography>Brand: {brand}</Typography>
          <Typography>Model: {model}</Typography>
          <Typography>Category: {category}</Typography>
          <Typography>Size: {size}</Typography>

          {/* PRICING */}
          <Typography variant="h6" mt={2}>
            Pricing
          </Typography>
          <Divider />
          {rates.hourly && (
            <Typography>Hourly: SEK {rates.hourly}</Typography>
          )}
          {rates.daily && (
            <Typography>Daily: SEK {rates.daily}</Typography>
          )}
          {rates.weekly && (
            <Typography>Weekly: SEK {rates.weekly}</Typography>
          )}
          {rates.monthly && (
            <Typography>Monthly: SEK {rates.monthly}</Typography>
          )}
          <Typography>
            Deposit: SEK {listing.depositAmount ?? "—"}
          </Typography>

          {/* ACCESSORIES */}
          <Typography variant="h6" mt={2}>
            Accessories
          </Typography>
          <Divider />
          {accessories.length > 0 ? (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {accessories.map((a: string) => (
                <Chip key={a} label={a} size="small" />
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">No accessories</Typography>
          )}

          {/* LOCATION */}
          <Typography variant="h6" mt={2}>
            Location
          </Typography>
          <Divider />
          <Typography>{location.address || "—"}</Typography>
          {location.city && <Typography>City: {location.city}</Typography>}
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