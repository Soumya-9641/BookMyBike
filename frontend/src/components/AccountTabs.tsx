import { Stack, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const AccountTabs = () => {
    const { token, user } = useSelector(
        (state: RootState) => state.auth
    );

    const canCreateListing =
        Boolean(token) && user?.hasBusinessProfile;

    const tabs = [
        { label: "My Account", path: "/my-account" },
        { label: "Change Password", path: "/change-password" },

        // 🔥 OWNER-ONLY TABS
        ...(canCreateListing
            ? [
                { label: "Owner Booking", path: "/owner-bookings" },
                { label: "My Listings", path: "/my-listings" },
            ]
            : [{ label: "My Orders", path: "/my-bookings" },
            { label: "My Refunds", path: "/my-refunds" },]),
    ];

    return (
        <Stack direction="row" spacing={2} mb={4} flexWrap="wrap">
            {tabs.map((tab) => (
                <Button
                    key={tab.path}
                    component={NavLink}
                    to={tab.path}
                    disableRipple
                    sx={{
                        textTransform: "none",
                        borderRadius: 3,
                        px: 3,
                        fontWeight: 600,

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
    );
};

export default AccountTabs;