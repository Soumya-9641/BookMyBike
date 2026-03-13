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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../app/store";

const Header = () => {
  const dispatch = useDispatch();

  const { token } = useSelector(
    (state: RootState) => state.auth
  );

  const isLoggedIn = Boolean(token);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  /* ---------------- Account Menu ---------------- */
  const openAccountMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
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
          <Box
            display={{ xs: "none", md: "flex" }}
            alignItems="center"
            gap={2}
          >
            <Button component={RouterLink} to="/">
              Home
            </Button>

            <Button component={RouterLink} to="/coming-soon">
              About
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
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/create-listing"
                >
                  Create Listing
                </Button>
                <IconButton onClick={openAccountMenu}>
                  <AccountCircleIcon />
                </IconButton>

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
                    My Bookings
                  </MenuItem>

                  <MenuItem
                    component={RouterLink}
                    to="/refunds"
                    onClick={closeAccountMenu}
                  >
                    My Refunds
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
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
              to="/coming-soon"
              onClick={() => setDrawerOpen(false)}
            >
              About
            </Button>

            <Button component={RouterLink}
              to="/browse-bikes" onClick={() => setDrawerOpen(false)}>
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
                  to="/account"
                  onClick={() => setDrawerOpen(false)}
                >
                  My Account
                </Button>

                <Button
                  component={RouterLink}
                  to="/bookings"
                  onClick={() => setDrawerOpen(false)}
                >
                  My Bookings
                </Button>

                <Button onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}

            <Button
              variant="contained"
              component={RouterLink}
              to="/create-listing"
              onClick={() => setDrawerOpen(false)}
            >
              Create Listing
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
