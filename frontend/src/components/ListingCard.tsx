import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Box,
} from "@mui/material";

interface Props {
  listing: any;
}

const ListingCard = ({ listing }: Props) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* IMAGE */}
      <CardMedia
        component="img"
        height="180"
        image={`${import.meta.env.VITE_API_BASE_URL}${listing.photos?.[0] || "/placeholder-bike.png"}`}
        alt={listing.title}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        {/* TITLE */}
        <Typography fontWeight={700} gutterBottom>
          {listing.title}
        </Typography>

        {/* BRAND / MODEL */}
        <Typography variant="body2" color="text.secondary">
          {listing.bike.brand} • {listing.bike.modelbike}
        </Typography>

        {/* CATEGORY */}
        <Typography variant="body2" color="text.secondary">
          {listing.bike.category}
        </Typography>

        {/* STATUS */}
        <Stack direction="row" spacing={1} mt={2}>
          <Chip
            label={listing.isPublished ? "Published" : "Draft"}
            color={listing.isPublished ? "success" : "default"}
            size="small"
          />
          <Chip
            label={`Deposit: SEK ${listing.depositAmount}`}
            size="small"
            variant="outlined"
          />
        </Stack>

        {/* PRICING */}
        <Box mt={2}>
          {listing.rates?.daily && (
            <Typography variant="body2">
              Daily: SEK {listing.rates.daily}
            </Typography>
          )}
          {listing.rates?.hourly && (
            <Typography variant="body2">
              Hourly: SEK {listing.rates.hourly}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* ACTIONS */}
      <Stack direction="row" spacing={1} p={2} pt={0}>
        {/* <Button size="small" variant="outlined" fullWidth>
          View
        </Button>
        <Button size="small" variant="contained" fullWidth>
          Edit
        </Button> */}
      </Stack>
    </Card>
  );
};

export default ListingCard;