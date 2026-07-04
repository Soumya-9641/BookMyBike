import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  Stack,
  Menu,
  MenuItem,
  Typography,
  Skeleton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, setOnboardingStatus } from "../features/auth/authSlice";
import type { RootState } from "../app/store";
import { useGetStripeStatusQuery } from "../services/stripeApi";
import { useGetProfileQuery } from "../services/bookingApi";

const Header = () => {
  const dispatch = useDispatch();
  const { token, isOnboarded } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = Boolean(token);
  const { data, isLoading } = useGetStripeStatusQuery(undefined, {
    skip: !token, // 🔥 important
  });
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !token, // 🔥 important
  });
  useEffect(() => {
    if (!isLoading && data?.success) {
      if (data.data.isOnboarded) {
        dispatch(setOnboardingStatus(true));
      }
    }
  }, [isLoading, data]);

  const canCreateListing = Boolean(token) && isOnboarded;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /* ---------------- Account Menu ---------------- */
  const openAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeAccountMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeAccountMenu();
  };

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar
          sx={{
            maxWidth: "lg",
            mx: "auto",
            width: "100%",
            px: { xs: 2, md: 3 },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* ---------------- Logo ---------------- */}
          <Box
            component={RouterLink}
            to="/"
            display="flex"
            alignItems="center"
            sx={{ textDecoration: "none", cursor: "pointer" }}
          >
            <img
              src="/images/icons/logo_main.png"
              alt="RentMyBike"
              style={{
                height: 42,
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* ---------------- Desktop Navigation ---------------- */}
          <Box display={{ xs: "none", md: "flex" }} alignItems="center" gap={2}>
            <Button component={RouterLink} to="/">
              Home
            </Button>

            <Button component={RouterLink} to="/browse-bikes">
              Browse Bikes
            </Button>

            {!isLoggedIn ? (
              <>
                <Button component={RouterLink} to="/login">
                  SIGN IN
                </Button>

                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/register"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                {isLoggedIn &&
                  (canCreateListing ? (
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/create-listing"
                    >
                      Create Listing
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      component={RouterLink}
                      to="/verify-profile"
                    >
                      Register as Lister
                    </Button>
                  ))}
                {isLoggedIn && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton onClick={openAccountMenu}>
                      <AccountCircleIcon />
                    </IconButton>
                    {profile ? (
                      <Typography fontWeight={500}>
                        Hi, {profile?.data?.first_name}
                      </Typography>
                    ) : (
                      <Skeleton width={80} />
                    )}
                  </Stack>
                )}

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeAccountMenu}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/my-account"
                    onClick={closeAccountMenu}
                  >
                    My Account
                  </MenuItem>

                  <MenuItem
                    component={RouterLink}
                    to="/my-bookings"
                    onClick={closeAccountMenu}
                  >
                    My Rides
                  </MenuItem>
                  {canCreateListing && (
                    <MenuItem
                      component={RouterLink}
                      to="/owner-bookings"
                      onClick={closeAccountMenu}
                    >
                      My Rentals
                    </MenuItem>
                  )}
                   <MenuItem
                      component={RouterLink}
                      to="/my-refunds"
                      onClick={closeAccountMenu}
                    >
                      My Refunds
                    </MenuItem>
                  {canCreateListing && (
                    <MenuItem
                      component={RouterLink}
                      to="/my-listings"
                      onClick={closeAccountMenu}
                    >
                      My Listings
                    </MenuItem>
                  )}

                  <MenuItem
                    component={RouterLink}
                    to="/change-password"
                    onClick={closeAccountMenu}
                  >
                    Change Password
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>

          {/* ---------------- Mobile Menu Button ---------------- */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ================= Mobile Drawer ================= */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box width={260} p={2}>
          <Stack spacing={2}>
            <Button
              component={RouterLink}
              to="/"
              onClick={() => setDrawerOpen(false)}
            >
              Home
            </Button>

            <Button
              component={RouterLink}
              to="/browse-bikes"
              onClick={() => setDrawerOpen(false)}
            >
              Browse Bikes
            </Button>

            {!isLoggedIn ? (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                >
                  SIGN IN
                </Button>

                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/register"
                  onClick={() => setDrawerOpen(false)}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/my-account"
                  onClick={() => setDrawerOpen(false)}
                >
                  My Account
                </Button>

                <Button
                  component={RouterLink}
                  to="/my-bookings"
                  onClick={() => setDrawerOpen(false)}
                >
                  My Rides
                </Button>
                {canCreateListing && (
                  <Button
                    component={RouterLink}
                    to="/owner-bookings"
                    onClick={() => setDrawerOpen(false)}
                  >
                    My Rentals
                  </Button>
                )}
                <Button
                  component={RouterLink}
                  to="/my-refunds"
                  onClick={closeAccountMenu}
                >
                  My Refunds
                </Button>
                {canCreateListing && (
                  <Button
                    component={RouterLink}
                    to="/my-listings"
                    onClick={closeAccountMenu}
                  >
                    My Listings
                  </Button>
                )}
                <Button onClick={handleLogout}>Logout</Button>
              </>
            )}

            {isLoggedIn &&
              (canCreateListing ? (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/create-listing"
                  onClick={() => setDrawerOpen(false)}
                >
                  Create Listing
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/verify-profile"
                  onClick={() => setDrawerOpen(false)}
                >
                  Register as Lister
                </Button>
              ))}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
