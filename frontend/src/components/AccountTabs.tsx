import { Stack, Button, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const AccountTabs = () => {
  const { token, isOnboarded } = useSelector((state: RootState) => state.auth);

  const canCreateListing = Boolean(token) && isOnboarded;

  const tabs = [
    { label: "My Account", path: "/my-account" },
    { label: "My Rides", path: "/my-bookings" },
    ...(canCreateListing ? [
      { label: "My Rentals", path: "/owner-bookings" },
      { label: "My Listings", path: "/my-listings" },
    ] : []),
    { label: "My Refunds", path: "/my-refunds" },
    { label: "Change Password", path: "/change-password" },
  ];

  return (
    <Box
      sx={{
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        mb={3}
        sx={{
          minWidth: "max-content",
          px: { xs: 1, sm: 0 },
        }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.path}
            component={NavLink}
            to={tab.path}
            disableRipple
            sx={{
              whiteSpace: "nowrap",
              textTransform: "none",
              borderRadius: 999,
              px: 2.5,
              py: 1,
              fontSize: { xs: 13, sm: 14 },
              fontWeight: 600,
              flexShrink: 0,

              "&.active": {
                bgcolor: "#22a652",
                color: "#fff",
                pointerEvents: "none",
              },

              "&:not(.active)": {
                bgcolor: "#e0f2ea",
                color: "#22a652",
              },
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default AccountTabs;
