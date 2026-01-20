import {
  Box,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const TopBar = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#22a652",
        color: "#fff",
        py: 0.5,
      }}
    >
      <Box maxWidth="lg" mx="auto" px={{ xs: 1.5, md: 3 }}>
        <Stack
          direction="row" // ✅ ALWAYS ROW
          alignItems="center"
          justifyContent="space-between"
          sx={{
            flexWrap: "nowrap", // ✅ prevent wrapping
          }}
        >
          {/* Left: Email */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ minWidth: 0 }}
          >
            <EmailOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: 12, sm: 14 },
                whiteSpace: "nowrap",
              }}
            >
              email@rentmybike.com
            </Typography>
          </Stack>

          {/* Right: Social Links */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
          >
            {/* Desktop only label */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                display: { xs: "none", sm: "block" },
                mr: 0.5,
              }}
            >
              FOLLOW US ON :
            </Typography>

            <IconButton size="small" sx={{ color: "#fff" }}>
              <FacebookIcon fontSize="small" />
            </IconButton>

            <IconButton size="small" sx={{ color: "#fff" }}>
              <XIcon fontSize="small" />
            </IconButton>

            <IconButton size="small" sx={{ color: "#fff" }}>
              <LinkedInIcon fontSize="small" />
            </IconButton>

            <IconButton size="small" sx={{ color: "#fff" }}>
              <InstagramIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default TopBar;
