import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

export const useAuth = () => {
  const { token, user, isOnboarded } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    token,
    user,
    isOnboarded,
    isAuthenticated: Boolean(token),
  };
};