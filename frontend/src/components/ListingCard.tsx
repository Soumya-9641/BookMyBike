import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Box,
  Switch,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import ListingDetailsModal from "./ListingDetailsModal";
import { useBlockUnblockListingMutation } from "../services/listingApi";
import { toast } from "react-hot-toast";

interface Props {
  listing: any;
  isAdmin?: boolean;
  refetch?: () => void;
}

const ListingCard = ({ listing, isAdmin = false, refetch }: Props) => {
  const [open, setOpen] = useState(false);

  /**
   * ✅ SUPPORT BOTH SHAPES
   * - User API → listing.bike.brand
   * - Admin API → listing.brand
   */
  const brand = listing?.bike?.brand ?? listing?.brand ?? "—";
  const model = listing?.bike?.modelbike ?? listing?.modelbike ?? "—";
  const category = listing?.bike?.category ?? listing?.category ?? "—";
  const rates = listing?.rates ?? {};
  const [blockUnblockListing, { isLoading: isBlocking }] =
    useBlockUnblockListingMutation();
  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* IMAGE */}
        <CardMedia
          component="img"
          height="180"
          image={
            listing?.photos?.[0]
              ? `${import.meta.env.VITE_API_BASE_URL}${listing.photos[0]}`
              : "/placeholder-bike.png"
          }
          alt={listing?.title || "Listing"}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          {/* TITLE */}
          <Typography fontWeight={700} gutterBottom>
            {listing?.title || "Untitled Listing"}
          </Typography>

          {/* BRAND / MODEL */}
          <Typography variant="body2" color="text.secondary">
            {brand} • {model}
          </Typography>

          {/* CATEGORY */}
          <Typography variant="body2" color="text.secondary">
            {category}
          </Typography>

          {/* STATUS */}
          <Stack direction="row" spacing={1} mt={2}>
            <Chip
              label={listing?.isPublished ? "Published" : "Paused"}
              color={listing?.isPublished ? "success" : "default"}
              size="small"
            />
            {listing?.depositAmount !== undefined && (
              <Chip
                label={`Deposit: SEK ${listing.depositAmount}`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>

          {/* PRICING */}
          <Box mt={2}>
            {rates.daily && (
              <Typography variant="body2">Daily: SEK {rates.daily}</Typography>
            )}
            {rates.hourly && (
              <Typography variant="body2">
                Hourly: SEK {rates.hourly}
              </Typography>
            )}
            {rates.weekly && (
              <Typography variant="body2">
                Weekly: SEK {rates.weekly}
              </Typography>
            )}
            {rates.monthly && (
              <Typography variant="body2">
                Monthly: SEK {rates.monthly}
              </Typography>
            )}
          </Box>
        </CardContent>

        {/* ACTIONS */}
        <Stack direction="row" spacing={1} p={2} pt={0}>
          <Switch
            checked={!listing?.isBlocked}
            color="success"
            disabled={isBlocking}
            onChange={async () => {
              try {
                await blockUnblockListing(
                  listing.listingId || listing._id,
                ).unwrap();

                refetch?.();
                toast.success(
                  listing?.isBlocked
                    ? "Your bike listing is now live"
                    : "Your bike listing has been paused",
                );
              } catch (error: any) {
                toast.error(
                  error?.data?.message || "Failed to update listing status",
                );
              }
            }}
          />

          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={() => setOpen(true)}
          >
            View
          </Button>

          {!isAdmin && (
            <Button
              size="small"
              variant="contained"
              color="warning"
              fullWidth
              component={RouterLink}
              to={`/edit-listing/${listing.listingId}`}
            >
              Edit
            </Button>
          )}
        </Stack>
      </Card>

      {open && (
        <ListingDetailsModal
          open={open}
          listing={listing}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ListingCard;
