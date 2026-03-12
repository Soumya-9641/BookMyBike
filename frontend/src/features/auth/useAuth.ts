import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

export const useAuth = () => {
  const { token, user } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
  };
};