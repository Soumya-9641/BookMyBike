import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useGetMyListingsQuery } from "../services/bookingApi";
import { useEditListingMutation } from "../services/listingApi";
import {
  useGetAllListingsQuery,
  useEditListingAsAdminMutation,
} from "../services/adminApi";

import CategorySelector from "../components/create-listing/CategorySelector";

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

const MAX_PHOTOS = 6;

const EditListing = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  /* -------------------- QUERIES -------------------- */
  const userListingsQuery = useGetMyListingsQuery(undefined, {
    skip: isAdmin,
  });

  const adminListingsQuery = useGetAllListingsQuery(undefined, {
    skip: !isAdmin,
  });
  const listings = isAdmin
    ? adminListingsQuery.data
    : userListingsQuery.data?.listings;

  const isPageLoading =
    userListingsQuery.isLoading || adminListingsQuery.isLoading;

  const listing = listings?.find(
    (l: any) =>
      l.listingId === listingId || l._id === listingId
  );

  /* -------------------- MUTATIONS -------------------- */
  const [editListing, { isLoading: userSaving }] =
    useEditListingMutation();

  const [editListingAsAdmin, { isLoading: adminSaving }] =
    useEditListingAsAdminMutation();

  /* -------------------- STATE -------------------- */
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [form, setForm] = useState<any>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  /* -------------------- PREFILL -------------------- */
  useEffect(() => {
    if (!listing) return;

    const rawCategory =
      listing.bike?.category || listing.category || "";

    const [main = "", sub = ""] = rawCategory.split(" > ");

    setMainCategory(main);
    setSubCategory(sub);

    setForm({
      title: listing.title || "",
      brand: listing.bike?.brand || listing.brand || "",
      modelbike: listing.bike?.modelbike || listing.modelbike || "",
      size: listing.bike?.size || listing.size || "",
      description: listing.description || "",
      depositAmount: listing.depositAmount || "",
      pickupPoint: listing.pickupPoint || "",
      rates: listing.rates || {},
      location: listing.location || listing.bike?.location,
    });

    setSelectedAccessories(listing.accessories || []);

    setExistingPhotos(
      (listing.photos || []).map(
        (p: string) => `${import.meta.env.VITE_API_BASE_URL}${p}`
      )
    );
  }, [listing]);

  if (isPageLoading || !form) {
    return (
      <Box minHeight="400px" display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAccessoryToggle = (item: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handlePhotoUpload = (e: any) => {
    const files = Array.from(e.target.files || []) as File[];
    const allowed =
      MAX_PHOTOS - (existingPhotos.length + newPhotos.length);

    if (files.length > allowed) {
      toast.error(`You can upload only ${allowed} more photos`);
      return;
    }

    setNewPhotos((prev) => [...prev, ...files]);
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (k !== "rates" && k !== "location") {
          fd.append(k, String(v));
        }
      });

      fd.append("category", `${mainCategory} > ${subCategory}`);
      fd.append("accessories", JSON.stringify(selectedAccessories));

      /* ✅ SEND ALL IMAGES */

      // Existing images
      const existingImageFiles = await Promise.all(
        existingPhotos.map(async (url, index) => {
          const res = await fetch(url);
          const blob = await res.blob();
          return new File([blob], `existing_${index}.jpg`, {
            type: blob.type,
          });
        })
      );

      existingImageFiles.forEach((file) => {
        fd.append("photos", file);
      });

      // New images
      newPhotos.forEach((file) => {
        fd.append("photos", file);
      });

      /* ✅ ADMIN VS USER API */
      if (isAdmin) {
        await editListingAsAdmin({
          listingId: listing.listingId || listing._id,
          data: fd,
        }).unwrap();

        toast.success("Listing updated successfully");
        navigate("/admin/listings");
      } else {
        await editListing({
          listingId: listing.listingId,
          data: fd,
        }).unwrap();

        toast.success("Listing updated successfully");
        navigate("/my-listings");
      }
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update listing");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Edit Listing
      </Typography>

      <Stack spacing={4}>
        {/* BASIC INFO */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
            <TextField
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
            />
            <TextField
              label="Model"
              name="modelbike"
              value={form.modelbike}
              onChange={handleChange}
            />

            <CategorySelector
              mainCategory={mainCategory}
              subCategory={subCategory}
              onMainChange={setMainCategory}
              onSubChange={setSubCategory}
            />

            <TextField
              label="Size"
              name="size"
              value={form.size}
              onChange={handleChange}
            />
            <TextField
              label="Pickup Point"
              name="pickupPoint"
              value={form.pickupPoint}
              onChange={handleChange}
            />
            <TextField
              multiline
              rows={3}
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Stack>
        </Paper>

        {/* PRICING */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography fontWeight={600} mb={2}>
            Pricing (cannot be changed)
          </Typography>
          <Stack spacing={2}>
            <TextField label="Hourly Rate" value={form.rates?.hourly || ""} disabled />
            <TextField label="Daily Rate" value={form.rates?.daily || ""} disabled />
            <TextField label="Weekly Rate" value={form.rates?.weekly || ""} disabled />
            <TextField label="Monthly Rate" value={form.rates?.monthly || ""} disabled />
          </Stack>
        </Paper>

        {/* LOCATION */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography fontWeight={600} mb={2}>
            Location (cannot be changed)
          </Typography>
          <TextField
            fullWidth
            disabled
            value={`${form.location?.address || ""}, ${form.location?.city || ""}`}
          />
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
          <Typography fontWeight={600} mb={2}>
            Photos (max {MAX_PHOTOS})
          </Typography>

          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadOutlinedIcon />}
            disabled={existingPhotos.length + newPhotos.length >= MAX_PHOTOS}
          >
            Add Photos
            <input hidden multiple type="file" accept="image/*" onChange={handlePhotoUpload} />
          </Button>

          <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
            {existingPhotos.map((src, idx) => (
              <Box key={src} position="relative">
                <img src={src} width={80} height={80} style={{ borderRadius: 6 }} />
                <IconButton
                  size="small"
                  onClick={() => removeExistingPhoto(idx)}
                  sx={{ position: "absolute", top: -8, right: -8 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            {newPhotos.map((file, idx) => (
              <Box key={idx} position="relative">
                <img
                  src={URL.createObjectURL(file)}
                  width={80}
                  height={80}
                  style={{ borderRadius: 6 }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeNewPhoto(idx)}
                  sx={{ position: "absolute", top: -8, right: -8 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Button
          variant="contained"
          size="large"
          sx={{ bgcolor: "#22a652" }}
          onClick={handleSubmit}
          disabled={isAdmin ? adminSaving : userSaving}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
};

export default EditListing;