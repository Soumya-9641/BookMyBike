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
import { Link as RouterLink } from "react-router-dom";

const accessories = [
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
  return (
    <Box>
      {/* ================= Breadcrumb ================= */}
      <Box maxWidth="lg" mx="auto" px={2} mt={3}>
        <Typography variant="body2" color="text.secondary">
          Home &nbsp;›&nbsp;
          <Box component="span" color="#22a652">
            Create listing
          </Box>
        </Typography>
      </Box>

      {/* ================= Page Header ================= */}
      <Box maxWidth="lg" mx="auto" px={2} mt={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color="#22a652">
              List Your Bike
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Share your bikes with the community and earn money while helping
              others explore.
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/browse-bikes"
            variant="contained"
            sx={{
              bgcolor: "#22a652",
              "&:hover": { bgcolor: "#1e8e4a" },
            }}
          >
            Back to Listing
          </Button>
        </Stack>
      </Box>

      {/* ================= FORM ================= */}
      <Box maxWidth="lg" mx="auto" px={2} mt={4} mb={8}>
        <Stack spacing={4}>
          {/* ===== Basic Information ===== */}
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography fontWeight={700} mb={2}>
              Basic Information
            </Typography>

            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Listing Title *" fullWidth />
                <TextField label="Brand" fullWidth />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Model" fullWidth />
                <TextField label="Category *" fullWidth />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Size *" fullWidth />
                <TextField label="Condition *" fullWidth />
              </Stack>

              <TextField label="Location *" fullWidth />
              <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
              />
            </Stack>
          </Paper>

          {/* ===== Pricing ===== */}
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography fontWeight={700} mb={2}>
              Pricing (SEK)
            </Typography>

            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Hourly Rate *" fullWidth />
                <TextField label="Daily Rate *" fullWidth />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Weekly Rate" fullWidth />
                <TextField label="Monthly Rate *" fullWidth />
              </Stack>

              <TextField label="Security Deposit" fullWidth />
            </Stack>
          </Paper>

          {/* ===== Accessories ===== */}
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography fontWeight={700} mb={2}>
              Included Accessories
            </Typography>

            <Stack
              direction="row"
              flexWrap="wrap"
              rowGap={1}
              columnGap={3}
            >
              {accessories.map((item) => (
                <FormControlLabel
                  key={item}
                  control={<Checkbox />}
                  label={item}
                />
              ))}
            </Stack>
          </Paper>

          {/* ===== Photos ===== */}
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography fontWeight={700} mb={2}>
              Photos
            </Typography>

            <Box
              sx={{
                border: "1px dashed #cfcfcf",
                borderRadius: 1,
                p: 4,
                textAlign: "center",
              }}
            >
              <CloudUploadOutlinedIcon
                sx={{ fontSize: 40, color: "#22a652" }}
              />
              <Typography mt={1} color="text.secondary">
                Upload photos of your bike
              </Typography>

              <Button
                variant="outlined"
                sx={{
                  mt: 2,
                  borderColor: "#22a652",
                  color: "#22a652",
                  "&:hover": {
                    borderColor: "#1e8e4a",
                    bgcolor: "rgba(34,166,82,0.05)",
                  },
                }}
              >
                Browse Files
              </Button>
            </Box>
          </Paper>

          {/* ===== Submit ===== */}
          <Box textAlign="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 6,
                bgcolor: "#22a652",
                "&:hover": { bgcolor: "#1e8e4a" },
              }}
            >
              List My Bike
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default CreateListing;
