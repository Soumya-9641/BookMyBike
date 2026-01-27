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
import { useState } from "react";
import { useCreateListingMutation } from "../services/listingApi";
import { toast } from "react-hot-toast";

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
];

const CreateListing = () => {
  const navigate = useNavigate();
  const [createListing, { isLoading }] = useCreateListingMutation();

  // ===================== FORM STATE =====================
  const [form, setForm] = useState({
    title: "",
    brand: "",
    modelbike: "",
    category: "",
    size: "",
    description: "",
    location: "",
    depositAmount: "",
    rates: {
      hourly: "",
      daily: "",
      weekly: "",
      monthly: "",
    },
  });

  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  // ===================== HANDLERS =====================
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

  // ===================== VALIDATION =====================
  const validateForm = () => {
    if (
      !form.title ||
      !form.brand ||
      !form.modelbike ||
      !form.size ||
      !form.category ||
      !form.depositAmount ||
      !form.location
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (
      !form.rates.hourly &&
      !form.rates.daily &&
      !form.rates.weekly &&
      !form.rates.monthly
    ) {
      toast.error("At least one rate is required");
      return false;
    }

    if (!photos.length) {
      toast.error("Please upload at least one photo");
      return false;
    }

    return true;
  };

  // ===================== SUBMIT =====================
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Only include allowed rate fields
      const rates: { hourly?: number; daily?: number } = {};
      if (form.rates.hourly) rates.hourly = Number(form.rates.hourly);
      if (form.rates.daily) rates.daily = Number(form.rates.daily);

      await createListing({
        title: form.title,
        description: form.description,
        brand: form.brand,
        modelbike: form.modelbike,
        size: form.size,
        category: form.category,
        depositAmount: Number(form.depositAmount),
        accessories: selectedAccessories,
        rates,
        location: {
          address: form.location,
          city: "abc", // TODO: Set city value appropriately
          country: "", // TODO: Set country value appropriately
          lat: 0,
          lng: 0,
        },
        photos,
      }).unwrap();

      toast.success("Bike listed successfully 🚲");
      navigate("/browse-bikes");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create listing");
    }
  };

  // ===================== UI =====================
  return (
    <Box>
      <Box maxWidth="lg" mx="auto" px={2} mt={3}>
        <Typography variant="body2" color="text.secondary">
          Home › <Box component="span" color="#22a652">Create listing</Box>
        </Typography>
      </Box>

      <Box maxWidth="lg" mx="auto" px={2} mt={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5" fontWeight={700} color="#22a652">
            List Your Bike
          </Typography>
          <Button component={RouterLink} to="/browse-bikes" variant="contained">
            Back to Listing
          </Button>
        </Stack>
      </Box>

      <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
        <Stack spacing={4}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField label="Listing Title *" name="title" onChange={handleChange} />
              <TextField label="Brand *" name="brand" onChange={handleChange} />
              <TextField label="Model *" name="modelbike" onChange={handleChange} />
              <TextField label="Category *" name="category" onChange={handleChange} />
              <TextField label="Size *" name="size" onChange={handleChange} />
              <TextField label="Location *" name="location" onChange={handleChange} />
              <TextField label="Description" name="description" multiline rows={3} onChange={handleChange} />
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField label="Hourly Rate" name="hourly" onChange={handleRateChange} />
              <TextField label="Daily Rate" name="daily" onChange={handleRateChange} />
              <TextField label="Weekly Rate" name="weekly" onChange={handleRateChange} />
              <TextField label="Monthly Rate" name="monthly" onChange={handleRateChange} />
              <TextField label="Deposit Amount *" name="depositAmount" onChange={handleChange} />
            </Stack>
          </Paper>

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

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Button component="label" variant="outlined" startIcon={<CloudUploadOutlinedIcon />}>
              Upload Photos
              <input hidden multiple type="file" accept="image/*" onChange={handlePhotoUpload} />
            </Button>

            <Stack direction="row" mt={2} spacing={2}>
              {preview.map((src) => (
                <img key={src} src={src} width={80} height={80} style={{ borderRadius: 6 }} />
              ))}
            </Stack>
          </Paper>

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "List My Bike"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CreateListing;
