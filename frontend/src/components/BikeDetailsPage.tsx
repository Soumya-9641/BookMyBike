import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import { useGetBikeByIdQuery } from "../services/listingApi";

const BikeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetBikeByIdQuery(id!);

  if (isLoading) return <CircularProgress />;
  if (isError || !data) return <Typography>Bike not found</Typography>;

  return (
    <Box maxWidth="lg" mx="auto" px={2} py={4}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        alignItems="flex-start"
      >
        {/* Images */}
        <Box width={{ xs: "100%", md: "50%" }}>
          <img
            src={`${import.meta.env.VITE_API_URL}${data.photos[0]}`}
            alt={data.title}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Box>

        {/* Details */}
        <Box width={{ xs: "100%", md: "50%" }}>
          <Typography variant="h4" fontWeight={700}>
            {data.title}
          </Typography>

          <Typography mt={1} color="text.secondary">
            {data.brand} · {data.modelbike}
          </Typography>

          <Typography mt={2}>
            ₹{data.rates.daily}/day
          </Typography>

          <Typography mt={1}>
            Deposit: ₹{data.depositAmount}
          </Typography>

          <Typography mt={1}>
            Location: {data.location.city}
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 3, bgcolor: "#22a652" }}
          >
            Book Now
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default BikeDetails;
