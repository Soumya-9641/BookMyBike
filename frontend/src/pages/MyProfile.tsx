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
import { useGetProfileQuery } from "../services/bookingApi";
import { useState, useEffect } from "react";
import type { ProfileForm } from "../types/listing";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AccountTabs from "../components/AccountTabs";

const MyProfile = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProfileQuery();
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

  if (isLoading) return
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
    <CircularProgress />
  </Box>;
  if (!data?.success || !form)
    return <Typography>Error loading profile</Typography>;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isBusinessReady =
    data?.data?.isVerified && data?.isStripeConnected;
  const handleStripeConnect = () => {
    if (isBusinessReady) return;
    navigate("/verify-profile", { replace: true });
    toast.success("Stripe connected successfully");
  }
  return (
    <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
      <AccountTabs />
      <Typography variant="h4" fontWeight={700} color="#22a652">
        Hi, {form.first_name}
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4} mt={4}>
        {/* Profile Form */}
        <Paper sx={{ p: 3, flex: 1 }}>
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
                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                fullWidth
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={form.last_name || ""}
                disabled={!editMode}
                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
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
                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                fullWidth
              />
              <TextField
                label="City"
                name="city"
                value={form.city || ""}
                disabled={!editMode}
                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                fullWidth
              />
            </Stack>

            <TextField
              label="Address"
              name="address"
              value={form.address || ""}
              disabled={!editMode}
              onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
              fullWidth
            />

            {/* Role Toggle */}
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
                <Button variant="contained" sx={{ bgcolor: "#22a652" }}>
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    setForm(data.data);
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