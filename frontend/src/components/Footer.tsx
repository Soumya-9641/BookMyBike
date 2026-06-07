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

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#1f1f1f", color: "#bdbdbd" }}>
      {/* Main Footer Content */}
      <Box maxWidth="lg" mx="auto" px={3} py={6}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={6}
          justifyContent="space-between"
        >
          {/* LEFT: Logo + Company Info */}
          <Stack spacing={1} maxWidth={360}>
            <Box>
              <img
                src="/images/icons/logo_footer.png"
                alt="RentMyBike"
                style={{ height: 50, width: "auto" }}
              />
            </Box>

            <Typography variant="body2">
              <span style={{ color: "#22a652", fontWeight: 600 }}>
                RentMyBike™
              </span>{" "}
              is operated by RM Platforms
            </Typography>

            <Typography variant="body2">
              AB Org.nr: <span style={{ color: "#22a652" }}>559542-5843</span>
            </Typography>

            <Typography variant="body2">Registered in Sweden</Typography>

            <Typography variant="body2">All rights reserved.</Typography>
          </Stack>

          {/* CENTER: Important Links */}
          <Stack spacing={2}>
            <Typography sx={{ color: "#22a652", fontWeight: 600 }}>
              IMPORTANT LINKS
            </Typography>

            <Stack direction="row" spacing={6}>
              <Stack spacing={1}>
                {["Home", "How it works", "Browse bikes"].map((item) => (
                  <Typography key={item} variant="body2">
                    »{" "}
                    {item === "Home" ? (
                      <Link
                        component={RouterLink}
                        to="/home"
                        underline="none"
                        color="inherit"
                      >
                        {item}
                      </Link>
                    ) : item === "Browse bikes" ? (
                      <Link
                        component={RouterLink}
                        to="/browse-bikes"
                        underline="none"
                        color="inherit"
                      >
                        {item}
                      </Link>
                    ) : item === "How it works" ? (
                      <Link
                        component={RouterLink}
                        to="/how-it-works"
                        underline="none"
                        color="inherit"
                      >
                        {item}
                      </Link>
                    ) : (
                      <Link href="#" underline="none" color="inherit">
                        {item}
                      </Link>
                    )}
                  </Typography>
                ))}
              </Stack>

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

          {/* RIGHT: Social Links */}
          <Stack spacing={2}>
            <Typography sx={{ color: "#22a652", fontWeight: 600 }}>
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

      {/* Bottom Copyright Bar */}
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
