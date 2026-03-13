import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useGetProfileQuery } from "../services/bookingApi";
import { useState } from "react";

const MyProfile = () => {
  const { data, isLoading } = useGetProfileQuery();
  const [editMode, setEditMode] = useState(false);

  if (isLoading) return <CircularProgress sx={{ mt: 5 }} />;
  if (!data?.success) return <Typography>Error loading profile</Typography>;

  const profile = data.data;

  return (
    <Box maxWidth="lg" mx="auto" mt={4} mb={8}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} color="#22a652">
        Hi, {profile.personalProfile.firstName}
      </Typography>

      {/* Action Tabs */}
      <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
        {[
          "My Profile",
          "My Bookings",
          "My Listings",
          "My Payments",
          "My Refunds",
          "Change Password",
        ].map((item) => (
          <Button
            key={item}
            variant="contained"
            size="small"
            sx={{ bgcolor: "#22a652" }}
          >
            {item}
          </Button>
        ))}
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4} mt={4}>
        {/* Saved Card (Static / Stripe Ready) */}
        <Paper sx={{ p: 3, width: 300, bgcolor: "#22a652", color: "#fff" }}>
          <Typography fontWeight={600}>Saved Card</Typography>
          <Typography mt={2}>Master Card</Typography>
          <Typography>XXXX XXXX XXXX 1234</Typography>
          <Typography mt={1}>
            {profile.personalProfile.firstName}{" "}
            {profile.personalProfile.lastName}
          </Typography>
        </Paper>

        {/* Profile Form */}
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography fontWeight={700} mb={2}>
            Profile Details
          </Typography>

          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                value={profile.personalProfile.firstName}
                disabled={!editMode}
                fullWidth
              />
              <TextField
                label="Middle Name"
                value={profile.personalProfile.middleName || ""}
                disabled={!editMode}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={profile.personalProfile.lastName}
                disabled={!editMode}
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Email"
                value={profile.email}
                disabled
                fullWidth
              />
              <TextField
                label="Phone"
                value={profile.personalProfile.phone || ""}
                disabled={!editMode}
                fullWidth
              />
              <TextField
                label="City"
                value={profile.personalProfile.city || ""}
                disabled={!editMode}
                fullWidth
              />
            </Stack>

            <TextField
              label="Address"
              value={profile.personalProfile.address || ""}
              disabled={!editMode}
              fullWidth
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
                  onClick={() => setEditMode(false)}
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