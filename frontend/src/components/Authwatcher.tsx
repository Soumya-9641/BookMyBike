import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import type { RootState } from "../app/store";

const AuthWatcher = () => {
  const dispatch = useDispatch();

  // 🔑 Check if user is logged in
  const userToken = useSelector(
    (state: RootState) => state.auth.token
  );

  useEffect(() => {
    // 🚫 If no user token, DO NOTHING
    if (!userToken) return;

    const checkExpiry = () => {
      const userExpiry = localStorage.getItem("tokenExpiry");

      if (!userExpiry || Date.now() > Number(userExpiry)) {
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
  }, [dispatch, userToken]);

  return null;
};

export default AuthWatcher;