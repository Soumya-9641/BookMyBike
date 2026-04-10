import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link as RouterLink } from "react-router-dom";

import { useAdminLoginMutation } from "../../services/adminAuthApi";
import { setAdminCredentials } from "../../features/admin/adminAuthSlice";

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [adminLogin, { isLoading }] = useAdminLoginMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /* ---------- Validation ---------- */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isFormValid = isEmailValid && password.trim().length > 0;

    /* ---------- Submit ---------- */
    const handleLogin = async () => {
        if (!isFormValid) return;

        try {
            const res = await adminLogin({ email, password }).unwrap();

            dispatch(
                setAdminCredentials({
                    adminToken: res.token,
                    admin: res.data.admin,
                })
            );

            toast.success("Admin login successful");

            setTimeout(() => {
                navigate("/admin/dashboard", { replace: true });
            }, 800);
        } catch (err: any) {
            toast.error(err?.data?.message || "Admin login failed");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at center, #a8e6c2 0%, #c9f3dc 40%, #2faa54 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
            }}
        >
            <Box
                sx={{
                    width: 420,
                    bgcolor: "#fff",
                    p: 4,
                    borderRadius: 1,
                    boxShadow: "0px 8px 30px rgba(0,0,0,0.15)",
                }}
            >
                <Box
                    component={RouterLink}
                    to="/"
                    display="flex"
                    alignItems="center"
                    justifyContent={"center"}
                    mb={4}
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
                <Typography variant="h5" fontWeight={700} mb={3}>
                    Admin Sign In
                </Typography>

                <Stack spacing={2.5}>
                    {/* Email */}
                    <Box>
                        <Typography fontSize={14} mb={0.5}>
                            Email address <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={email.length > 0 && !isEmailValid}
                            helperText={
                                email.length > 0 && !isEmailValid
                                    ? "Please enter a valid email address"
                                    : " "
                            }
                        />
                    </Box>

                    {/* Password */}
                    <Box>
                        <Typography fontSize={14} mb={0.5}>
                            Password <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Box>

                    {/* Login Button */}
                    <Button
                        fullWidth
                        disabled={!isFormValid || isLoading}
                        sx={{
                            bgcolor: "#1fa64b",
                            color: "#fff",
                            fontWeight: 600,
                            py: 1.2,
                            "&:hover": { bgcolor: "#188f40" },
                            "&.Mui-disabled": {
                                bgcolor: "#c7e6d2",
                                color: "#fff",
                            },
                        }}
                        onClick={handleLogin}
                    >
                        {isLoading ? "Signing in..." : "LOGIN"}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default AdminLogin;