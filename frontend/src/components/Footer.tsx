import {
  Box,
  Typography,
  Stack,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Logo = () => (
  <Box>
    <img
      src="/images/icons/logo_footer.png"
      alt="RentMyBike"
      style={{ height: 50, width: "auto" }}
    />
  </Box>
);

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#1f1f1f", color: "#bdbdbd" }}>
      <Box maxWidth="lg" mx="auto" px={3} py={6}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={5}
          justifyContent="space-between"
        >
          {/* ================= MOBILE LOGO ================= */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              order: 1,
            }}
          >
            <Logo />
          </Box>

          {/* ================= COMPANY INFO ================= */}
          <Stack
            spacing={1}
            maxWidth={360}
            sx={{
              order: { xs: 3, md: 1 },
            }}
          >
            {/* Desktop Logo */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              <Logo />
            </Box>

            <Typography variant="body2">
              <span
                style={{
                  color: "#22a652",
                  fontWeight: 600,
                }}
              >
                RentMyBike™
              </span>{" "}
              is operated by RM Platforms
            </Typography>

            <Typography variant="body2">
              AB Org.nr:{" "}
              <span style={{ color: "#22a652" }}>
                559542-5843
              </span>
            </Typography>

            <Typography variant="body2">
              Registered in Sweden
            </Typography>

            <Typography variant="body2">
              All rights reserved.
            </Typography>
          </Stack>

          {/* ================= IMPORTANT LINKS ================= */}
          <Stack
            spacing={2}
            sx={{
              order: { xs: 2, md: 2 },
            }}
          >
            <Typography
              sx={{
                color: "#22a652",
                fontWeight: 600,
              }}
            >
              IMPORTANT LINKS
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 2, md: 6 }}
            >
              {/* Left Links */}
              <Stack spacing={1}>
                <Typography variant="body2">
                  »{" "}
                  <Link
                    component={RouterLink}
                    to="/"
                    underline="none"
                    color="inherit"
                  >
                    Home
                  </Link>
                </Typography>

                <Typography variant="body2">
                  »{" "}
                  <Link
                    component={RouterLink}
                    to="/how-it-works"
                    underline="none"
                    color="inherit"
                  >
                    How it works
                  </Link>
                </Typography>

                <Typography variant="body2">
                  »{" "}
                  <Link
                    component={RouterLink}
                    to="/browse-bikes"
                    underline="none"
                    color="inherit"
                  >
                    Browse bikes
                  </Link>
                </Typography>
              </Stack>

              {/* Right Links */}
              <Stack spacing={1}>
                <Typography variant="body2">
                  »{" "}
                  <Link
                    component={RouterLink}
                    to="/user-agreement"
                    underline="none"
                    color="inherit"
                  >
                    User agreement
                  </Link>
                </Typography>

                <Typography variant="body2">
                  »{" "}
                  <Link
                    component={RouterLink}
                    to="/privacy-policy"
                    underline="none"
                    color="inherit"
                  >
                    Privacy policy
                  </Link>
                </Typography>

                <Typography variant="body2">
                  »{" "}
                  <Link
                    component={RouterLink}
                    to="/termsConditions"
                    underline="none"
                    color="inherit"
                  >
                    Terms and conditions
                  </Link>
                </Typography>

                <Typography variant="body2">
                  »{" "}
                  <Link
                    component={RouterLink}
                    to="/cancellation-policy"
                    underline="none"
                    color="inherit"
                  >
                    Cancellation policy
                  </Link>
                </Typography>

                <Typography variant="body2">
                  »{" "}
                  <Link
                    component={RouterLink}
                    to="/dispute-resolution"
                    underline="none"
                    color="inherit"
                  >
                    Dispute resolution
                  </Link>
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* ================= SOCIAL ================= */}
          <Stack
            spacing={2}
            sx={{
              order: { xs: 4, md: 3 },
            }}
          >
            <Typography
              sx={{
                color: "#22a652",
                fontWeight: 600,
              }}
            >
              FOLLOW US ON
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: "#9e9e9e" }}>
                <FacebookIcon />
              </IconButton>

              <IconButton sx={{ color: "#9e9e9e" }}>
                <XIcon />
              </IconButton>

              <IconButton
                component="a"
                href="https://www.instagram.com/rentmy.bike?utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#9e9e9e" }}
              >
                <InstagramIcon />
              </IconButton>

              <IconButton
                component="a"
                href="https://www.linkedin.com/company/rentmybike/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#9e9e9e" }}
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ bgcolor: "#2e2e2e" }} />

      <Box textAlign="center" py={2} bgcolor="#000">
        <Typography variant="body2" color="#9e9e9e">
          RentMyBike™ © 2025 | All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;