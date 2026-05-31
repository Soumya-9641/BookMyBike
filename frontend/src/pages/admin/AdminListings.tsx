import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Stack,
  Switch,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetAllListingsQuery } from "../../services/adminApi";
import { useBlockUnblockListingMutation } from "../../services/listingApi";
import ListingDetailsModal from "../../components/ListingDetailsModal";
import { toast } from "react-hot-toast";

const AdminListings = () => {
  const { data, isLoading, refetch } = useGetAllListingsQuery();
  const navigate = useNavigate();
  const [blockUnblockListing, { isLoading: isToggling }] = useBlockUnblockListingMutation();
  const [selectedListing, setSelectedListing] = useState<any>(null);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="xl" mx="auto" px={2} mt={4}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        All Listings
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Deposit</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((listing: any) => {
              const brand = listing?.bike?.brand ?? listing?.brand ?? "—";
              const category =
                listing?.bike?.category ?? listing?.category ?? "—";

              return (
                <TableRow key={listing.listingId || listing._id}>
                  {/* PHOTO */}
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={
                        listing?.photos?.[0]
                          ? `${import.meta.env.VITE_API_BASE_URL}${listing.photos[0]}`
                          : undefined
                      }
                      sx={{ width: 64, height: 48 }}
                    />
                  </TableCell>

                  {/* TITLE */}
                  <TableCell>
                    <Typography fontWeight={600}>
                      {listing.title || "Untitled"}
                    </Typography>
                  </TableCell>

                  {/* BRAND */}
                  <TableCell>{brand}</TableCell>

                  {/* CATEGORY */}
                  <TableCell>{category}</TableCell>

                  {/* STATUS */}
                  <TableCell>
                    {listing.isPublished ? "Published" : "Draft"}
                  </TableCell>

                  {/* DEPOSIT */}
                  <TableCell>
                    {listing.depositAmount !== undefined
                      ? `SEK ${listing.depositAmount}`
                      : "—"}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <Switch
                        checked={!listing?.isBlocked}
                        color="success"
                        disabled={isToggling}
                        onChange={async () => {
                          try {
                            await blockUnblockListing(
                              listing._id || listing.listingId,
                            ).unwrap();

                            toast.success(
                              listing?.isBlocked
                                ? "Listing unblocked successfully"
                                : "Listing blocked successfully",
                            );

                            refetch();
                          } catch (error: any) {
                            toast.error(
                              error?.data?.message ||
                                "Failed to update listing",
                            );
                          }
                        }}
                      />

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedListing(listing)}
                      >
                        View
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        onClick={() =>
                          navigate(`/admin/edit-listing/${listing._id}`)
                        }
                      >
                        Edit
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* VIEW MODAL */}
      {selectedListing && (
        <ListingDetailsModal
          open={!!selectedListing}
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </Box>
  );
};

export default AdminListings;
