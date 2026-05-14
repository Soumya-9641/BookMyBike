import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import Slider from "react-slick";
import { useGetPriceBreakdownMutation } from "../services/stripeApi";
import { useGetBikeByIdQuery } from "../services/listingApi";
import { useCreateBookingMutation } from "../services/bookingApi";
import DateTimeDialog from "../components/DateTimeDialog";
import BikeLocationMap from "./BikeLocationMap";


const BikeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetBikeByIdQuery(id!);
  const [createBooking, { isLoading: bookingLoading }] =
    useCreateBookingMutation();
  const [getPriceBreakdown, { data: priceData, isLoading: priceLoading }] =
    useGetPriceBreakdownMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Dayjs | null>(null);
  const [endDateTime, setEndDateTime] = useState<Dayjs | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [lng, lat] = data?.location?.coordinates || [0, 0];
  if (isLoading) {
    return (
      <Box minHeight="400px" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return <Typography>Bike not found</Typography>;

  /* ---------------- Booking ---------------- */
  const handleBookNow = async () => {
    if (!startDateTime || !endDateTime) return;

    const hours = endDateTime.diff(startDateTime, "hour");

    try {
      const res = await createBooking({
        listingId: data._id,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        hours,
      }).unwrap();

      navigate("/checkout", {
        state: {
          clientSecret: res.clientSecret,
          bookingId: res.bookingId,
        },
      });
    } catch (err: any) {
      if (err?.status === 401) {
        setAuthDialogOpen(true);
        return;
      }
      alert(err?.data?.message || "Booking failed");
    }
  };

  /* ---------------- SLIDER SETTINGS (REFERENCE BASED) ---------------- */
  const sliderSettings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: data.photos.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,

    customPaging: (i: number) => (
      <a>
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${data.photos[i]}`}
          alt={`thumb-${i}`}
          style={{
            width: 70,
            height: 60,
            objectFit: "cover",
            borderRadius: 6,
          }}
        />
      </a>
    ),
  };

  return (
    <Box maxWidth="lg" mx="auto" px={2} py={4}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* ---------- IMAGE CAROUSEL ---------- */}
        <Box width={{ xs: "100%", md: "50%" }}>
          <div className="slider-container">
            <Slider {...sliderSettings}>
              {data.photos.map((photo: string, index: number) => (
                <div key={index}>
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${photo}`}
                    alt={`bike-${index}`}
                    style={{
                      width: "100%",
                      height: 420,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </Box>

        {/* ---------- DETAILS ---------- */}
        <Box width={{ xs: "100%", md: "50%" }}>
          <Typography variant="h4" fontWeight={700}>
            {data.title}
          </Typography>

          <Typography color="text.secondary">
            {data.brand} · {data.modelbike} · Size {data.size}
          </Typography>

          <Typography mt={1}>📍 {data.location.address}</Typography>

          {data.pickupPoint && (
            <Typography mt={0.5} color="text.secondary">
              🧭 Pickup Point: {data.pickupPoint}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <BikeLocationMap
            lat={lat}
            lng={lng}
            address={data?.location?.address}
          />

          <Divider sx={{ my: 2 }} />
          <Typography fontWeight={600}>Category</Typography>
          <Typography>{data.category}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography fontWeight={600}>Description</Typography>
          <Typography color="text.secondary">{data.description}</Typography>

          <Divider sx={{ my: 2 }} />

          {data.accessories?.length > 0 && (
            <>
              <Typography fontWeight={600}>Accessories</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                {data.accessories.map((acc: string) => (
                  <Chip key={acc} label={acc} />
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          <Typography fontWeight={600}>Rates</Typography>
          {data.rates?.hourly !== undefined && (
            <Typography>SEK {data.rates.hourly} / hour</Typography>
          )}
          {data.rates?.daily !== undefined && (
            <Typography>SEK {data.rates.daily} / day</Typography>
          )}
          {data.rates?.weekly !== undefined && (
            <Typography>SEK {data.rates.weekly} / week</Typography>
          )}
          {data.rates?.monthly !== undefined && (
            <Typography>SEK {data.rates.monthly} / month</Typography>
          )}

          <Typography mt={1} color="text.secondary">
            Deposit: SEK {data.depositAmount}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* ---------- DATE TIME ---------- */}
          <Stack spacing={1}>
            <Typography fontWeight={600}>Trip Time</Typography>

            {startDateTime && endDateTime ? (
              <Typography>
                {startDateTime.format("DD MMM YYYY, HH:mm")} →{" "}
                {endDateTime.format("DD MMM YYYY, HH:mm")}
              </Typography>
            ) : (
              <Typography color="text.secondary">No time selected</Typography>
            )}

            <Button variant="outlined" onClick={() => setDialogOpen(true)}>
              Select Date & Time
            </Button>
          </Stack>

          {/* ---------- PRICE BREAKDOWN ---------- */}
          {/* ---------- PRICE BREAKDOWN ---------- */}
          {priceLoading && (
            <>
              <Divider sx={{ my: 2 }} />
              <Stack alignItems="center" py={2}>
                <CircularProgress size={28} />
                <Typography mt={1} variant="body2">
                  Calculating price...
                </Typography>
              </Stack>
            </>
          )}

          {priceData?.breakdown && (
            <>
              <Divider sx={{ my: 2 }} />

              <Typography fontWeight={600}>Price Breakdown</Typography>

              <Typography>
                Rental Amount: SEK{" "}
                {priceData.breakdown.rentalAmount.toFixed(2)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Platform Fee (18%): SEK{" "}
                {priceData.breakdown.platformFee.toFixed(2)}
              </Typography>
              {/* 
              <Typography variant="body2" color="text.secondary">
                VAT (included): SEK{" "}
                {priceData.breakdown.vatAmount.toFixed(2)}
              </Typography> */}

              <Divider sx={{ my: 1 }} />

              <Typography>
                Security Deposit: SEK{" "}
                {priceData.breakdown.depositAmount.toFixed(2)}
              </Typography>

              <Typography fontWeight={700} mt={1}>
                Total to Pay: SEK{" "}
                {priceData.breakdown.chargeAmount.toFixed(2)}
              </Typography>
            </>
          )}

          <Button
            variant="contained"
            sx={{ mt: 3, bgcolor: "#22a652" }}
            disabled={!priceData?.breakdown || bookingLoading}
            onClick={handleBookNow}
          >
            Pay Now
          </Button>
        </Box>
      </Stack>

      {/* ---------- DATE DIALOG ---------- */}
      <DateTimeDialog
        open={dialogOpen}
        startDateTime={startDateTime ?? dayjs()}
        endDateTime={endDateTime ?? dayjs().add(1, "hour")}
        onClose={() => setDialogOpen(false)}
        disablePast
        onApply={async (start, end) => {
          setStartDateTime(start);
          setEndDateTime(end);
          setDialogOpen(false);

          const hours = end.diff(start, "hour");

          if (hours <= 0) return;

          try {
            await getPriceBreakdown({
              listingId: data._id,
              startDate: start.toISOString(),
              endDate: end.toISOString(),
              hours,
            }).unwrap();
          } catch (err: any) {
            alert(err?.data?.message || "Failed to calculate price");
          }
        }}
      />

      {/* ---------- AUTH DIALOG ---------- */}
      <Dialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>Please login first before booking this bike.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() =>
              navigate("/login", {
                state: { redirectTo: `/bike/${id}` },
              })
            }
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BikeDetails;