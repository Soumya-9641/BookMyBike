// components/AuthWatcher.tsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const AuthWatcher = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkExpiry = () => {
      const expiry = localStorage.getItem("tokenExpiry");
      if (!expiry || Date.now() > Number(expiry)) {
        dispatch(logout());
      }
    };

    checkExpiry();

    const interval = setInterval(checkExpiry, 60 * 1000);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token" && !event.newValue) {
        dispatch(logout());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);

  return null;
};

export default AuthWatcher;