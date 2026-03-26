import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useGetProfileQuery, useUpdateProfileMutation } from "../services/bookingApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AccountTabs from "../components/AccountTabs";
import type { ProfileForm } from "../types/listing";
import LocationAutocomplete from "../components/LocationAutocomplete";

const MyProfile = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<ProfileForm | null>(null);

  useEffect(() => {
    if (data?.success) {
      setForm({
        ...data.data,
        isStripeConnected: data.isStripeConnected,
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.success || !form) {
    return <Typography>Error loading profile</Typography>;
  }

  /* -------------------- Helpers -------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isBusinessReady = data.isStripeConnected;

  const handleStripeConnect = () => {
    if (isBusinessReady) return;
    navigate("/verify-profile");
  };

  /* -------------------- SAVE PROFILE -------------------- */
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        firstName: form.first_name,
        lastName: form.last_name,
        phone: form.phone,
        city: form.city,
        address: form.address,
      }).unwrap();

      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
      <AccountTabs />

      <Typography variant="h4" fontWeight={700} color="#22a652">
        Hi, {form.first_name}
      </Typography>

      <Stack mt={4}>
        <Paper sx={{ p: 3 }}>
          <Typography fontWeight={700} mb={2}>
            Profile Details
          </Typography>

          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                name="first_name"
                value={form.first_name || ""}
                disabled={!editMode}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={form.last_name || ""}
                disabled={!editMode}
                onChange={handleChange}
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField label="Email" value={form.email} disabled fullWidth />
              <TextField
                label="Phone"
                name="phone"
                value={form.phone || ""}
                disabled={!editMode}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="City"
                name="city"
                value={form.city || ""}
                disabled={!editMode}
                onChange={handleChange}
                fullWidth
              />
            </Stack>

            <LocationAutocomplete
              label="Address"
              value={form.address || ""}
              disabled={!editMode}
              onChange={(value) =>
                setForm({ ...form, address: value })
              }
              onSelect={(data) => {
                setForm({
                  ...form,
                  address: data.address,
                  city: data.city || form.city,
                });
              }}
            />

            {/* Lister Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={isBusinessReady}
                  disabled={isBusinessReady}
                  color="success"
                  onChange={handleStripeConnect}
                />
              }
              label="Register as Lister"
            />
          </Stack>

          {/* ACTION BUTTONS */}
          <Stack direction="row" spacing={2} mt={3}>
            {!editMode ? (
              <Button
                variant="contained"
                sx={{ bgcolor: "#22a652" }}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#22a652" }}
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    setForm({
                      ...data.data,
                      isStripeConnected: data.isStripeConnected,
                    });
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default MyProfile;