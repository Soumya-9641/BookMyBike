import {
  Box,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useGetAllListingsQuery } from "../../services/adminApi";
import ListingCard from "../../components/ListingCard";

const AdminListings = () => {
  const { data, isLoading } = useGetAllListingsQuery();

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );

  return (
    <Box maxWidth="lg" mx="auto" px={2} mt={4}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        All Listings
      </Typography>

<Grid container spacing={3}>
        {data?.map((listing, index) => (
          <ListingCard key={listing.listingId ?? listing._id ?? index} listing={listing} isAdmin />
        ))}
     </Grid>
    </Box>
  );
};

export default AdminListings;