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

import { useGetBikeByIdQuery } from "../services/listingApi";
import { useCreateBookingMutation } from "../services/bookingApi";
import DateTimeDialog from "../components/DateTimeDialog";
import { calculatePricePreview } from "../utils/CalculatePricePreview";
import BikeLocationMap from "./BikeLocationMap";

const PLATFORM_FEE_RATE = 0.18;
const VAT_RATE = 0.25;

const BikeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetBikeByIdQuery(id!);
  const [createBooking, { isLoading: bookingLoading }] =
    useCreateBookingMutation();

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

  const hours =
    startDateTime && endDateTime
      ? endDateTime.diff(startDateTime, "hour")
      : 0;

  const pricePreview =
    hours > 0
      ? calculatePricePreview({
        hours,
        hourlyRate: data.rates?.hourly,
        dailyRate: data.rates?.daily,
        depositAmount: data.depositAmount,
      })
      : null;

  const platformFee =
    pricePreview ? Math.round(pricePreview.rentalAmount * PLATFORM_FEE_RATE) : 0;

  const vatAmount =
    platformFee ? Math.round(platformFee * VAT_RATE) : 0;

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
          {pricePreview && (
            <>
              <Divider sx={{ my: 2 }} />

              <Typography fontWeight={600}>Price Breakdown</Typography>

              <Typography>
                Rental ({pricePreview.priceType}): SEK {pricePreview.rentalAmount}
              </Typography>

              <Typography variant="body2" color="text.secondary" ml={1}>
                (Platform fee included: SEK {platformFee})
              </Typography>

              <Typography variant="body2" color="text.secondary" ml={1}>
                (VAT 25% included: SEK {vatAmount})
              </Typography>

              <Typography mt={1}>
                Security Deposit: SEK {pricePreview.deposit}
              </Typography>

              <Typography fontWeight={700} mt={1}>
                Total to Pay: SEK {pricePreview.totalToPay}
              </Typography>
            </>
          )}

          <Button
            variant="contained"
            sx={{ mt: 3, bgcolor: "#22a652" }}
            disabled={!pricePreview || bookingLoading}
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
        onApply={(start, end) => {
          setStartDateTime(start);
          setEndDateTime(end);
          setDialogOpen(false);
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