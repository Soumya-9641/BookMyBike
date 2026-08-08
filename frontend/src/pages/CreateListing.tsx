import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useCreateListingMutation } from "../services/listingApi";
import { toast } from "react-hot-toast";
import LocationAutocomplete from "../components/LocationAutocomplete";
import CategorySelector from "../components/create-listing/CategorySelector";
import { isPositiveNumber } from "../utils/bookingStatus";

const accessoriesList = [
  "Helmet",
  "Led Lights",
  "Bike Lock",
  "Water Bottle Holder",
  "Phone Mount",
  "Winter Tyres",
  "Basket",
  "Pump",
  "Repair Kit",
  "Child Seat",
  "Trailer",
];

const CreateListing = () => {
  const navigate = useNavigate();
  const [createListing, { isLoading }] = useCreateListingMutation();

  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [form, setForm] = useState({
    title: "",
    brand: "",
    modelbike: "",
    size: "",
    description: "",
    depositAmount: "",
    pickupPoint: "",
    rates: {
      hourly: "",
      daily: "",
      weekly: "",
      monthly: "",
    },
  });

  const [locationText, setLocationText] = useState("");
  const [location, setLocation] = useState<{
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  /* -------------------- Handlers -------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      rates: { ...form.rates, [e.target.name]: e.target.value },
    });
  };

  const handleAccessoryToggle = (item: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 6);
    setPhotos(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  /* -------------------- Validation -------------------- */
  const isFormValid = useMemo(() => {
    if (
      !form.title.trim() ||
      !form.brand.trim() ||
      !form.modelbike.trim() ||
      !form.size.trim() ||
      !isPositiveNumber(form.depositAmount) ||
      !form.pickupPoint ||
      !mainCategory ||
      !subCategory ||
      !location ||
      photos.length === 0
    ) {
      return false;
    }

    const hasValidRates =
      isPositiveNumber(form.rates.hourly) &&
      isPositiveNumber(form.rates.daily) &&
      isPositiveNumber(form.rates.weekly) &&
      isPositiveNumber(form.rates.monthly);

    return hasValidRates;
  }, [form, mainCategory, subCategory, location, photos]);
  /* -------------------- Submit -------------------- */
  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please fill all mandatory fields with valid values");
      return;
    }

    if (!location) {
      toast.error("Please select a valid location");
      return;
    }

    try {
      const rates: Record<string, number> = {};
      Object.entries(form.rates).forEach(([k, v]) => {
        if (v) rates[k] = Number(v);
      });

      await createListing({
        title: form.title,
        description: form.description,
        brand: form.brand,
        modelbike: form.modelbike,
        size: form.size,
        pickupPoint: form.pickupPoint,
        category: `${mainCategory} > ${subCategory}`,
        depositAmount: Number(form.depositAmount),
        accessories: selectedAccessories,
        rates,
        location,
        photos,
      }).unwrap();

      toast.success("Bike listed successfully 🚲");
      navigate("/my-listings");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create listing");
    }
  };

  return (
    <Box>
      {/* Breadcrumb */}
      <Box maxWidth="lg" mx="auto" px={2} mt={3}>
        <Typography variant="body2" color="text.secondary">
          Home › <Box component="span" color="#22a652">Create Listing</Box>
        </Typography>
      </Box>

      {/* Header */}
      <Box maxWidth="lg" mx="auto" px={2} mt={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5" fontWeight={700} color="#22a652">
            List Your Bike
          </Typography>
          <Button component={RouterLink} to="/browse-bikes" variant="outlined">
            Back
          </Button>
        </Stack>
      </Box>

      {/* Form */}
      <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
        <Stack spacing={4}>
          {/* BASIC INFO */}
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField label="Listing Title *" name="title" onChange={handleChange} />
              <TextField label="Brand *" name="brand" onChange={handleChange} />
              <TextField label="Model *" name="modelbike" onChange={handleChange} />

              <Paper variant="outlined" sx={{ p: 2 }}>
                <CategorySelector
                  mainCategory={mainCategory}
                  subCategory={subCategory}
                  onMainChange={setMainCategory}
                  onSubChange={setSubCategory}
                />
              </Paper>

              <TextField label="Size (cm) *" name="size" onChange={handleChange} />
              <TextField
                label="Pickup Point"
                name="pickupPoint"
                placeholder="e.g. Near Central Station parking"
                value={form.pickupPoint}
                onChange={handleChange}
                required
              />
              <LocationAutocomplete
                label="Location *"
                value={locationText}
                onChange={(val) => {
                  setLocationText(val);
                  setLocation(null); // force dropdown selection
                }}
                onSelect={(data) => {
                  setLocationText(data.address);
                  setLocation(data);
                }}
              />

              <TextField
                label="Description"
                name="description"
                multiline
                rows={3}
                onChange={handleChange}
              />
            </Stack>
          </Paper>

          {/* PRICING */}
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Hourly Rate"
                name="hourly"
                type="number"
                inputProps={{ min: 1 }}
                error={!isPositiveNumber((form.rates.hourly))}
                helperText="Must be greater than 0"
                onChange={handleRateChange}
              />
              <TextField 
                label="Daily Rate" 
                name="daily" 
                type="number"
                inputProps={{ min: 1 }} 
                error={!isPositiveNumber((form.rates.daily))}
                helperText="Must be greater than 0" 
                onChange={handleRateChange} />
              <TextField 
                label="Weekly Rate" 
                name="weekly" 
                type="number"
                inputProps={{ min: 1 }} 
                error={!isPositiveNumber((form.rates.weekly))}
                helperText="Must be greater than 0" 
                onChange={handleRateChange} />
              <TextField 
                label="Monthly Rate" 
                name="monthly" 
                type="number"
                inputProps={{ min: 1 }} 
                error={!isPositiveNumber((form.rates.monthly))}
                helperText="Must be greater than 0" 
                onChange={handleRateChange} />
              <TextField
                label="Deposit Amount *"
                name="depositAmount"
                type="number"
                inputProps={{ min: 1 }}
                error={!isPositiveNumber(form.depositAmount)}
                helperText="Must be greater than 0"
                onChange={handleChange}
              />
            </Stack>
          </Paper>

          {/* ACCESSORIES */}
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" flexWrap="wrap">
              {accessoriesList.map((item) => (
                <FormControlLabel
                  key={item}
                  control={
                    <Checkbox
                      checked={selectedAccessories.includes(item)}
                      onChange={() => handleAccessoryToggle(item)}
                    />
                  }
                  label={item}
                />
              ))}
            </Stack>
          </Paper>

          {/* PHOTOS */}
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Button component="label" variant="outlined" startIcon={<CloudUploadOutlinedIcon />}>
              Upload Photos *
              <input hidden multiple type="file" accept="image/*" onChange={handlePhotoUpload} />
            </Button>

            <Stack direction="row" mt={2} spacing={2}>
              {preview.map((src) => (
                <img
                  key={src}
                  src={src}
                  width={80}
                  height={80}
                  style={{ borderRadius: 6, objectFit: "cover" }}
                />
              ))}
            </Stack>
          </Paper>

          {/* SUBMIT */}
          <Button
            variant="contained"
            size="large"
            disabled={!isFormValid || isLoading}
            onClick={handleSubmit}
            sx={{ bgcolor: "#22a652", fontWeight: 600 }}
          >
            {isLoading ? "Submitting..." : "List My Bike"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CreateListing;