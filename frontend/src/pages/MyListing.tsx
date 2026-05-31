import {
    Box,
    Typography,
    CircularProgress,
    Grid,
} from "@mui/material";
import { useGetMyListingsQuery } from "../services/bookingApi";
import ListingCard from "../components/ListingCard";
import AccountTabs from "../components/AccountTabs";

const MyListings = () => {
    const { data, isLoading , refetch} = useGetMyListingsQuery();
    if (isLoading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <CircularProgress />
            </Box>
        );

    return (
        <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
            <AccountTabs />

            <Typography variant="h5" fontWeight={700} mb={3}>
                My Listings
            </Typography>

            {data?.listings?.length === 0 ? (
                <Typography color="text.secondary">
                    You haven’t created any listings yet.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {data?.listings.map((listing) => (
                        <ListingCard listing={listing} key={listing.listingId} 
                        refetch={refetch} />
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default MyListings;